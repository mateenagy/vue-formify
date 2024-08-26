<script lang="ts" setup>
import Form from './components/FormElements/Form.vue';
import { ref } from 'vue';
import { FormType } from './components';
import { ArrayField, Field } from '@/components/main';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const form = ref<FormType>();
const send = (data: any) => {
	form.value?.setError('baz', 'Required');
	form.value?.setError('faz', 'Required');
	form.value?.setError('first_name', 'Required');
	console.log('[form data]: ', data);
};
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
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
	<div>
		<h2>Form</h2>
		<Form
			@submit="send"
			:initial-values="{ foo: 'test' }"
			ref="form"
			v-slot="{ values }">
			<pre>{{ values }}</pre>
			<div>
				<Field
					name="test"
					value="foo"
					checked
					type="radio"
					as="input" />
				<Field
					name="test"
					default="foo"
					value="bar"
					type="radio"
					as="input" />
			</div>
			<Field
				name="check"
				type="checkbox"
				as="input" />
			<Field
				v-if="values.check"
				name="check-custom"
				type="checkbox"
				true-value="yes"
				false-value="no"
				as="input" />


			<Field
				name="faz"
				default="faz"
				v-slot="{ field, error }">
				<input
					type="text"
					v-bind="field">
				<small>{{ error }}</small>
			</Field>
			<ArrayField
				name="links"
				:initial-values="['1', '2', '3']"
				v-slot="{ fields, add, remove }">
				<fieldset
					v-for="(field, idx) of fields"
					:key="field.id">
					<Field
						:name="`links[${idx}]`"
						as="input" />
					<button
						type="button"
						@click="remove(idx)">
						Remove
					</button>
				</fieldset>
				<button
					type="button"
					@click="add">
					Add
				</button>
			</ArrayField>
			<!-- <Field
				name="faz"
				default="faz"
				v-slot="{ field }">
				<input
					type="text"
					v-bind="field">
			</Field>
			<Error error-for="faz" />
			<Field
				name="first_name"
				v-slot="{ field, error }">
				<label>Firstname</label>
				<input v-bind="field" />
				<small>{{ error }}</small>
			</Field>
			<ArrayField
				name="links"
				v-slot="{ fields, add, remove }">
				<fieldset
					v-for="(field, idx) of fields"
					:key="field.id">
					<Field
						:name="`links[${idx}]`"
						as="input" />
					<button
						type="button"
						@click="remove(idx)">
						Remove
					</button>
				</fieldset>
				<button
					type="button"
					@click="add">
					Add
				</button>
			</ArrayField> -->
			<button>Send</button>
			<button
				type="button"
				@click="form?.reset">
				Reset
			</button>
		</Form>
	</div>
</template>
