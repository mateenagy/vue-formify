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
<p align="center" style="font-size: 20px">VueFormify Ionic component integration</p>

## 📦 Install
```
npm i @vue-formify/ionic-vue
```
## 💻 Usage
```vue
<script lang="ts" setup>
import { IonInput } from '@vue-formify/ionic-vue';

const send = (data: any) => {
	console.log(data);
};
</script>
<template>
<FormifyForm @submit="send">
	<IonInput name="email" />
	<button>Send</button>
</FormifyForm>
</template>
```
