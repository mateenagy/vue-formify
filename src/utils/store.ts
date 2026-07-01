import { reactive } from 'vue';

/**
 * A single field entry in the store. The known keys describe a leaf field;
 * the index signature covers nested path segments and array items (`[0]`, …),
 * which are themselves FieldStore nodes.
 */
export interface FieldStore {
	value?: any;
	initialValue?: any;
	error?: any;
	ignore?: boolean;
	isTouched?: boolean;
	[key: string]: any;
}

export type FormStore = {
	values: Record<string, FieldStore>;
	initialValues: Record<string, any>;
	key: number;
}

export const forms = reactive<Record<string, FormStore>>({});
