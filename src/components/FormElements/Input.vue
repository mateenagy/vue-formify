<script lang="ts" setup>
import { computed } from 'vue';
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
		error?: string;
	}>(),
	{
		modelValue: undefined,
		required: false,
		type: 'text',
		label: undefined,
		id: undefined,
		defaultValue: undefined,
		error: undefined,
	},
);
const emit = defineEmits(['update:modelValue', 'blur']);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
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
			<span
				v-if="required">
				<slot name="required">*</slot>
			</span>
		</label>
		<div>
			<input
				v-bind="$attrs"
				v-model="value"
				:name="name"
				:type="type"
				:id="id ? id : name"
				:required="required"
				:aria-labelledby="`label-${id ? id : name}`"
				@blur="emit('blur', name)">
		</div>
		<small v-if="error">{{ error }}</small>
	</div>
</template>
