<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { useForm } from '@/composable/useForm';
import { MassiveForm, MegaForm } from './Examples.types';
import { ComponentProps, createInput } from '@/main';
import CustomInput from './CustomInput.vue';
import { onMounted } from 'vue';

type BasicForm = {
	username: string;
	id: number;
	links: {
		name: string;
		url: string;
	}[];
	bars: string[];
	foo: {
		bar: {
			baz: string;
		};
	}
	lol: {
		boo: string[];
	};
}
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const { id = 2 } = defineProps<{
	id?: number;
}>();
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const initial: Partial<BasicForm> = {
	username: 'Heloka',
	id: 31,
	links: [
		{
			name: 'Google',
			url: 'https://google.com',
		},
		{
			name: 'Facebook',
			url: 'https://facebook.com',
		},
	],
	lol: {
		boo: ['1', '2'],
	},
};
const { Form, Field, FieldArray, reset, setValues } = useForm<BasicForm>({
	initialValues: initial,
});
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const submit = (data: BasicForm) => {
	console.log(data);
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
	<Form
		v-slot="{ values }"
		@submit="submit">
		<fieldset>
			<label>Username: </label>
			<Field
				name="username" />
			<Field
				name="foo.bar.baz" /> 
		</fieldset>
		<fieldset>
			<label>Array field: </label>
			<FieldArray
				name="links"
				v-slot="{ fields, add, remove }">
				<fieldset
					v-for="(field, index) of fields"
					:key="field.id">
					<Field :name="`links[${index}].name`" />
					<Field :name="`links[${index}].url`" />
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
		</fieldset>
		<pre>{{ values }}</pre>
		<button>
			Send
		</button>
		<button
			@click="reset"
			type="button">
			Reset
		</button>
	</Form>
</template>
