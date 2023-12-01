<script lang="ts" setup>
import { ElSwitch } from 'element-plus';
import { ref } from 'vue';
import { ComponentProps, FormType } from './components';
import { Form, Input } from './components';
import { createInput } from './composable/createInput';
import { STORE } from './store/store';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const form = ref<FormType>();
const Switch = createInput<ComponentProps<typeof ElSwitch>>(ElSwitch);
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
			<pre>{{ STORE }}</pre>
			<Form
				@submit="send"
				ref="form"
				v-slot="{ data }">
				<pre>{{ data }}</pre>
				<Input
					name="social.facebooka"
					label="facebook" />
				<Input
					name="social.asd.qwe.asd"
					default="asd"
					label="twitter" />
				<Input
					name="first_name"
					default="lol">
					<template #error="{ error }">
						{{ error }}
					</template>
				</Input>
				<Input name="last_name" />
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
