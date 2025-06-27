<script setup lang="ts">
import { useForm } from 'vue-formify';

type UserData = {
	first_name: string;
	last_name: string;
}

const { Form, Field, handleSubmit, values } = useForm<UserData>();

const submit = handleSubmit((data) => {
	alert(JSON.stringify(data, undefined, '\t'));
});
</script>

<template>
	<div class="container">
		<Form @submit="submit">
			<label>Firstname</label>
			<Field
				name="first_name"
				class="form-control color-red" />
			<label>Lastname</label>
			<Field
				name="last_name"
				class="form-control" />
			<button class="btn btn-primary mt-3">
				Submit
			</button>
			<pre class="mt-3">{{ values }}</pre>
		</Form>
	</div>
</template>
