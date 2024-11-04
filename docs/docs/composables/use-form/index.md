# useForm composable
`useForm<T>` composable allow you to create **Type-safe** forms with autocompletion feature. You can also use infered type from validation schema packages like `yup`, `zod`, `valibot` `joi`.

## Usage
For basic usage you have to define the components and functions from the `useForm` composable. It gives you autocompletion for `name` attribute on `Field`, `FieldArrray` and `error-for` attribute on `Error` components.

When you define `initals` as option in `useForm` it gives you full type safety.

:::info Using `:initial-values` attribute on `Form`
When you set the `:initial-values` attribute on `Form` component it will only help with autocompletion
:::
### Basic
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

:::warning Do not mix composable components with directly imported comoponents
If you using the composable you must import the other components from there too except components created with `createInput`.

❌ Bad:
```vue
<script lang="ts" setup>
import { useForm, FormifyForm } from './composable/useForm';

const {
  Field,
} = useForm();
...
</script>
<template>
    <FormifyForm
        @submit="submit">
        <Field name="username" />
    </FormifyForm>
</template>
```
✅ Good:
```vue
<script lang="ts" setup>
import { useForm } from './composable/useForm';

const {
  Form
  Field,
} = useForm();
...
</script>
<template>
    <Form
        @submit="submit">
        <Field name="username" />
    </Form>
</template>
```
:::
### Type safety with `createInput` composable
You can define it's type as the second parameter of the `createInput` type:
```vue
<script lang="ts" setup>
import { createInput, ComponentProps } from 'vue-formify';
import Input from '@/components/Input.vue';
type LoginType = {
    email: string,
    password: string
}

const InputField = createInput<ComponentProps<typeof Input>, LoginType>(Input);
</script>
```
This works fine but there is a limitation because you set the type but this is not so dynamic when you want to use this component somewhere else with different type.

The solution for this is to **create a composable** where you can pass type and the return the component or components.

```ts
import { createInput, ComponentProps } from 'vue-formify';
import Input from '@/components/Input.vue';

export const useMyCustomInputs = <T>() => {
    const InputField = createInput<ComponentProps<typeof Input>, T>(Input);

    return {
        InputField
    }
}
```
Now you can import this composable in your component and set the type.
```vue
<script lang="ts" setup>
import { useMyCustomInputs } from '@/composables/myCustomInputs.ts';
type LoginType = {
    email: string,
    password: string
}

const { InputField } = useMyCustomInputs<LoginType>();
</script>
<template>
	<Form
      ref="form"
      @submit="send">
        <InputField name="email" />
        //       ^ will show autocomplete with 'email' | 'password'
        <button>Send</button>
  </Form>
</template>
```
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
| setInitalValues      | `Record<T, any>` | Set initial values. |
| reset      | `void` | Reset form values. |

#### Variables
| Name      |     Description
| -------------  | :-------------------- |
| isSubmitting      | Form submitting state |
