# Form

The `<FormifyForm />` component is the same as the native equivalent with some extra magic under the hood.

This is the root component for every form. The form will extract the data automatically.
### Basic usage
```vue
<script lang="ts" setup>
import { FormifyForm, Field } from 'vue-formify';

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<FormifyForm @submit="sendForm">
		<Field name="first_name" />
		<Field name="last_name" />
		<button>Send</button>
	</FormifyForm>
</template>
```

## Api reference
### Props
| Prop                 |      Description      |
| --------------------- | :----------- |
| enctype               | Specifies how the form data should be encoded. |
| initialValues               | Inital values for form elements |
| validation-schema     | You can pass validation schema object from **yup/zod/valibot/joi** |
| preserve     | Preserve form data even the Form component is unmounted |
| name     | Name of the form. |

### Events
| Event                 |      Description      |
| -------------         | :----------- |
| submit               | Send form data. Data will be automatically extracted. |
| value-change         | Event when form data changed. Good for side effects.  |

### Methods
| Method      |      Parameter      |        Description
| -------------  | :-------------------- | :-------------------- |
| reset      | `void` | Reset form to default value. |
| flush      | `void` | Forced reset. |
| setError      | `{ name: string; error: any }` | Set error messages for specified input. |

#### Exposed variables
| Name      |     Description
| -------------  | :-------------------- |
| isSubmitting      | Form submitting state |
| values      | Form field values |
| errors      | Form field errors |

### Slots
| Slot      |      Parameter      |        Description
| -------------  | :-------------------- | :-------------------- |
| default      | `{ values, errors }` | Gives back the form data and errors. |
