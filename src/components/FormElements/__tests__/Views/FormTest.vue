<script lang="ts" setup>
import { ref } from 'vue';
import CustomInput from './CustomInput.vue';
import { FormifyForm, FormifyInput, createInput, ComponentProps } from '@/components/main';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const response = ref(Object.create({}));
const form = ref();
const ColorPicker = createInput<ComponentProps<typeof CustomInput>>(CustomInput);
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const sendForm = (data: any) => {
	response.value = data;
	if (!data.first_name) {
		form.value?.setError('first_name', 'First name required');
	}
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
	<div>
		<FormifyForm
			@submit="sendForm"
			ref="form">
			<FormifyInput name="first_name" />
			<FormifyInput
				name="first_name">
				<template #error="{ error }">
					<span class="custom-error">
						{{ error }}
					</span>
				</template>
			</FormifyInput>
			<FormifyInput name="social.facebook" />
			<FormifyInput name="links[0]" />
			<FormifyInput name="links[1]" />
			<ColorPicker name="color" />
			<button type="submit">
				Send
			</button>
		</FormifyForm>
	</div>
	<h2>First name</h2>
	<p>{{ response.first_name }}</p>
	<p id="respObj">
		{{ response?.social?.facebook }}
	</p>
	<p id="respArray">
		{{ response?.links }}
	</p>
	<p id="respCustom">
		{{ response?.color }}
	</p>
	<p id="debug">
		{{ response }}
	</p>
</template>
