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
	<li>Type-safe forms</li>
	<li>Form level validation integration with (external modules)</li>
		<ul>
			<li>joi</li>
			<li>yup</li>
			<li>zod</li>
			<li>valibot</li>
		</ul>
	<li>Easy to create custom or third party components</li>
	<li>You can access values with v-model if you want</li>
	<li>Using JSON or FormData</li>
	<li>Only 4kb (gzipped)</li>
</ul>

## 📚 Documentation
Read more in the <a href="https://vue-formify.matenagy.me/" target="_blank">documentation</a>
## 📦 Install
```
npm i vue-formify
```
## 💻 Usage
### Basic
```vue
<script lang="ts" setup>
import { FormifyForm, Field, Error } from 'vue-formify';

const sendForm = (data) => {
	console.log(data);
};
</script>

<template>
	<FormifyForm @submit="sendForm">
		<Field name="email" as="input" />
		<Error error-for="email" />
		<button>Send</button>
	</FormifyForm>
</template>
```
### Type safe
```vue
<script lang="ts" setup>
import { useField } from 'vue-formify';

type FormData = {
  username: string;
  password: string;
}

const {
  Form,
  Field,
  Error,
  handleSubmit,
} = useForm<FormData>();

const sendForm = handleSubmit((data) => {
	console.log(data)
})

</script>

<template>
	<Form @submit="sendForm">
		<Field name="email" as="input" />
		<Error error-for="email" />
		<button>Send</button>
	</Form>
</template>
```
