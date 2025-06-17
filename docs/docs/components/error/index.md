# Error

The `<Error>` component displays error messages for a specified input field. By default, it renders the error inside a `<span>` element.

## Basic Usage

::: code-group
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

const { Form, Field, Error, setError, handleSubmit } = useForm();

const sendForm = (data) => {
	if (!data.email.length) {
		setError('email', 'Email required!');
	}
};
</script>

<template>
	<Form @submit="sendForm">
		<Field name="email" />
		<Error error-for="email" />
		<button>Send</button>
	</Form>
</template>
```
:::

:::warning
**Important:** If you are not using the `useForm` composable, you should use a template ref on `<Form>` to set and display errors with the `<Error>` component.
:::

You can also customize the rendered output using a slot:

::: code-group
```vue
<template>
	<Error error-for="email" v-slot="{ error }">
		<p class="error-message">Error: {{ error }}</p>
	</Error>
</template>
```
:::

:::info
The `<Error>` component does not render anything if there is no error for the specified field.
:::

## API Reference

### Props

| Prop        | Description                                 |
|-------------|---------------------------------------------|
| error-for   | The name of the input to show the error for |

### Slots

| Slot   | Parameter         | Description           |
|--------|------------------|-----------------------|
| error  | `{ error: string }` | Customize error output |
