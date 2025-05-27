<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { useForm } from '@/components/new/useForm';
import { forms } from '@/utils/store';
import { z } from 'zod';
import * as v from 'valibot';
import { type } from 'arktype';
import { ref } from 'vue';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const { id = 2 } = defineProps<{
	id?: number;
}>();

const schema = z.object({
	single: z.string().min(2, 'Single field must be at least 2 characters long'),
	user: z.string().min(5, 'User name must be at least 5 characters long'),
	foo: z.object({
		bar: z.string().min(3, 'Bar must be at least 3 characters long'),
	}),
	singleArray: z.array(z.string().min(3, '3 char nedded')).min(2, 'Single array item must be at least 2 long'),
	nestedArray: z.array(
		z.object({
			name: z.string().min(3, 'Name must be at least 3 characters long'),
		}),
	).min(2, 'Nested array must have at least 2 item'),
});
const nameSchema = z.string().min(5, 'Username must be at least 5 characters long');
const UserForm = type({
	username: type.string.atLeastLength(5).configure({ message: 'Username must be at least 5 characters long' }),
});
// const schema = v.object({
// 	email: v.pipe(v.string(), v.email('Email must be a valid email address')),
// 	password: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters long')),
// });
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const { Form, Field, Error, reset, values, setInitalValues } = useForm({
	schema: UserForm,
});
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const submit = (val: any) => {
	console.log('Submit', val);
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
const arrayInputCount = ref<number>(1);
</script>
<template>
	<div>
		<h2>Basic</h2>
		<Form
			@submit="submit"
			v-slot="{ getError, isDirty, isValid }">
			<Field name="username" />
			<Error error-for="username" />
			<!-- <div>
				<div>
					<Field
						name="singleArray[0]" />
					<small style="display: block; margin-bottom: 0.5rem; color: red;"><Error error-for="singleArray[0]" /></small>
				</div>
				<div>
					<Field
						name="singleArray[1]" />
					<small style="display: block; margin-bottom: 0.5rem; color: red;"><Error error-for="singleArray[1]" /></small>
					<small style="display: block; margin-bottom: 0.5rem; color: red;"><Error error-for="singleArray[2]" /></small>
				</div>
				<small style="display: block; margin-bottom: 0.5rem; color: red;">{{ getError('singleArray') }}</small>
				<div
					v-for="i in arrayInputCount"
					:key="i">
					<label for="name">name</label>
					<Field
						:name="`nestedArray[${i - 1}].name`" />
					<small style="display: block; margin-bottom: 0.5rem; color: red;"><Error :error-for="`nestedArray[${i - 1}].name`" /></small>
				</div>
				<small style="display: block; margin-bottom: 0.5rem; color: red;">{{ getError('nestedArray') }}</small>
				<button
					type="button"
					@click="arrayInputCount++">
					Add
				</button>
				<button
					type="button"
					@click="arrayInputCount--">
					Remove
				</button>
				<div>
					<Field
						name="single" />
					<small style="display: block; margin-bottom: 0.5rem;"><Error error-for="single" /></small>
				</div>
				<div>
					<Field
						name="user" />
					<small style="display: block; margin-bottom: 0.5rem;"><Error error-for="user" /></small>
				</div>
				<div>
					<Field
						name="foo.bar" />
					<small style="display: block; margin-bottom: 0.5rem;"><Error error-for="foo.bar" /></small>
				</div>
			</div> -->
			<button :disabled="!isValid">
				submit
			</button>
			<button>
				submit no disabled
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
			<pre>isDirty: {{ isDirty }}</pre>
			<pre>isValid: {{ isValid }}</pre>
			<!-- errors: <pre>{{ errors }}</pre> -->
			<p>Form data</p>
			<pre>{{ forms }}</pre>
			<p>Form values</p>
			<pre>{{ values }}</pre>
		</Form>
	</div>
</template>
