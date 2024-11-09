# Element Plus integration
Element Plus provides a modern design language and a wide range of features for developers, designers, and product managers:

## 📦 Install
Install the package with a package manager like `npm` or `bun`:
```bash
npm i @vue-formify/element-plus
```
After that you can import the equivalent components from the `@vue-formify/element-plus` instead of `element-plus`.

Before:
```ts
import ElInput from 'element-plus';
```
After:
```ts
import { ElInput } from '@vue-formify/element-plus';
```

## 💻 Usage
```vue
<script lang="ts" setup>
import { Form } from 'vue-formify';
import { ElInput } from '@vue-formify/element-plus';

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<Form @submit="sendForm">
		<ElInput name="email" />
		<button>Send</button>
	</Form>
</template>
```
