# Joi
Install the necessary packages via package manager:
```bash
npm i @vue-formify/joi joi
```
Import the helper function to convert joi schema for vue-formify specific schema:
```vue
<script lang="ts" setup>
import Joi from 'joi';
import { schemaFromJoi } from '@vue-formify/joi';
import { FormifyForm, Field, Error } from 'vue-formify';

const schemaJoi = schemaFromJoi(
  Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
  })
);

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<FormifyForm :validation-schema="schemaJoi" @submit="sendForm">
        <Field name="first_name" />
        <Field name="last_name" />
    <button>Submit</button>
  </FormifyForm>
</template>
```
