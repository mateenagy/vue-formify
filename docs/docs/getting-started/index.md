# Getting started
## Installation
Install the package with a package manager like `npm` or `bun`:
```bash
npm i vue-formify
```
## Create your first form
### With Type safe
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

type UserData = {
	first_name: string;
	last_name: string;
}

const { Form, Field, handleSubmit } = useForm<UserData>();

const sendForm = handleSubmit((data) => console.log(data));

</script>
<template>
	<Form @submit="sendForm">
		<Field name="first_name" />
		<Field name="last_name" />
		<button>Send</button>
	</Form>
</template>
```
### Without type safe
```vue
<script lang="ts" setup>
import { Form, Field } from 'vue-formify';

const sendForm = (data) => {
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
