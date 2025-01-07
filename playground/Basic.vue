<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { useForm } from '@/composable/useForm';
import { MassiveForm, MegaForm } from './Examples.types';

type BasicForm = {
	email?: string;
	emails?: string[];
	socials: {
		name: string;
		url: string;
	}[];
	loo: {
		a: string;
		b: string[];
		c: number[];
		d: {
			name: string;
		}[]
	};
}
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const { Form, Field, FieldArray } = useForm<BasicForm>({
	initialValues: {
		email: 'as',
	},
});
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
</script>
<template>
	<Form v-slot="{ values }">
		<fieldset>
			<label>Emaila</label>
			<Field name="email" />
		</fieldset>
		<fieldset>
			<label>Array</label>
			<Field name="loo.c[0]" />
			<Field name="loo.c[1]" />
		</fieldset>
		<fieldset>
			<label>Array field</label>
			<FieldArray
				name="loo.d"
				v-slot="{ fields, add, remove }">
				<fieldset
					v-for="(field, index) of fields"
					:key="field.id">
					<Field :name="`loo.d[${index}].name`" />
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
		<!-- <fieldset>
			<label>Item</label>
			<Field name="nested.item" />
		</fieldset>
		<fieldset>
			<label>Items</label>
			<Field name="" />
			<Field name="nested.child[0].child_items[0]" />
		</fieldset>
		<fieldset>
			<label>Very nested</label>
			<Field name="nested.child[0].child_items[0]" />
		</fieldset> -->
		<pre>{{ values }}</pre>
	</Form>
</template>
