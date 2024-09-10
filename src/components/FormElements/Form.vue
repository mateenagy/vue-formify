<script lang="ts" setup>
import { computed, onMounted, provide } from 'vue';
import { flattenObject, getValueByPath, EventEmitter, createFormDataFromObject } from '@/utils/utils';
import { forms } from '@/utils/store';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const props = defineProps<{
	enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data';
	validationSchema?: any;
	initialValues?: any;
	name?: string;
	preserve?: boolean;
}>();
const emits = defineEmits(['submit', 'value-change']);
const uid = props.name || Math.floor(Math.random() * Date.now());
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
let originalForm = Object.create({});
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const setError = (name: string, error: any) => {
	if (getValueByPath(forms[uid].values, name)) {
		getValueByPath(forms[uid].values, name).error = error;
	}
};

const updateField = (name: string, value: any) => {
	if (getValueByPath(forms[uid].values, name)) {
		getValueByPath(forms[uid].values, name).value = value;

		EventEmitter.emit('value-change', uid);
	}
};

const reset = () => {
	EventEmitter.emit('reset');
	forms[uid].values = JSON.parse(originalForm);
};

EventEmitter.on('value-change', (id: string) => {
	if (id === uid) {
		emits('value-change', values.value);
	}
});

const submit = async ($event: any) => {
	let _value: any = values.value;
	if (props.validationSchema) {
		const result = await props.validationSchema.parse(flattenObject(forms[uid].values));

		if (result.errors.length) {
			result.errors.forEach((err: any) => {
				setError(err.key, err.message);
			});

			return;
		}
	}

	if (props?.enctype === 'multipart/form-data') {
		_value = createFormDataFromObject(flattenObject(forms[uid].values));
	}

	emits('submit', _value, $event);
};

const flush = () => {
	forms[uid].initialValues = Object.create({});
	forms[uid].values = Object.create({});
	forms[uid].key++;
};
/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
const errors = computed(() => {
	return flattenObject(forms[uid].values, 'error');
});
const values = computed(() => {
	return flattenObject(forms[uid].values);
});
/*---------------------------------------------
/  WATCHERS
---------------------------------------------*/
/*---------------------------------------------
/  CREATED
---------------------------------------------*/
if (!forms[uid]) {
	forms[uid] = {
		values: Object.create({}),
		initialValues: props.initialValues,
		key: 0,
	};
} else {
	props.initialValues && (forms[uid].initialValues = props.initialValues);
}
/*---------------------------------------------
/  HOOKS
---------------------------------------------*/
onMounted(() => {
	originalForm = JSON.stringify(forms[uid].values);
});

provide('formData', {
	uid,
	preserve: props.preserve,
});
defineExpose({
	values,
	errors,
	setError,
	updateField,
	reset,
	flush,
});
</script>
<template>
	<form
		:key="forms[uid].key"
		@submit.prevent="submit($event)"
		v-bind="$attrs">
		<slot
			:values="values"
			:errors="errors" />
	</form>
</template>
