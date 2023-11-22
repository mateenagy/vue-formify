<script lang="ts" setup>
// import { Input } from '../../components';
import { ElCheckbox } from 'element-plus';
import { ComponentProps } from '../main';
import Input from '@/components/FormElements/Input.vue';
import { createInput } from '@/composable/createInput';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const Input2 = createInput<ComponentProps<typeof Input>>(Input);
const Checkbox = createInput<ComponentProps<typeof ElCheckbox>>(ElCheckbox);
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
		<Input2
			name="email" />
		<Checkbox
			name="accept_pp"
			label="Accept PP" />
	</div>
</template>
