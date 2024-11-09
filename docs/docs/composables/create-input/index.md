# `createInput` composable
The `createInput` composable is a core part of this package. It allows you to turn custom inputs into `Formify` components, making them compatible with the package.

You can also wrap components from any UI library while maintaining type safety for attributes.

### Basic usage
First, we’ll create a custom component—a simple color picker for demonstration. As you can see, there's nothing additional required beyond standard Vue setup.

`ColorPicker.vue`
```vue
<script lang="ts" setup>
const modelValue = defineModel();
</script>
<template>
	<input type="color" v-model="modelValue" />
</template>
```
All we need to do is pass it through the createInput composable, and it becomes compatible and ready to use.
```ts
const ColorPickerInput = createInput<ComponentProps<typeof ColorPicker>>(ColorPicker);
```
:::info `ComponentProps<typeof Component>` type utility
It helps maintain the original component's props and types, in addition to the props added by createInput.
:::

## Type safe
When using it with the `useForm` composable, we want all the type-safe features for our custom input. To ensure this, we need to pass the same type to define the field as we use for the `useForm` composable.
We do this by adding the type as the sencond type argument
```ts
const ColorPickerInput = createInput<ComponentProps<typeof ColorPicker>, LoginForm>(ColorPicker);
```

## Best practice
If you want to use your custom components throughout your project, I recommend creating a composable to store your custom inputs. Then, pass down the type from there to make it more generic and reusable.
```ts
const useCutomInputs = <T>() => {
	const ColorPickerInput = createInput<ComponentProps<typeof ColorPicker>, T>(ColorPicker);

	return {
		ColorPickerInput
	}
}
```

## Api reference
### Options
| Option      |      Parameter      |        Description
| -------------  | :-------------------- | :-------------------- |
| modelKey      | `string` | Custom model key |
| useModelKeyAsState      | `boolean` | Set `true` if you use custom model key as state so the the form don't use it as a key |
| default      | `any` | default value for the component |
| defaultValueKey      | `any` | You need to set this if you use different `prop` name for default value |
