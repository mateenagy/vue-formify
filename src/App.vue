<script lang="ts" setup>
import { ref } from 'vue';
import { FormType } from './components';
import { STORE } from './store/store';
import { Formify } from '@/components/main';
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
			<pre>{{ STORE }}</pre>
			<Formify.Form  
				@submit="send"
				ref="form"
				v-slot="{ data }">
				<pre>{{ data }}</pre>
				<div>
					<Formify.Input
						name="first_name"
						label="First name" />
				</div>
				<div>
					<Formify.Input
						name="last_name"
						label="Last name" />
				</div>
				<div>
					<Formify.Input
						name="foo.bar"
						label="Last name" />
				</div>
				<div>
					<Formify.Input
						name="boo.baz"
						label="Last name" />
				</div>
				<button>
					Send
				</button>
			</Formify.Form>
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
