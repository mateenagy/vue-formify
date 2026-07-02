# `useInput` composable
The `useInput` composable is designed to simplify the creation of custom input components in Vue. While it streamlines the process, note that type safety in the template is limited. However, there are workarounds to address this limitation.

To use `useInput`, define your component and pass the necessary props. The composable returns useful properties and methods for managing input state and validation.

::: code-group
```vue
<script setup lang="ts">
import { useInput, type InputProps } from 'vue-formify';

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
| options    | `UseInputOption`                     | Optional configuration (see below).                              |

`options` fields:

| Option       | Type      | Description                                                                                   |
|--------------|-----------|-----------------------------------------------------------------------------------------------|
| isArray      | `boolean` | If `true`, sets the default input value to an empty array. Default is `false`.                |
| isComponent  | `boolean` | Set to `true` for third-party components to avoid a duplicate value update on input.          |
| isCheckbox   | `boolean` | Set to `true` when the input is a checkbox so the default value falls back to `falseValue`.   |

### Returned Variables

| Variable     | Description                                 |
|--------------|---------------------------------------------|
| value        | The current field value (writable computed) |
| inputProps   | Bindings required for the input element     |
| isValid      | Indicates if the field is valid             |
| isDirty      | `true` when the value differs from initial  |
| isTouched    | `true` once the field has been touched      |

### Returned Methods

| Function   | Parameter                     | Description                                  |
|------------|-------------------------------|----------------------------------------------|
| getError   | `() => string`                | Returns the error message for the field.     |
| setValue   | `(value: any) => void`        | Sets the field value.                        |
| setError   | `(error: any) => void`        | Sets an error message on the field.          |

