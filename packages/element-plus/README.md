<p align="center">
  <a href="https://vue-formify.matenagy.me/" target="_blank">
	<img src="https://raw.githubusercontent.com/mateenagy/vue-formify/main/logo.png"  width="250px"/> 
  </a>
  <div align="center">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
  </div>
  <div align="center">
	<a href="https://vue-formify.matenagy.me/" target="_blank">
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
