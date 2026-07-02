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
import { useForm } from 'vue-formify';

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

| Function        | Parameter                                     | Description                                                                                  |
|-----------------|-----------------------------------------------|----------------------------------------------------------------------------------------------|
| handleSubmit    | `(cb: (data: T) => void \| Promise<any>)`     | Wraps a submit handler and provides the typed form data to the callback.                     |
| setError        | `(name: GetKeys<T>, error: any)`              | Sets an error message for a specific field (typed with autocomplete).                        |
| setValue        | `(name: GetKeys<T>, value: any)`              | Sets the value for a specific field (typed with autocomplete).                               |
| setValues       | `(values: Partial<T>)`                        | Sets multiple field values at once (typed with autocomplete).                                |
| setInitialValues| `(values: Partial<T>)`                        | Sets the initial values for the form.                                                        |
| getFieldState   | `(name: GetKeys<T>) => FieldState`            | Returns `{ value, error, isDirty, isTouched, isValid }` for a single field.                  |
| validate        | `() => Promise<boolean>`                      | Runs the schema against the current values, surfaces errors, and returns whether it is valid.|
| clearErrors     | `(name?: GetKeys<T>)`                         | Clears the error for a single field, or every field's error when called with no argument.    |
| reset           | `(force?: boolean)`                           | Resets the form to its initial values. Pass `true` to clear values and initial values.       |

#### Variables

| Name          | Description                                            |
|---------------|--------------------------------------------------------|
| values        | Current form data values.                              |
| isSubmitting  | `true` while the submit handler is running.            |
| isSubmitted   | `true` once the form has been submitted at least once. |
| submitCount   | Number of submit attempts.                             |
| isDirty       | `true` when any field differs from its initial value.  |
| isTouched     | `true` when any field has been touched.                |
| isValid       | `true` when the form currently has no errors.          |
