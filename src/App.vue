<script lang="ts" setup>
import { ElCheckbox } from 'element-plus';
import { ref } from 'vue';
import { ComponentProps, FormType } from './components';
import { STORE } from './store/store';
import { createInput, FormifyCheckbox, FormifyForm, FormifyInput, FormifyRadio } from '@/components/main';
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
			<FormifyForm
				@submit="send"
				ref="form"
				v-slot="{ data }">
				<pre>{{ data }}</pre>
				<div>
					<FormifyInput
						name="first_name"
						label="First name" />
				</div>
				<div>
					<Checkbox
						name="check"
						:default="false">
						Element plus checkbox
					</Checkbox>
				</div>
				<div>
					<FormifyInput
						default="lorem"
						name="foo.bar"
						label="Last name" />
				</div>
				<div>
					<FormifyCheckbox
						name="asd"
						:default="true"
						label="hali">
					</FormifyCheckbox>
				</div>
				<div>
					<FormifyRadio
						name="radio"
						value="foo"
						label="foo" />
				</div>
				<div>
					<FormifyRadio
						name="radio"
						value="bar"
						label="bar" />
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
