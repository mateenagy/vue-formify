import { getDefaults, ObjectSchema, safeParseAsync, flatten } from 'valibot';

const processError = (issues: any) => {
	const _error = {};
	for (const key in issues) {
		_error[key] = issues[key];
	}

	return _error;
};

const schemaFromValibot = <TSchema extends ObjectSchema<any, any>>(_schema: TSchema) => {
	const schema = {
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
