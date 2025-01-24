# Custom input
In this example, we’ll create a custom input with labels and error message handling. For every custom component, no additional setup is required beyond the standard Vue setup.

To handle `errors`, we simply add an `error` prop to the component, and the `Form` will automatically populate the error message into that prop.
```vue
<script lang="ts" setup>
defineProps<{
	label: string;
	error?: any;
}>();
const value = defineModel();
</script>
<template>
	<div>
		<label>{{ label }}</label>
		<input type="color" v-model="value" />
		<p v-if="error">{{ error }}</p>
	</div>
</template>
```

## Using the custom input
```vue
<script lang="ts" setup>
import { useForm, createInput, ComponentProps } from 'vue-formify';
import CustomInput from './CustomInput.vue'

const { Form } = useForm();
const InputField = createInput<ComponentProps<typeof CustomInput>>(CustomInput);
</script>
<template>
	<div>
		<Form>
			<InputField name="firstname" label="First name" />
		</Form>
	</div>
</template>
```
