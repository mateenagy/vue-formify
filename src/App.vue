<script lang="ts" setup>
import { ref } from 'vue';
import { FormType } from './components';
import { Form, Input } from './components';
import { STORE } from './store/store';
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
	if (!data.social.twitter) {
		form.value?.setError('social.twitter', 'twitter link required');
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
				<div>
					<Input
						name="first_name"
						label="First name" />
				</div>
				<div>
					<Input
						name="last_nameqwe"
						label="Last name" />
				</div>
				<div>
					<Input
						name="email"
						label="Email" />
				</div>
				<div>
					<div>
						<Input
							name="social.twitter"
							label="Twitter link" />
					</div>
					<div>
						<Input
							name="social.dev.github"
							label="Github" />
					</div>
				</div>
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
