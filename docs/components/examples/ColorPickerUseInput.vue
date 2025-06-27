<script setup lang="ts">
import { useInput } from 'vue-formify';
const props = defineProps<{name?: string}>();
const { inputProps } = useInput(props);
</script>

<template>
	<div>
		<label>Pick a color: 	</label>
		<input
			type="color"
			v-bind="inputProps" />
	</div>
</template>
