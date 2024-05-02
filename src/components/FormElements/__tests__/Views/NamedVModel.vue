<script lang="ts" setup>
const title = defineModel<string>('title');
</script>
<template>
	<input
		type="text"
		v-model="title" />
</template>
