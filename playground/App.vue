<script lang="ts" setup>
import { useForm } from '@/composable/useForm';
import { JSONSchema, SchemaField } from '@/components/SchemaField';
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
	setError,
	isSubmitting,
	values,
} = useForm<LoginRequest>({
	initialValues: {
		stay_loggedin: false,
	},
});
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const promiseSubmit = async () => {
	return new Promise(_r => setTimeout(_r, 2000));
};
const submit = handleSubmit(async (data) => {
	await promiseSubmit();
	!data?.username && setError('username', 'Error');
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
const jsonSchema: JSONSchema<LoginRequest> = [
	{
		name: 'username',
		component: [Field, Error],
	},
	{
		name: 'password',
		component: 'input',
	},
	{
		name: 'nested.foo',
		component: Field,
	},
];
</script>
<template>
	<div>
		<Form
			ref="form"
			@submit="submit"
			name="foo">
			<SchemaField :schema="jsonSchema" />
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
