<script lang="ts" setup>
import { computed, inject } from 'vue';
import { FormValue, HTMLInputAttributeType, PluginOptions } from '..';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
defineOptions({
	inheritAttrs: false,
});

const props = withDefaults(
	defineProps<{
		name: string;
		value: any;
		modelValue?: FormValue;
		label?: string;
		id?: string;
		required?: boolean;
		type?: HTMLInputAttributeType;
		errorClass?: string;
		error?: string;
	}>(),
	{
		modelValue: undefined,
		required: false,
		type: 'text',
		label: undefined,
		id: undefined,
		error: undefined,
		errorClass: undefined,
	},
);
const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change', 'input']);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const config: PluginOptions | undefined = inject('config', undefined);
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
const value = computed({
	get: () => {
		return props.modelValue;
	},
	set: (value: any) => {
		emit('update:modelValue', value);
	},
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
</script>
<template>
	<div>
		<label
			v-if="label"
			:id="`label-${id ? id : name}`"
			:for="id ? id : name">
			<slot name="label">
				{{ label }}
			</slot>
			<span v-if="required">
				<slot name="required">*</slot>
			</span>
		</label>
		<div>
			<input
				v-bind="$attrs"
				:value="value"
				:name="name"
				:type="type"
				:id="id ? id : name"
				:required="required"
				:aria-required="required"
				:aria-labelledby="`label-${id ? id : name}`"
				@blur="emit('blur', $event, name, value)"
				@focus="emit('focus', $event, name, value)"
				@input="emit('input', $event, name, value), emit('update:modelValue', ($event.target as HTMLInputElement).value)"
				@change="emit('change', $event, name, value)">
		</div>
		<small
			:class="[errorClass, (config as any)?.globalErrorCSSClass]"
			v-if="error">{{ error }}</small>
	</div>
</template>
