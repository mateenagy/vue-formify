<p align="center">
  <a href="https://vue-formify.matenagy.me/" target="_blank">
	<img src="https://raw.githubusercontent.com/mateenagy/vue-formify/main/logo.png"  width="200px"/>
  </a>
</p>
<p align="center" style="font-size: 20px">Unleash Form-Building Freedom! 🚀</p>

<div class="text-center"><strong>VueFormify</strong> is a form creation package that liberates developers to create forms with freedom! VueFormify is not just a form package; it's your ticket to form-building autonomy, empowering you to craft both simple and complex forms with a bare yet robust skeleton.</div>

## Features
<ul>
	<li>Auto collect form values</li>
	<li>Nested Objects and Arrays</li>
	<li>Form level validation integration with (external modules)</li>
		<ul>
			<li>joi</li>
			<li>yup</li>
			<li>zod</li>
			<li>valibot</li>
		</ul>
	<li>Integrated libraries (external modules)</li>
		<ul>
			<li>PrimeVue</li>
			<li>Element Plus</li>
			<li>Ionic</li>
		</ul>
	<li>Easy to create custom or third party components</li>
	<li>You can access values with v-model if you want</li>
	<li>Using JSON or FormData</li>
	<li>4 basic input component: Input, Checkbox, Radio, Error</li>
	<li>No styling: use anything you want from Bootstrap to Tailwind</li>
	<li>Only 3kb (gzipped)</li>
</ul>

## 📚 Documentation
Read more in the <a href="https://vue-formify.matenagy.me/" target="_blank">documentation</a>
## 📦 Install
```
npm i vue-formify
```
## 💻 Usage
```vue
<script lang="ts" setup>
import { ref } from 'vue';
import { FormifyForm, FormifyInput } from 'vue-formify';

type SimpleForm = {
	email: string;
}

const form = ref()

const sendForm = (data: SimpleForm) => {
	if(!data.email) {
		return form.setError('email', 'Email required')
	}

	console.log(data);
};
</script>

<template>
	<FormifyForm @submit="sendForm" v-slot="{errors}">
		<FormifyInput name="email" />
		<span class="error">{{ errors.email }}</span>
		<button>Send</button>
	</FormifyForm>
</template>
```
