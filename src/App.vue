<script lang="ts" setup>
import { ref } from 'vue';
import { FormType } from './components';
import { Form, Input } from './components';
import FormGroup from './components/FormGroup.vue';
import { createInput } from './composable/createInput';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const form = ref<FormType>();
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const imageUrl = ref<string>('');
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const send = (data: any) => {
	console.log('[data]: ', { ...data, ... { img: imageUrl.value } });
	form.value?.setError((elements) => {
		elements.email.error = 'email error';
	});
};

const Group = createInput(FormGroup);
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
			<Input name="email" />
			<Group name="group" />
			<FormGroup />
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
