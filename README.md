# VueFormify

VueFormify is a form creating framework. This is **not a UI library**. There are some awesome libraries I tried, but most of them feels overcomplicated. They have their own ecosystem which not always works well together with other UI libraries (which not just focused on forms). That is the reason I made this small framework which make form creations much more easier and faster without worrying about writing big objects and put v-model on every input or using other UI libraries form components.

## 📦 Install

```
npm i vue-formify
```

## 💡 How it works

My focus was to create something that feels good to use without struggling with styling or using other libraries components. For that purpose I made only 3 components all together:

-   **Form**: Same as native forms, we put our inputs inside the `<Form>` element.
-   **Input**: It's basically an input field with extra features like a11y and able to show error messages and label for input.
-   **Error**: The main usage of this component is when you create input from different UI libraries (e.g. Element Plus) you can show error messages without creating a wrapper component

When you define the **Input** element inside the **Form** the only thing you have to do is set the **name** attribute and the Form will automatically extract the value.

It also works well with **HMR** without any issue! You can **add / remove / change** inputs and the data will be updated.

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
	createInput<ComponentProps<typeof ColorPickerComponent>>(ColorPickerComponent);

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

This composable also help to create other UI frameworks compatible with VueFormify. Take a look at how we implement Element Plus checkbox:

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

## 🛑 Handling errors

I prefer to minimize client-side error handling or not using at all, as it can become convoluted when combined with backend error handling. That's why this framework doesn't include built-in error handling. But rest assured, you have the flexibility to manage errors. By using template ref, you can access the form object to set errors. In theory, you can implement any JavaScript validator; for instance, I use yup in this example."

```vue
<script lang="ts" setup>
import { Form, Input } from "vue-formify";
import { FormType } from "vue-formify/dist/components";

const form = ref<FormType>();
const send = (data: any) => {
	const rules = yup.object({
		first_name: yup.string().required("First name requried"),
		last_name: yup.string().required("Last name requried"),
		email: yup.string().required("Email requried"),
	});

	rules
		.validate(data, { abortEarly: false })
		.then(() => {
			console.log("data", data);
		})
		.catch((errors) => {
			errors.inner.forEach((error) => {
				form.value?.setError(error.path, error.message);
			});
		});
};
</script>
<template>
	<div>
		<Form ref="form" @submit="send">
			<Input name="first_name" />
			<Input name="last_name" />
			<Input name="email" />
			<button type="submit">Send</button>
		</Form>
	</div>
</template>
```

## ⛔️ Limitations

I found one limitation with this approach. Sadly if you want to wrap multiple input component to be one component file and use that inside form then it will not work:

```vue
<Form>
	<Inputs />  <!-- <-This component contains multiple Input component  -->
</Form>
```
