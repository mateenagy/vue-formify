import { TypedSchema } from '@packages/utils/types';
import { z } from 'zod';

const arrayToStringPath = (arr: (string | number)[]): string => {
	let result = '';

	for (const element of arr) {
		if (typeof element === 'string') {
			result += element;
		} else if (typeof element === 'number') {
			result = result.slice(0, -1);
			result += `[${element}]`;
		} else {
			console.warn(`Unexpected type in array: ${typeof element}`);

			return '';
		}
		result += '.';
	}

	return result.slice(0, -1);
};

const processError = (error: z.ZodIssue[]) => {
	const _error: Record<string, any> = {};
	error.forEach((err) => {
		_error[arrayToStringPath(err.path)] = err.message;
	});

	return _error;
};

const schemaFromZod = <TSchema extends z.ZodObject<z.ZodRawShape>>(_schema: TSchema): TypedSchema<TSchema, z.infer<TSchema>> => {
	const schema: TypedSchema = {
		parse: async (value: any) => {
			if (!(_schema instanceof z.ZodObject)) {
				throw new Error('You have to use ZodObject type)!');
			}
			const result = await _schema.safeParseAsync(value);

			if (result.success) {
				return {
					value: result.data,
					errors: [],
				};
			}
			const errors = processError(result.error.issues);

			return { errors };
		},
		cast: () => {
			return defaultInstance(_schema);
		},
	};

	return schema;
};

/**
 * @summary Function returns default object from Zod schema
 * @version 23.05.15.2
 * @link https://gist.github.com/TonyGravagno/2b744ceb99e415c4b53e8b35b309c29c
 * @author Jacob Weisenburger, Josh Andromidas, Thomas Moiluiavon, Tony Gravagno
 * @param schema z.object schema definition
 * @param options Optional object, see Example for details
 * @returns Object of type schema with defaults for all fields
 * @example
 * const schema = z.object( { ... } )
 * const default1 = defaultInstance<typeof schema>(schema)
 * const default2 = defaultInstance<typeof schema>(
 *   schema,{ // toggle from these defaults if required
 *     defaultArrayEmpty: false,
 *     defaultDateEmpty: false,
 *     defaultDateUndefined: false,
 *     defaultDateNull: false,
 * } )
 */
export function defaultInstance<T extends z.ZodTypeAny>(
	schema: z.AnyZodObject | z.ZodEffects<any>,
	options: object = {
		defaultArrayEmpty: true,
	},
): z.infer<T> {
	const defaultArrayEmpty = 'defaultArrayEmpty' in options ? options.defaultArrayEmpty : false;
	const defaultDateEmpty = 'defaultDateEmpty' in options ? options.defaultDateEmpty : false;
	const defaultDateUndefined = 'defaultDateUndefined' in options ? options.defaultDateUndefined : false;
	const defaultDateNull = 'defaultDateNull' in options ? options.defaultDateNull : false;

	function run(): z.infer<T> {
		if (schema instanceof z.ZodEffects) {
			if (schema.innerType() instanceof z.ZodEffects) {
				return defaultInstance(schema.innerType(), options); // recursive ZodEffect
			}

			// return schema inner shape as a fresh zodObject
			return defaultInstance(z.ZodObject.create(schema.innerType().shape), options);
		}

		if (schema instanceof z.ZodType) {
			const the_shape = schema.shape as z.ZodAny; // eliminates 'undefined' issue
			const entries = Object.entries(the_shape);
			const temp = entries.map(([key, value]) => {
				const this_default =
					value instanceof z.ZodEffects ? defaultInstance(value, options) : getDefaultValue(value);

				return [key, this_default];
			});

			return Object.fromEntries(temp);
		} else {
			console.log('Error: Unable to process this schema');

			return null; // unknown or undefined here results in complications
		}

		function getDefaultValue(dschema: z.ZodTypeAny): any {
			if (dschema instanceof z.ZodDefault) {
				if (!('_def' in dschema)) {
					return undefined;
				} // error
				if (!('defaultValue' in dschema._def)) {
					return undefined;
				} // error

				return dschema._def.defaultValue();
			}
			if (dschema instanceof z.ZodArray) {
				if (!('_def' in dschema)) {
					return undefined;
				} // error
				if (!('type' in dschema._def)) {
					return undefined;
				} // error

				// return empty array or array with one empty typed element
				return defaultArrayEmpty ? [] : [getDefaultValue(dschema._def.type as z.ZodAny)];
			}
			if (dschema instanceof z.ZodString) {
				return '';
			}
			if (dschema instanceof z.ZodNumber || dschema instanceof z.ZodBigInt) {
				const value = dschema.minValue ?? 0;

				return value;
			}
			if (dschema instanceof z.ZodDate) {
				const value = defaultDateEmpty
					? ''
					: defaultDateNull
						? null
						: defaultDateUndefined
							? undefined
							: (dschema as z.ZodDate).minDate;

				return value;
			}
			if (dschema instanceof z.ZodSymbol) {
				return '';
			}
			if (dschema instanceof z.ZodBoolean) {
				return false;
			}
			if (dschema instanceof z.ZodNull) {
				return null;
			}
			if (dschema instanceof z.ZodPipeline) {
				if (!('out' in dschema._def)) {
					return undefined;
				} // error

				return getDefaultValue(dschema._def.out);
			}
			if (dschema instanceof z.ZodObject) {
				return defaultInstance(dschema, options);
			}
			if (dschema instanceof z.ZodAny && !('innerType' in dschema._def)) {
				return undefined;
			} // error?

			return getDefaultValue(dschema._def.innerType);
		}
	}

	return run();
}

export { schemaFromZod };
