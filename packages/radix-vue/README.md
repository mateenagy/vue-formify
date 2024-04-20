<p align="center">
  <a href="https://vue-formify.matenagy.me/" target="_blank">
	<img src="https://raw.githubusercontent.com/mateenagy/vue-formify/main/logo.png"  width="250px"/> 
  </a>
  <div align="center">
  </div>
  <div align="center">
	<a href="https://element-plus.org" target="_blank">
		<img src="https://seeklogo.com/images/I/ionic-logo-F9D2A52359-seeklogo.com.png"  width="80px"/>
	</a>
  </div>
</p>
<p align="center" style="font-size: 20px">VueFormify Radix Vue component integration. </p>

## 📦 Install
```
npm i @vue-formify/radix-vue
```
## 💻 Usage
You only need to import the root components from this package. Any other part of the components need to be imported from `radix-vue`.

```vue
<script lang="ts" setup>
import { SwitchRoot } from '@vue-formify/ionic-vue';
import { SwitchThumb } from 'radix-vue'

const send = (data: any) => {
	console.log(data);
};
</script>
<template>
	<FormifyForm @submit="send">
		<SwitchRoot
			id="airplane-mode"
			name="airplane"
			class="SwitchRoot">
			<SwitchThumb class="SwitchThumb"/>
		</SwitchRoot>
		<button>Send</button>
	</FormifyForm>
</template>
```

### Available components
- CheckboxRoot
- ComboboxRoot
- PinInputRoot
- RadioGroupRoot
- SelectRoot
- SwitchRoot
- TagsInputRoot
- Toggle
