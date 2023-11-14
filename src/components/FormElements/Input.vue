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
				v-bind="$attrs"
				v-model="value"
				:name="name"
				:type="type"
				:id="id ? id : name"
				:class="prefix && 'has-prefix'"
				:aria-labelledby="`label-${id ? id : name}`"
				@blur="emit('blur')">
			<span
				v-if="prefix"
				class="prefix">{{ prefix }}</span>
		</div>
	</div>
</template>
