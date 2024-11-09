# Share data between forms
In situations where you need a large object but your forms are split into different views, like in a checkout process, you typically use some form of store management logic.

I’ve solved this problem by allowing data to be shared between forms.

To make this work, you need to do two things: set the `name` and `preserve` attributes.

`View1.vue`
```vue
<script lang="ts" setup>
import { Form, Field } from 'vue-formify';

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<Form @submit="sendForm" name="signup" preserved>
		<Field name="first_name" />
		<Field name="last_name" />
		<button>Send</button>
	</Form>
</template>
```
`View2.vue`
```vue
<script lang="ts" setup>
import { Form, Field } from 'vue-formify';

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<Form @submit="sendForm" name="signup" preserved>
		<Field name="email" />
		<Field name="password" type="password" />
		<button>Send</button>
	</Form>
</template>
```
When you send the form the final data will be:
```json
{
    "first_name": "Foo",
    "last_name": "Bar",
    "email": "foo.bar@email.com",
    "password": "123456",
}
```
:::tip Importance of `name` and `preserve`
It's important to use the same `name` and use `preserve` to make it work. The `name` identifies the form and `preserve` prevent the value removed when the component is unmounted.
:::
::: warning `v-if` directive
It also works the same if you are using `v-if`
:::
