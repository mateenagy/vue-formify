# Validators
You can use popular validation libraries like `yup`, `zod`, `valibot`, and `joi`. To integrate them, install the validator package along with the corresponding module for `vue-formify`.

We will use `yup` for this example.

## Install

```bash
npm i yup @vue-formify/yup
```
## Usage
```vue {2,3,6-9,11,13,22}
<script setup lang="ts">
import * as yup from 'yup';
import { schemaFromYup } from '@vue-formify/yup';
import { useForm } from 'vue-formify';

const yupSchema = yup.object({
	username: yup.string();
	password: yup.string();
});

type LoginForm = yup.InferType<typeof yupSchema>;

const schema = schemaFromYup(yupSchema);
const { Form, Field, Error } = useForm<LoginForm>();

const submit = handleSubmit((data) => {
	console.log(data);
});

</script>
<template>
	<Form @submit="submit" :validation-schema="schema">
		<Field name="username" />
		<Error error-for="username" />

		<Field name="password" type="password" />
		<Error error-for="password" />
		<button>Submit</button>
	</Form>
</template>
```
