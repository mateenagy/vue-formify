# useForm composable
`useForm<T>` composable allow you to create **Type-safe** forms with autocompletion feature. 

You can also use schema validators like `Zod`, `Valibot`, or `ArkType` and infer the types from there.

## Usage
For basic usage you have to define the components and functions from the `useForm` composable. It gives you autocompletion for `name` attribute on `Field`, `FieldArrray` and `error-for` attribute on `Error` components.

::: tip Initial values types
When you define `initialValues` as option in `useForm` or `:initial-values` property on `Form` component it gives you full type safety.
:::

### Basic
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
      <Form
          @submit="submit"
          v-slot="{ values }">
          <div>
              <Field name="username" />
              <Error error-for="username" />
          </div>
          <div>
              <Field
                  name="password"
                  type="password" />
          </div>
          <div>
              <Field
                  name="stay_loggedin"
                  v-slot="{ field }">
                  <input
                      id="loggedin"
                      type="checkbox"
                      v-bind="field" />
                  <label for="loggedin">Stay logged in</label>
              </Field>
          </div>
          <button>Send</button>
          <button
              type="button"
              @click="reset">
              Reset
          </button>
          <pre>{{ values }}</pre>
      </Form>
  </div>
</template>
```
:::
### API
`useForm()` composable provides several components and functions:

#### Components
| Name      |     Description
| -------------  | :-------------------- |
| Form      | Form element. |
| Field      | Use for create input element. |
| FieldArray      | Use for create input array elements. |
| Error      | Use for create input array elements. |

#### Methods
| Function      |      Parameter      |        Description
| -------------  | :-------------------- | :-------------------- |
| handleSubmit      | `(cb: (data: T) => void) => void` | handleSubmit takes a callback function, which provides the typed data. |
| setError      | `{name: T, message: string}` | Set error message for defined field. `name` is typed and have autocomplete |
| setValue      | `{name: T, value: any}` | Set value for defined field. `name` is typed and have autocomplete |
| setValues      | `Record<T, any>`` | Set values for defined field. arguement object is typed and have autocomplete |
| setInitalValues      | `Record<T, any>` | Set initial values. |
| reset      | `void` | Reset form values. |

#### Variables
| Name      |     Description
| -------------  | :-------------------- |
| isSubmitting      | Form submitting state |
| values      | Form data values |
