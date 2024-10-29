# Field

The `<Field />` component is a flexible component which helps you handle most usecases. By default it renders  an HTML `input` element.

```vue
<script lang="ts" setup>
import { FormifyForm, Field } from 'vue-formify';
</script>

<template>
	<FormifyForm>
		<Field name="first_name" />
		<button>Send</button>
	</FormifyForm>
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
    <FormifyForm @submit="sendForm">
        <Field name="favourite_fruit" as="select">
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="orange">Orange</option>
        </Field>
    </FormifyForm>
</template>
```
##### Multiple select
Add `multiple` attribute for multi select input.
```vue
<template>
    <FormifyForm @submit="sendForm">
        <Field name="favourite_fruit" as="select" multiple>
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="orange">Orange</option>
        </Field>
    </FormifyForm>
</template>
```


### Basic custom input
You can also wrap your custom input between `Field` component and binding the `field` value to the input.
```vue
<template>
    <FormifyForm @submit="sendForm">
        <Field name="favourite_fruit" v-slot={field, error}>
            <label>Email</label>
            <input type="email" v-bind="field" />
            <small>{{ error }}</small>
        </Field>
    </FormifyForm>
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
| as               | Render field as `input` (default), `select` |

### Slots
| Slot      |      Parameter      |        Description
| -------------  | :-------------------- | :-------------------- |
| default      | `{ field: { value: any }, errors }` | Gives back the field data and errors. |
