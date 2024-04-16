<p align="center">
  <a href="https://vue-formify.matenagy.me/" target="_blank">
	<img src="https://raw.githubusercontent.com/mateenagy/vue-formify/main/logo.png"  width="250px"/> 
  </a>
  <div align="center">
  </div>
  <div align="center">
	<a href="https://primevue.org/" target="_blank">
		<img src="https://i2.wp.com/www.primefaces.org/wp-content/uploads/2019/12/primevue-logo.png?ssl=1"  width="100px"/>
	</a>
  </div>
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
## ⚠️ Known issues
- **InputOtp**: Basic component not working properly, but with template everything is fine. It is a bug	 in the PrimeVue package.
- **Password**: Bug in the PrimeVue package.
