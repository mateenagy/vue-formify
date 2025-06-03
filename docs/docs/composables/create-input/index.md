# `useInput` composable
`useInput` composable helps to create custom component. It is really easy to use the only caveat is it loses the type safety feature in the template, but don't worry I will present some workaround.

We create our component and use the `useInput` composable to create the field. We should pass the props to make everything work.
::: code-group
```vue
<script setup lang="ts">
import { useInput, type InputProps } from '@/main';

const props = defineProps<InputProps>();
const { inputProps, getError } = useInput(props);

</script>

<template>
	<div>
		<label for="">Custom Input</label>
		<div>
			<input
				v-bind="inputProps" />
			<small class="color-red">{{ getError() }}</small>
		</div>
	</div>
</template>
```
:::
### API
#### Variables
| Variable name  |        Description
| -------------  | :-------------------- |
| inputProps     | 	Required data for input fields  |
| isValid     | 	Is the field valid or not  |

#### Methods
| Function      |      Parameter      |        Description
| -------------  | :-------------------- | :-------------------- |
| getError      | `() => void` | Get error message for field |
