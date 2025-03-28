import { forms } from './store';

export const BETWEEN_BRACKETS_REGEX = /^\[(.+?)\]$/gm;
export const REMOVE_BRACKETS_REGEX = /(^.*\[|\].*$)/g;
export const ARRAY_INDEX_FROM_STRING_REGEX = /\[(\d*)\]/gm;
export const GET_INDEX_FROM_STRING_REGEX = /\[(\d+)\]/;
export const REMOVE_ARRAY_INDEX_FROM_STRING_REGEX = /\[\d+\]/;

export const getKey = (name: string = '', modelKey: string, useKey: boolean = false): string => {
	if (name) {
		return useKey ? name : `${name}.${modelKey}`;
	}

	return modelKey;
};

export const extractInitialValues = (key: string, initialValues: Record<string, any>, props: Record<string, any>, options: any) => {
	const name = key.replace(REMOVE_ARRAY_INDEX_FROM_STRING_REGEX, '');
	const index = key.match(GET_INDEX_FROM_STRING_REGEX)?.[1];

	if (!index) {
		return getValueByPath(initialValues, name) ?? (options?.modelKey && props[options.modelKey]) ?? props?.modelValue ?? props?.default ?? options?.default ?? '';
	}

	return getValueByPath(initialValues, name)?.[index] || '';
};

export const createFormInput = (name: string, uid: string | number, defaultValue: { value: any, error: any }) => {
	if (name && !(name in forms[uid].values)) {
		const obj = stringToObject(name, defaultValue);
		forms[uid].values = mergeDeep(forms[uid].values, obj);
	}
};

export const resolveTag = (props: Record<string, any>, slots: any) => {
	let tag = props.as || '';

	if (!props.as && !slots.default) {
		tag = 'input';
	}

	return tag;
};

export const normalizeChildren = (
	tag: string | undefined | null,
	slots: any,
	slotProps: () => Record<string, unknown>,
) => {
	if (!slots.default) {
		return slots.default;
	}

	if (typeof tag === 'string' || !tag) {
		return slots.default(slotProps());
	}

	return {
		default: () => slots.default?.(slotProps()),
	};
};

export const getPropBooleanValue = (props: any) => {
	if (typeof props === 'string' && props === '') {
		return true;
	}

	return !!props;
};

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
					value: {
						[`[${index}]`]: obj,
					},
				},
			};
		}

		return { [next]: obj };
	}, defaultValue);

	return obj;
};

export const objectToString = (obj: Record<string, any>, parentKey: string = ''): Record<string, any> => {
	let result: Record<string, any> = {};

	for (const key in obj) {
		const newKey = parentKey ? `${parentKey}.${key}` : key;

		if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
			const nestedResult = objectToString(obj[key], newKey);
			result = { ...result, ...nestedResult };
		} else {
			result[newKey] = obj[key];
		}
	}

	return result;
};

export const getValueByPath = (object: Record<string, any>, path?: string) => {
	if (!path) {
		return;
	}

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


			currentObject = currentObject?.[key]?.value?.[`[${index}]`];
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

			return last && currentObject?.[key]?.value?.[`[${index}]`];
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

			currentObject = currentObject?.[key]?.value?.[`[${index}]`];
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

			delete currentObject?.[key]?.value?.[`[${index}]`];
			(currentObject?.[key]?.value && !Object.keys(currentObject?.[key]?.value).length) && (currentObject[key].value = []);
		} else {
			delete currentObject[last];
		}

		if (Object.keys(currentObject).length === 0) {
			deleteByPath(object, parts.join('.'));
		}
	}
};

export const flattenObject = (obj: any, type: 'value' | 'error' = 'value'): Record<string, any> => {
	const result: any = {};
	for (const key in obj) {
		if (typeof obj[key] === 'object' && 'value' in obj[key]) {
			if (typeof obj[key].value === 'object') {
				Array.isArray(obj[key].value) && (result[key] = []);
				if (Object.keys(obj[key].value)?.[0]?.match?.(BETWEEN_BRACKETS_REGEX)) {
					for (const arrayKey in obj[key].value) {
						(!result[key] && !obj[key].ignore) && (result[key] = []);
						if (type in obj[key].value[arrayKey]) {
							obj[key].value[arrayKey][type] && result[key].push(obj[key].value[arrayKey][type]);
						} else {
							!obj[key].ignore && result[key].push(flattenObject(obj[key].value[arrayKey], type));
						}
					}
				} else {
					!obj[key].ignore && (result[key] = obj[key][type]);
				}
			} else {
				!obj[key].ignore && (result[key] = obj[key][type]);
			}
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

export const createFormDataFromObject = (obj: Record<string, any>, parentKey = '') => {
	const formData: FormData = new FormData();

	Object.keys(obj).reduce((acc, key) => {
		const newKey = parentKey ? `${parentKey}.${key}` : key;

		if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key]) && !(obj[key] instanceof Date) && !(obj[key] instanceof File) && !(obj[key] instanceof Blob)) {
			const nested = createFormDataFromObject(obj[key], newKey);
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

	return formData;
};

export const fetcher = async (promise?: void | Promise<any>) => {
	try {
		return await promise;
	} catch {
		return;
	}
};

/* Custom event handler */
type EventHandler = (data?: any) => void;

export class EventEmitter {
	private static eventListeners: Record<string, EventHandler[]> = {};

	static on(eventName: string, handler: EventHandler): void {
		if (!this.eventListeners[eventName]) {
			this.eventListeners[eventName] = [];
		}

		this.eventListeners[eventName].push(handler);
	}

	static off(eventName: string, handler: EventHandler): void {
		const listeners = this.eventListeners[eventName];

		if (listeners) {
			this.eventListeners[eventName] = listeners.filter(h => h !== handler);
		}
	}

	static emit(eventName: string, data?: any): void {
		const listeners = this.eventListeners[eventName];

		if (listeners) {
			listeners.forEach(handler => handler(data));
		}
	}
}

/*
/  TYPES
*/
