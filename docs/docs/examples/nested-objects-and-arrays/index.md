# Nested Objects and Arrays

## Objects

You can create nested objects by using dot notation in the `name` attribute, just like in JavaScript. There are no limits—you can nest as deeply as you need.

::: code-group
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

type NestedObject = {
	social: {
		twitter: string;
		github: string;
	};
}

const { Form, Field, handleSubmit } = useForm<NestedObject>();
const sendForm = handleSubmit((data) => {
	console.log(data);
});
</script>

<template>
	<Form @submit="sendForm">
		<Field name="social.twitter" />
		<Field name="social.github" />
		<button>Send</button>
	</Form>
</template>
```
:::

:::warning Disable object nesting behaviour
To treat a dot in a field name as a literal string (not as a path), wrap the name in square brackets:
```vue
<Field name="[foo.bar]" />
```
:::

## Arrays

Arrays are created using square brackets in the field name.

**Important:** Use numbers inside the brackets to represent array indices. Using strings or other values will not work.

::: tip Best practice
❌ **Bad**: `movies[]`, `movies[foo]`, `movies[0foo]`

✅ **Good**: `movies[0]`, `movies[1]`, `movies[2]`
:::

::: code-group
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

type NestedObject = {
	social: string[];
}

const { Form, Field, handleSubmit } = useForm<NestedObject>();
const sendForm = handleSubmit((data) => {
	console.log(data);
});
</script>

<template>
	<Form @submit="sendForm">
		<Field name="social[0]" />
		<Field name="social[1]" />
		<button>Send</button>
	</Form>
</template>
```
:::

You can also combine objects and arrays as deeply as you like. For example: `foo.bar[0].baz`

::: code-group
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

type NestedObject = {
	social: {
		links: {
			url: string;
		}[];
	};
}

const { Form, Field, handleSubmit } = useForm<NestedObject>();
const sendForm = handleSubmit((data) => {
	console.log(data);
});
</script>

<template>
	<Form @submit="sendForm">
		<Field name="social.links[0].url" />
		<Field name="social.links[1].url" />
		<button>Send</button>
	</Form>
</template>
```
:::
