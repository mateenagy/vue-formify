# Handles errors
To handle errors easily, use the `Error` component along with the `setError` function if you’re not using a validator package.

For more details, see the [Error Component](/docs/components/error/) section.

```vue {12-14}
<script setup lang="ts">
import { useForm } from 'vue-formify';

type LoginForm = {
	username: string;
	password: string;
}

const { Form, Field, Error, handleSubmit, setError } = useForm<LoginForm>(); // [!code highlight]

const submit = handleSubmit((data) => {
	if(!data?.username.length) {
		setError('username', 'Required field');
	}
});

</script>
<template>
	<Form @submit="submit">
		<Field name="username" />
		<Error error-for="username" /> // [!code highlight]

		<Field name="password" type="password" />
		<Error error-for="password" /> // [!code highlight]
		<button>Submit</button>
	</Form>
</template>
```
