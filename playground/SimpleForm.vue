<script lang="ts" setup>
import { useForm } from '@/main';
import { type } from 'arktype';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
defineProps<{
	id: number
}>();
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const { Form, Field, values, handleSubmit } = useForm({
	name: 'simple',
	preserve: true,
	initialValues: {
		name: 'John Doe',
	},
	schema: type({
		name: 'string >= 1',
	}),
});
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const submit = handleSubmit((val) => {
	console.log('Submit', val);
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
		Form {{ id }}
		<Form @submit="submit">
			<Field
				name="name" />
			<button>Send</button>
		</Form>
		<pre>{{ values }}</pre>
	</div>
</template>
