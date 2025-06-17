# useForm composable
The `useForm<T>` composable enables you to build **type-safe** forms in Vue with full autocompletion support. It works seamlessly with schema validators like `Zod`, `Valibot`, or `ArkType`, allowing you to infer types directly from your validation schema.

## Usage

To get started, import and use the components and functions provided by `useForm`. You'll benefit from autocompletion for the `name` attribute on `Field`, `FieldArray`, and the `error-for` attribute on `Error` components.

::: tip Initial values types
Defining `initialValues` in the `useForm` options or using the `:initial-values` prop on the `Form` component ensures complete type safety for your form data.
:::

### Basic Example

::: code-group
```vue
<script lang="ts" setup>
import { useForm } from './composable/useForm';

type FormData = {
	username: string;
	password: string;
	stay_loggedin: boolean;
}

const {
	Form,
	Field,
	Error,
	reset,
	handleSubmit,
	setError,
} = useForm<FormData>({
	initialValues: {
		stay_loggedin: false,
	},
});

const submit = handleSubmit((data) => {
	console.log('username', data?.username);
	setError('username', 'Username required');
});
</script>
<template>
	<div>
		<Form @submit="submit" v-slot="{ values }">
			<div>
				<Field name="username" />
				<Error error-for="username" />
			</div>
			<div>
				<Field name="password" type="password" />
			</div>
			<div>
				<Field name="stay_loggedin" v-slot="{ field }">
					<input id="loggedin" type="checkbox" v-bind="field" />
					<label for="loggedin">Stay logged in</label>
				</Field>
			</div>
			<button>Send</button>
			<button type="button" @click="reset">Reset</button>
			<pre>{{ values }}</pre>
		</Form>
	</div>
</template>
```
:::

### API Reference

#### Options

| Option              | Type                                     | Description                                                                 |
|---------------------|------------------------------------------|-----------------------------------------------------------------------------|
| initialValues       | `T`                                      | Set initial values.                                                         |
| schema              | `StandardSchemaV1<any, T>`               | Schema definition for validations.                                          |
| name                | `string`                                 | Name of the form.                                                           |
| preserve            | `boolean`                                | Preserve data even though the component is unMounted.                       |
| mode                | `'onChange' \| 'onSubmit'`               | Validation execution mode. <br> (default: `'onSubmit'`)                     |

#### Components

| Name        | Description                              |
|-------------|------------------------------------------|
| Form        | The form wrapper component.              |
| Field       | For creating input elements.             |
| FieldArray  | For managing arrays of input elements.   |
| Error       | For displaying field-specific errors.    |

#### Methods

| Function        | Parameter                                | Description                                                                 |
|-----------------|------------------------------------------|-----------------------------------------------------------------------------|
| handleSubmit    | `(cb: (data: T) => void) => void`        | Handles form submission and provides typed data to the callback.            |
| setError        | `{ name: T, message: string }`           | Sets an error message for a specific field (typed with autocomplete).       |
| setValue        | `{ name: T, value: any }`                | Sets the value for a specific field (typed with autocomplete).              |
| setValues       | `Record<T, any>`                         | Sets multiple field values at once (typed with autocomplete).               |
| setInitialValues| `Record<T, any>`                         | Sets the initial values for the form.                                       |
| reset           | `void`                                   | Resets the form to its initial values.                                      |

#### Variables

| Name          | Description                |
|---------------|----------------------------|
| isSubmitting  | Indicates submit state     |
| values        | Current form data values   |
