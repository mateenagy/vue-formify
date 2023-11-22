<script lang="ts" setup>
import { useSlots, computed, provide, onBeforeUpdate, onMounted, ref, Slots, VNode } from 'vue';
import { FormElement, FormValue } from '@/components';
import { STORE } from '@/store/store';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const props = defineProps<{
	formName: string;
}>();
const emit = defineEmits(['update:modelValue', 'submit', 'update:error', 'setError', 'error-handler']);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const form = ref();
const formLookUpTable = ref<Record<string, Map<string, any>>>(Object.create({}));
const baseValue = {
	value: '',
	error: undefined,
};
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const updateFormData = (key: keyof FormElement, value: FormValue) => {
	if (STORE.value[props.formName][key]) {
		STORE.value[props.formName][key].value = value;
	} else {
		emit('update:modelValue', value);
	}
};

const setError = (name: string, error: any) => {
	STORE.value[props.formName][name].error = error;
};

const hideInputError = (name: string) => {
	STORE.value[props.formName][name].error = undefined;
};
	
const resetForm = () => {
	Object.keys(STORE.value[props.formName]).forEach((key) => {
		STORE.value[props.formName][key] = { ...baseValue, ...{ value: formLookUpTable.value[props.formName].get(key)?.['default-value'] || '' } };
	});
};
/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
const data = computed(() => {
	const data = Object.create({});
	
	Object.keys(STORE.value[props.formName]).forEach((key) => {
		const inputProps = formLookUpTable.value[props.formName].get(key);
		inputProps?.ignore !== '' && (data[key] = STORE.value[props.formName][key].value);
	});

	return data;
});
/*---------------------------------------------
/  WATCHERS
---------------------------------------------*/
/*---------------------------------------------
/  CREATED
---------------------------------------------*/
provide('form', {
	formName: props.formName,
	formLookUpTable,
	updateFormData,
});

defineExpose({
	form,
	resetForm,
	setError,
	hideInputError,
	formData: data,
});

STORE.value[props.formName] = Object.create({});
formLookUpTable.value[props.formName] = new Map();
/*---------------------------------------------
/  HOOKS
---------------------------------------------*/
</script>
<template>
	<form
		ref="form"
		@submit.prevent="emit('submit', data)">
		<slot></slot>
	</form>
</template>
