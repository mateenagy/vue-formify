<script lang="ts" setup>
import Form from './components/FormElements/Form.vue';
import { ref } from 'vue';
import { FormType } from './components';
import { createInput } from './composable/createInput';
import { ArrayField, Field, Error } from '@/components/main';
import NamedVModel from './components/FormElements/__tests__/Views/NamedVModel.vue';
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
	console.log('[form data]: ', data);
};
const Custom = createInput(NamedVModel, { modelKeys: 'title', useModelKeyAsState: true });
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
			ref="form">
			<Custom
				name="foo.name" />
			<Field
				name="baz"
				default="baza"
				as="input"
				type="password" />
			<Error error-for="baz" />
			<Field
				name="faz"
				default="faz"
				v-slot="{ field }">
				<input
					type="text"
					v-bind="field">
			</Field>
			<Error error-for="faz" />
			<ArrayField
				name="users"
				v-slot="{ fields, add, remove, error }">
				<fieldset
					v-for="(field, idx) of fields"
					:key="field.id">
					<legend>user #{{ idx }}</legend>
					<Field
						:name="`users[${idx}].name`"
						type="input" />
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
			</ArrayField>
			<button>Send</button>
			<button
				type="button"
				@click="form?.reset">
				Reset
			</button>
		</Form>
	</div>
</template>
