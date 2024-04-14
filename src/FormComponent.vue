<script lang="ts" setup>
import { schemaFromYup } from '@vue-formify/yup';
import { schemaFromZod } from '@vue-formify/zod';
import { ref } from 'vue';
import * as yup from 'yup';
import * as zod from 'zod';
import { FormType } from './components';
import CustomDefault from './components/FormElements/CustomDefault.vue';
import { STORE } from './store/store';
import { FormifyCheckbox, FormifyForm, FormifyInput, createInput, ComponentProps, FormifyError } from '@/components/main';
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
const schemaZod = schemaFromZod(zod.object({
	first_name: zod.string({ required_error: 'Password is required' }),
	last_name: zod.string({ required_error: 'This filed is required' }).min(1, { message: 'Not enough' }),
	foo: zod.object({
		bar: zod.string({ required_error: 'This filed is required' }),
		baz: zod.string({ required_error: 'This filed is required' }),
	}),
	social: zod.object({
		name: zod.string().min(1, 'Required'),
	}).array(),
	a: zod.object({
		b: zod.object({
			name: zod.string().min(1, { message: 'Requried field' }),
		}).array(),
	}).array(),
}));

const schemaYup = schemaFromYup(yup.object({
	first_name: yup.string().min(3, 'Halika'),
	last_name: yup.string().min(3, 'Galika'),
	foo: yup.object({
		bar: yup.string().required('Requried'),
		baz: yup.string().required('Requried'),
	}),
	social: yup.array()
		.of(yup.object({
			name: yup.string().min(1, 'Required'),
		})),
	a: yup.array().of(yup.object({
		b: yup.array().of(yup.object({
			name: yup.string().min(1, 'Required field lol'),
		})),
	})),
}));
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
				:validation-schema="schemaZod"
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
