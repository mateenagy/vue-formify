<script lang="ts" setup>
import { useSlots, computed, provide, onBeforeUpdate, onMounted } from 'vue';
import { formCore } from '@/core/formCore';
import '@/style.css';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const emit = defineEmits(['update:modelValue', 'submit', 'update:error', 'setError', 'error-handler']);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const slots = useSlots();
const { formElements, updateFormData, resetForm, hasSlotContent, setError, hideInputError, formLookUpTable } = formCore(emit);
/*---------------------------------------------
/  METHODS
---------------------------------------------*/

/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
const data = computed(() => {
	const data = Object.create({});

	Object.keys(formElements.value).forEach((key) => {
		const props = formLookUpTable.value.get(key);
		props?.ignore !== '' && (data[key] = formElements.value[key].value);
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
	setError,
	hideInputError,
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
