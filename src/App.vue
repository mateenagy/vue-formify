<script lang="ts" setup>
import { ElCheckbox } from 'element-plus';
import { ref } from 'vue';
import { ComponentProps, FormType } from './components';
import { STORE } from './store/store';
import { Formify, createInput } from '@/components/main';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const form = ref<FormType>();
const Checkbox = createInput<ComponentProps<typeof ElCheckbox>>(ElCheckbox);
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
					<Checkbox
						name="check"
						:default="false">
						Check this
					</Checkbox>
				</div>
				<div>
					<Formify.Input
						default="lorem"
						name="foo.bar"
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
