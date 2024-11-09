# PrimeVue integration
PrimeVue is a comprehensive UI library designed for Vue.js that offers a rich set of over 80 components 

## 📦 Install
Install the package with a package manager like `npm` or `bun`:
```bash
npm i @vue-formify/primevue
```
After that you can import the equivalent components from the `@vue-formify/primevue` instead of `primevue`.

Before:
```ts
import InputText from 'primevue/inputtext';
```
After:
```ts
import { InputText } from '@vue-formify/primevue';
```

## 💻 Usage
```vue
<script lang="ts" setup>
import { Form } from 'vue-formify';
import { InputText, InputMask } from '@vue-formify/primevue';

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<Form @submit="sendForm">
		<InputText name="email" />
        <InputMask name="mask" mask="99-999999" placeholder="99-999999" />
		<button>Send</button>
	</Form>
</template>
```
## ℹ️ Auto Import
If you are using `unplugin-vue-components`, you can use a modified resolver:
```
npm i @vue-formify/resolver
```

```ts
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@vue-formify/resolver'

export default defineConfig({
	plugins: [
		Components({
			resolvers: [
				PrimeVueResolver(),
			],
			...
		}),
	]
})
```
### ❗️ Important note
Sadly I cant update the global typing so if you use it and not import the component inside the component you don't get the `vue-formify` autocomletion. (It will be working behind the scene just there is no types).
