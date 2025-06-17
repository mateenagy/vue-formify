# `useInput` composable
The `useInput` composable is designed to simplify the creation of custom input components in Vue. While it streamlines the process, note that type safety in the template is limited. However, there are workarounds to address this limitation.

To use `useInput`, define your component and pass the necessary props. The composable returns useful properties and methods for managing input state and validation.

::: code-group
```vue
<script setup lang="ts">
import { useInput, type InputProps } from '@/main';

const props = defineProps<InputProps>();
const { inputProps, getError } = useInput(props);

</script>

<template>
	<div>
		<label>Custom Input</label>
		<div>
			<input v-bind="inputProps" />
			<small class="color-red">{{ getError() }}</small>
		</div>
	</div>
</template>
```
:::

## API Reference

### Composable Arguments

| Argument   | Type                                 | Description                                                      |
|------------|--------------------------------------|------------------------------------------------------------------|
| props      | `InputProps \| { name: string }`     | Props required for the input. The `name` property is mandatory.  |
| isArray    | `boolean`                            | If `true`, sets the default input value to an empty array. Default is `false`. |

### Returned Variables

| Variable     | Description                        |
|--------------|------------------------------------|
| inputProps   | Data required for input fields     |
| isValid      | Indicates if the field is valid    |

### Returned Methods

| Function   | Parameter      | Description                        |
|------------|---------------|------------------------------------|
| getError   | `() => void`   | Returns the error message for the field |

