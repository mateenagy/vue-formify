<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { ref } from 'vue';
import { ComponentProps, FormType } from './components';
import { useForm } from './composable/useForm';
import CustomInput from './CustomInput.vue';
import { createInput } from './composable/createInput';
import { object, string, number, date, InferType, array } from 'yup';
import CustomInputVue from '@/components/FormElements/__tests__/Views/CustomInput.vue';
/*---------------------------------------------
/  TYPES
---------------------------------------------*/
const schema = object({
	age: number().required().positive().integer(),
	createdOn: date(),
	name: string().required(),
	email: string().email(),
	website: string().url().nullable(),
	links: array().of(string()),
	countries: array().of(string()),
});
type User = InferType<typeof schema>;
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const ColorPicker = createInput(CustomInputVue);
const form = ref<FormType<User>>();
const send = (data: User) => {
	form.value?.setError('name', 'Required');
	console.log('[form data]: ', data);
};
const { Form, Field, FieldArray, Error } = useForm<User>();
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
const foo = ref<string>('asdasd');
const show = ref<boolean>(true);
</script>
<template>
	<div>
		<h2>Form</h2>
		<Form
			ref="form"
			name="foo"
			v-slot="{ values }"
			@submit="send">
			<button
				type="button"
				@click="show = !show">
				Toggle
			</button>
			<Field
				name="countries"
				multiple
				default="en"
				as="select"
				v-slot="{ field }">
				<option
					value="hu"
					:selected="field.value.includes('hu')">
					Hungary
				</option>
				<option
					value="en"
					:selected="field.value.includes('en')">
					England
				</option>
				<option
					value="au"
					:selected="field.value.includes('au')">
					Austria
				</option>
			</Field>
			<Field
				name="website"
				v-if="show"
				preserve
				v-slot="{ field }">
				<input
					type="text"
					v-bind="field">
			</Field>
			<Field
				name="name"
				v-model="foo" />
			<Error error-for="name" />
			<FieldArray
				v-if="show"
				name="links"
				v-slot="{ fields, add, remove }">
				<fieldset
					v-for="(field, index) of fields"
					:key="field.id">
					<Field
						:name="`links[${index}]`" />
					<button
						type="button"
						@click="remove(index)">
						Remove
					</button>
				</fieldset>
				<button
					type="button"
					@click="add">
					Add
				</button>
			</FieldArray>
			<pre>{{ values }}</pre>
			<button>Send</button>
		</Form>
	</div>
</template>
