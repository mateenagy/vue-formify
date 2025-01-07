<script lang="ts" setup>
import { useForm } from '@/composable/useForm';
import { schemaFromValibot } from '@packages/valibot';
import * as v from 'valibot';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const schema = schemaFromValibot(v.object({
	username: v.string(),
	links: v.array(v.object({
		name: v.string(),
		url: v.string(),
	})),
}));
const { Form, Field, handleSubmit } = useForm({
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
			<Field name="links[0].name" />
			<Field name="links[0].url" />
			<pre>{{ values }}</pre>
			<button>Send</button>
		</Form>
	</div>
</template>
