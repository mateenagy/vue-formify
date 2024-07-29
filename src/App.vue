<script lang="ts" setup>
import { ref } from 'vue';
import * as yup from 'yup';
import { schemaFromYup } from '../packages/yup/index';
import { ComponentProps } from './components';
import Form2 from './components/FormElements/Form.vue';
import NamedVModel from './components/FormElements/__tests__/Views/NamedVModel.vue';
import GroupInput from './components/GroupInput.vue';
import UserName from './components/UserName.vue';
import { createInput } from './composable/createInput';
import ArrayField from './components/FormElements/ArrayField.vue';
import { FormifyInput } from './components/VueFormify';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const validationSchema = schemaFromYup(yup.object({
	users: yup.array().of(yup.string()).min(1, 'Min 1 item required').required('Required'),
}));
const form = ref();
const UserInput = createInput<ComponentProps<typeof UserName>>(UserName, { modelKeys: ['firstname', 'lastname'], useKey: true });
const FieldYo = createInput<ComponentProps<typeof NamedVModel>>(NamedVModel, { modelKeys: 'title' });
const ArrayInput = createInput<ComponentProps<typeof ArrayField>>(ArrayField);
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
const show = ref<boolean>(true);
</script>
<template>
	<div class="wrapper">
		<div>
			<div>
				<Form2
					ref="form"
					@submit="send"
					:validation-schema="validationSchema">
					<FormifyInput name="foo" />
					<FormifyInput name="link[0]" />
					<FormifyInput name="link[1]" />
					<FormifyInput name="link[2]" />
					<ArrayInput
						name="users"
						v-slot="{ add, fields, remove }">
						{{ fields }}
						<div
							v-for="(field, idx) of fields"
							:key="field.id">
							<strong>field: {{ field.id }}</strong>
							<FormifyInput :name="`users[${idx}]`" />
							<button @click="remove(idx)">
								remove
							</button>
						</div>
						<button
							type="button"
							@click="add">
							Add
						</button>
					</ArrayInput>
					<label>Custom</label>
					<button>send</button>
					<button
						type="button"
						@click="form.reset">
						reset
					</button>
				</Form2>
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
