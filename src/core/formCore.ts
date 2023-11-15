import { ref, Slots, VNode } from 'vue';
import { FormElement, FormValue } from '@/components';

const formElements = ref<FormElement>(Object.create({}));
const formLookUpTable = ref<Map<string, any>>(new Map());

export const formCore = (emit: any) => {
	const baseValue = {
		value: '',
		error: undefined,
	};

	const updateFormData = (key: keyof FormElement, value: FormValue) => {
		if (formElements.value[key]) {
			formElements.value[key].value = value;
			emit('update:modelValue', formElements.value);
		} else {
			emit('update:modelValue', value);
		}
	};
	
	const hasSlotContent = (slots: Slots) => {
		if (!slots.default) {
			clearData();
	
			return;
		} else {
			const elements = slots.default();
			formLookUpTable.value.clear();
			fillLookupTable(elements);
			if (!compareMap(formLookUpTable.value, formElements.value)) {
				setFormElements();
				emit('update:modelValue', formElements.value);
		
				Object.keys(formElements.value).forEach(key => !formLookUpTable.value.has(key) && delete formElements.value[key]);
			}
		}
	};
	
	const fillLookupTable = (elements: VNode[]) => {
		const stack: VNode[] = [...elements];
	
		while (stack.length > 0) {
			const element = stack.pop();
	
			if (typeof element?.type === 'object' || typeof element?.type === 'function') {
				formLookUpTable.value.set(element.props?.name, element.props);
			} else if (Array.isArray(element?.children) && element?.children.length) {
				stack.push(...element.children as VNode[]);
			}
		}
	};
	
	const setFormElements = () => {
		formLookUpTable.value.forEach((props, key) => {
			if (!formElements.value[key]) {
				formElements.value[key] = { ...baseValue, ...{ value: props?.['default-value'] || '' } };
			}
		});
	};
	
	const compareMap = (map: Map<string, object>, obj: object): boolean => {
		const mapKeys = Array.from(map.keys()).sort();
		const objKeys = Object.keys(obj).sort();
	
		if (!mapKeys.length || !objKeys.length) {
			return false;
		}
	
		return JSON.stringify(mapKeys) === JSON.stringify(objKeys);
	};
	
	const clearData = () => {
		formLookUpTable.value.clear();
		formElements.value = {};
		emit('update:modelValue', {});
	};

	const setError = (cb: (elements?: any) => void) => {
		cb?.(formElements.value);
	};

	const hideInputError = (name: string) => {
		formElements.value[name].error = undefined;
	};
	
	const resetForm = () => {
		Object.keys(formElements.value).forEach((key) => {
			formElements.value[key] = { ...baseValue, ...{ value: formLookUpTable.value.get(key)?.['default-value'] || '' } };
		});
	};

	return {
		resetForm,
		setError,
		hideInputError,
		formElements,
		updateFormData,
		hasSlotContent,
	};
};
