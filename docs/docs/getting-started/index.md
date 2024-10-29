# Getting started
Install the package with a package manager like `npm` or `bun`:
```bash
npm i vue-formify
```
## Create your first form
```vue
<script lang="ts" setup>
import { FormifyForm, Field } from 'vue-formify';

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<FormifyForm @submit="sendForm">
		<Field name="first_name" />
		<Field name="last_name" />
		<button>Send</button>
	</FormifyForm>
</template>
```
