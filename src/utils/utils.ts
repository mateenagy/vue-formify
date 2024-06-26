export const BETWEEN_BRACKETS_REGEX = /^\[(.+?)\]$/gm;
export const REMOVE_BRACKETS_REGEX = /(^.*\[|\].*$)/g;
export const ARRAY_INDEX_FROM_STRING_REGEX = /\w\[(\d*)\]/gm;
export const GET_INDEX_FROM_STRING_REGEX = /\[(\d+)\]/;
export const REMOVE_ARRAY_INDEX_FROM_STRING_REGEX = /\[\d+\]/;

export const stringToObject = (path: string, defaultValue: Record<string, any>) => {
	const disable_matches = path.match(BETWEEN_BRACKETS_REGEX);

	/* DISABLE NESTING BEHAVIOUR */
	if (disable_matches) {
		const key = disable_matches[0].replace(REMOVE_BRACKETS_REGEX, '');

		return {
			[key]: defaultValue,
		};
	}
	const paths = path.split('.');

	const obj = paths.reduceRight((obj, next) => {
		const array_mathes = next.match(ARRAY_INDEX_FROM_STRING_REGEX);
		const key = next.replace(REMOVE_ARRAY_INDEX_FROM_STRING_REGEX, '');
		const index = next.match(GET_INDEX_FROM_STRING_REGEX)?.[1];

		if (array_mathes) {
			return {
				[key]: {
					[`[${index}]`]: obj,
				},
			};
		}

		return { [next]: obj };
	}, defaultValue);

	return obj;
};

export const getValueByPath = (object: Record<string, any>, path: string) => {
	const matches = path.match(BETWEEN_BRACKETS_REGEX);

	/* DISABLE DOT NOTATION BEHAVIOUR */
	if (matches) {
		const key = matches[0].replace(REMOVE_BRACKETS_REGEX, '');

		return object[key];
	}

	/* DOT NOTATION BEHAVIOUR */
	let currentObject = object;
	const parts = path.split('.');
	const last = parts.pop();

	for (const part of parts) {
		const array_mathes = part.match(ARRAY_INDEX_FROM_STRING_REGEX);
		if (array_mathes) {
			const key = part.replace(REMOVE_ARRAY_INDEX_FROM_STRING_REGEX, '');
			const index = part.match(GET_INDEX_FROM_STRING_REGEX)?.[1];

			currentObject = currentObject?.[key]?.[`[${index}]`];
		} else {
			currentObject = currentObject[part];
		}
		if (!currentObject) {
			return;
		}
	}

	if (last) {
		const array_mathes = last.match(ARRAY_INDEX_FROM_STRING_REGEX);
		if (array_mathes) {
			const key = last.replace(REMOVE_ARRAY_INDEX_FROM_STRING_REGEX, '');
			const index = last.match(GET_INDEX_FROM_STRING_REGEX)?.[1];
	
			return last && currentObject?.[key]?.[`[${index}]`];
		}
	}


	return last && currentObject[last];
};

export const deleteByPath = (object: Record<string, any>, path: string) => {
	const matches = path.match(BETWEEN_BRACKETS_REGEX);

	if (matches) {
		const key = matches[0].replace(REMOVE_BRACKETS_REGEX, '');

		delete object[key];
	}
	let currentObject = object;
	const parts = path.split('.');
	const last = parts.pop();
	
	for (const part of parts) {
		const array_mathes = part.match(ARRAY_INDEX_FROM_STRING_REGEX);
		if (array_mathes) {
			const key = part.replace(REMOVE_ARRAY_INDEX_FROM_STRING_REGEX, '');
			const index = part.match(GET_INDEX_FROM_STRING_REGEX)?.[1];

			currentObject = currentObject?.[key]?.[`[${index}]`];
		} else {
			currentObject = currentObject[part];
		}
		if (!currentObject) {
			return;
		}
	}

	if (last) {
		const array_mathes = last.match(ARRAY_INDEX_FROM_STRING_REGEX);
		if (array_mathes) {
			const key = last.replace(REMOVE_ARRAY_INDEX_FROM_STRING_REGEX, '');
			const index = last.match(GET_INDEX_FROM_STRING_REGEX)?.[1];

			delete currentObject?.[key]?.[`[${index}]`];
		} else {
			delete currentObject[last];
		}

		if (Object.keys(currentObject).length === 0) {
			deleteByPath(object, parts.join('.'));
		}
	}
};

export const flattenObject = (obj: any, type: 'value' | 'error' = 'value'): Record<string, string> => {
	let result: any = {};
	
	for (const key in obj) {
		const array_mathes = key.match(BETWEEN_BRACKETS_REGEX);

		if (typeof obj[key] === 'object' && 'value' in obj[key] ) {
			if (array_mathes) {
				if (type === 'value') {
					!Array.isArray(result) && (result = []);
					obj[key].value && result.push(obj[key].value);
				} else {
					result = obj.error;
				}
			} else {
				!obj[key].ignore && (result[key] = type === 'value' ? obj[key].value : obj[key].error);
			}
		} else if (typeof obj[key] === 'object') {
			if (array_mathes) {
				!Array.isArray(result) && (result = []);
				result.push(flattenObject(obj[key], type));
			} else {
				result[key] = flattenObject(obj[key], type);
			}
		}
	}

	return result;
};

export const mergeDeep = (...objects: any) => {
	const isObject = (obj: object) => obj && typeof obj === 'object';

	return objects.reduce((prev: Record<string, any>, obj: Record<string, any>) => {
		Object.keys(obj).forEach((key) => {
			const pVal = prev[key];
			const oVal = obj[key];

			if (Array.isArray(pVal) && Array.isArray(oVal)) {
				prev[key] = pVal.concat(...oVal);
			} else if (isObject(pVal) && isObject(oVal)) {
				prev[key] = mergeDeep(pVal, oVal);
			} else {
				prev[key] = oVal;
			}
		});

		return prev;
	}, {});
};

export const createFormDataFromObject = (obj: Record<string, any>, formData: FormData, parentKey = '') => {
	Object.keys(obj).reduce((acc, key) => {
		const newKey = parentKey ? `${parentKey}.${key}` : key;

		if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key]) && !(obj[key] instanceof Date) && !(obj[key] instanceof File) && !(obj[key] instanceof Blob)) {
			const nested = createFormDataFromObject(obj[key], formData, newKey);
			acc += nested;
		} else {
			if (Array.isArray(obj[key])) {
				obj[key].forEach((value: any) => {
					formData.append(`${newKey}[]`, value);
				});
			} else {
				formData.append(`${newKey}`, obj[key]);
			}
		}

		return acc;
	}, '');
};
