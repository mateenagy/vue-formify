import { AnyObjectSchema, ObjectSchema, ValidationError } from 'yup';

const processError = (error: any[]) => {
	const _error: any[] = [];
	error.forEach((err) => {
		_error.push({
			key: err.path,
			message: err.errors[0],
		});
	});

	return _error;
};

const schemaFromYup = <TSchema extends AnyObjectSchema>(_schema: TSchema) => {
	const schema = {
		parse: async (value: any) => {
			if (!(_schema instanceof ObjectSchema)) {
				throw new Error('You have to use yup object)!');
			}

			try {
				const result = await _schema.validate(value, {
					abortEarly: false,
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
