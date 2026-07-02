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
## Field-level validation
Instead of (or in addition to) a form-wide `schema`, you can validate a single field by passing a StandardSchema to its `rule` prop. This is handy for one-off fields, reusable field components, or when you don't want to maintain a schema for the whole form.

The `rule` schema validates that field's value directly, and runs on blur and on submit — and on every change when `mode` is `'onChange'`.
::: code-group
```vue
<script setup lang="ts">
import { useForm } from 'vue-formify';
import * as z from 'zod';

const { Form, Field, Error, handleSubmit } = useForm();

const submit = handleSubmit((data) => {
	console.log(data);
});
</script>
<template>
	<Form @submit="submit">
		<Field name="email" :rule="z.string().email('Invalid email address')" /> <!-- [!code highlight] -->
		<Error error-for="email" />
		<button>Submit</button>
	</Form>
</template>
```
:::

::: tip
`FieldArray` accepts a `rule` prop as well, so you can validate a whole array — for example, enforcing a minimum number of items.
:::
## Validation modes
You can choose between two modes to trigger validations. The default mode is `onSubmit`, which runs the validation after the form is submitted.

The other mode is `onChange`, which runs validation every time an input changes.
::: code-group
```vue:line-numbers {6}
<script setup lang="ts">
import { useForm } from 'vue-formify';
import { type } from 'arktype'

const { Form, Field, Error, handleSubmit } = useForm({
	mode: 'onChange',
	schema: type({
		username: 'string >= 1',
		password: 'string >= 1',
	})
});
</script>
```
:::
## Form types
You don't have to declare a separate type when you use a schema — VueFormify infers the whole form shape from it. Pass the `schema` and skip the `useForm<T>()` generic:
::: code-group
```vue
<script setup lang="ts">
import { useForm } from 'vue-formify';
import * as z from 'zod';

// No `useForm<T>()` generic needed — the type is inferred from the schema. // [!code highlight]
const { Form, Field, Error, handleSubmit } = useForm({
	schema: z.object({
		email: z.string().email(),
		password: z.string().min(8),
	}),
});

const submit = handleSubmit((data) => {
	// `data` is fully typed: { email: string; password: string }
	console.log(data?.email);
});
</script>
<template>
	<Form @submit="submit">
		<!-- `name` and `error-for` autocomplete to the schema's keys -->
		<Field name="email" />
		<Error error-for="email" />
		<Field name="password" type="password" />
		<Error error-for="password" />
		<button>Submit</button>
	</Form>
</template>
```
:::

Because the type flows from the schema, components like `Field`, `Error`, and `FieldArray` know your form's structure automatically: `name`/`error-for` autocomplete, `handleSubmit` hands you typed data, and mismatches are caught at compile time.

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
		first_name: 'string >= 1',
		last_name: 'string >= 1',
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
