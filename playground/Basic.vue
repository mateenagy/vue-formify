<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { useForm } from '@/composable/useForm';
import { MassiveForm, MegaForm } from './Examples.types';
import { ComponentProps, createInput } from '@/main';
import CustomInput from './CustomInput.vue';

type BasicForm = {
	username: string;
	links: {
		name: string;
		url: string;
	}[]
}
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const { Form, Field, FieldArray, reset } = useForm<BasicForm>();
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
			<label>Username: </label>
			<Field name="username" />
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
		<button
			@click="reset"
			type="button">
			Reset
		</button>
	</Form>
</template>
