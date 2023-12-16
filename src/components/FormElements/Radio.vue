<script lang="ts" setup>
import { computed, inject } from 'vue';
import { FormValue, PluginOptions } from '..';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
defineOptions({
	inheritAttrs: false,
});

const props = withDefaults(
	defineProps<{
		name: string;
		value?: any;
		modelValue?: FormValue;
		label?: string;
		id?: string;
		required?: boolean;
		errorClass?: string;
		trueLabel: any;
		falseLabel: any;
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
		trueLabel: true,
		falseLabel: false,
		value: '',
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
const modelVal = computed({
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
		<div>
			<input
				v-bind="$attrs"
				v-model="modelVal"
				:name="name"
				:value="value"
				type="radio"
				:id="id ? id : value"
				:required="required"
				:aria-required="required"
				:aria-labelledby="`label-${id ? id : value}`"
				:true-value="trueLabel"
				:false-value="falseLabel"
				@blur="emit('blur', $event, name, value)"
				@focus="emit('focus', $event, name, value)"
				@input="emit('input', $event, name, value)"
				@change="emit('change', $event, name, value)">
			<label
				v-if="label"
				:id="`label-${id ? id : value}`"
				:for="id ? id : value">
				<slot
					name="label"
					:label="label">
					{{ label }}
				</slot>
				<span v-if="required">
					<slot name="required">*</slot>
				</span>
			</label>
		</div>
		<slot
			name="error"
			:error="error">
			<small
				:class="[errorClass, (config as any)?.globalErrorCSSClass]"
				v-if="error">{{ error }}</small>
		</slot>
	</div>
</template>
