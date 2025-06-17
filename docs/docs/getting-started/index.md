# Getting started
## Installation
Install the package with a package manager you like:
::: code-group
```sh [bun]
bun i vue-formify
```
```sh [npm]
npm i vue-formify
```
```sh [pnpm]
pnpm i vue-formify
```
```sh [yarn]
yarn i vue-formify
```
:::
## Create your first form
::: code-group
```vue
<script lang="ts" setup>
import { useForm } from 'vue-formify';

type UserData = {
	first_name: string;
	last_name: string;
}

const { Form, Field, handleSubmit } = useForm<UserData>();

const submit = handleSubmit((data) => console.log(data));

</script>
<template>
	<Form @submit="submit">
		<Field name="first_name" />
		<Field name="last_name" />
		<button>Send</button>
	</Form>
</template>
```
:::
## Playground
With this simple example you can add new field and try out autocomplete feature in template.
<iframe src="https://play.vuejs.org/#eNqNVG2P2jAM/itWvwAStKexTRMriL3cSTtNd9Nu+xZpCm2A3JI0SlwOhPjvcxoovW1iq1QptR/bTx7b3SfvrE03tUgmSe4LJy2CF1hbUNyspixBz5IZM1LbyiHsofbipnIaDrB0lYYehY6WZJDLXe8tM8zgzgr47oX7yJHDFPbMACyl8/jDcC0m4NFJsyIsUI0/rYeQpKiMD9VCqSHcSKHKIay5KZV4qBda4hA2XNXCE4/piVN+qjrrDxoqMYtvAgjWje/3SwIOYDqLBLkSDvu3D/d3aWRC92kgQ6hNKZbSCGLQYwx7gwGRDAXyLApG8tAHCm0VR0FfAHkpN1DQ9TxJSDSQUwLXKAn05I2E88iMEPHQugmg+EKo2U2QLeiTZ9HQ+htJILgo/KwuS9qqoSmjUNpViszZ77k/k/b/Tt126L8yL2rEyrTABRqgd2Sd1NztQONoTJeMHciziD5HWyfa0CN0v2/7fMgzApwEzIKCUeqMtKZTnnU6kHvcqXCYHwe3t0a0fpJlRWnSR18KJTcuNQIzY3W2qCqktnM7f5WO09eU0WNWeH92pFqalCxxxtOuBHGANN+OnmSJ6wmMr67sNk4yjciRSDKkVaKIpVxR/crQvjVxYTy0lTR+9xYlDSxLJjFj8HGlqqfbxoauFsOTvViL4udf7I9+G2ws+eIELcOG2tb6kLuVoCEL7uuHO7Glc+vUVVkrQl9wfhW+UnXgGGHvaTGIdgfXsP3UCE4b9M1fb1EYf7pUIBqQhwbPEvpzfLhw9TPdcfqyiSNFScXY0JGmnjzXMTqeJ+n8nSLpi2PQQc9fpFfpmzgIHXMqPIWxpOVz+AWcrcYH" />
