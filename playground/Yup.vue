<script lang="ts" setup>
import { useForm } from '@/composable/useForm';
import { schemaFromYup } from '@packages/yup';
import * as yup from 'yup';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const schema = schemaFromYup(yup.object({
	username: yup.string().default('asd'),
	links: yup.array().of(yup.string()).default(['asd']),
	socials: yup.array().of(yup.object({
		name: yup.string().required('Required field'),
		url: yup.string().required('Required field'),
	})).default([]),
	foo: yup.object({
		bar: yup.string(),
	}),
}));
const { Form, Field, FieldArray, Error, handleSubmit } = useForm();
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const submit = handleSubmit((data) => {
	console.log('[data]', data);
});
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
		<Form
			v-slot="{ values }"
			@submit="submit"
			:validation-schema="schema">
			<Field name="foo.bar" />
			<FieldArray
				name="links"
				v-slot="{ fields, add, remove }">
				<fieldset
					v-for="(field, index) of fields"
					:key="field.id">
					<Field :name="`links[${index}]`" />
					<Error :error-for="`links[${index}]`" />
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
			<FieldArray
				name="socials"
				v-slot="{ fields, add, remove }">
				<fieldset
					v-for="(field, index) of fields"
					:key="field.id">
					<Field :name="`socials[${index}].name`" />
					<Field :name="`socials[${index}].url`" />
					<Error :error-for="`socials[${index}].url`" />
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
			<Error :error-for="`links`" />
			<pre>{{ values }}</pre>
			<button>Send</button>
		</Form>
	</div>
</template>
