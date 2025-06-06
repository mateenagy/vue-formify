# Form
The `<Form>` component functions like a native form but includes additional behind the scenes functionality. It helps collect form data, manage validations, and handle submissions.

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
### Set initial values
You can set intial value by passing it as an option in the composable or pass it as a prop on the `Form` component:
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
::: code-group
```vue
<template>
	<Form @submit="sendForm" :initial-values: { first_name: 'John', last_name: 'Doe' }>
		<Field name="first_name" />
		<Field name="last_name" />
		<button>Send</button>
	</Form>
</template>
```
:::
## Api reference
### Props
| Prop name                 |      Description      |
| --------------------- | :----------- |
| enctype               | Specifies how the form data should be encoded. |
| initialValues               | Sets initial values for form elements. |
| name     | Defines the name of the form. |

### Events
| Event                 |      Description      |
| -------------         | :----------- |
| submit               | Sends form data, with data automatically extracted. |
| value-change         | Triggers an event when form data changes, useful for side effects.  |

### Slots
| Slot      |      Parameter      |        Description
| -------------  | :-------------------- | :-------------------- |
| default      | `{ values, errors }` | Gives back the form data and errors. |
