const BETWEEN_BRACKETS_REGEX = /^\[(.+?)\]$/gm;
const REMOVE_BRACKETS_REGEX = /(^.*\[|\].*$)/g;
const ARRAY_INDEX_FROM_STRING_REGEX = /\w\[(\d*)\]/gm;
const GET_INDEX_FROM_STRING_REGEX = /\[(\d+)\]/;
const REMOVE_ARRAY_INDEX_FROM_STRING_REGEX = /\[\d+\]/;

export const stringToObject = (path: string, defaultValue: Record<string, any>) => {
	const disable_matches = path.match(BETWEEN_BRACKETS_REGEX);

	/* DISABLE NESTING BEHAVIOUR */
	if (disable_matches) {
		const key = disable_matches[0].replace(REMOVE_BRACKETS_REGEX, '');

		return {
			[key]: defaultValue,
		};
	}

	/* CREATE OBJECT FROM DOT NOTATION */
	const paths = path.split('.');

	const obj = paths.reduceRight((obj, next) => ({ [next]: obj } as any), defaultValue);

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
		currentObject = currentObject[part];
		if (!currentObject) {
			return;
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
		currentObject = currentObject[part];
		if (!currentObject) {
			return;
		}
	}

	if (last) {
		delete currentObject[last];

		if (Object.keys(currentObject).length === 0) {
			deleteByPath(object, parts.join('.'));
		}
	}
};

export const flattenObject = (obj: any, type: 'value' | 'error' = 'value'): Record<string, string> => {
	const result: any = {};

	for (const key in obj) {
		/* ARRAY BEHAVIOUR */
		const array_mathes = key.match(ARRAY_INDEX_FROM_STRING_REGEX);
		if (array_mathes) {
			const k = key.replace(REMOVE_ARRAY_INDEX_FROM_STRING_REGEX, '');
			!Array.isArray(result[k]) && (result[k] = []);
			const idx = key.match(GET_INDEX_FROM_STRING_REGEX)?.[1];
			if (idx !== undefined) {
				const id = parseInt(idx);
				if (typeof obj[key] === 'object' && 'value' in obj[key]) {
					result[k][id] = type === 'value' ? obj[key].value : obj[key].error;
				} else if (typeof obj[key] === 'object') {
					result[k][id] = flattenObject(obj[key], type);
				}
			}
		} else if (typeof obj[key] === 'object' && 'value' in obj[key]) {
			!obj[key].ignore && (result[key] = type === 'value' ? obj[key].value : obj[key].error);
		} else if (typeof obj[key] === 'object') {
			result[key] = flattenObject(obj[key], type);
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
			const nested = createFormDataFromObject(obj[key],formData, newKey);
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
