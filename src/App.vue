<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { ref } from 'vue';
import { ComponentProps, FormType } from './components';
import { useForm } from './composable/useForm';
import CustomInput from './CustomInput.vue';
import { createInput } from './composable/createInput';
import { object, string, number, date, InferType, array, boolean } from 'yup';
import CustomInputVue from '@/components/FormElements/__tests__/Views/CustomInput.vue';
import InputText from 'primevue/inputtext';
import Knob from 'primevue/knob';
import Checkbox from 'primevue/checkbox';
/*---------------------------------------------
/  TYPES
---------------------------------------------*/
const schema = object({
	age: number().required().positive().integer(),
	createdOn: date(),
	name: string().required(),
	check: boolean().required(),
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
	form.value?.setError('countries', 'Required');
	console.log('[form data]: ', data);
	fetch('https://jsonplaceholder.typicode.com/posts', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
		.then(response => response.json())
		.then(json => console.log(json));
};
const { Form, Field, FieldArray } = useForm<User>();
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
const foo = ref<string>('foo');
const bar = ref<string[]>(['hu', 'au']);
const show = ref<boolean>(true);
const check = ref<boolean>(true);
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
			<div>
				{{ bar }}
				<Field
					name="countries"
					multiple
					:default="['hu', 'au']"
					as="select">
					<option value="hu">
						Hungary
					</option>
					<option value="en">
						England
					</option>
					<option value="au">
						Austria
					</option>
				</Field>
			</div>
			<div>
				{{ foo }}
				<Field
					name="name"
					v-model="foo" />
				<Field
					name="website"
					v-model="foo"
					v-slot="{ field }">
					<label>Website</label>
					<input v-bind="field" />
				</Field>
				{{ check }}
				<Field
					name="check"
					:default="check"
					v-slot="{ field }">
					<label>Check</label>
					<Checkbox
						v-bind="field"
						binary />
				</Field>
				<Field
					name="email"
					default="heloka"
					v-slot="{ field }">
					<div>
						<InputText v-bind="field" />
					</div>
				</Field>
				<Field
					name="age"
					:default="50"
					v-slot="{ field }">
					<Knob v-bind="field" />
				</Field>
			</div>
			<!-- {{ bar }}
			<Field
				name="countries"
				multiple
				v-model="bar"
				as="select">
				<option value="hu">
					Hungary
				</option>
				<option value="en">
					England
				</option>
				<option value="au">
					Austria
				</option>
			</Field>
			<Error
				error-for="countries"
				v-slot="{ error }">
				<small>{{ error }}</small>
			</Error>
			<Field
				name="website"
				v-if="show"
				v-slot="{ field }">
				<input
					type="text"
					v-bind="field">
			</Field>
			<Error error-for="name" />
			<FieldArray
				v-if="show"
				name="links"
				v-slot="{ fields, add, remove }">
				<fieldset
					v-for="(field, index) of fields"
					:key="field.id">
					<Field :name="`links[${index}]`" />
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
			</FieldArray> -->
			<!-- <pre>{{ values }}</pre> -->
			<button>Send</button>
			<button
				type="button"
				@click="form?.reset()">
				Reset
			</button>
		</Form>
	</div>
</template>
