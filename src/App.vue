<script lang="ts" setup>
import { ref } from 'vue';
import { FormType } from './components';
import { Form, ComponentProps } from './components';
import Group from './components/FormElements/Group.vue';
import Input from './components/FormElements/Input.vue';
import { createInput } from './composable/createInput';
import { STORE } from './store/store';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const form = ref<FormType>();
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const send = (data: any) => {
	console.log('data', data);
};

const Input2 = createInput<ComponentProps<typeof Input>>(Input);
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
const show = ref<boolean>(false);
</script>
<template>
	<div class="wrapper">
		<p>STORE</p>
		<pre>{{ STORE }}</pre>
		<button @click="show = !show">
			SHOW
		</button>
		<Form
			@submit="send"
			form-name="form-1"
			ref="form">
			<Input2
				name="first_name" />
			<Input2
				name="last_name" />
			<Group />
			<button>Send</button>
		</Form>
		<button @click="form?.resetForm()">
			Reset
		</button>
	</div>
</template>
<style>
.wrapper {
	padding: 1rem;
}
</style>
