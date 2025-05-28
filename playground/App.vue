<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { forms } from '@/utils/store';
import { z } from 'zod';
import Knob from 'primevue/knob';
import DatePicker from 'primevue/datepicker';
import * as v from 'valibot';
import { type } from 'arktype';
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { useForm } from '@/main';
import CustomInput from './CustomInput.vue';
import InputField from './InputField.vue';
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
	shippingAddress: type({
		street: type.string.atLeastLength(2).configure({ message: 'Street is required' }),
		city: type.string.atLeastLength(2).configure({ message: 'City is required' }),
		state: type.string.atLeastLength(2).configure({ message: 'State is required' }),
		zip: type.string.atLeastLength(2).configure({ message: 'Zip code is required' }),
	}).array().atLeastLength(1).configure({
		message: 'At least one shipping address is required',
	}),
});
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const { Form, Field, Error, reset, values, FieldArray } = useForm({
	initialValues: {
		firstName: 'John',
		lastName: 'Doe',
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
	<div class="container">
		<h2>Basic</h2>
		<Form
			@submit="submit"
			mode="onChange"
			v-slot="{ isValid }">
			<div class="row">
				<div class="col-6">
					<InputField
						name="firstName"
						label="First name" />
				</div>
				<div class="col-6">
					<InputField
						name="lastName"
						label="Last name" />
				</div>
				<div class="col-6">
					<InputField
						name="email"
						label="Email" />
				</div>
				<div class="col-12">
					<h2>Addresses</h2>
					<FieldArray
						name="shippingAddress"
						label="Shipping Address"
						v-slot="{ fields, add, remove }">
						<fieldset
							v-for="(field, index) in fields"
							:key="field.id"
							class="mb-1rem rd-10px">
							<legend>{{ `Shipping Address ${index + 1}` }}</legend>
							<div class="row">
								<div class="col-6">
									<InputField
										:name="`shippingAddress[${index}].street`"
										label="Street" />
								</div>
								<div class="col-6">
									<Field
										:name="`shippingAddress[${index}].city`"
										v-slot="{ field: selectField }"
										class="w-full">
										<label
											class="mb-0.5rem block ml-0.5rem">City</label>
										<Select
											:options="cities"
											option-label="name"
											option-value="code"
											class="w-full"
											:invalid="!selectField.isValid"
											:placeholder="`Select a City`"
											v-bind="selectField" />
										<Error
											:error-for="`shippingAddress[${index}].city`"
											class="block color-red" />
									</Field>
								</div>
								<div class="col-6">
									<InputField
										:name="`shippingAddress[${index}].state`"
										label="State" />
								</div>
								<div class="col-6">
									<InputField
										:name="`shippingAddress[${index}].zip`"
										label="Zip Code" />
								</div>
							</div>
							<button
								class="mt-1rem"
								type="button"
								@click="remove(index)">
								Remove
							</button>
						</fieldset>
						<button
							type="button"
							clas
							mb-1rem
							@click="add()">
							Add Address
						</button>
						<Error
							error-for="shippingAddress"
							class="color-red block" />
					</FieldArray>
				</div>
			</div>
			<button :disabled="!isValid">
				submit
			</button>
			<button>
				submit no disabled
			</button>
			<button
				type="button"
				@click="reset()">
				Reset
			</button>
			<button
				type="button"
				@click="reset(true)">
				Force reset
			</button>
			<p>Form values</p>
			<pre>{{ values }}</pre>
		</Form>
	</div>
</template>
