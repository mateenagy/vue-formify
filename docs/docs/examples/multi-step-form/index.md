# Multi step form
In this example, we create a simple multi-step form. To achieve this, we use `v-show` and a `reactive` value to track the current step. In the send method, you can write the logic for validation and determine when to allow the user to move to the next step.

You can also use `v-if` if preferred, but in that case, you'll need to add the `preserve` attribute to every input.

```vue
<script lang="ts" setup>
import { ref } from 'vue';
import { Form, Field, FormType } from 'vue-formify';

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
	<Form ref="form" @submit="send" v-slot="{ data }">
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
	</Form>
</template>
```
