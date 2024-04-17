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
				<FormifyInput name="asd" />
				<FormifyForm
					ref="form"
					@submit="send" 
					v-slot="{ data }">
					<!-- <FormifyInput
						name="name" /> -->
					<pre>{{ data }}</pre>
					<InputText name="asd" />
					<ToggleButton
						name="toggle"
						:default="false" />
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
