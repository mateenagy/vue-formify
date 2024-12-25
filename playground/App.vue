<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { useForm } from '@/composable/useForm';
import { createInput } from '@/composable/createInput';
import * as v from 'valibot';
import * as yup from 'yup';
import { schemaFromValibot } from '@packages/valibot';
import { schemaFromYup } from '@packages/yup/index';
import { ComponentProps } from '@/index';
import CustomInput from './CustomInput.vue';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const _schema = yup.object().shape({
	emails: yup.array().of(yup.string().required('Required field').email('Bad email format')).min(2, 'Minimum 2 item'),
});
type User = yup.InferType<typeof _schema>;
const schema = schemaFromYup(_schema);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const {
	Form,
	Field,
	Error,
	reset,
	handleSubmit,
	setError,
	isSubmitting,
	values,
} = useForm<User>();
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const promiseSubmit = async () => {
	return new Promise(_r => setTimeout(_r, 2000));
};
const submit = handleSubmit(async (data) => {
	await promiseSubmit();
	console.log('[data]: ', data);
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
			ref="form"
			@submit="submit"
			:validation-schema="schema"
			name="foo"
			v-slot="{ errors }">
			<Field name="emails[0]" />
			<Error error-for="emails[0]" />

			<Field name="emails[1]" />
			<Error error-for="emails[1]" />

			<Error error-for="emails" />

			<pre>{{ errors }}</pre>
			<button :disabled="isSubmitting">
				Send
			</button>
			<button
				type="button"
				@click="reset">
				Reset
			</button>
			<pre>{{ values }}</pre>
		</Form>
	</div>
</template>
