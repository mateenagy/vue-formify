<script lang="ts" setup>
import { useSlots, ref, Slots, VNode, computed, provide, onBeforeUpdate, onMounted } from 'vue';
import { FormElement, FormValue } from '..';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const emit = defineEmits(['update:modelValue', 'submit', 'update:error', 'setError']);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const slots = useSlots();
const formElements = ref<FormElement>(Object.create({}));
const baseValue = {
	value: '',
	error: undefined,
};
const formLookUpTable = ref<Map<string, any>>(new Map());
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const updateFormData = (key: keyof FormElement, value: FormValue) => {
	formElements.value[key].value = value;
	emit('update:modelValue', formElements.value);
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

		if (typeof element?.type === 'object') {
			formLookUpTable.value.set(element.props?.name, element.props);
		} else if (Array.isArray(element?.children) && element?.children.length) {
			stack.push(...element.children as VNode[]);
		}
	}
};

const setFormElements = () => {
	formLookUpTable.value.forEach((props, key) => {
		0;
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

const resetForm = () => {
	Object.keys(formElements.value).forEach((key) => {
		formElements.value[key] = { ...baseValue, ...{ value: formLookUpTable.value.get(key)?.['default-value'] || '' } };
	});
};
/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
const data = computed(() => {
	const data = Object.create({});

	Object.keys(formElements.value).forEach((key) => {
		data[key] = formElements.value[key].value;
	});

	return data;
});
/*---------------------------------------------
/  WATCHERS
---------------------------------------------*/
/*---------------------------------------------
/  CREATED
---------------------------------------------*/
provide('formModel', {
	formElements,
	updateFormData,
});

defineExpose({
	resetForm,
	formData: data,
});
/*---------------------------------------------
/  HOOKS
---------------------------------------------*/
onMounted(() => {
	hasSlotContent(slots);
});

onBeforeUpdate(() => {
	hasSlotContent(slots);
});
</script>
<template>
	<form @submit.prevent="emit('submit', data)">
		<slot></slot>
	</form>
</template>
