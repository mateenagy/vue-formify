<script lang="ts" setup>
import { ref } from 'vue';
import { FormType } from './components';
import { Form, Input } from './components';

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
	<div class="wrapper">
		<pre>{{ form?.formData }}</pre>
		<Form
			ref="form"
			@submit="send">
			<Input
				name="first_name"
				required />
			<Input name="last_name" />
			<Input name="email" />
			<button type="submit">
				Küldés
			</button>
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
