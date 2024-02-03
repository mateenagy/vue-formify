<script lang="ts" setup>
import { ref } from 'vue';
import { FormType } from './components';
import { STORE } from './store/store';
import { FormifyCheckbox, FormifyForm, FormifyInput } from '@/components/main';
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
			<FormifyForm
				@submit="send"
				ref="form">
				<div>
					<FormifyCheckbox
						name="foo[0]"
						:default="true"
						label="hali">
					</FormifyCheckbox>
					<FormifyInput name="first_name" />
				</div>
				<button>
					Send
				</button>
			</FormifyForm>
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
