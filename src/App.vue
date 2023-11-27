<script lang="ts" setup>
import { ref } from 'vue';
import { FormType } from './components';
import { Form, Input } from './components';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const form = ref<FormType>();

/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const send = (data: any) => {
	console.log('data', data);
	if (!data.first_name) {
		form.value?.setError('first_name', 'error message');
	}
};
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
	<div class="wrapper">
		<div>
			<Form
				@submit="send"
				ref="form"
				v-slot="{ data }">
				<pre>{{ data }}</pre>
				<Input
					name="first_name"
					label="First name">
					<template #error="{ error }">
						{{ error }}
					</template>
				</Input>
				<Input
					name="last_name" />
				<button>
					Send
				</button>
			</Form>
		</div>
		<button @click="form?.resetForm()">
			Reset
		</button>
	</div>
</template>
<style>
.wrapper {
	padding: 1rem;
}

.error-message {
	color: rgb(255, 77, 77);
}
</style>
