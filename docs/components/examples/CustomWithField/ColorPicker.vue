<script setup lang="ts">
const value = defineModel<string>();
</script>

<template>
	<div>
		<label>Pick a color: </label>
		<input
			type="color"
			v-model="value" />
	</div>
</template>
