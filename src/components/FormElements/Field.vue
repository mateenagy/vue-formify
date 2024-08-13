<script lang="ts" setup>
import { forms } from '@/utils/store';
import { EventEmitter, getValueByPath } from '@/utils/utils';
import { inject, onBeforeUpdate, reactive, ref, Ref, useAttrs } from 'vue';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const props = withDefaults(
	defineProps<{
		name: string;
		error?: any;
		default?: any;
		ignore?: any;
		as?: 'input' | 'select' | undefined;
	}>(),
	{
		error: undefined,
		default: '',
		ignore: false,
		as: undefined,
	},
);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const attrs = useAttrs();
const formData = inject('formData', Object.create({}));

const field = reactive({
	...attrs,
	name: props.name,
	oninput: (event: any) => {
		if (!props.ignore) {
			getValueByPath(forms[formData.uid].values, props.name).value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
			field.value = getValueByPath(forms[formData.uid].values, props.name)?.value;
		}
	},
	onfocus: () => {
		!props.ignore && (getValueByPath(forms[formData.uid].values, props.name).error = undefined);
	},
	'onUpdate:modelValue': (val: any) => {
		if (!props.ignore) {
			getValueByPath(forms[formData.uid].values, props.name).value = val;
			field.modelValue = getValueByPath(forms[formData.uid].values, props.name).value;
		}
	},
	value: (forms[formData.uid]?.initialValues && getValueByPath(forms[formData.uid].initialValues, props.name)) ?? getValueByPath(forms[formData.uid].values, props.name)?.value ?? props.default,
	modelValue: (forms[formData.uid]?.initialValues && getValueByPath(forms[formData.uid].initialValues, props.name)) ?? getValueByPath(forms[formData.uid].values, props.name)?.value ?? props.default,
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
	if (field) {
		field.value = props.default;
		field.modelValue = props.default;
	}
});
/*---------------------------------------------
/  HOOKS
---------------------------------------------*/
onBeforeUpdate(() => {
	if (field && !props.ignore) {
		field.value = getValueByPath(forms[formData.uid].values, props.name)?.value;
		field.modelValue = getValueByPath(forms[formData.uid].values, props.name)?.value;
	}
	
	EventEmitter.emit('value-change');
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
