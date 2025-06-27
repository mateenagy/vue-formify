<script setup lang="ts">
import { useForm } from 'vue-formify';

type UserData = {
	users: string[];
}

const { Form, FieldArray, Field, handleSubmit, values } = useForm<UserData>();

const submit = handleSubmit((data) => {
	alert(JSON.stringify(data, undefined, '\t'));
});
</script>

<template>
	<div class="container">
		<Form @submit="submit">
			<label>Users:</label>
			<FieldArray
				name="users"
				v-slot="{ fields, add, remove }">
				<div
					class="form-group mb-3"
					v-for="(field, idx) of fields"
					:key="field.id">
					<p class="mb-0">
						User #{{ idx }}
					</p>
					<div class="d-flex gap-2">
						<Field
							:name="`users[${idx}]`"
							class="form-control" />
						<button
							type="button"
							class="btn btn-danger d-inline"
							@click="remove(idx)">
							Remove
						</button>
					</div>
				</div>
				<button
					type="button"
					class="btn btn-secondary"
					@click="add">
					Add new user
				</button>
			</FieldArray>

			<button class="btn btn-primary mt-3">
				Submit
			</button>
			<pre class="mt-3">{{ values }}</pre>
		</Form>
	</div>
</template>
