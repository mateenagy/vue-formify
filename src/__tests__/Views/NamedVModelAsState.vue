<script lang="ts" setup>
defineProps<{
	name?: string;
	error?: string;
	onFocus?: (a: string) => void;
}>();
const checked = defineModel<boolean>('checked', {
	default: true,
});
</script>
<template>
	<div>
		<input
			type="checkbox"
			v-bind="$attrs"
			@focus="onFocus?.('checked')"
			v-model="checked" />
		<p>{{ error }}</p>
	</div>
</template>
