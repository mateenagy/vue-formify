import { TypedSchema } from '@packages/utils/types';
import { AnyObjectSchema, ObjectSchema, ValidationError, InferType } from 'yup';

const processError = (error: any[]) => {
	const _error: Record<string, any> = {};
	
	error.forEach((err) => {
		_error[err.path] = err.errors;
	});

	return _error;
};

const schemaFromYup = <TSchema extends AnyObjectSchema>(_schema: TSchema): TypedSchema<TSchema, InferType<TSchema>> => {
	const schema: TypedSchema = {
		parse: async (value: any) => {
			if (!(_schema instanceof ObjectSchema)) {
				throw new Error('You have to use yup object)!');
			}

			try {
				const result = await _schema.validate(value, {
					abortEarly: false,
					strict: true,

				});

				return {
					value: result,
					errors: [],
				};
			} catch (err) {
				const error = err as ValidationError;
				const errors = processError(error.inner);

				return { errors };
			}
		},
		cast: () => {
			const _defaults = _schema.getDefault();

			return removeUndefinedKeys(_defaults);
		},
	};

	return schema;
};

export const removeUndefinedKeys = (obj: Record<string, any>): Record<string, any> => {
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}

	return Object.fromEntries(
		Object.entries(obj)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.filter(([_, value]) => value !== undefined) // Filter out undefined values
			.map(([key, value]) => [key, removeUndefinedKeys(value)]), // Recursively handle nested objects
	);
};

export { schemaFromYup };
