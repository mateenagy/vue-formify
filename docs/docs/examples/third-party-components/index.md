# Third party UI components
To use third-party library components, follow the same process as for custom components. Simply pass the component through the `createInput` composable, and it will be ready to use.

## PrimeVue example
### InputText 
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
	</div>
</template>
```
