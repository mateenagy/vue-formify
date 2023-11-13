<script lang="ts" setup>
import { ref } from 'vue';
import { FormType } from './components';
import Form from '@/components/FormElements/Form.vue';
import Input from '@/components/FormElements/Input.vue';
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
</script>
<template>
	<div>
		<pre>{{ form?.formData }}</pre>
		<Form
			ref="form"
			@submit="send">
			<Input
				name="last_name"
				label="Vezetéknév" />
			<Input
				name="first_name"
				label="Keresztnév"
				default-value="asd" />
			<Input
				required
				name="email"
				label="Email" />
			<button type="submit">
				Küldés
			</button>
		</Form>
		<button @click="form?.resetForm()">
			Reset
		</button>
	</div>
</template>
