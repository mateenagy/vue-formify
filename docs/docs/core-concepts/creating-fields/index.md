# Creating fields
To create fields, use the `Field` component. By default, `Field` acts as a native HTML `input`, but if you add a child input element, it works as a headless component.

It can also render native `<select>` and `<select multiple>` elements when the `as` attribute is set to `select`.

For more details, see the [Field Component](/docs/components/field/) section.

```vue
<script setup lang="ts">
import { useForm } from 'vue-formify';

type LoginForm = {
	username: string;
	password: string;
}

const { Form, Field } = useForm<LoginForm>(); // [!code highlight]

</script>
<template>
	<Form>
		<Field name="username" /> // [!code highlight]
		<Field name="password" type="password" /> // [!code highlight]
	</Form>
</template>
```




