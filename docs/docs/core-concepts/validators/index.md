# Validation
Client-side validation is the process of checking form data in the browser before it's sent to the server. It helps catch errors early, such as empty required fields or invalid formats (like an incorrect email address), providing instant feedback to users.

Benefits of client-side validation:
- <strong>Faster feedback</strong>: Users see errors immediately without waiting for a server response.
- <strong>Better user experience</strong>: Helps guide users to correct input in real time.
- <strong>Reduced server load</strong>: Prevents invalid data from reaching the server, saving bandwidth and processing.
- <strong>Improved form usability</strong>: Interactive validation leads to smoother, more intuitive forms.

Instead of being locked into a single validation solution, VueFormify lets you choose from popular schema libraries like `Zod`, `Valibot` or `ArkType` as long as they conform to the [StandardSchema](https://github.com/standard-schema/standard-schema) interface. This approach keeps your validation logic consistent and type-safe while giving you full control over how your data is validated.

## Usage
::: code-group
```vue:line-numbers {3,6-9, 18}
<script setup lang="ts">
import { useForm } from 'vue-formify';
import { type } from 'arktype'

const { Form, Field, Error, handleSubmit } = useForm({
	schema: type({
		username: 'string >= 1',
		password: 'string >= 1',
	})
});

const submit = handleSubmit((data) => {
	console.log(data);
});

</script>
<template>
	<Form @submit="submit">
		<Field name="username" />
		<Error error-for="username" />

		<Field name="password" type="password" />
		<Error error-for="password" />
		<button>Submit</button>
	</Form>
</template>
```
:::
## Form types
Using a schema enables full type inference for form values, field names, and default values.

Thanks to this, VueFormify’s components like `Field`, `Error`, and `FieldArray` automatically know the correct types and structure of your form. This means better TypeScript support, fewer bugs, and a smoother developer experience.

## Schema Validators
### Zod
::: code-group
```vue
<script lang="ts" setup>
import * as zod from 'zod';
import { useForm } from 'vue-formify';

const { Form, Field, handleSubmit } = useForm({
	schema: zod.object({
		first_name: zod.string().min(1, { message: 'Required' }),
		last_name: zod.string().min(1, { message: 'Required' }),
	}),
});

const sendForm = handleSubmit((data) => {
	console.log(data);
});

</script>
<template>
	<Form @submit="sendForm">
        <Field name="first_name" />
        <Field name="last_name" />
    <button>Submit</button>
  </Form>
</template>
```
:::

### Valibot
::: code-group
```vue
<script lang="ts" setup>
import * as v from 'valibot';
import { useForm } from 'vue-formify';

const { Form, Field, handleSubmit } = useForm({
	schema: v.object({
		first_name: v.pipe(v.string(), v.minLength(1, 'Required field')),
		last_name: v.pipe(v.string(), v.minLength(1, 'Required field')),
	}),
});

const sendForm = handleSubmit((data) => {
	console.log(data);
});

</script>
<template>
	<Form @submit="sendForm">
        <Field name="first_name" />
        <Field name="last_name" />
    <button>Submit</button>
  </Form>
</template>
```
:::

### ArkType
::: code-group
```vue
<script lang="ts" setup>
import { type } from 'arktype';
import { useForm } from 'vue-formify';

const { Form, Field, handleSubmit } = useForm({
	schema: type({
		first_name: 'string >= 1';
		last_name: 'string >= 1';
	})
});

const sendForm = handleSubmit((data) => {
	console.log(data);
});

</script>
<template>
	<Form @submit="sendForm">
        <Field name="first_name" />
        <Field name="last_name" />
    <button>Submit</button>
  </Form>
</template>
```
:::
