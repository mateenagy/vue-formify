<!-- eslint-disable func-call-spacing -->
<script lang="ts" setup>

defineProps<{
	error?: any;
	onFocus?: (a: string) => void;
}>();


const firstname = defineModel<string>('firstname');
const lastname = defineModel<string>('lastname');
</script>
<template>
	<div>
		<input
			v-model="firstname"
			@focus="onFocus?.('firstname')" />
		{{ error.firstname }}
		<input
			v-model="lastname"
			@focus="onFocus?.('lastname')" />
		{{ error.lastname }}
	</div>
</template>
