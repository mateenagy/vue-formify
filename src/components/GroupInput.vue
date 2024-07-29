<script lang="ts" setup>
import { ref } from 'vue';
import { createInput } from '../composable/createInput';
import Error from './FormElements/Error.vue';
import Input from './FormElements/Input.vue';
import { ComponentProps } from './main';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const InputField = createInput<ComponentProps<typeof Input>>(Input);
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
const toggle = ref<boolean>(true);
</script>
<template>
	<div>
		<button @click="toggle = !toggle">
			Toggle
		</button>
		<InputField
			name="foo[0]" />
		<InputField
			name="foo[1]" />
		<Error error-for="foo" />
		<InputField name="baz" />
		<button>send</button>
	</div>
</template>
