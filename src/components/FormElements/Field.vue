<script lang="ts" setup>
import { getValueByPath } from '@/utils/utils';
import { inject, reactive, Ref, useAttrs } from 'vue';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const props = withDefaults(
	defineProps<{
		name: string;
		error?: any;
		default?: any;
	}>(),
	{
		error: undefined,
		default: '',
	},
);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const attrs = useAttrs();
const form = inject<Ref<Record<string, any>>>('form', Object.create({}));
const field = reactive({
	...attrs,
	name: props.name,
	oninput: (event: any) => {
		getValueByPath(form.value, props.name).value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
	},
	onfocus: () => {
		getValueByPath(form.value, props.name).error = undefined;
	},
	'onUpdate:modelValue': (value: any) => {
		field.modelValue = value;
		getValueByPath(form.value, props.name).value = value;
	},
	checked: props?.default,
	modelValue: getValueByPath(form.value, props.name).value ?? props.default,
});
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
/*---------------------------------------------
/  WATCHERS
---------------------------------------------*/
/*---------------------------------------------
/  CREATED
---------------------------------------------*/
/*---------------------------------------------
/  HOOKS
---------------------------------------------*/
</script>
<template>
	<div>
		<slot
			:field="field"
			:error="error" />
	</div>
</template>
