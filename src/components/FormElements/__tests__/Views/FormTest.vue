<script lang="ts" setup>
import { ref } from 'vue';
import { Formify } from '@/components/main';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const response = ref('');
const responseWithObject = ref('');
const responseWithArray = ref('');
const form = ref();
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const sendForm = (data: any) => {
	response.value = data.first_name;
	responseWithObject.value = data.social.facebook;
	responseWithArray.value = data.links;
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
	<Formify.Form
		@submit="sendForm"
		ref="form">
		<Formify.Input name="first_name" />
		<Formify.Input
			name="first_name">
			<template #error="{ error }">
				<span class="custom-error">
					{{ error }}
				</span>
			</template>
		</Formify.Input>
		<Formify.Input name="social.facebook" />
		<Formify.Input name="links[0]" />
		<Formify.Input name="links[1]" />
		<button type="submit">
			Send
		</button>
	</Formify.Form>
	<h2>First name</h2>
	<p>{{ response }}</p>
	<p id="respObj">
		{{ responseWithObject }}
	</p>
	<p id="respArray">
		{{ responseWithArray }}
	</p>
</template>
