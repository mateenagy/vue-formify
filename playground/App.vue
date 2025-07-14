<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { forms } from '@/utils/store';
import { z } from 'zod';
import Knob from 'primevue/knob';
import DatePicker from 'primevue/datepicker';
import * as v from 'valibot';
import { type } from 'arktype';
import { computed, ref } from 'vue';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Listbox from 'primevue/listbox';
import MultiSelect from 'primevue/multiselect';
import { useForm } from '@/main';
import CustomInput from './CustomInput.vue';
import InputField from './InputField.vue';
import SimpleForm from './SimpleForm.vue';
import CustomMultiSelect from './CustomMultiSelect.vue';
import ToggleButton from 'primevue/togglebutton';
import RadioButton from 'primevue/radiobutton';
import Checkbox from 'primevue/checkbox';
import CustomCheckbox from './CustomCheckbox.vue';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const { progress = 20 } = defineProps<{
	progress?: number;
}>();

const UserForm = type({
	firstName: type.string.atLeastLength(2).configure({ message: 'First name is required' }),
	lastName: type.string.atLeastLength(2).configure({ message: 'Last name is required' }),
	email: type('string.email').configure({ message: 'Email is not valid' }),
	foo: 'string[]',
	toppings: 'string[]',
	date: 'Date',
	// list: 'string',
	radio: 'string',
	toggle: 'boolean',
	check: 'boolean',
	'check-prime': 'boolean',
	test: 'string',
	shippingAddress: type({
		street: type.string.atLeastLength(2).configure({ message: 'Street is required' }),
		city: type.string.atLeastLength(2).configure({ message: 'City is required' }),
		state: type.string.atLeastLength(2).configure({ message: 'State is required' }),
		zip: type.string.atLeastLength(2).configure({ message: 'Zip code is required' }),
	}).array().atLeastLength(1).configure({
		message: 'At least one shipping address is required',
	}),
});

const stringType = type.string.atLeastLength(2).configure({ message: 'Last name is required' });
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const { Form, Field, Error, FieldArray,
	reset, setError, setInitialValues, setValue, setValues, handleSubmit,
	isSubmitting, values } = useForm({
		name: 'UserForm',
		mode: 'onChange',
		initialValues: {
			// firstName: 'John',
			// lastName: 'Doe',
			radio: 'Salami',
			toppings: [],
			foo: [
				'NY',
				'PRS',
			],
			// toggle: true,
		},
		schema: UserForm,
	});
const cities = ref([
	{ name: 'New York', code: 'NY' },
	{ name: 'Rome', code: 'RM' },
	{ name: 'London', code: 'LDN' },
	{ name: 'Istanbul', code: 'IST' },
	{ name: 'Paris', code: 'PRS' },
]);
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const submit = (val: any) => {
	console.log('Submit', val);
};
const submitSingle = () => {
	console.log('Submit', values.value);
};
/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
/*---------------------------------------------
/  WATCHERS
---------------------------------------------*/
/*---------------------------------------------
/  CREATED
---------------------------------------------*/
const test = ref<string>('asd');
const toggle = ref<boolean>(false);
const ph = ref();
/*---------------------------------------------
/  HOOKS
---------------------------------------------*/
</script>
<template>
	<div class="container">
		<h2>Simple</h2>
		<div
			class="row"
			style="display: flex;">
			<div class="col-6">
				<pre>{{ values }}</pre>
			</div>
			<div class="col-6">
				<!-- <pre>{{ forms }}</pre>  -->
			</div>
		</div>
		<!-- <Field name="date" />
		<Field name="firstName" />
		<button @click="submitSingle">
			Submit
		</button> -->
		<Form
			@submit="submit"
			mode="onChange"
			v-slot="{ isValid }">
			<p>Form values</p>
			<Field
				name="email"
				:schema="stringType" />
			<CustomInput name="email" />
			<!-- <Field name="toppings[0]" />
			<Field name="toppings[1]" />
			<Field name="toppings[2]" /> -->
			<Field
				name="toppings[0]"
				v-slot="{ field }"
				class="flex">
				{{ field }}
				<Checkbox
					input-id="ch"
					v-bind="field"
					value="Cheese" />
				<label for="ch"> Cheese </label>
			</Field>
			<Field
				name="toppings[1]"
				v-slot="{ field }"
				class="flex">
				<Checkbox
					input-id="salame"
					v-bind="field"
					value="Salame" />
				<label for="salame"> Salame </label>
			</Field>

			<Field
				name="check-prime"
				v-slot="{ field }"
				:default="false"
				class="flex">
				<Checkbox
					binary
					input-id="prime"
					v-bind="field" />
				<label for="prime"> Cheese </label>
			</Field>
			<Field
				name="check"
				v-slot="{ field }"
				:default="false">
				<CustomCheckbox
					id="toggle"
					v-bind="field">
					Toggle this
				</CustomCheckbox>
			</Field>
			<Field
				name="foo"
				v-slot="{ field }">
				<Listbox
					multiple
					v-bind="field"
					:options="cities"
					option-label="name"
					option-value="code" />
			</Field>
			<Field
				name="foo"
				v-slot="{ field }">
				<MultiSelect
					v-bind="field"
					:options="cities"
					option-label="name"
					option-value="code" />
			</Field>
			custom:
			<CustomMultiSelect name="foo" />
			<!-- <CustomMultiSelect name="foo" />
			<Field
				name="radio"
				v-slot="{ field }">
				<RadioButton
					v-bind="field"
					input-id="ingredient1"
					name="pizza"
					value="Cheese" />
				<label for="ingredient1">Cheese</label>
				<RadioButton
					v-bind="field"
					input-id="ingredient2"
					name="pizza"
					value="Salami" />
				<label for="ingredient2">Salami</label>
				<RadioButton
					v-bind="field"
					input-id="ingredient3"
					name="pizza"
					value="Mushroom" />
				<label for="ingredient3">Mushroom</label>
			</Field>
			<Field
				name="toggle"
				v-slot="{ field }">
				<ToggleButton
					v-bind="field"
					on-label="On"
					off-label="Off" />
			</Field>
			<Field
				name="foo"
				:default="[]"
				v-slot="{ field }">
				<Listbox
					multiple
					v-bind="field"
					:options="cities"
					option-label="name"
					option-value="code" />
			</Field>
			<Field
				name="date"
				:default="new Date()"
				v-slot="{ field }">
				<DatePicker v-bind="field" />
			</Field>
			
			<Field
				name="foo"
				:default="[]"
				v-slot="{ field }">
				<MultiSelect
					v-bind="field"
					:options="cities"
					option-label="name"
					option-value="code" />
			</Field> -->
			<button :disabled="!isValid">
				submit
			</button>
			<button>
				submit no disabled
			</button>
		</Form>
	</div>
</template>
