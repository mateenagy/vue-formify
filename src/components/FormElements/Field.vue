<script lang="ts" setup>
import { getValueByPath } from '@/utils/utils';
import { inject, Ref, useAttrs } from 'vue';
//TODO: Checkbox & Radio type
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

const field = {
	...attrs,
	name: props.name,
	oninput: (event: any) => {
		getValueByPath(form.value, props.name).value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
	},
	onfocus: () => {
		getValueByPath(form.value, props.name).error = undefined;
	},
};
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
