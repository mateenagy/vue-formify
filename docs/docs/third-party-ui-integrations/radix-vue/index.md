# Radix Vue integration
Radix Vue is an Unstyled, Accessible Building Blocks for Vue 

## 📦 Install
Install the package with a package manager like `npm` or `bun`:
```bash
npm i @vue-formify/radix-vue
```
After that you can import the equivalent components from the `@vue-formify/radix-vue` instead of `radix-vue`.

❗️ This package only contains the component `root` elements, so you have to import the reso of the child components from the main package.

Before:
```ts
import { SwitchRoot } from '@vue-formify/radix-vue';
```
After:
```ts
import { SwitchRoot } from 'radix-vue';
```

## 💻 Usage
```vue
<script lang="ts" setup>
import { SwitchRoot } from '@vue-formify/radix-vue';
import { SwitchThumb } from 'radix-vue'

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<FormifyForm @submit="send">
		<SwitchRoot
			id="airplane-mode"
			name="airplane"
			class="SwitchRoot">
			<SwitchThumb class="SwitchThumb"/>
		</SwitchRoot>
		<button>Send</button>
	</FormifyForm>
</template>
```
## 🗒️ Note
The `alpha` tagged components not included yet.
