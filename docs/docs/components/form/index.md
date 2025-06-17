# Form
The `<Form>` component acts as an enhanced version of the native HTML form. It streamlines form data collection, validation management, and submission handling.

### Basic usage

::: code-group
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

const { Form, Field, handleSubmit } = useForm();

const sendForm = handleSubmit((data) => {
	console.log(data);
});
</script>

<template>
	<Form @submit="sendForm">
		<Field name="first_name" />
		<Field name="last_name" />
		<button>Send</button>
	</Form>
</template>
```
:::

### Set initial values

You can set initial values either by providing them as an option to the composable or by passing them as a prop to the `Form` component:

::: code-group
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

const { Form, Field, handleSubmit } = useForm({
	initialValues: {
		first_name: 'John',
		last_name: 'Doe'
	}
});
</script>
```
:::
::: code-group
```vue
<template>
	<Form @submit="sendForm" :initial-values="{ first_name: 'John', last_name: 'Doe' }">
		<Field name="first_name" />
		<Field name="last_name" />
		<button>Send</button>
	</Form>
</template>
```
:::

## API reference

### Props

| Prop name      | Description                                         |
| -------------- | --------------------------------------------------- |
| enctype        | Specifies how the form data should be encoded.      |
| initialValues  | Sets initial values for form elements.              |
| name           | Defines the name of the form.                       |

### Events

| Event         | Description                                                        |
| ------------- | ------------------------------------------------------------------ |
| submit        | Emits form data, automatically extracting the values.              |
| value-change  | Fires when form data changes, useful for triggering side effects.  |

### Slots

| Slot    | Parameter            | Description                                 |
| ------- | -------------------- | ------------------------------------------- |
| default | `{ values, errors }` | Provides access to form data and errors.     |
