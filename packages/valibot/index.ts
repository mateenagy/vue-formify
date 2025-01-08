import { getDefaults, ObjectSchema, safeParseAsync, flatten, InferInput } from 'valibot';
import { TypedSchema } from '@packages/utils/types';

const processError = (issues: any) => {
	const _error: Record<string, any> = {};
	for (const key in issues) {
		_error[key] = issues[key];
	}

	return _error;
};

const schemaFromValibot = <TSchema extends ObjectSchema<any, any>>(_schema: TSchema): TypedSchema<TSchema, InferInput<TSchema>> => {
	const schema: TypedSchema = {
		parse: async (value: any) => {
			const result = await safeParseAsync(_schema, value);
			if (result.success) {
				return {
					value: result.output,
					errors: [],
				};
			}
			const errors = processError(flatten(result.issues).nested);

			return { errors };
		},
		cast: () => {
			return getDefaults(_schema);
		},
	};

	return schema;
};

export { schemaFromValibot };
