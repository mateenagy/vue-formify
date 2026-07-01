import { forms } from './store';
import { GetKeys, StandardSchemaV1 } from './types';

export const BETWEEN_BRACKETS_REGEX = /^\[(.+?)\]$/gm;
export const REMOVE_BRACKETS_REGEX = /(^.*\[|\].*$)/g;
export const ARRAY_INDEX_FROM_STRING_REGEX = /\[(\d*)\]/gm;
export const GET_INDEX_FROM_STRING_REGEX = /\[(\d+)\]/;
export const REMOVE_ARRAY_INDEX_FROM_STRING_REGEX = /\[\d+\]/;

export const createFormInput = (name: string, uid: string | number, defaultValue: { value: any, error: any }) => {
	if (name && !(name in forms[uid].values)) {
		const obj = stringToObject(name, defaultValue);
		forms[uid].values = mergeDeep(forms[uid].values, obj);
	}
};

export const resolveTag = (props: Record<string, any>, isSlot: boolean) => {
	let tag = props.as || '';

	if (!props.as && !isSlot) {
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

export const stringToObject = (path: string, defaultValue: Record<string, any> | string) => {
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

/**
 * Deep clone a value. Primitives are returned as-is; objects/arrays are
 * structurally cloned so a stored snapshot can't be mutated by later writes.
 */
export const cloneValue = (val: any): any => {
	if (val === null || typeof val !== 'object') {
		return val;
	}

	try {
		return JSON.parse(JSON.stringify(val));
	} catch {
		return val;
	}
};

/**
 * Structural equality. Treats `undefined`-valued keys and missing keys as
 * equivalent so a JSON-cloned snapshot (which drops `undefined`) still matches
 * a live field object that carries `error: undefined`.
 */
export const isEqual = (a: any, b: any): boolean => {
	if (a === b) {
		return true;
	}

	if (typeof a !== typeof b) {
		return false;
	}

	if (typeof a !== 'object' || a === null || b === null) {
		// NaN === NaN
		return a !== a && b !== b;
	}

	if (a instanceof Date || b instanceof Date) {
		return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
	}

	if (typeof File !== 'undefined' && (a instanceof File || b instanceof File)) {
		return a === b;
	}

	if (typeof Blob !== 'undefined' && (a instanceof Blob || b instanceof Blob)) {
		return a === b;
	}

	const aIsArray = Array.isArray(a);
	const bIsArray = Array.isArray(b);
	if (aIsArray !== bIsArray) {
		return false;
	}

	if (aIsArray) {
		if (a.length !== b.length) {
			return false;
		}

		return a.every((item: any, index: number) => isEqual(item, b[index]));
	}

	const aKeys = Object.keys(a).filter(key => a[key] !== undefined);
	const bKeys = Object.keys(b).filter(key => b[key] !== undefined);
	if (aKeys.length !== bKeys.length) {
		return false;
	}

	return aKeys.every(key => isEqual(a[key], b[key]));
};

/**
 * A single field is dirty when its current value differs from the value it was
 * initialised with.
 */
export const isFieldDirty = (field: any): boolean =>
	!!field && typeof field === 'object' && 'value' in field && !isEqual(field.value, field.initialValue);

/**
 * The form is dirty when any field in it is dirty. Walks the nested store,
 * treating nodes that carry a `value` key as leaf fields (covers scalar,
 * object-value and array fields) and recursing through dot-path segments.
 */
export const isFormDirty = (values: Record<string, any>): boolean => {
	if (!values || typeof values !== 'object') {
		return false;
	}

	for (const key in values) {
		const node = values[key];
		if (!node || typeof node !== 'object') {
			continue;
		}

		if ('value' in node) {
			if (node.ignore) {
				continue;
			}
			if (isFieldDirty(node)) {
				return true;
			}
		} else if (isFormDirty(node)) {
			return true;
		}
	}

	return false;
};

/**
 * Clear the `error` on every field in the store (scalar, object-value and
 * array fields), descending into nested/array values like isFormTouched.
 */
export const clearStoreErrors = (values: Record<string, any>): void => {
	if (!values || typeof values !== 'object') {
		return;
	}

	for (const key in values) {
		const node = values[key];
		if (!node || typeof node !== 'object') {
			continue;
		}

		if ('value' in node) {
			node.error = undefined;
			if (node.value && typeof node.value === 'object') {
				clearStoreErrors(node.value);
			}
		} else {
			clearStoreErrors(node);
		}
	}
};

/**
 * The form is touched when any field in it has been touched. Like isFormDirty,
 * but the touched flag lives on the leaf inputs, so this also descends into a
 * field's nested/array `value` to reach the touched flags of array items.
 */
export const isFormTouched = (values: Record<string, any>): boolean => {
	if (!values || typeof values !== 'object') {
		return false;
	}

	for (const key in values) {
		const node = values[key];
		if (!node || typeof node !== 'object') {
			continue;
		}

		if ('value' in node) {
			if (node.ignore) {
				continue;
			}
			if (node.isTouched) {
				return true;
			}
			if (node.value && typeof node.value === 'object' && isFormTouched(node.value)) {
				return true;
			}
		} else if (isFormTouched(node)) {
			return true;
		}
	}

	return false;
};

export function hasErrors(errors: any): boolean {
	if (typeof errors === 'string' && errors) {
		return true;
	}

	if (Array.isArray(errors)) {
		return errors.some(err => hasErrors(err));
	}

	if (typeof errors === 'object' && errors !== null) {
		return Object.values(errors).some(value => hasErrors(value));
	}

	return false;
}

export const getErrorMessage = <T extends Record<string, any>>(values: Record<string, any>, errorFor: GetKeys<T>) => {
	return getValueByPath(values, errorFor as string)?.error;
};

export const flattenObject = (obj: any, type: 'value' | 'error' = 'value'): Record<string, any> => {
	const result: any = {};
	for (const key in obj) {
		if (obj[key] && typeof obj[key] === 'object' && 'value' in obj[key]) {
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

export const objectToModelValue = (object: Record<string, any>): Record<string, any>[] | string => {
	const result: Record<string, any>[] = [];

	if (!Array.isArray(object.value) && typeof object.value === 'object' && !(object.value instanceof Date)) {
		const firstKey = Object.keys(object.value)?.[0];

		if (firstKey?.match?.(BETWEEN_BRACKETS_REGEX)) {
			for (const key in object.value) {
				result.push(object.value[key].value);
			}

			return result;
		}

		return object.value;
	}

	return object.value || typeof object.value === 'boolean' ? object.value : '';
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

export const getDotPath = (issue: StandardSchemaV1.Issue): string | null => {
	if (issue.path?.length) {
		let dotPath = '';
		for (const item of issue.path) {
			const key = typeof item === 'object' ? item.key : item;
			if (typeof key === 'string') {
				if (dotPath) {
					dotPath += `.${key}`;
				} else {
					dotPath += key;
				}
			} else if (typeof key === 'number') {
				dotPath += `[${key}]`;
			} else {
				return null;
			}
		}

		return dotPath;
	}

	return null;
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

/**
 * A small event bus. One instance is created per form (provided through the
 * form context) so events never cross form boundaries and listeners are
 * garbage-collected with the form rather than accumulating on a global.
 */
export class EventEmitter {
	private eventListeners: Record<string, EventHandler[]> = {};

	on(eventName: string, handler: EventHandler): void {
		if (!this.eventListeners[eventName]) {
			this.eventListeners[eventName] = [];
		}

		this.eventListeners[eventName].push(handler);
	}

	off(eventName: string, handler: EventHandler): void {
		const listeners = this.eventListeners[eventName];

		if (listeners) {
			this.eventListeners[eventName] = listeners.filter(h => h !== handler);
		}
	}

	emit(eventName: string, data?: any): void {
		const listeners = this.eventListeners[eventName];

		if (listeners) {
			listeners.forEach(handler => handler(data));
		}
	}
}
