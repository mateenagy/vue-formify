<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { ref } from 'vue';
import { FormType } from './components';
import { useForm } from './composable/useForm';
import { createInput } from './composable/createInput';
import { object, string, number, date, InferType, array, boolean } from 'yup';
import CustomInputVue from '@/components/FormElements/__tests__/Views/CustomInput.vue';
import InputText from 'primevue/inputtext';
import Knob from 'primevue/knob';
import ToggleSwitch from 'primevue/toggleswitch';
import NamedVModel from './components/FormElements/__tests__/Views/NamedVModel.vue';
import NamedVModelAsState from './components/FormElements/__tests__/Views/NamedVModelAsState.vue';
// import { schemaFromYup } from '../packages/yup/index';
// import { schemaFromZod } from '../packages/zod/index';
// import { schemaFromJoi } from '../packages/joi/index';
// import { schemaFromValibot } from '../packages/valibot/index';
import * as z from 'zod';
import * as v from 'valibot';
import Joi from 'joi';
/*---------------------------------------------
/  TYPES
---------------------------------------------*/
/* YUP */
const schema = object({
	age: number().required().positive().integer().default(18),
	createdOn: date(),
	name: string().required(),
	check: boolean().required().default(true),
	email: string().email().default('helobelo'),
	website: string().url().nullable(),
	links: array().of(string()),
	countries: array().of(string()),
	foo: object({
		bar: string(),
		baz: string().default('Baz'),
	}),
});
// const _schema = schemaFromYup(schema);
/* ZOD */
const _zodSchema = z.object({
	email: z.string().min(2, 'error on firstname').default('Vue'),
	foo: z.object({
		baz: z.string().default('Baz'),
	}),
});
// const zodSchema = schemaFromZod(_zodSchema);
/* JOI */
// const _joischema = schemaFromJoi(Joi.object({
// 	email: Joi.string().default('hello@gmail.com'),
// }));
/* VALIBOT */
// const _valibotschema = schemaFromValibot(v.object({
// 	email: v.optional(v.string('asd'), 'hello@gmail.com'),
// }));
type User = InferType<typeof schema>;
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const ColorPicker = createInput(CustomInputVue);
const TitleInput = createInput(NamedVModel, { modelKey: 'title' });
const CheckInput = createInput(NamedVModelAsState, { modelKey: 'checked', useModelKeyAsState: true });
const form = ref<FormType<User>>();
const send = (_data: User) => {
	console.log('asd');

	form.value?.setError('name', 'Required');
	form.value?.setError('email', 'Required');
	form.value?.setError('website', 'Required');
	form.value?.setError('countries', 'Required');
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
const foo = ref<string>('#b77171');
const bar = ref<string[]>(['hu', 'au']);
const show = ref<boolean>(true);
const check = ref<boolean>(false);
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
			<pre>{{ values }}</pre>
			<Field
				v-if="show"
				name="email"
				preserve />
			<Field
				v-if="show"
				name="foo.baz"
				preserve />
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
			<Field
				name="name"
				v-slot="{ field }">
				<InputText v-bind="field" />
			</Field>
			<Field
				name="check"
				:default="false"
				v-slot="{ field }">
				<ToggleSwitch v-bind="field" />
			</Field>
			<Field
				v-if="values.check"
				name="age"
				:default="0"
				v-slot="{ field }">
				<Knob v-bind="field" />
			</Field>
			<button>Send</button>
			<button
				type="button"
				@click="form?.reset()">
				Reset
			</button>
		</Form>
	</div>
</template>
