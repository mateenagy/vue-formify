<p align="center">
  <a href="https://vue-formify.matenagy.me/" target="_blank">
	<img src="https://raw.githubusercontent.com/mateenagy/vue-formify/main/logo.png"  width="250px"/>
  </a>
</p>
<p align="center" style="font-size: 20px">VueFormify Valibot schema validator integration</p>

## 📦 Install
```
npm i @vue-formify/valibot
```
## 💻 Usage
```vue
<script lang="ts" setup>
import { schemaFromValibot } from '@vue-formify/valibot';
import { object, string, minLength } from 'valibot'

const schema = schemaFromValibot(
	object({
		first_name: string('Value must be a string', [
			minLength(1, 'Required')
		]),
		last_name: string('Value must be a string', [
			minLength(1, 'Required')
		]),
	})
)

const sendForm = (data) => {
	console.log('data', data);
};

</script>

<template>
	<FormifyForm @submit="sendForm" :validation-schema="schema">
		<FormifyInput name="first_name" />
		<FormifyInput name="last_name" />
		<button>Send</button>
	</FormifyForm>
</template>
```
