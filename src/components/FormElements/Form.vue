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
const updateFormData = (key: keyof FormElement, value: FormValue) => {
	if (STORE.value[uid][key]) {
		emit('update:modelValue', STORE.value[uid][key].value);
		STORE.value[uid][key].value = value;
	} else {
		emit('update:modelValue', value);
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
		Object.keys(STORE.value[uid]).forEach((key) => {
			data[key] = STORE.value[uid][key].value;
		});
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
