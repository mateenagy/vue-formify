# Error
The `<Error />` component is for show error message for defined input field. By default it will be between a `<span>` element.

### Basic usage
```vue
<script lang="ts" setup>
import { Form, Field, Error, FormType } from 'vue-formify';

const form = ref<FormType>();

const sendForm = (data) => {
    if (!data.email.length) {
        form.value?.setError('email', 'Email required!');
    }
};

</script>
<template>
	<Form ref="form" @submit="sendForm">
		<Field name="email" />
		<Error error-for="email" />
		<button>Send</button>
	</Form>
</template>
```
:::warning Important note if you are not using `useForm` composable
For setting and showing the `<Error />` component you should use template ref on `<Form>`.
:::
However you can customize how it rendered using slot.
```vue
<template>
    <Error error-for="email" v-slot="{ error }">
        <p class="error-message">Error: {{ error }}</p>
    </Error>
</template>
```
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
