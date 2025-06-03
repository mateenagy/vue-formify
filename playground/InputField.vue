<script lang="ts" setup>
import { useInput, type InputProps } from '@/main';
import InputText, { type InputTextProps } from 'primevue/inputtext';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const props = defineProps<InputProps<any> & { label?: string }>();
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const { inputProps, isValid, getError } = useInput<InputTextProps>(props);
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
	<div class="w-full mb-1rem">
		<label
			:for="(props.name as string)"
			class="mb-0.5rem block ml-0.5rem">{{ label }}</label>
		<InputText
			v-bind="inputProps"
			:invalid="!isValid"
			class="w-full" />
		<small class="block color-red">{{ getError() }}</small>
	</div>
</template>
