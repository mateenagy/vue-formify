import { BaseIssue, getDefaults, ObjectSchema, safeParseAsync } from 'valibot';

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

const processError = (issues: BaseIssue<any>[]) => {
	const _error: any[] = [];
	issues.forEach((issue) => {
		const p = arrayToStringPath(issue.path?.map(_path => _path.key) as string[]);

		_error.push({
			key: p,
			message: issue.message,
		});
	});

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

			const errors = processError(result.issues);

			return { errors };
		},
		cast: () => {
			return getDefaults(_schema);
		},
	};

	return schema;
};

export { schemaFromValibot };
