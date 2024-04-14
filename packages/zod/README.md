<p align="center">
  <a href="https://vue-formify.matenagy.me/" target="_blank">
	<img src="https://raw.githubusercontent.com/mateenagy/vue-formify/main/logo.png"  width="250px"/>
  </a>
</p>
<p align="center" style="font-size: 20px">VueFormify Zod schema validator integration</p>

## 📦 Install
```
npm i @vue-formify/zod
```
## 💻 Usage
```vue
<script lang="ts" setup>
import { schemaFromZod } from '@vue-formify/zod';
import { object, string } from 'zod'

const schema = schemaFromZod(
	object({
		first_name: string().min(1, { message: 'Required' }),
		last_name: string().min(1, { message: 'Required' }),
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
