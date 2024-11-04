# Multi step form
In this example we create a simple multi step form. To archive this we just simply use v-show and a reactive value to track the current step. On the send method you can write the logic for validation and when to let the user to the next step.

You can use v-if if you want but then you have to put **preserve** attribute on every input
```vue
<script lang="ts" setup>
import { ref } from 'vue';
import { FormifyForm, Field, FormType } from 'vue-formify';

const step = ref<number>(0);
const form = ref<FormType>();

const send = (data: any) => {
	if (step.value === 0) {
		if (!data.username) {
			return form.value?.setError('username', 'Username required' );
		}

		return step.value++;
	}

	if (step.value === 1) {
		if (!data.password) {
			return form.value?.setError('password', 'Password required' );
		} else {
			console.log('[data]: ', data);
			form.value?.resetForm();
			step.value = 0;
		}
	}
};
</script>
<template>
	<FormifyForm ref="form" @submit="send" v-slot="{ data }">
		<pre>{{ data }}</pre>
		<h3>Registration</h3>
		<div v-show="step === 0">
			<Field name="username"/>
		</div>
		<div v-show="step === 1">
			<Field name="password" type="password"/>
		</div>
		<button class="mt-2">
			{{ step !== 1 ? 'Next' : 'Send' }}
		</button>
	</FormifyForm>
</template>
```
