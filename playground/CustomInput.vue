<script setup lang="ts">
const firstName = defineModel<string>();
const emits = defineEmits(['focus']);
</script>

<template>
	<div>
		<input
			type="text"
			v-model="firstName"
			@blur="emits('focus')" />
	</div>
</template>
