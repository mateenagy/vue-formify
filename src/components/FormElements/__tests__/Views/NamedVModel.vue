<script lang="ts" setup>
defineProps<{
	error?: string;
	onFocus?: (a: string) => void;
}>();
const title = defineModel<string>('title');
</script>
<template>
	<div>
		<input
			type="text"
			v-bind="$attrs"
			@focus="onFocus?.('title')"
			v-model="title" />
		<p>{{ error }}</p>
	</div>
</template>
