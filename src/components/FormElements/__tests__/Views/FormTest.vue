<script lang="ts" setup>
import { ref } from 'vue';
import { Input } from '@/components';
import Form from '@/components/FormElements/Form.vue';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const response = ref('');
const form = ref();
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const sendForm = (data: any) => {
	response.value = data.first_name;
	if (!data.first_name) {
		form.value?.setError('first_name', 'First name required');
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
	<Form
		@submit="sendForm"
		ref="form">
		<Input name="first_name" />
		<Input
			name="first_name">
			<template #error="{ error }">
				<span class="custom-error">
					{{ error }}
				</span>
			</template>
		</Input>
		<button type="submit">
			Send
		</button>
	</Form>
	<h2>First name</h2>
	<p>{{ response }}</p>
</template>
