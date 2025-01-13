# Zod
Install the necessary packages via package manager:
```bash
npm i @vue-formify/zod zod
```
Import the helper function to convert zod schema for vue-formify specific schema.

Passing `schema` option will **automatically** infer types from `zod`.
```vue
<script lang="ts" setup>
import * as zod from 'zod';
import { schemaFromZod } from '@vue-formify/zod';
import { useForm } from 'vue-formify';

const schema = schemaFromZod(
  zod.object({
    first_name: zod.string().min(1, { message: 'Required' }),
    last_name: zod.string().min(1, { message: 'Required' }),
  })
);

const { Form, Field, handleSubmit } = useForm({
	schema,
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
