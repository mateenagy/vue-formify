<script lang="ts" setup>
// import * as v from 'valibot';
// import * as yup from 'yup';
// import { schemaFromYup } from '../packages/yup/index';
// import { schemaFromYup } from '../packages/yup/index';
// import { schemaFromValibot } from '../packages/valibot/index';
import { useForm } from '@/composable/useForm';
import { createInput } from './composable/createInput';
import { ComponentProps } from './components';
import CustomInput from './CustomInput.vue';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
type LoginRequest = {
	username: string;
	password: string;
	links: string[];
	nested: { 
		foo: string,
		bar?: string
	};
	stay_loggedin: boolean;
}
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
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
		stay_loggedin: false
	}
});
const Custom = createInput<ComponentProps<typeof CustomInput>, LoginRequest>(CustomInput);
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const promiseSubmit = async () => {
	return new Promise((_r, _rj) => setTimeout(_r, 2000));
}
const submit = handleSubmit(async (data) => {
	await promiseSubmit();
	!data?.username && setError('username', 'Error')
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
			<Field name="username" />
			<Error error-for="username"/>
			<Custom name="password" />
			<Error error-for="password"/>
			<div>
				<Field id="stay_loggedin" name="stay_loggedin" type="checkbox" />
				<label for="stay_loggedin">Check</label>
				<Error error-for="stay_loggedin"/>
			</div>
			<button :disabled="isSubmitting">Send</button>
			<button type="button" @click="reset">
				Reset
			</button>
			<pre>{{ values }}</pre>
		</Form>
	</div>
</template>
