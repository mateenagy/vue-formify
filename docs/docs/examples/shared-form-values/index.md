# Share data between forms
There are situations where you need one large object but your forms need to be separated into different views like a checkout. In this case you mostly use some kind of store management logic.

I solved this problem so you are able to share data between forms.

To make it work we need to do two thing: Set the `name` and `preserve` attribute 

`View1.vue`
```vue
<script lang="ts" setup>
import { FormifyForm, Field } from 'vue-formify';

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<FormifyForm @submit="sendForm" name="signup" preserved>
		<Field name="first_name" />
		<Field name="last_name" />
		<button>Send</button>
	</FormifyForm>
</template>
```
`View2.vue`
```vue
<script lang="ts" setup>
import { FormifyForm, Field } from 'vue-formify';

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<FormifyForm @submit="sendForm" name="signup" preserved>
		<Field name="email" />
		<Field name="password" type="password" />
		<button>Send</button>
	</FormifyForm>
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
