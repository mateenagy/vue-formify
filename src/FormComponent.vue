<script lang="ts" setup>
import { ref } from 'vue';
import { object, string } from 'zod';
import { FormType } from './components';
import CustomDefault from './components/FormElements/CustomDefault.vue';
import { STORE } from './store/store';
import { FormifyCheckbox, FormifyForm, FormifyInput, createInput, ComponentProps, FormifyError } from '@/components/main';
import { schemaFromZod } from '@vue-formify/zod';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const form = ref<FormType>();
const Input = createInput<ComponentProps<typeof CustomDefault>>(CustomDefault, { defaultValueKey: 'value' });
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const send = (data: any) => {
	console.log('data', data);
};
const user = object({
	first_name: string({ required_error: 'Password is required' }),
	last_name: string({ required_error: 'This filed is required' }).min(1, { message: 'Not enough' }),
	foo: object({
		bar: string({ required_error: 'This filed is required' }),
		baz: string({ required_error: 'This filed is required' }),
	}),
	social: object({
		name: string().min(1, 'Required'),
	}).array(),
	a: object({
		b: object({
			name: string().min(1, { message: 'Requried field' }),
		}).array(),
	}).array(),
});
const schema = schemaFromZod(user);
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
				:validation-schema="schema"
				@submit="send"
				ref="form">
				<div>
					<FormifyInput
						name="first_name"
						label="first_name" />
					<FormifyInput
						name="last_name"
						label="last_name" />
					<FormifyInput
						name="foo.bar"
						label="bar" />
					<FormifyInput
						name="foo.baz"
						label="baz" />
					<FormifyInput
						name="social[0].name"
						label="twitter" />
					<FormifyInput
						name="social[1].name"
						label="github" />
					<FormifyInput
						name="a[0].b[0].name"
						label="a0b0" />
					<FormifyInput
						name="a[1].b[0].name"
						label="a1b0" />
					<FormifyInput
						name="a[0].b[1].name"
						label="a0b1" />
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
