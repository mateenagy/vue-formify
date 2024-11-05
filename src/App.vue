<script lang="ts" setup>
// import * as v from 'valibot';
// import * as yup from 'yup';
// import { schemaFromYup } from '../packages/yup/index';
// import { schemaFromYup } from '../packages/yup/index';
// import { schemaFromValibot } from '../packages/valibot/index';
import { useForm } from '@/composable/useForm';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
type User = {
	name: string;
	age: number;
	links: string[];
}
type LoginRequest = {
	username: string;
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
// const _schema = yup.object({
// 	username: yup.string().required('Required field'),
// 	nested: yup.object({
// 		name: yup.string(),
// 		age: yup.number(),
// 	})
// })
// const schema = schemaFromYup(_schema);
// type UserType = yup.InferType<typeof _schema>;
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
		username: 'asd'
	},
});
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
		<Form ref="form" @submit="submit" name="foo" v-slot="{ values }" :initial-values="{
			username: 'asd'
		}">
			<button :disabled="isSubmitting">Send</button>
			<button type="button" @click="reset">
				Reset
			</button>
			<pre>{{ values }}</pre>
		</Form>
	</div>
</template>
