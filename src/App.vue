<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { ComponentProps, FormType } from './components';
import { useForm } from './composable/useForm';
import CustomInput from './CustomInput.vue';
import { createInput } from './composable/createInput';
import { object, string, number, date, InferType, array, boolean } from 'yup';
import CustomInputVue from '@/components/FormElements/__tests__/Views/CustomInput.vue';
import InputText from 'primevue/inputtext';
import Knob from 'primevue/knob';
import Checkbox from 'primevue/checkbox';
import { forms } from './utils/store';
import NamedVModel from './components/FormElements/__tests__/Views/NamedVModel.vue';
import NamedVModelAsState from './components/FormElements/__tests__/Views/NamedVModelAsState.vue';
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
const TitleInput = createInput(NamedVModel, { modelKey: 'title' });
const CheckInput = createInput(NamedVModelAsState, { modelKey: 'checked', useModelKeyAsState: true });
const form = ref<FormType<User>>();
const send = (_data: User) => {
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
			:initial-values="{ website: 'asd' }"
			v-slot="{ values }"
			@submit="send">
			<button
				type="button"
				@click="show = !show">
				Toggle
			</button>
			<pre>{{ values }}</pre>
			<Field
				name="website"
				default="loo" />
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
			<button>Send</button>
			<button
				type="button"
				@click="form?.reset()">
				Reset
			</button>
		</Form>
	</div>
</template>
