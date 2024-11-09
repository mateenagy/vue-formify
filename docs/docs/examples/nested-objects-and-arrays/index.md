# Nested objects and arrays
## Objects
You can create nested objects by passing strings with dot path to name attribute (same as you do with JavaScript).

There is no limitation, you can nest as musch as you like.
```vue
<script lang="ts" setup>
import { Form, Field } from 'vue-formify';

type NestedObject = {
	social: {
		twitter: string;
		github: string;
	};
}
const sendForm = (data: NestedObject) => {
	console.log(data);
};

</script>
<template>
	<Form @submit="sendForm">
		<Field name="social.twitter" />
		<Field name="social.github" />
		<button>Send</button>
	</Form>
</template>
```
:::warning Disable object nesting behaviour
You can disable object nesting behaviour if your wrap it between square brackets
```vue
<Field name="[foo.bar]" />
```
:::

## Arrays
You can create arrays using square brackets.

**Important: You have to use numbers between brackets because it represents the index of the array. If you put string or anything else it will not work.**
::: tip Best practice
❌ **Bad**: `movies[]`, `movies[foo]` or `movies[0foo]`

✅ **Good**: `movies[0]`, `movies[1]`, `movies[2]`
:::
```vue
<script lang="ts" setup>
import { Form, Field } from 'vue-formify';

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<Form @submit="sendForm">
		<Field name="social[0]" />
		<Field name="social[1]" />
		<button>Send</button>
	</Form>
</template>
```

Also you can nesting objects and arrays together as much as you like:`foo.bar[0].baz`
```vue
<script lang="ts" setup>
import { Form, Field } from 'vue-formify';

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<Form @submit="sendForm">
		<Field name="social.links[0].url" />
		<Field name="social.links[1].url" />
		<button>Send</button>
	</Form>
</template>
```
