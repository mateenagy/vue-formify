import { ObjectSchema, ValidationError } from 'joi';

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

const processError = (error: any[]) => {
	const _error = {};
	error.forEach((err) => {
		_error[arrayToStringPath(err.path)] = err.message;
	});

	return _error;
};

const schemaFromJoi = <TSchema extends ObjectSchema>(_schema: TSchema) => {
	const schema = {
		parse: async (value: any) => {
			try {
				const result = await _schema.validateAsync(value, {
					abortEarly: false,
				});

				return {
					value: result,
					errors: [],
				};
			} catch (err) {
				const error = err as ValidationError;
				const errors = processError(error.details);

				return { errors };
			}
		},
		cast: (values: Record<string, any>) => {
			const result = _schema.validate(values);
			if (result.error) {
				return values;
			}

			return result.value;
		},
	};

	return schema;
};

export { schemaFromJoi };
