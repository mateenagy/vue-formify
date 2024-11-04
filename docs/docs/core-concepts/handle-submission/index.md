# Handle submission
To handle form submissions, use the `handleSubmit` method. This method takes a callback function that provides the form data with autocompletion.

```vue {11-13}
<script setup lang="ts">
import { useForm } from 'vue-formify';

type LoginForm = {
	username: string;
	password: string;
}

const { Form, Field, handleSubmit } = useForm<LoginForm>(); // [!code highlight]

const submit = handleSubmit((data) => {
	console.log(data)
});

</script>
<template>
	<Form @submit="submit"> // [!code highlight]
		<Field name="username" />
		<Field name="password" type="password" />
		<button>Submit</button>
	</Form>
</template>
```
