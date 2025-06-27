<script setup lang="ts">
import { useForm } from 'vue-formify';

type UserData = {
	user: {
		email: string;
		password: string;
		socials: {
			facebook: string;
			instagram: string;
		}
	}

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
				name="user.email"
				class="form-control" />
			<label>Lastname</label>
			<Field
				name="user.password"
				class="form-control" />
			<label>Facebook link</label>
			<Field
				name="user.socials.facebook"
				class="form-control" />
			<label>Instagram link</label>
			<Field
				name="user.socials.instagram"
				class="form-control" />
			<button class="btn btn-primary mt-3">
				Submit
			</button>
			<pre class="mt-3">{{ values }}</pre>
		</Form>
	</div>
</template>
