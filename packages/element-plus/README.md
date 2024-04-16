<p align="center">
  <a href="https://vue-formify.matenagy.me/" target="_blank">
	<img src="https://raw.githubusercontent.com/mateenagy/vue-formify/main/logo.png"  width="250px"/> 
  </a>
  <div align="center">
  </div>
  <div align="center">
	<a href="https://element-plus.org" target="_blank">
		<img src="https://element-plus.org/images/element-plus-logo.svg"  width="250px"/>
	</a>
  </div>
</p>
<p align="center" style="font-size: 20px">VueFormify Element Plus component integration</p>

## 📦 Install
```
npm i @vue-formify/element-plus
```
## 💻 Usage
```vue
<script lang="ts" setup>
import { ElInput } from '@vue-formify/element-plus';

const send = (data: any) => {
	console.log(data);
};
</script>
<template>
<FormifyForm @submit="send">
	<ElInput name="email" />
	<button>Send</button>
</FormifyForm>
</template>
```
