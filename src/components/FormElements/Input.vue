<script lang="ts" setup>
import { computed, inject } from 'vue';
import { FormValue, HTMLInputAttributeType } from '..';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const props = withDefaults(
	defineProps<{
		name: string;
		modelValue?: FormValue;
		label?: string;
		id?: string;
		required?: boolean;
		type?: HTMLInputAttributeType;
		defaultValue?: FormValue;
		prefix?: string;
	}>(),
	{
		modelValue: undefined,
		required: false,
		type: 'text',
		label: undefined,
		id: undefined,
		defaultValue: undefined,
		prefix: '',
	},
);
const emit = defineEmits(['update:modelValue', 'blur']);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const { updateFormData, formElements } = inject<any>('formModel');
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
const value = computed({
	get: () => {
		return props.modelValue || formElements.value[props.name]?.value;
	},
	set: (value) => {
		updateFormData(props.name, value);
		emit('update:modelValue', formElements.value[props.name]?.value);
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
			class="input-label"
			:id="`label-${id ? id : name}`"
			:for="id ? id : name">
			<slot name="label">
				{{ label }}
			</slot>
			<span
				class="required"
				v-if="required">
				<slot name="required">*</slot>
			</span>
		</label>
		<div class="position-relative">
			<input
				class="form-control"
				v-model="value"
				v-bind="$attrs"
				:name="name"
				:type="type"
				:id="id ? id : name"
				:value="value"
				:class="prefix && 'has-prefix'"
				:data-has-error="formElements[name]?.error ? 'true' : 'false'"
				:aria-labelledby="`label-${id ? id : name}`"
				@blur="emit('blur')"
				@focus="formElements[name].error = undefined">
			<span
				v-if="prefix"
				class="prefix">{{ prefix }}</span>
		</div>
		<span
			class="error-msg"
			v-if="formElements[name]?.error">
			<slot name="error">error</slot>
		</span>
	</div>
</template>
