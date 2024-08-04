<script lang="ts" setup>
import { computed, onMounted, provide, ref } from 'vue';
import { flattenObject, getValueByPath, EventEmitter, createFormDataFromObject } from '@/utils/utils';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const props = defineProps<{
	enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data';
	validationSchema?: any;
}>();
const emits = defineEmits(['submit']);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const data = ref({});
let originalForm = Object.create({});
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const setError = (name: string, error: any) => {
	if (getValueByPath(data.value, name)) {
		getValueByPath(data.value, name).error = error;
	}
};

const reset = () => {
	EventEmitter.emit('reset');
	data.value = JSON.parse(originalForm);
};

const submit = async () => {
	let _value: any = values.value;
	if (props.validationSchema) {
		const result = await props.validationSchema.parse(flattenObject(data.value));

		if (result.errors.length) {
			result.errors.forEach((err: any) => {
				setError(err.key, err.message);
			});

			return;
		}
	}

	if (props?.enctype === 'multipart/form-data') {
		_value = createFormDataFromObject(flattenObject(data.value));
	}

	emits('submit', _value);
};
/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
const errors = computed(() => {
	return flattenObject(data.value, 'error');
});
const values = computed(() => {
	return flattenObject(data.value);
});
/*---------------------------------------------
/  WATCHERS
---------------------------------------------*/
/*---------------------------------------------
/  CREATED
---------------------------------------------*/
/*---------------------------------------------
/  HOOKS
---------------------------------------------*/
onMounted(() => {
	originalForm = JSON.stringify(data.value);
});
provide('form', data);
defineExpose({
	values: data,
	errors,
	setError,
	reset,
});
</script>
<template>
	<form
		@submit.prevent="submit"
		v-bind="$attrs">
		<slot
			:values="values"
			:errors="errors" />
	</form>
</template>
