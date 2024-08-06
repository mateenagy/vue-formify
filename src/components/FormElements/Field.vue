<script lang="ts" setup>
import { EventEmitter, getValueByPath } from '@/utils/utils';
import { inject, onBeforeUpdate, reactive, Ref, useAttrs } from 'vue';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const props = withDefaults(
	defineProps<{
		name: string;
		error?: any;
		default?: any;
		as?: 'input' | 'select' | undefined;
	}>(),
	{
		error: undefined,
		default: '',
		type: undefined,
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
		field.value = getValueByPath(form.value, props.name).value;
	},
	onfocus: () => {
		getValueByPath(form.value, props.name).error = undefined;
	},
	'onUpdate:modelValue': (val: any) => {
		field.modelValue = val;
		getValueByPath(form.value, props.name).value = val;
	},
	value: getValueByPath(form.value, props.name).value ?? props.default,
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
EventEmitter.on('reset', () => {
	field.value = props.default;
	field.modelValue = props.default;
});
/*---------------------------------------------
/  HOOKS
---------------------------------------------*/
onBeforeUpdate(() => {
	field.value = getValueByPath(form.value, props.name).value;
});
</script>
<template>
	<div>
		<template v-if="!as">
			<slot
				:field="field"
				:error="error" />
		</template>
		<template v-else>
			<component
				:is="props.as"
				v-bind="field">
				<slot />
			</component>
		</template>
	</div>
</template>
