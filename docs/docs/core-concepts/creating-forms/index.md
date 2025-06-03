# Creating forms

## Define our form
Since we're using TypeScript, we’ll start by defining the type for our form. Type definitions help reduce errors and provide autocompletion suggestions.

```ts
type FirstForm = {
	name: string;
	checked: boolean;
	nested: {
		text: string;
	}
	numbers: number[];
}
```

For simplicity in the next part we will create a login form so our type will look like this:
```ts
type LoginForm = {
	username: string;
	password: string;
}
```

## Create a form
As mentioned above, we’ll use the `useForm` composable to create our form. The `useForm` composable returns all form-related components, methods, and variables we need.

For more details, see the [useForm composable](/docs/composables/use-form/) and [Form Component](/docs/components/form/) section.


```vue
<script setup lang="ts">
import { useForm } from 'vue-formify'; // [!code highlight]

type LoginForm = {
	username: string;
	password: string;
}

const { Form } = useForm<LoginForm>(); // [!code highlight]

</script>
<template>
	<Form></Form>
</template>
```
