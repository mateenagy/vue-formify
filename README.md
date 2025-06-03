<p align="center">
  <a href="https://vue-formify.matenagy.me/" target="_blank">
	<img src="https://raw.githubusercontent.com/mateenagy/vue-formify/main/logo.png"  width="120px"/>
  </a>
</p>
<p align="center" style="font-size: 20px">Build powerful, <strong>type-safe</strong> forms in Vue.</p>

<strong>VueFormify</strong> is a form-building library for Vue that simplifies creating both simple and complex forms. It offers type safety, schema validations and a minimal bundle size (~4kb gzipped), making it both secure and efficient.

## Features
- <strong>Type Safe</strong>: Ensures accurate data types and autocompletion across fields.
- <strong>Validation</strong>: Use schema based validators like `Zod`, `Valibot` or `ArkType`.
- <strong>Auto Collect Values</strong>: Seamlessly gathers form data.
- <strong>Supports Nested Objects and Arrays</strong>: Easily handle complex data structures. 
- <strong>Easy Third-Party Integrations</strong>: Flexible to work with other libraries.
- <strong>Customizable Components</strong>: Easily build and integrate custom components.
- <strong>Lightweight</strong>: Small footprint for a faster, more responsive app. 

## 📚 Documentation
Read more in the <a href="https://vue-formify.matenagy.me/" target="_blank">documentation</a>
## 📦 Install
```bash
npm i vue-formify
```
## 💻 Usage
### Basic
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

type FormData = {
  email: string;
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
		<Field name="email" />
		<Error error-for="email" />
		<button>Send</button>
	</Form>
</template>
```
