# Share data between forms
In situations where you need a large object but your forms are split into different views, like in a checkout process, you typically use some form of store management logic.

I’ve solved this problem by allowing data to be shared between forms.

To make this work, you need to do two things: set the `name` and `preserve` options in `useForm` hook.

`SharedForm.vue`
::: code-group
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

const { Form, Field, handleSubmit } = useForm<{username: string; password: string;}>({
	name: 'shared-form',
	preserved: true,
});
const sendForm = handleSubmit((data)) => {
	console.log(data);
};

</script>
<template>
	<Form @submit="sendForm">
		<Field name="first_name" />
		<Field name="last_name" />
		<button>Send</button>
	</Form>
</template>
```
:::
`Template.vue`
::: code-group
```vue
<script lang="ts" setup>
import { SharedForm } from './SharedForm.vue';

const toggle = ref<boolean>(false)
</script>
<template>
	<div>
		<SharedForm v-if="toggle" />
		<SharedForm v-else />
		<button type="button" @click="toggle = !toggle">
			Toggle between forms
		</button>
	</div>
</template>
```
:::
If you fill the inputs and toggle between the form the values stays the same.
```json
{
    "first_name": "Foo",
    "last_name": "Bar",
}
```
:::tip Importance of `name` and `preserve`
It's important to use the same `name` and use `preserve` to make it work. The `name` identifies the form and `preserve` prevent the value removed when the component is unmounted.
:::
