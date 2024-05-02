<script lang="ts" setup>
const value = defineModel<string>();
</script>
<template>
	<input
		type="color"
		v-model="value" />
</template>
