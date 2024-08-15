<script lang="ts" setup>
import Form from './components/FormElements/Form.vue';
import { ref } from 'vue';
import { FormType } from './components';
import { ArrayField, Field, Error } from '@/components/main';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const form = ref<FormType>();
const send = (data: any) => {
	form.value?.setError('baz', 'Required');
	form.value?.setError('faz', 'Required');
	form.value?.setError('first_name', 'Required');
	console.log('[form data]: ', data);
};
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
/*---------------------------------------------
/  WATCHERS
---------------------------------------------*/
/*---------------------------------------------
/  CREATED
---------------------------------------------*/
/*---------------------------------------------
/  HOOKS
---------------------------------------------*/
</script>
<template>
	<div>
		<h2>Form</h2>
		<Form
			@submit="send"
			:initial-values="{ foo: { name: 'lol' } }"
			ref="form">
			<Field
				name="faz"
				default="faz"
				v-slot="{ field }">
				<input
					type="text"
					v-bind="field">
			</Field>
			<Error error-for="faz" />
			<Field
				name="first_name"
				v-slot="{ field, error }">
				<label>Firstname</label>
				<input v-bind="field" />
				<small>{{ error }}</small>
			</Field>
			<ArrayField
				name="links"
				v-slot="{ fields, add, remove }">
				<fieldset
					v-for="(field, idx) of fields"
					:key="field.id">
					<Field
						:name="`links[${idx}]`"
						as="input" />
					<button
						type="button"
						@click="remove(idx)">
						Remove
					</button>
				</fieldset>
				<button
					type="button"
					@click="add">
					Add
				</button>
			</ArrayField>
			<!-- <ArrayField
				name="users"
				ignore
				v-slot="{ fields, add, remove, error }">
				<fieldset
					v-for="(field, idx) of fields"
					:key="field.id">
					<legend>user #{{ idx }}</legend>
					<Field
						ignore
						:name="`users[${idx}].name`"
						as="input" />
					<button
						type="button"
						@click="remove(idx)">
						Remove
					</button>
				</fieldset>
				<button
					type="button"
					@click="add">
					Add
				</button>
				error: {{ error }}
			</ArrayField> -->
			<button>Send</button>
			<button
				type="button"
				@click="form?.reset">
				Reset
			</button>
		</Form>
	</div>
</template>
