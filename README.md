# Vue Formify

## Say Hello to Effortless Form Creation in Vue 3!

### 💡 Introduction

Vue Formify is your go-to solution for painless and efficient form creation in Vue 3. Tired of wrestling with complex form syntax? Experience the joy of crafting forms with simplicity, performance, and ease of use at the forefront.

### 🚀 Key Features

#### Easy to Use 🎉
Craft forms effortlessly with Vue Formify's components. No more headaches just intuitive form creation for developers of all levels.

#### Pain-Free Form Creation 🤕 ➡️ 😌
Bid farewell to the pains and intricacies of form development. Vue Formify streamlines the process, making form creation an enjoyable task. <br />Enjoy form creation without big `objects refs` or multiple `v-models`, or **without any extra javascript** to extract data.

#### Lightning-Fast 🚄
Enjoy rapid form rendering and submission. Vue Formify accelerates your development workflow, ensuring a seamless user experience.

#### Easy Custom Component Creation 🛠️
Tailor your forms effortlessly with custom components. Extend functionality without sacrificing simplicity. It's easy to create wrapper for popular UI libraries (e.g. Element Plus, PrimeVue) or create more advenced input if you want.

#### Lightweight 🕊️
Keep your project lean with Vue Formify's feather-light design. Zero unnecessary dependencies (except for Vue.js) for a nimble application.

#### Zero Dependencies (Except Vue.js) 📦
Embrace simplicity and minimalism. Vue Formify has zero external dependencies—just Vue.js for a streamlined development experience.

### 🎉 Conclusion

Elevate your Vue.js development with Vue Formify—a modern, easy-to-use, and lightweight form library that puts simplicity and efficiency first. Say goodbye to form creation woes and hello to a delightful development experience!

## 💻 Usage

## Simple form
```tsx
import { Form, Input } from 'vue-formify';

const sendForm = (data) => {
	console.log(data)
}

<template>
	<Form @submit="sendForm">
		<Input name="first_name" label="First name" />
		<Input name="last_name" label="Last name" />
		<Input name="email" label="email" type="email" />
		<Input name="born_date" label="Born date" type="date" />
	</Form>
<template>
```
## Create custom input
For custom input we need to use this boilerplate code. We need to define the `name` prop which is essential for the `Form` component to extract data automatically and we need the modelValue for `v-model` implementation. After that we have the `value` from `useCreateInput` composable. We can update this value as we want and this will be our final value
```ts
import { useCreateInput } from '@/composable/useCreateInput';

const props = defineProps<{
	name: string;
	modelValue?: any[];
}>();
const emit = defineEmits(['update:modelValue']);
const { value } = useCreateInput(props, emit);
```

### Advance usage with custom component
To understand what we can do with the code above let's create a custom input which is just a plain color type input. The twist is that we want the value contain the hex and the rgb code at the same time in an object.

- First we start with the template part becuase it is really easy:
```html
<template>
	<input type="color" @input="setColor">
</template>
```

- Then we add the boiler plate code and the logic.
```ts
// The boilerplate for the custom input
import { useCreateInput } from '@/composable/useCreateInput';

const props = defineProps<{
	name: string;
	modelValue?: any[];
}>();
const emit = defineEmits(['update:modelValue']);
const { value } = useCreateInput(props, emit);

// The custom logic
const hexToRgb = (hex: string) => {
	hex = hex.replace(/^#/, '');
	const bigint = parseInt(hex, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;

	return { r, g, b };
};

const setRandomNumber = ($event: any) => {
	const hex = $event.target.value;

	// We change the value here and it gives us an object with the color data
	value.value = {
		hex,
		rgb: hexToRgb(hex),
	};
};
```

### Use custom input to create wrapper for other UI libraries
We can easily create wrapper for different UI libraries just using `value` as `v-model` e.g. ElementPlus

```tsx
<script setup lang="ts">
import { ElCheckbox } from 'element-plus'
import { useCreateInput } from '@/composable/useCreateInput';

const props = defineProps<{
	name: string;
	label: string;
	modelValue?: any[];
}>();
const emit = defineEmits(['update:modelValue']);
const { value } = useCreateInput(props, emit);
</script>

<template>
	<ElCheckbox v-model="value" :label="label" />
</template>
```

**Happy Coding!** 🚀
