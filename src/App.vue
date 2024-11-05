<script lang="ts" setup>
// import * as yup from 'yup';
// import * as v from 'valibot';
// import { schemaFromYup } from '../packages/yup/index';
// import { schemaFromYup } from '../packages/yup/index';
// import { schemaFromValibot } from '../packages/valibot/index';
import { useForm } from '@/composable/useForm';
import { FieldComp } from './components/Field';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
type User = {
	name: string;
	age: number;
	links: string[];
}
type LoginRequest = {
	username: number;
	password: string;
	bro: string[]
	test: {foo: string, bar?: string};
	stay_loggedin: boolean;
	file: any;
	nested: {
		foo: string;
		bar: string[];
		baz: User[];
	}
}
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
// const schema = schemaFromYup(yup.object({
// 	username: yup.string().required('Required field'),
// }));
// const schema = schemaFromValibot(v.object({
// 	username: v.pipe(v.string(), v.minLength(1, 'Required field')),
// }));
const {
	Form,
	Field,
	Error,
	reset,
	handleSubmit,
	isSubmitting,
	setError,
} = useForm<LoginRequest>({
	initialValues: {
		stay_loggedin: false,
	},
});
const Field2 = FieldComp<LoginRequest>()
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const promiseSubmit = async () => {
	return new Promise((_r, _rj) => setTimeout(_r, 2000));
}
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
		<Form ref="form" @submit="submit" name="foo" v-slot="{ values }">
			<div>
				<Field name="bro" v-slot="{field}">
					<input v-bind="field">
				</Field>
				<Error error-for="username" />
			</div>
			<div>
				<Field name="username" type="password" />
			</div>
			<div>
				<Field name="stay_loggedin" v-slot="{ field }">
					<input id="loggedin" type="checkbox" v-bind="field" />
					<label for="loggedin">Stay logged in</label>
				</Field>
			</div>
			<div>
				<Field name="file" type="file" v-slot="{ field }">
					<label>Upload</label>
					<input v-bind="field" />
				</Field>
			</div>
			<button :disabled="isSubmitting">Send</button>
			<button type="button" @click="reset">
				Reset
			</button>
			<pre>{{ values }}</pre>
		</Form>
	</div>
</template>
