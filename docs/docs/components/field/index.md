# Field

The `<Field>` component is a versatile input handler in `vue-formify`. By default, it renders a standard HTML input, but it can be customized for various use cases.

## Basic Usage

```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

const { Form, Field } = useForm();
</script>

<template>
	<Form>
		<Field name="first_name" />
		<button>Send</button>
	</Form>
</template>
```

> **Tip:**  
> You can pass any standard input attributes (like `disabled` or `maxlength`) to the `<Field>` component.

## Rendering Different Inputs

### Select Input

To render a native `<select>`, set the `as="select"` prop:

#### Simple Select

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

#### Multiple Select

Add the `multiple` attribute for multi-select:

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

### Custom Inputs

You can use custom inputs by leveraging the `Field` slot and binding the `field` object:

```vue
<template>
	<Form @submit="sendForm">
		<Field name="favourite_fruit" v-slot="{ field, error }">
			<label>Email</label>
			<input type="email" v-bind="field" />
			<small>{{ error }}</small>
		</Field>
	</Form>
</template>
```

### Using `Field` Outside `Form`

Fields can also be used independently of a `Form`:

```vue
<template>
	<Field name="search" />
</template>
```

## API Reference

### Props

| Prop        | Description                                              |
|-------------|---------------------------------------------------------|
| name        | Field name                                              |
| default     | Field default value                                     |
| schema      | Schema validation                                       |
| ignore      | Ignore field when extracting data                       |
| trueValue   | Custom true value                                       |
| falseValue  | Custom false value                                      |
| preserve    | Preserve value when field is unmounted                  |
| as          | Render as `input` (default) or `select`                 |

### Slots

| Slot    | Parameter                                                                                                    | Description                                 |
|---------|-------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| default | `{ field: { value, modelValue, updateModelValue, isValid, error } }`                                        | Provides field data and validation errors   |

