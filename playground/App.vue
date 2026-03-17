<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { type } from 'arktype';
import { ref } from 'vue';
import { useForm } from '@/main';
import ObjectInput from './ObjectInput.vue';
import InputNumber from 'primevue/inputnumber';
import InputOtp from 'primevue/inputotp';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const UserForm = type({
	firstName: type.string.atLeastLength(2).configure({ message: 'First name is required' }),
	list: type.string.array().configure({ message: 'List is required' }),
	accept: type.boolean.configure({ message: 'Accept is required' }),
	customCheckbox: type.string.configure({ message: 'Accept is required' }),
	number: type.number.configure({ message: 'Number is required' }),
	otp: type.number.configure({ message: 'Number is required' }),
});

const stringType = type.string.atLeastLength(2).configure({ message: 'Last name is required' });
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const { Form, Field, Error, FieldArray } = useForm({
	name: 'UserForm',
	mode: 'onChange',
	initialValues: {
		list: ['asd', 'lol', '123'],
		accept: false,
		customCheckbox: 'foo',
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
const test = ref<number>(0);
</script>
<template>
	<div class="container">
		<Form v-slot="{ values, isValid }">
			{{ test }}
			<InputNumber v-model="test" />
			<pre>{{ values }}</pre>
			<Field name="number" v-slot="{ field }">
				<InputNumber v-bind="field" :default-value="0" />
			</Field>
			<Field name="otp" v-slot="{ field }">
				<!-- <InputNumber v-bind="field" inputId="expiry" prefix="Expires in " suffix=" days" fluid /> -->
				<InputOtp v-bind="field" />
			</Field>
			<ObjectInput name="asd" :default="{ min: 30, max: 100 }" />
			<Field name="firstName" :rule="stringType" />
			<Error error-for="firstName" />
			<Field name="accept" type="checkbox" />
			<Error error-for="accept" />
			<Field name="customCheckbox" type="checkbox" true-value="foo" false-value="bar" :rule="type.boolean" />
			<FieldArray name="list" v-slot="{ add, fields, remove }">
				<button @click="add">
					Add
				</button>
				<div :key="index" v-for="(field, index) in fields">
					<Field :key="index" :name="`list[${index}]`" :rule="stringType" />
					<button @click="remove(field.id)">
						Remove
					</button>
				</div>
			</FieldArray>
		</form>
	</div>
</template>
