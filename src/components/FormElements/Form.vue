<script lang="ts" setup>
import { computed, provide, onMounted, onUnmounted } from 'vue';
import { FormElement, FormValue } from '@/components';
import { STORE } from '@/store/store';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const emit = defineEmits(['update:modelValue', 'submit', 'update:error', 'setError', 'error-handler']);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
let originalForm = Object.create({});
const uid = Math.floor(Math.random() * Date.now());
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const updateStoreValue = (store: any, path: string, value: any) => {
	const keys = path.split('.');
	let currentObject = store;

	keys.forEach((key, index) => {
		if (!currentObject[key]) {
			currentObject[key] = {};
		}

		if (index === keys.length - 1) {
			// If it's the last key, update the value
			currentObject[key].value = value;
		}

		currentObject = currentObject[key];
	});
};
const flattenObject = (obj: any): Record<string, string> => {
	const result: any = {};

	for (const key in obj) {
		if (typeof obj[key] === 'object' && 'value' in obj[key]) {
			// If the property is an object with a 'value' property, extract the value
			result[key] = obj[key].value;
		} else if (typeof obj[key] === 'object') {
			// If the property is an object without a 'value' property, recursively flatten it
			result[key] = flattenObject(obj[key]);
		}
	}

	return result;
};
const updateFormData = (key: keyof FormElement, value: FormValue) => {
	if (key.includes('.')) {
		updateStoreValue(STORE.value[uid], key, value);
	} else {
		if (STORE.value[uid][key]) {
			emit('update:modelValue', STORE.value[uid][key].value);
			STORE.value[uid][key].value = value;
		} else {
			emit('update:modelValue', value);
		}
	}
};

const setError = (name: string, error: any) => {
	if (STORE.value[uid][name]) {
		STORE.value[uid][name].error = error;
	}
};

const hideInputError = (name: string) => {
	STORE.value[uid][name].error = undefined;
};
	
const resetForm = () => {
	STORE.value[uid] = JSON.parse(originalForm);
};
/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
const data = computed(() => {
	const data = Object.create({});
	if (STORE.value[uid]) {
		return flattenObject(STORE.value[uid]);
	}

	return data;
});
/*---------------------------------------------
/  WATCHERS
---------------------------------------------*/
/*---------------------------------------------
/  CREATED
---------------------------------------------*/
STORE.value[uid] = Object.create({});

provide('form', {
	formName: uid,
	updateFormData,
});

defineExpose({
	resetForm,
	setError,
	hideInputError,
	formData: data,
});
/*---------------------------------------------
/  HOOKS
---------------------------------------------*/
onMounted(() => {
	originalForm = JSON.stringify(STORE.value[uid]);
});

onUnmounted(() => {
	delete STORE.value[uid];
});
</script>
<template>
	<form
		@submit.prevent="emit('submit', data)">
		<slot :data="data"></slot>
	</form>
</template>
