/* eslint-disable @typescript-eslint/no-explicit-any */
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
	};

	return schema;
};

export { schemaFromYup };
