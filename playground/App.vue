<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { FormComponent } from '@/components/new/Form';
import { useForm } from '@/components/new/useForm';
import { forms } from '@/utils/store';
import { ref } from 'vue';

// import Basic from './Basic.vue';
// import Valibot from './validators/Valibot.vue';
// import Yup from './validators/Yup.vue';
// import Zod from './validators/Zod.vue';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
type TestForm = {
	email: string;
	foo: {
		bar: string;
	};
	select: string;
	multiSelect: string[];
	bar: string[];
};
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const { Form, Field, reset, values, setValue, setInitalValues } = useForm<TestForm>({
	initialValues: {
		email: 'email from composable',
		foo: {
			bar: 'lol',
		},
	},
});
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const submit = () => {
	console.log('Submit');
};
const change = () => {
	console.log('Submit');
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
setInitalValues({
	select: '2',
	multiSelect: ['1', '2'],
});
/*---------------------------------------------
/  HOOKS
---------------------------------------------*/
</script>
<template>
	<div>
		<h2>Basic</h2>
		<p>Form data</p>
		<pre>{{ forms }}</pre>
		<p>Form values</p>
		<pre>{{ values }}</pre>
		<Form
			@submit="submit"
			@value-change="change"
			:initial-values="{
				email: 'email from form prop',
				foo: {
					bar: 'lorem ipsum',
				},
			}">
			<Field
				name="email" />
			<Field
				name="bar[0]"
				default="asd" />
			<Field
				name="foo.bar" />
			<Field
				name="select"
				as="select">
				<option value="1">
					1
				</option>
				<option value="2">
					2
				</option>
				<option value="3">
					3
				</option>
				<option value="4">
					4
				</option>
			</Field>
			<Field
				name="multiSelect"
				as="select"
				multiple>
				<option value="1">
					1
				</option>
				<option value="2">
					2
				</option>
				<option value="3">
					3
				</option>
				<option value="4">
					4
				</option>
			</Field>
			<button>
				submit
			</button>
			<button
				type="button"
				@click="reset()">
				Reset
			</button>
			<button
				type="button"
				@click="reset(true)">
				Force reset
			</button>
		</Form>
		<!-- <Basic /> -->
		<!-- <div>
		</div>
		<hr>
		<div>
			<h2>Yup</h2>
			<Yup />
		</div>
		<hr>
		<div>
			<h2>Zod</h2>
			<Zod />
		</div>
		<hr>
		<div>
			<h2>Valibot</h2>
			<Valibot />
		</div> -->
	</div>
</template>
