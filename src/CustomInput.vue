<script setup lang="ts">
const firstName = defineModel<string>();
</script>

<template>
	<div>
		<input
			type="text"
			v-model="firstName" />
	</div>
</template>
