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
const _schema = yup.object({
	email: yup.string().email('Email is not good').required('Required field'),
	email2: yup.string().email('Email is not good').required('Required field'),
	emails: yup.array().of(yup.string()).min(1, 'Min 1 item'),
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
	setError('email', 'asd');
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
			name="foo">
			<Field name="email" />
			<Error error-for="email" />
			<Error
				error-for="email"
				v-slot="{ error }">
				<pre>{{ error }}</pre>
			</Error>

			<Field name="email2" />
			<Error error-for="email2" />
			<Error
				error-for="email2"
				v-slot="{ error }">
				<pre>{{ error }}</pre>
			</Error>

			<Field name="emails[0]" />
			<Error error-for="emails" />
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
