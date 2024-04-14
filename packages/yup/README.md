<p align="center">
  <a href="https://vue-formify.matenagy.me/" target="_blank">
	<img src="https://raw.githubusercontent.com/mateenagy/vue-formify/main/logo.png"  width="250px"/>
  </a>
</p>
<p align="center" style="font-size: 20px">VueFormify Yup schema validator integration</p>

## 📦 Install
```
npm i @vue-formify/yup
```
## 💻 Usage
```vue
<script lang="ts" setup>
import { schemaFromYup } from '@vue-formify/yup';
import { object, string } from 'yup'

const schema = schemaFromYup(
	object({
		first_name: string().required(),
		last_name: string().required(),
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
