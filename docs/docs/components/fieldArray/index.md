# FieldArray

The `<FieldArray>` component lets you create repeatable array fields in your forms.

## Basic Usage

::: code-group
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

const { Form, FieldArray, handleSubmit } = useForm();

const sendForm = handleSubmit((data) => {
	console.log(data);
});
</script>

<template>
	<Form @submit="sendForm">
		<FieldArray name="links" v-slot="{ fields, add, remove }">
			<fieldset v-for="(field, index) in fields" :key="field.id">
				<Field :name="`links[${index}]`" />
				<button type="button" @click="remove(index)">Remove</button>
			</fieldset>
			<button type="button" @click="add">Add</button>
		</FieldArray>
		<button>Send</button>
	</Form>
</template>
```
:::

::: warning Important note
When using `v-for` on `fields`, always use `field.id` for the `:key` attribute and use `index` as the array index. Otherwise, it may not work as expected.
:::

## API Reference

### Props

| Prop      | Description                                      |
|-----------|--------------------------------------------------|
| name      | Field name                                       |
| schema    | Schema validation                                |
| ignore    | Ignore field when extracting data                |
| preserve  | Preserve field value when the field is unmounted |

### Slots

| Slot    | Parameter                          | Description                                                                                                  |
|---------|------------------------------------|--------------------------------------------------------------------------------------------------------------|
| default | `{ fields, add, remove, error }`   | `fields`: Generated fields for rendering<br/>`error`: FieldArray error value<br/>`add`: Add new field<br/>`remove`: Remove field from array |
