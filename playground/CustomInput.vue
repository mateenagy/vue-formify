<script setup lang="ts">
import { useInput, type InputProps } from '@/main';

const props = defineProps<InputProps>();
const { inputProps, getError } = useInput(props);

</script>

<template>
	<div>
		<label for="">Custom Input</label>
		<div>
			<input
				v-bind="inputProps" />
			<small class="color-red">{{ getError() }}</small>
		</div>
	</div>
</template>
