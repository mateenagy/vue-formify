# Error

The `<Error>` component displays error messages for a specified input field. By default, it renders the error inside a `<span>` element.

## Basic Usage

::: code-group
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

const { Form, Field, Error, setError, handleSubmit } = useForm();

const sendForm = handleSubmit((data) => {
	if (!data?.email?.length) {
		setError('email', 'Email required!');
	}
});
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

:::tip
`<Error>` must be rendered inside the `<Form>` it belongs to, and both must come from the **same** `useForm()` call. When you use a validator schema, matching errors are displayed automatically — you only need `setError` for manual or server-side errors.
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

| Slot    | Parameter           | Description             |
|---------|---------------------|-------------------------|
| default | `{ error: string }` | Customize error output. |
