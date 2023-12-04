export const stringToObject = (path: string, defaultValue: Record<string, any>) => {
	const paths = path.split('.');

	const obj = paths.reduceRight((obj, next) => ({ [next]: obj } as any), defaultValue);

	return obj;
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

export const deleteByPath = (object: Record<string, any>, path: string) => {
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

export const getValueByPath = (object: Record<string, any>, path: string) => {
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

export const flattenObject = (obj: any): Record<string, string> => {
	const result: any = {};

	for (const key in obj) {
		if (typeof obj[key] === 'object' && 'value' in obj[key]) {
			result[key] = obj[key].value;
		} else if (typeof obj[key] === 'object') {
			result[key] = flattenObject(obj[key]);
		}
	}

	return result;
};
