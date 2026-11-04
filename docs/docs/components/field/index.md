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
		<Field name="email" v-slot="{ field, error }">
			<label>Email</label>
			<input type="email" v-bind="field" />
			<small>{{ error }}</small>
		</Field>
	</Form>
</template>
```

### Web Components

`as` also renders custom elements, such as components built with Lit. The element needs a `name` and a `value` property and should fire `input` (or `change`) events, like a native input. `Field` sets `value`, `name` and `error` on it and reads `event.target.value`:

```vue
<template>
	<Form @submit="sendForm">
		<Field name="email" as="my-input" type="email" label="E-mail" />
	</Form>
</template>
```

For type checking, the tag must be registered in `HTMLElementTagNameMap`. Lit components and most web component libraries do this already; for one that doesn't, add the declaration yourself:

```ts
declare global {
	interface HTMLElementTagNameMap {
		'my-input': MyInput;
	}
}
```

When you write the tag directly in a template instead, for example `<my-input v-bind="field" />` in the `Field` slot, tell Vue it is a custom element with `compilerOptions.isCustomElement` in the Vue plugin options.

## API Reference

### Props

| Prop        | Description                                             |
|-------------|---------------------------------------------------------|
| name        | Field name                                              |
| default     | Field default value                                     |
| custom      | Set to `true` when wrapping a third-party component     |
| rule        | Field-level schema validation (StandardSchema)          |
| ignore      | Ignore field when extracting data                       |
| trueValue   | Custom true value                                       |
| falseValue  | Custom false value                                      |
| preserve    | Preserve value when field is unmounted                  |
| as          | What to render: `input` (default), `select`, `textarea`, a custom element's tag, or a component |

### Slots

| Slot    | Parameter                                                                                                    | Description                                 |
|---------|-------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| default | `{ field: { value, modelValue, error, isValid, isDirty, isTouched, ...handlers } }`                         | Provides field data, state and validation errors. Bind it with `v-bind="field"`. |

