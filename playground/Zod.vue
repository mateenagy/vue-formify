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
