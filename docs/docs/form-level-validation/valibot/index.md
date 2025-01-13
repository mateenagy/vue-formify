# Valibot
Install the necessary packages via package manager:
```bash
npm i @vue-formify/valibot valibot
```
Import the helper function to convert valibot schema for vue-formify specific schema.

Passing `schema` option will **automatically** infer types from `valibot`.
```vue
<script lang="ts" setup>
import * as valibot from 'valibot';
import { schemaFromValibot } from '@vue-formify/valibot';
import { useForm } from 'vue-formify';

const schema = schemaFromValibot(
  v.object({
    first_name: v.pipe(v.string(), v.nonEmpty('Required field')),
    last_name: v.pipe(v.string(), v.nonEmpty('Required field')),
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
	<Form :validation-schema="schemaValibot" @submit="sendForm">
        <Field name="first_name" />
        <Field name="last_name" />
    <button>Submit</button>
  </Form>
</template>
```
