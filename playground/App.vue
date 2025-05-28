<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { forms } from '@/utils/store';
import { z } from 'zod';
import MultiSelect from 'primevue/multiselect';
import Knob from 'primevue/knob';
import DatePicker from 'primevue/datepicker';
import * as v from 'valibot';
import { type } from 'arktype';
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { useForm } from '@/main';
import CustomInput from './CustomInput.vue';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const { id = 2 } = defineProps<{
	id?: number;
}>();
const UserForm = type({
	custom: {
		cities: 'string[] >= 1',
	},
	knob: 'number > 60',
	users: 'string[]',
	dateTime: 'Date',
});
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const { Form, Field, Error, reset, values, FieldArray } = useForm({
	initialValues: {
		
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
	<div>
		<h2>Basic</h2>
		<Form
			@submit="submit"
			mode="onSubmit"
			v-slot="{ isDirty, isValid }">
			<!-- <div>
				<Field
					name="custom.cities"
					v-slot="{ field }">
					<pre>{{ field }}</pre>
					<MultiSelect
						v-bind="field"
						:options="cities"
						option-label="name"
						option-value="code"
						placeholder="Select a City" />
				</Field>
			</div> -->
			<div>
				<CustomInput name="custom.cities" />
			</div>
			<div>
				<Field
					name="knob"
					:default="0"
					v-slot="{ field }">
					{{ field }}
					<Knob v-bind="field" />
					<Error error-for="knob" />
				</Field>
			</div>
			<div>
				<FieldArray
					name="users"
					v-slot="{ fields, add, remove }">
					<div
						v-for="(field, index) of fields"
						:key="field.id">
						<Field :name="`users[${index}]`" />
						<button
							type="button"
							@click="remove(index)">
							Remove
						</button>
					</div>
					<button
						type="button"
						@click="add">
						Add field
					</button>
				</FieldArray>
			</div>
			<Field
				name="dateTime"
				v-slot="{ field }">
				<DatePicker v-bind="field" />
			</Field>
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
			<pre>isDirty: {{ isDirty }}</pre>
			<pre>isValid: {{ isValid }}</pre>
			<!-- errors: <pre>{{ errors }}</pre> -->
			<p>Form data</p>
			<pre>{{ forms }}</pre>
			<p>Form values</p>
			<pre>{{ values }}</pre>
		</Form>
	</div>
</template>
