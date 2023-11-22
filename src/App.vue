<script lang="ts" setup>
import { ref } from 'vue';
import { FormType } from './components';
import { Form, Input } from './components';
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
				<Input name="first_name" />
				<button>
					Send
				</button>
			</Form>
		</div>
		<div>
			<Form
				@submit="send"
				ref="form">
				<Input name="last_name" />
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
</style>
