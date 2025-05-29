<script setup lang="ts">
import { useInput, type InputProps } from '@/main';
import MultiSelect, { MultiSelectProps } from 'primevue/multiselect';
import { ref } from 'vue';
const props = defineProps<InputProps>();
const { inputProps } = useInput<MultiSelectProps>(props, true);

const cities = ref([
	{ name: 'New York', code: 'NY' },
	{ name: 'Rome', code: 'RM' },
	{ name: 'London', code: 'LDN' },
	{ name: 'Istanbul', code: 'IST' },
	{ name: 'Paris', code: 'PRS' },
]);
</script>

<template>
	<div>
		{{ inputProps }}
		<label for="">Custom Input</label>
		<div>
			<MultiSelect
				v-bind="inputProps"
				:options="cities"
				option-label="name"
				option-value="code"
				placeholder="Select a City" />
		</div>
	</div>
</template>
