# Third Party UI Components

You can easily integrate third-party UI library components with your forms. The process is the same as using custom components: wrap the third-party component with the `createInput` composable, and it will work seamlessly with your form logic.

## PrimeVue example

### Using `InputText` with `Field` component

```vue
<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import { useForm } from 'vue-formify';

const { Field } = useForm();
</script>

<template>
	<Field name="color" v-slot="{field}">
		<InputText v-bind="field"  />
	</Field>
</template>
```
### Using `InputText` with `useInput` composable

```vue
<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import { useInput, type InputProps } from '@/main';

const props = defineProps<InputProps>();
const { inputProps, getError } = useInput(props);
</script>

<template>
	<div>
		<InputText v-bind="inputProps" />
		<!-- Optionally display validation errors -->
		<span v-if="getError()">{{ getError() }}</span>
	</div>
</template>
```

::: tip
You can use this approach with any compatible third-party component, not just PrimeVue. Just pass the component through your form composable and bind the generated props.
