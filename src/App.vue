<script lang="ts" setup>
import { useForm } from './composable/useForm';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
type LoginRequest = {
	username: string;
	password: string;
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
} = useForm<LoginRequest>({
	initials: {
		stay_loggedin: false,
	},
});
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const submit = handleSubmit((data) => {
	console.log('username', data?.username);
	setError('username', 'Username required');
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
			@submit="submit"
			v-slot="{ values }">
			<div>
				<Field name="username" />
				<Error error-for="username" />
			</div>
			<div>
				<Field
					name="password"
					type="password" />
			</div>
			<div>
				<Field
					name="stay_loggedin"
					v-slot="{ field }">
					<input
						id="loggedin"
						type="checkbox"
						v-bind="field" />
					<label for="loggedin">Stay logged in</label>
				</Field>
			</div>
			<button>Send</button>
			<button
				type="button"
				@click="reset">
				Reset
			</button>
			<pre>{{ values }}</pre>
		</Form>
	</div>
</template>
