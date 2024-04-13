import { ZodObject, ZodRawShape, ZodIssue } from 'zod';

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

const processError = (error: ZodIssue[]) => {
	const _error: any[] = [];
	error.forEach((err) => {
		_error.push({
			key: arrayToStringPath(err.path),
			message: err.message,
		});
	});

	return _error;
};

const schemaFromZod = <TSchema extends ZodObject<ZodRawShape>>(_schema: TSchema) => {
	const schema = {
		parse: async (value: any) => {
			if (!(_schema instanceof ZodObject)) {
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
	};

	return schema;
};

export { schemaFromZod };
