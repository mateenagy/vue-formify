# Error
The `<Error>` component is for show error message for defined input field. By default it will be between a `<span>` element.

### Basic usage
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
:::warning Important note if you are not using `useForm` composable
For setting and showing the `<Error>` component you should use template ref on `<Form>`.
:::
However you can customize how it rendered using slot.
::: code-group
```vue
<template>
    <Error error-for="email" v-slot="{ error }">
        <p class="error-message">Error: {{ error }}</p>
    </Error>
</template>
```
:::
::: info Rendering errors
`<Error>` component will not rendering anything when no error for the field.
:::
## Api reference
### Props
| Prop                 |      Description      |
| --------------------- | :----------- |
| error-for       | The name of the input to show the error for


### Slots
| Slot      |      Parameter      |        Description
| -------------  | :-------------------- | :-------------------- |
| error      | `{ error: string }` | Customize error |
