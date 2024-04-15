<script lang="ts" setup>
import { TriStateCheckbox } from '@vue-formify/primevue';
import { ref } from 'vue';
import FormComponent from './FormComponent.vue';
import { FormifyForm } from './components/VueFormify';
import { STORE } from './store/store';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
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
			<pre>{{ STORE }}</pre>
			<div>
				<FormifyForm @submit="send">
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
