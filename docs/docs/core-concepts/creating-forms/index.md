# Creating forms
In <strong>VueFormify</strong>, you can create forms using either the `useForm` composable or by importing components directly from the package.

Throughout the <strong>Core Concepts</strong> section, we'll use the `useForm` composable, as it enables type safety for our forms.

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

### Infer types from validation schema
If we are using a validation package then we can infer types from them and use it as our type definition. Here is an example with `yup`

```ts
import * as yup from 'yup';

const yupSchema = yup.object({
	name: yup.string();
	checked: yup.boolean();
	nested: yup.object({
		text: yup.string();
	})
	numbers: yup.array().of(yup.number());
});

type FirstForm = yup.InferType<typeof yupSchema>;
```
::: warning Type rule
Your types should represent the data you expect when submitting the form. 
:::

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
