<script lang="ts" setup>
import { useForm } from '@/composable/useForm';
import { schemaFromZod } from '@packages/zod';
import { z } from 'zod';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const schema = schemaFromZod(z.object({
	username: z.string(),
	links: z.array(z.object({
		name: z.string(),
		url: z.string(),
	})),
}));
const { Form, Field, FieldArray, Error, handleSubmit, reset } = useForm({
	schema,
});
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
			@submit="submit">
			<Field name="username" />
			<FieldArray
				name="links"
				v-slot="{ fields, add, remove }">
				<fieldset
					v-for="(field, index) of fields"
					:key="field.id">
					<Field :name="`links[${index}].name`" />
					<Field :name="`links[${index}].url`" />
					<Error :error-for="`links[${index}].url`" />
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
			<pre>{{ values }}</pre>
			<button>Send</button>
			<button
				@click="reset"
				type="button">
				Reset
			</button>
		</Form>
	</div>
</template>
