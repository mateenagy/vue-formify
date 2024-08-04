<script lang="ts" setup>
import Form from './components/FormElements/Form.vue';
import { ref } from 'vue';
import { FormType } from './components';
import { createInput } from './composable/createInput';
import { ArrayField, Field } from '@/components/main';
import NamedVModel from './components/FormElements/__tests__/Views/NamedVModel.vue';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const form = ref<FormType>();
const send = (data: any) => {
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
			ref="form"
			v-slot="{ values }">
			<pre>{{ values }}</pre>
			<Custom
				name="foo"
				default="lol" />
			<Field
				name="bar"
				default="bar"
				v-slot="{ field, error }">
				<input
					type="text"
					v-bind="field">
				<p>{{ error }}</p>
			</Field>
			<ArrayField
				name="users"
				v-slot="{ fields, add, remove }">
				<fieldset
					v-for="(field, idx) of fields"
					:key="field.id">
					<Field
						:name="`users[${idx}].username`"
						v-slot="{ field: inputField }">
						<input
							type="text"
							v-bind="inputField">
					</Field>
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
			<button>Send</button>
			<button
				type="button"
				@click="form?.reset">
				Reset
			</button>
		</Form>
	</div>
</template>
