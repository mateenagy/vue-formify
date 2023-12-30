<style>
.title {
	font-size: 30px;
	font-weight: bold;
	text-align: center;
	margin-bottom: 10px;
	text-shadow: 0 0 50px rgba(255,255,255, 40%),
				0 0 10px rgba(255,255,255, 50%);
}
span {
	text-shadow: 0 0 50px rgba(66, 184, 131, 50%),
				0 0 10px rgba(66, 184, 131, 80%);
}
.sub-title {
	font-size: 18px;
	font-weight: bold;
	text-align: center;
	margin-bottom: 10px
}

ul {
	list-style: none;
	padding: 0;
}

li {
	position: relative;
	margin-bottom: 0.5rem;
	padding-left: 10px;
	display: flex;
	align-items: center;

	&::before {
		content: '';
		position: absolute;
		width: 5px;
		height: 5px;
		left: 0;
		background-color: #42b883;
		border-radius: 50%;
	}
}
.text-center {
	text-align: center;
}
</style>

<div class="title"><span style="color: #42b883">Vue</span>Formify</div>
<p class="sub-title">Unleash Form-Building Freedom! 🚀</p>

<div class="text-center"><strong>VueFormify</strong> is a form creation package that liberates developers to create forms with freedom! VueFormify is not just a form package; it's your ticket to form-building autonomy, empowering you to craft both simple and complex forms with a bare yet robust skeleton.</div>

## Features
<ul>
	<li>Auto collect form values</li>
	<li>Nested Objects and Arrays</li>
	<li>You can access values with v-model if you want</li>
	<li>Easy to create custom component</li>
	<li>Easy to integrate any third party UI library</li>
	<li>Using JSON or FormData</li>
	<li>4 basic input component: Input, Checkbox, Radio, Error</li>
	<li>No styling: use anything you want from Bootstrap to Tailwind</li>
	<li>Form reset</li>
	<li>Only 3kb (gzipped)</li>
</ul>

## 📚 Documentation
Read more in the <a href="https://vue-formify.matenagy.me/" target="_blank">documentation</a>
## 📦 Install
```
npm i vue-formify
```
## 💻 Usage
```vue
<script lang="ts" setup>
import { FormifyForm, FormifyInput } from 'vue-formify';

type SimpleForm = {
	first_name: string;
	last_name: string;
}
const sendForm = (data: SimpleForm) => {
	console.log('first_name', data.first_name);
	console.log('last_name', data.last_name);
};

</script>

<template>
	<FormifyForm @submit="sendForm">
		<FormifyInput name="first_name" />
		<FormifyInput name="last_name" />
		<button>Send</button>
	</FormifyForm>
</template>
```
