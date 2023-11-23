# VueFormify: Unleash Form-Building Freedom! 🚀

**VueFormify** is a form creation package that liberates developers to create forms with freedom! VueFormify is not just a form package; it's your ticket to form-building autonomy, empowering you to craft both simple and complex forms with a bare yet robust skeleton.

### 🎨 Unleash Your Creativity:

Unlike other form libraries, VueFormify is not confined to being a UI library. It liberates you from the shackles of pre-defined styles and layouts, allowing seamless integration with your favorite UI libraries such as Element Plus, PrimeVue, Radix Vue, and more. **Your forms, your rules** – VueFormify puts the power back in your hands.

### 🚫 No Validation Boundaries:

VueFormify takes a unique stance on validation – there isn't any built-in. Why? Because I believe you should have complete control over how you handle data and errors because everyone do it differently. Mold your validation strategies to fit your application's needs, ensuring a tailored user experience without compromise.

### 🚀 Easy To Learn - Easy To Use

I made VueFormify intuitive and straightforward. Seamlessly integrate it into your project and watch as the simplicity of VueFormify transforms form creation into a breeze.

### 💡 Empowering Developers, One Form at a Time:

This package is about empowering developers to take charge of their forms but not in a painful way. Take a look, try it and redefine the way you create forms in Vue.js.

## 📦 Install

```
npm i vue-formify
```

## 🔧 How it works

For simplicity VueFormify only have 3 component:

### Form: `FormType<T>`
The most important component. It contains all the inputs and extract data automatically so you don't need to use v-model.


| Events  | Parameter	| Descripton                                    	|
|-------- |--------	|-----------------------------------------------	|
| @submit | `{ data: T }` 	| Send form data. data automatically extracted. 	|

| Methods 	| Parameters  	| Descripton						|
|--------	|--------	|---------------------- 			|	
| resetForm | 	-		| Reset form to default value. 		|
| setError  | 	`{ name: string; error: any }`		| Set error messages to specified input 				|
| hideInputError  | 	`{ name: string }`		| Hide error messages from specified input 				|

| Properties 	| Descripton                                    	|
|--------	|-----------------------------------------------	|
| formData 	| Extracted data from the form. (`data` from `submit` already contain these but it can be useful)	|

```html
<Form ref="form" @submit="sendForm">
	...
</Form>
```

### Input: `Component<T>`
This is a basic input field with label and error message.
| Props  | Type	| Descripton                                    	|
|-------- |--------	|-----------------------------------------------	|
| name | `string ` 	| Uniqe name of the input. The form extract data from name attribute |
| modelValue | FormValue 	| Input value (v-model) |
| label | string 	| Input label |
| id | string 	| Input id |
| default | FormValue | Input default value |
| error | string | Input error message |

| Methods  	| Descripton                                    	|
|-------- |-----------------------------------------------	|
| @blur  | input blur event |
| @focus  | input focus event |
| @change  | input change event |
| @input  | input input event |

```html
<Form ref="form" @submit="sendForm">
	<Input name="first_name" />
	<Input name="last_name" />

	<button>Send</button>
</Form>
```

### Error: `Component<T>`
A simple component for show error for specified input. Easy to use with custom components.
| Props  | Type	| Descripton                                    	|
|-------- |--------	|-----------------------------------------------	|
| errorFor | `string ` 	| Name of the input to show the error for |

```html
<Form ref="form" @submit="sendForm">
	<CustomComponent name="custom" />
	<Error error-for="custom" />

	<button>Send</button>
</Form>
```

## Composables
### createInput: `ComponentProps<typeof component>(component: Component, options?: CreateInputOptions) => FunctionalComponent<T & BaseInput, any>`
**createInput** composable is a very important part of this package. This handy function can create usable component for `<Form>` from any custom component with ease. With the help of `ComponentProps` type we can keep the original component props autocompletion.

```vue
<script setup lang="ts">
import { createInput, ComponentProps } from 'vue-formify'
import { ElCheckbox } from 'element-plus'
import CustomComponent from './components/CustomComponent.vue'

const Checkbox = createInput<ComponentProps<typeof ElCheckbox>>(ElCheckbox);
const CustomComponent = createInput<ComponentProps<typeof CustomComponent>>(CustomComponent);
</script>
```

## Examples
### Simple

```vue
<script setup lang="ts">
import { Form, Input, Error} from 'vue-formify'

const sendForm = (data: any) => {
	console.log('data', data);
};

</script>
<template>
	<Form ref="form" @submit="sendForm">
		<Input name="first_name" />
		<Input name="last_name" />

		<button>Send</button>
	</Form>
</template>
```
### With custom UI library
```vue
<script setup lang="ts">
import { Form, Input, Error, createInput, ComponentProps} from 'vue-formify'
import { ElCheckbox } from 'element-plus'

const Checkbox = createInput<ComponentProps<typeof ElCheckbox>>(ElCheckbox);

const sendForm = (data: any) => {
	console.log('data', data);
	/* 
	console output: 
	{
		first_name: '...'
		last_name: '...',
		accept_terms: true/false,
	}
	*/
};

</script>
<template>
	<Form ref="form" @submit="sendForm">
		<Input name="first_name" />
		<Input name="last_name" />
		<Checkbox name="accept_terms" />
		<Error error-for="accept_terms" />

		<button>Send</button>
	</Form>
</template>
```
