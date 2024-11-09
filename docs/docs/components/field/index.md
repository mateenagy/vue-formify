# Field
The `<Field />` is a flexible component designed to handle most use cases. By default, it renders an HTML input element.

```vue
<script lang="ts" setup>
import { Form, Field } from 'vue-formify';
</script>

<template>
	<Form>
		<Field name="first_name" />
		<button>Send</button>
	</Form>
</template>
```
::: tip
You can set any other input attributes to this component like `disbaled` or `maxlength` 
:::
## Render inputs
### Select
To use the native `select` input you need to set `as="select"` property and then use it as the native.
##### Simple select
```vue
<template>
    <Form @submit="sendForm">
        <Field name="favourite_fruit" as="select">
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="orange">Orange</option>
        </Field>
    </Form>
</template>
```
##### Multiple select
Add `multiple` attribute for multi select input.
```vue
<template>
    <Form @submit="sendForm">
        <Field name="favourite_fruit" as="select" multiple>
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="orange">Orange</option>
        </Field>
    </Form>
</template>
```


### Basic custom input
You can also wrap your custom input between `Field` component and binding the `field` value to the input.
```vue
<template>
    <Form @submit="sendForm">
        <Field name="favourite_fruit" v-slot={field, error}>
            <label>Email</label>
            <input type="email" v-bind="field" />
            <small>{{ error }}</small>
        </Field>
    </Form>
</template>
```
## Api reference
### Props
| Prop                 |      Description      |
| --------------------- | :----------- |
| name               | Field name |
| default               | Field default value |
| ignore               | Ignore field when extract data |
| trueValue               | Custom true value |
| falseValue               | Custom false value |
| preserve               | Preserve field value when field is unmounted |
| as               | Render field as `input` (default), `select` |

### Slots
| Slot      |      Parameter      |        Description
| -------------  | :-------------------- | :-------------------- |
| default      | `{ field: { value: T }, errors }` | Gives back the field data and errors. |
