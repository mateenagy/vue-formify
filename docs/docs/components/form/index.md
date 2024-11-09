# Form
The `<Form />` component functions like a native form but includes additional behind the scenes functionality. It helps collect form data, manage validations, and handle submissions.

### Basic usage
```vue
<script lang="ts" setup>
import { Form, Field } from 'vue-formify';

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<Form @submit="sendForm">
		<Field name="first_name" />
		<Field name="last_name" />
		<button>Send</button>
	</Form>
</template>
```
## Api reference
### Props
| Prop name                 |      Description      |
| --------------------- | :----------- |
| enctype               | Specifies how the form data should be encoded. |
| initialValues               | Sets initial values for form elements. |
| validation-schema     | Accepts a validation schema object from **yup**, **zod**, **valibot**, or **joi**. |
| preserve     | Preserves form data even when the Form component is unmounted. |
| name     | Defines the name of the form. |

### Events
| Event                 |      Description      |
| -------------         | :----------- |
| submit               | Sends form data, with data automatically extracted. |
| value-change         | Triggers an event when form data changes, useful for side effects.  |

### Methods
| Method      |      Parameter      |        Description
| -------------  | :-------------------- | :-------------------- |
| reset      | `void` | Reset form. |
| flush      | `void` | Forced reset. |
| setError      | `{ name: string; error: any }` | Set error messages for specified input. |

### Exposed variables
| Name      |     Description
| -------------  | :-------------------- |
| isSubmitting      | Form submitting state |
| values      | Form field values |
| errors      | Form field errors |

### Slots
| Slot      |      Parameter      |        Description
| -------------  | :-------------------- | :-------------------- |
| default      | `{ values, errors }` | Gives back the form data and errors. |
