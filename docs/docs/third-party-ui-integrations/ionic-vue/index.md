# Ionic Vue integration
Ionic Vue empowers you to create top-notch mobile applications that seamlessly run on iOS, Android, and the web, all using the familiar tools and syntax of Vue.js. It's not just a UI library, but a framework that bridges the gap between Vue and mobile development.

## 📦 Install
Install the package with a package manager like `npm` or `bun`:
```bash
npm i @vue-formify/ionic-vue
```
After that you can import the equivalent components from the `@vue-formify/ionic-vue` instead of `ionic-vue`.

Before:
```ts
import IonInput from 'ionic-vue';
```
After:
```ts
import { IonInput } from '@vue-formify/ionic-vue';
```

## 💻 Usage
```vue
<script lang="ts" setup>
import { FormifyForm } from 'vue-formify';
import { IonInput } from '@vue-formify/ionic-vue';

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<FormifyForm @submit="sendForm">
		<IonInput name="email" />
		<button>Send</button>
	</FormifyForm>
</template>
```
## ℹ️ Auto Import
If you are using `unplugin-vue-components`, you can use a modified resolver:
```
npm i @vue-formify/resolver
```

```ts
import Components from 'unplugin-vue-components/vite';
import { IonicResolver } from '@vue-formify/resolver'

export default defineConfig({
	plugins: [
		Components({
			resolvers: [
				IonicResolver(),
			],
			...
		}),
	]
})
```
