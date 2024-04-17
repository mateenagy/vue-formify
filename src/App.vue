<script lang="ts" setup>
import { ref } from 'vue';
import { FormType } from './components';
import { FormifyForm, FormifyInput } from './components/VueFormify';
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
	console.log(data);
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
			<div>
				<FormifyForm
					ref="form"
					@submit="send">
					<FormifyInput
						name="name" />
					<FormifyInput name="email" />
					<FormifyInput name="foo" />
					<FormifyInput name="fbar" />
					<button>send</button>
				</FormifyForm>
			</div>
		</div>
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
