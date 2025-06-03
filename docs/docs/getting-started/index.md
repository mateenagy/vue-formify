# Getting started
## Installation
Install the package with a package manager you like:
::: code-group
```sh [bun]
bun i vue-formify
```
```sh [npm]
npm i vue-formify
```
```sh [pnpm]
pnpm i vue-formify
```
```sh [yarn]
yarn i vue-formify
```
:::
## Create your first form
::: code-group
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

type UserData = {
	first_name: string;
	last_name: string;
}

const { Form, Field, handleSubmit } = useForm<UserData>();

const submit = handleSubmit((data) => console.log(data));

</script>
<template>
	<Form @submit="submit">
		<Field name="first_name" />
		<Field name="last_name" />
		<button>Send</button>
	</Form>
</template>
```
:::
<!-- ## Playground
<iframe src="https://play.vuejs.org/#eNp9Ul1P2zAU/StXfqGVQqJtSJO6tGIfII0HmNbtzdJkEic1OI5lX7Oiqv+da4eG8CHy5Nxz7HN8jnfsq7X5XZBswUpfOWURtDDtkjP0nIGXGOyKG9XZ3iHsIHh53rsO9tC4voMj2nrc0EA190dfuOEG762Ev166HwIFLGFHQ2yU8/jPiE4uwKNTpo1c1OL1dB8PqXrjo1qUyuBcSV1nsBGm1nIdrjuFpL88eCkPaqvZPFkYdvuBuHy2bzariTiH5QqElg5nF+ury3wQpyskNAMTtM7gZD4fziuLIRnKoUTZWS1Q0ppjmaI4HZQosmHBWQIjHI1DvCCBTxlQrsWblDGPKeM6IPZmtZamLovHnyReRPXoqRhNsYwNTR13wuY3vjfUKzUAwB8BKnUROwH6OJu0F+ecbRCtXxRFMPa2zau+KyaU0w/5x/xzUSuP03EuPUlxFg+l9vZkAj110Kj2hQU6zyqK/cqioo6eWRFa9/8v0gxdkNlhXm1kdfvG/MZvB8u/nKT+7yizEUPhWkk9RPhsfSm3tB7Brq+DJvY74G/pex2ix4H2LcQX5Ca85PZnSpRezh9/tkVp/OFS0WhKI/FTzN/fufqT3U/5yZji/gE0tTvc" /> -->
