# Yup
Install the necessary packages via package manager:
```bash
npm i @vue-formify/yup yup
```
Import the helper function to convert yup schema for vue-formify specific schema.

Passing `schema` option will **automatically** infer types from `yup`.
```vue
<script lang="ts" setup>
import * as yup from 'yup';
import { schemaFromYup } from '@vue-formify/yup';
import { useForm } from 'vue-formify';

const schema = schemaFromYup(
  yup.object({
    first_name: yup.string().required('Required'),
    last_name: yup.string().required('Required'),
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
