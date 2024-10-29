# Third party UI components

To use third party library is as easy as create custom inputs (if not easier!). Mostly we only have to use createInput and we are done! 🪄✨

We will go through some example with **Element Plus** and **Radix Vue**.

## Element Plus

As I mentioned above it's easy to use third party UI elements, the only thing we need to do is to wrap it with createInput and your are good to go!

### Element plus Datepicker
```vue
<script lang="ts" setup>
import { ElDatePicker } from 'element-plus';
import { FormifyForm, createInput, ComponentProps } from 'vue-formify';

const DatePicker = createInput<ComponentProps<typeof ElDatePicker>>(ElDatePicker);

const send = (data: any) => {
	console.log('[data]: ', data);
};

</script>
<template>
	<div>
		<label class="mb-2">Datepicker</label>
		<FormifyForm @submit="send">
			<DatePicker name="date" value-format="YYYY-MM-DD" />
			<button class="btn btn-outline d-block mt-3">
				send
			</button>
		</FormifyForm>
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
import { FormifyForm, createInput, ComponentProps } from 'vue-formify';

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
		<FormifyForm @submit="send">
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
		</FormifyForm>
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
import { FormifyForm, createInput, ComponentProps } from 'vue-formify';

const Switch = createInput<ComponentProps<typeof SwitchRoot>>(SwitchRoot, { modelKey: 'checked', defaultValueKey: 'defaultChecked' });

const send = (data: any) => {
	console.log('[data]: ', data);
};
</script>
<template>
	<div>
		<label class="mb-2">Switch</label>
		<FormifyForm @submit="send">
			<Switch name="switch" class="SwitchRoot" :default-checked="false" :default="false">
				<SwitchThumb class="SwitchThumb"></SwitchThumb>
			</Switch>
			<button class="btn btn-outline d-block mt-3">
				send
			</button>
		</FormifyForm>
	</div>
</template>
```
