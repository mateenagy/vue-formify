<script lang="ts" setup>
import Form from './components/FormElements/Form.vue';
import { ref } from 'vue';
import { FormType } from './components';
import { ArrayField, Field } from './components/main';
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
			<Field
				name="foo"
				v-slot="{ field }">
				<input
					type="text"
					v-bind="field" />
			</Field>
			<ArrayField
				name="users"
				v-slot="{ fields, add, remove }">
				<fieldset
					v-for="(field, idx) of fields"
					:key="field.id">
					<Field
						:name="`users[${idx}]`"
						v-slot="{ field: inputField }">
						<input
							type="text"
							v-bind="inputField" />
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
		</Form>
	</div>
</template>
