<script lang="ts" setup>
import { computed, provide, onMounted, onUnmounted } from 'vue';
import { STORE } from '@/store/store';
import { getValueByPath, flattenObject, createFormDataFromObject } from '@/utils/utils';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const props = defineProps<{
	enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data';
	action?: string;
	validationSchema?: any;
}>();
const emit = defineEmits(['submit']);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
let originalForm = Object.create({});
const uid = Math.floor(Math.random() * Date.now());
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const setError = (name: string, error: any) => {
	if (getValueByPath(STORE.value[uid], name)) {
		getValueByPath(STORE.value[uid], name).error = error;
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
		const flattenData = flattenObject(STORE.value[uid]);

		if (props?.enctype === 'multipart/form-data') {
			const form_data = new FormData();
			createFormDataFromObject(flattenData, form_data);

			return form_data;
		}

		return flattenData;
	}

	return data;
});

const errors = computed(() => {
	const err = Object.create({});
	if (STORE.value[uid]) {
		const flattenData = flattenObject(STORE.value[uid], 'error');

		return flattenData;
	}

	return err;
});
/*---------------------------------------------
/  WATCHERS
---------------------------------------------*/
/*---------------------------------------------
/  CREATED
---------------------------------------------*/
STORE.value[uid] = Object.create({});

provide('form', {
	formUID: uid,
});

defineExpose({
	resetForm,
	setError,
	hideInputError,
	formData: data,
	errors,
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


const submit = async (payload: Event) => {
	if (props.validationSchema) {
		const result = await props.validationSchema.parse(data.value);

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
	payload.preventDefault();
	emit('submit', data.value);
};
</script>
<template>
	<form
		:key="uid"
		@submit.prevent="submit"
		:action="action">
		<slot
			:data="data"
			:errors="errors"></slot>
	</form>
</template>
