# FieldArray

The `<FieldArray>` is a component for create repeatable array fields.

### Basic usage
```vue
<script lang="ts" setup>
import { Form, FieldArray, Field } from 'vue-formify';

const sendForm = (data) => {
	console.log(data);
};

</script>
<template>
	<Form @submit="sendForm">
        <FieldArray name="links" v-slot="{fields, add, remove}">
            <fieldset v-for="(field, index) of fields" :key="field.id">
                <Field :name="`links[${index}]`" />
                <button type="button" @click="remove(index)">Remove</button>
            </fieldset>
            <button type="button" @click="add">Add</button>
        </FieldArray>
		<button>Send</button>
	</Form>
</template>
```
::: tip Best practice
When you using `v-for` on the `fields` always use the `field.id` in the `:key` attribute and use the `index` as array index. Otherwise it won't works as expected.
:::
## Api reference
### Props
| Prop                 |      Description      |
| --------------------- | :----------- |
| name               | Field name |
| initial-values               | Field default value |
| ignore               | Ignore field when extract data |
| preserve               | Preserve field value when field is unmounted |

### Slots
| Slot      |      Parameter      |        Description
| -------------  | :-------------------- | :-------------------- |
| default      | `{ fields, add, remove, error }` | `fields`: Generated fields for render <br /> `error`: FieldArray error value <br /> `add`: Function for add new field <br /> `remove`: Remove field from array |
