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
	console.log('[data]: ', data);
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
const a = ref<string>();
</script>
<template>
	<div>
		<pre>{{ form?.formData }}</pre>
		<pre>{{ a }}</pre>
		<Form
			ref="form"
			@submit="send">
			<Input
				name="foo"
				label="foo" />
			<button type="submit">
				Küldés
			</button>
		</Form>
		<Input
			name="asd"
			v-model="a"
			label="Bar" />
		<button @click="form?.resetForm()">
			Reset
		</button>
	</div>
</template>
