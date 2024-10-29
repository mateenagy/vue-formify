# createInput composable
<!-- `createInput` composable is the core part of this package. This is where the magic happens. To make any custom component work with this package you can simply pass through this function and you will be ready to go with it. -->
`createInput` is a core part of this package. If you have custom inputs you can turn into a `Formify` component so you can use it with the package.

You can also wrap any UI libraries components keeping type safety for attributes.

It is **easy to use** and **very powerful**.

## Usage
First we create our custom component which is a simple color picker for simplicity. As you can see we don't have to do anything extra beside the the Vue thing.
```vue
<script lang="ts" setup>
const modelValue = defineModel();
</script>
<template>
	<input type="color" v-model="modelValue" />
</template>
```
<!-- Then we pass it to the createInput to do the magic for us. If you use Typescript you can use the `ComponentProps` helper type to preserve the autocompletion for the custom component. -->
The only step we need to do is to use the `createInput` copmosable to make the component work with `<FormifyForm>`. 
```vue
<script lang="ts" setup>
import { FormifyForm, ComponentProps, createInput } from 'vue-formify';
import CustomComponent from './CustomComponent.vue';

const ColorPicker = createInput<ComponentProps<typeof CustomComponent>>(CustomComponent);

const sendForm = (data: any) => {
	console.log(data);
};
</script>
<template>
	<FormifyForm @submit="sendForm">
		<ColorPicker name="color" />
	</FormifyForm>
</template>

<style src="" lang="scss" scoped />
```
::: tip `ComponentProps` to keep attributes autocomplete
`ComponentProps` type helps to keep the component props types beside the props added by `createInput`.
:::
As a **best practice** separate these components to an external file so you can create the input once and use it across your code:
```ts
// my-inputs.ts
import { ComponentProps, createInput } from 'vue-formify';
import CustomComponent from './CustomComponent.vue';

const ColorPicker = createInput<ComponentProps<typeof CustomComponent>>(CustomComponent);

export {
    ColorPicker
}
```
## Api reference
### Options
| Option      |      Parameter      |        Description
| -------------  | :-------------------- | :-------------------- |
| modelKeys      | `string, string[]` | Custom model key/keys |
| useModelKeyAsState      | `boolean` | Set `true` if you use custom model key as state so the the form don't use it as a key |
| default      | `any` | default value for the component |
| defaultValueKey      | `any` | You need to set this if you use different `prop` name for default value |
