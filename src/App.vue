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
					@submit="send" 
					v-slot="{ data }">
					<pre>{{ data }}</pre>
					<FormifyInput
						name="name" />
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
