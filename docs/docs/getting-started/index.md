<script setup>
import App from '../../playground/basic/simple/App.vue?raw'
</script>

# Getting started
## Installation
Install the package with a package manager you like:
::: code-group
```sh [bun]
bun i vue-formify
```
```sh [npm]
npm i vue-formify
```
```sh [pnpm]
pnpm i vue-formify
```
```sh [yarn]
yarn add vue-formify
```
:::
## Create your first form
::: code-group
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

type UserData = {
	first_name: string;
	last_name: string;
}

const { Form, Field, handleSubmit } = useForm<UserData>();

const submit = handleSubmit((data) => console.log(data));

</script>
<template>
	<Form @submit="submit">
		<Field name="first_name" />
		<Field name="last_name" />
		<button>Send</button>
	</Form>
</template>
```
:::
## Playground
With this simple example you can add new field and try out autocomplete feature in template.

<Playground :files="{ 'App.vue': App }" />
