# Valibot
Install the necessary packages via package manager:
```bash
npm i @vue-formify/valibot valibot
```
Import the helper function to convert valibot schema for vue-formify specific schema:
```vue
<script lang="ts" setup>
import * as valibot from 'valibot';
import { schemaFromValibot } from '@vue-formify/valibot';
import { FormifyForm, Field } from 'vue-formify';

const schemaValibot = schemaFromValibot(
  v.object({
    first_name: v.string('Must be a string', [
      v.minLength(1, 'Required'),
    ]),
    last_name: v.string('Must be a string', [
      v.minLength(1, 'Required'),
    ]),
  })
);

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<FormifyForm :validation-schema="schemaValibot" @submit="sendForm">
        <Field name="first_name" />
        <Field name="last_name" />
    <button>Submit</button>
  </FormifyForm>
</template>
```
