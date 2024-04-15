<p align="center">
  <a href="https://vue-formify.matenagy.me/" target="_blank">
	<img src="https://raw.githubusercontent.com/mateenagy/vue-formify/main/logo.png"  width="250px"/>
  </a>
</p>
<p align="center" style="font-size: 20px">VueFormify PrimeVue component integration</p>

## 📦 Install
```
npm i @vue-formify/primevue
```
## 💻 Usage
```vue
<script lang="ts" setup>
import { InputText } from '@vue-formify/primevue';

const send = (data: any) => {
	console.log(data);
};
</script>
<template>
<FormifyForm @submit="send">
	<InputText name="email" />
	<button>Send</button>
</FormifyForm>
</template>
```
## 💻 Known issues
- **InputOtp**: basic component not working properly, but with template everything is fine.
- **Password**: Bug in the PrimeVue package.
