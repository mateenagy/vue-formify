# Third party UI components
To use third-party library components, follow the same process as for custom components. Simply pass the component through the `createInput` composable, and it will be ready to use.

## PrimeVue example
### InputText 
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';
import _InputText from 'primevue/inputtext';

const { Form, Field, handleSubmit } = useForm();
const InputText = createInput<ComponentProps<typeof _InputText>>(_InputText);

const sendForm = handleSubmit((data) => console.log(data));

</script>
<template>
	<Form @submit="sendForm">
		<InputText name="first_name" />
	</Form>
</template>
```

## Complex inputs with RadixVue
Radix vue have multiple components with complex setup. They have multi components inputs, and they use named `v-model` like `v-model:checked`.

In this example we will look into the `Switch` input which have both complex case.

The Switch component have two main component: `SwitchRoot` and `SwitchThumb`.

**To make it work we always should wrap only the root component with `createInput`.**

```ts
import { SwitchRoot, SwitchThumb } from 'radix-vue';
const Switch = createInput<ComponentProps<typeof SwitchRoot>>(SwitchRoot);
```
Now we have to use the `Switch` component instead of `SwitchRoot`.

But we still have some issue:
- Since this component uses `v-model:checked`, we need to capture those values instead of using `v-model`.
- Due to how `VueFormify` handles naming, it will extract checked as the name instead of using the `name` prop from `Field`.
- The last issue is the default value. In this example, the default value comes from the `SwitchRoot` component's `defaultChecked` property, so we need to handle that.

Thankfully, `createInput` provides some options to solve these issues. The options are straightforward to use

Here is our final component:
```ts
const Switch = createInput<ComponentProps<typeof SwitchRoot>>(
	SwitchRoot,
	{ 
		modelKey: 'checked',
		useModelKeyAsState: true,
		defaultValueKey: 'defaultChecked'
	}
);
```
<!-- # Third party UI components

To use third party library is as easy as create custom inputs (if not easier!). Mostly we only have to use createInput and we are done! 🪄✨

We will go through some example with **Element Plus** and **Radix Vue**.

## Element Plus

As I mentioned above it's easy to use third party UI elements, the only thing we need to do is to wrap it with createInput and your are good to go!

### Element plus Datepicker
```vue
<script lang="ts" setup>
import { ElDatePicker } from 'element-plus';
import { Form, createInput, ComponentProps } from 'vue-formify';

const DatePicker = createInput<ComponentProps<typeof ElDatePicker>>(ElDatePicker);

const send = (data: any) => {
	console.log('[data]: ', data);
};

</script>
<template>
	<div>
		<label class="mb-2">Datepicker</label>
		<Form @submit="send">
			<DatePicker name="date" value-format="YYYY-MM-DD" />
			<button class="btn btn-outline d-block mt-3">
				send
			</button>
		</Form>
	</div>
</template>
```
### Element plus Select
You will have the question: **What about slots?** The answer is it handled without any issue! Not only default but named slots are working as well.

Look at this example. The Element Plus **select component** consists of two parts the **ElSelect** component and **ElOption**. To make it work we only need to put the **ElSelect** to the **createInput** composable because we only need to transform component which handle the v-model like **ElSelect** in this case.

So after the transform we can use the **ElOption** without transforming
```vue
<script lang="ts" setup>
import { ElSelect, ElOption } from 'element-plus';
import { ref } from 'vue';
import { Form, createInput, ComponentProps } from 'vue-formify';

const Select = createInput<ComponentProps<typeof ElSelect>>(ElSelect);

const options = ref([
	{
		label: 'Foo',
		value: 'foo',
	},
	{
		label: 'Bar',
		value: 'bar',
	},
	{
		label: 'Baz',
		value: 'baz',
	},
]);

const send = (data: any) => {
	console.log('[data]: ', data);
};
</script>
<template>
	<div>
		<label class="mb-2">Select</label>
		<Form @submit="send">
			<Select name="select">
				<ElOption 
					v-for="option of options"
					:key="option.value"
					:label="option.label"
					:value="option.value" />
			</Select>
			<button class="btn btn-outline d-block mt-3">
				send
			</button>
		</Form>
	</div>
</template>
```

## Radix Vue
### Switch
In this example we use Radix Vue. Most of the Radix Vue components use named v-model instead of basic modelValue. In this case we use the modelKey option where we defined the the v-model key.

The **Switch** component using **v-model:checked** so we add `{ modelKey: 'checked' }` and we are finished!
```vue
<script lang="ts" setup>
import { SwitchRoot, SwitchThumb } from 'radix-vue';
import { Form, createInput, ComponentProps } from 'vue-formify';

const Switch = createInput<ComponentProps<typeof SwitchRoot>>(SwitchRoot, { modelKey: 'checked', defaultValueKey: 'defaultChecked' });

const send = (data: any) => {
	console.log('[data]: ', data);
};
</script>
<template>
	<div>
		<label class="mb-2">Switch</label>
		<Form @submit="send">
			<Switch name="switch" class="SwitchRoot" :default-checked="false" :default="false">
				<SwitchThumb class="SwitchThumb"></SwitchThumb>
			</Switch>
			<button class="btn btn-outline d-block mt-3">
				send
			</button>
		</Form>
	</div>
</template>
``` -->
