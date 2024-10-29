# Yup
Install the necessary packages via package manager:
```bash
npm i @vue-formify/yup yup
```
Import the helper function to convert yup schema for vue-formify specific schema:
```vue
<script lang="ts" setup>
import * as yup from 'yup';
import { schemaFromYup } from '@vue-formify/yup';
import { FormifyForm, Field } from 'vue-formify';

const schemaYup = schemaFromYup(
  yup.object({
    first_name: yup.string().required('Required'),
    last_name: yup.string().required('Required'),
  })
);

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<FormifyForm :validation-schema="schemaYup" @submit="sendForm">
        <Field name="first_name" />
        <Field name="last_name" />
    <button>Submit</button>
  </FormifyForm>
</template>
```
