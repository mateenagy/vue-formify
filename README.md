# VueFormify

VueFormify is a form creating framework. This is **not a UI library**. There are some awesome libraries I tried, but most of them feels overcomplicated. They have their own ecosystem which not always works well together with other UI libraries (which not just focused on forms). That is the reason I made this small framework which make form creations much more easier and faster without worrying about writing big objects and put v-model on every input or using other UI libraries form components.

## 📦 Install

```
npm i vue-formify
```

```ts
import { VueFormify } from "vue-formify";

app.use(VueFormify);
```

## 💡 How it works

My focus was to create something that feels like native and feels good to use. For that purpose I made only have 3 components all together:

-   **Form**: As native forms we put our inputs inside a `<Form>` element.
-   **Input**: It's basically an input field with extra features like a11y and error messages
-   **Error**: The main usage of this component is when you create input from different UI libraries (e.g. Element Plus) you can show error messages without creating a wrapper component

When you define the **Input** element inside the **Form** the only thing you have to do is set the **name** attribute and the Form will automatically extract the value.

It also works well with **HMR** without any issue! You can **add / remove / change** input and the data will be updated.

**But enough talk let's see some code!**

## 💻 Usage

### Simple form

With this simple example you can see how easy to make a simple form. You don't need any pre defined object or anything (you can use it with v-model if you want).
When you send the form the data will be extracted.

```tsx
import { Form, Input } from 'vue-formify';

const sendForm = (data) => {
	console.log(data)
	/*
		output:
		{
			first_name: ...
			last_name: ..
			email: ...
		}
	*/
}

<template>
	<Form @submit="sendForm">
		<Input name="first_name" label="First name" />
		<Input name="last_name" label="Last name" />
		<Input name="email" label="email" type="email" />
	</Form>
<template>
```

## Create custom input

To create custom input you can create a `.vue` file where you make a component just like you will do if you want a custom input.

**ColorPickerComponent.vue**

```vue
<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
	modelValue?: string;
}>();
const emits = defineEmits(["update:modelValue"]);
const value = computed({
	get: () => {
		return props.modelValue;
	},
	set: (value: any) => {
		emits("update:modelValue", value);
	},
});
</script>
<template>
	<input type="color" v-model="value" />
</template>
```

There is nothing special just casual Vue component stuff, but we only need one small step to make it work with the framework.

We have a special composable called `createInput` where you can pass the custom component and that's all! You can use your component now.

```vue
<script lang="ts" setup>
import { Form, Input, createInput } from "vue-formify";
import ColorPickerComponent from "./components/ColorPickerComponent.vue";
import { FormType, ComponentProps } from "vue-formify/dist/components";

const ColorPicker =
	createInput<ComponentProps<typeof ColorPickerComponent>>(
		ColorPickerComponent
	);

const send = (data: any) => {
	console.log(data);
	/* 
		output:
		{
			color: ...
		}
	*/
};
</script>
<template>
	<div>
		<Form @submit="send">
			<ColorPicker name="color" />
			<button type="submit">Send</button>
		</Form>
	</div>
</template>
```

This composable also help to create other UI frameworks compatible with this frameworks. Take a look at how we implement Element Plus checkbox:

```vue
<script lang="ts" setup>
import { Form, Input, createInput } from "vue-formify";
import { ElCheckbox } from "element-plus";
import { FormType, ComponentProps } from "vue-formify/dist/components";

const Checkbox = createInput<ComponentProps<typeof ElCheckbox>>(ElCheckbox);

const send = (data: any) => {
	console.log(data);
	/* 
		output:
		{
			check_this: ...
		}
	*/
};
</script>
<template>
	<div>
		<Form @submit="send">
			<Checkbox name="check_this" />
			<button type="submit">Send</button>
		</Form>
	</div>
</template>
```
