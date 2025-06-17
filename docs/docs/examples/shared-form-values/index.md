# Sharing Data Between Forms

When building multi-step forms or splitting a large form across different views (such as in a checkout process), you often need to share form data between components. This is typically handled with some form of state management.

With `vue-formify`, you can share data between forms by configuring the `useForm` hook with the `name` and `preserve` options.

## Example: Shared Form Values

### `SharedForm.vue`

```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

const { Form, Field, handleSubmit } = useForm<{ first_name: string; last_name: string }>({
	name: 'shared-form',
	preserve: true,
});
const sendForm = handleSubmit((data) => {
	console.log(data);
});
</script>

<template>
	<Form @submit="sendForm">
		<Field name="first_name" />
		<Field name="last_name" />
		<button>Send</button>
	</Form>
</template>
```

### `Template.vue`

```vue
<script lang="ts" setup>
import { ref } from 'vue';
import SharedForm from './SharedForm.vue';

const toggle = ref(false);
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

If you fill in the inputs and toggle between the forms, the values remain the same:

```json
{
	"first_name": "Foo",
	"last_name": "Bar"
}
```

:::tip Importance of `name` and `preserve`
Use the same `name` and set `preserve` to `true` to share values between forms. The `name` uniquely identifies the form, and `preserve` ensures values are not cleared when the component is unmounted.
:::
