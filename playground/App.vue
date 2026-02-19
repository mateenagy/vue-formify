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
import CustomCheckbox from './CustomCheckbox.vue';
import ObjectInput from './ObjectInput.vue';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const UserForm = type({
	firstName: type.string.atLeastLength(2).configure({ message: 'First name is required' }),
	list: type.string.array().configure({ message: 'List is required' }),
	accept: type.boolean.configure({ message: 'Accept is required' }),
	customCheckbox: type.string.configure({ message: 'Accept is required' }),
});

const stringType = type.string.atLeastLength(2).configure({ message: 'Last name is required' });
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const { Form, Field, Error, FieldArray,
	reset, setError, setInitialValues, setValue, setValues, handleSubmit,
	isSubmitting } = useForm({
		name: 'UserForm',
		mode: 'onChange',
		initialValues: {
			list: ['asd', 'lol'],
			accept: true,
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
const objectModel = ref();
</script>
<template>
	<div class="container">
		<Form v-slot="{ values }">
			<pre>{{ values }}</pre>
			{{ objectModel }}
			<ObjectInput name="asd" :default="{ min: 10, max: 100 }" />
			<Field
				name="firstName"
				:rule="stringType" />
			<Field
				name="accept"
				type="checkbox"
				:rule="type.boolean" />
			<Field
				name="customCheckbox"
				type="checkbox"
				true-value="foo"
				false-value="bar"
				:rule="type.boolean" />
			<FieldArray
				name="list"
				v-slot="{ add, fields, remove }">
				<button @click="add">
					Add
				</button>
				<div
					:key="index"
					v-for="(field, index) in fields">
					<Field
						:key="index"
						:name="`list[${index}]`"
						:rule="stringType" />
					<button @click="remove(field.id)">
						Remove
					</button>
				</div>
			</FieldArray>
		</form>
	</div>
</template>
