<script lang="ts" setup>
import { computed, onMounted, provide, ref } from 'vue';
import { flattenObject, getValueByPath } from '@/utils/utils';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const props = defineProps<{
	enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data';
	action?: string;
	validationSchema?: any;
}>();
const emits = defineEmits(['submit']);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const data = ref(Object.create({}));
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
	data.value = JSON.parse(originalForm);
};

const submit = async () => {
	if (props.validationSchema) {
		const result = await props.validationSchema.parse(flattenObject(data.value));

		if (result.errors.length) {
			result.errors.forEach((err: any) => {
				setError(err.key, err.message);
			});

			return;
		}
	}

	if (props.action) {
		return;
	}
	
	emits('submit', flattenObject(data.value));
};
/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
const errors = computed(() => {
	return flattenObject(data.value, 'error');
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
provide('formData', data);
defineExpose({
	setError,
	values: data,
	errors,
	reset,
});
</script>
<template>
	<form
		@submit.prevent="submit"
		:action="action"
		v-bind="$attrs">
		<pre>{{ data }}</pre>
		<label>flatten</label>
		<pre>{{ flattenObject(data) }}</pre>
		<slot
			:data="data"
			:errors="errors" />
	</form>
</template>
