<script lang="ts" setup>
import { ref } from 'vue';
import { FormType } from './components';
import { Form, Input } from './components';
import { STORE } from './store/store';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const form = ref<FormType>();

/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const send = (data: any) => {
	console.log('data', data);
	const errors = [
		{
			code: 'first_name:required',
		},
		{
			code: 'email:required',
		},
		{
			code: 'last_name:required',
		},
	];

	errors.forEach((error) => {
		const key = error.code.split(':')[0];
		form.value?.setError(key, error.code);
	});
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
		<p>STORE</p>
		<pre>{{ STORE }}</pre>
		<pre>{{ form?.formData }}</pre>
		<div>
			<Form
				@submit="send"
				ref="form">
				<Input
					name="first_name" />
				<Input
					name="last_name" />
				<button>
					Send
				</button>
			</Form>
		</div>
		<button @click="form?.resetForm()">
			Reset
		</button>
	</div>
</template>
<style>
.wrapper {
	padding: 1rem;
}

.error-message {
	color: rgb(255, 77, 77);
}
</style>
