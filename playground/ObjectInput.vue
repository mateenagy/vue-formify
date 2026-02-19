<script lang="ts" setup>
import { computed } from 'vue';
import { useInput, type InputProps } from '@/main';
import Slider from 'primevue/slider';

const props = defineProps<InputProps>();
const { value, setValue } = useInput(props);

const minMax = computed({
	get: () => [value.value.min, value.value.max],
	set: (val) => setValue({min: val[0], max: val[1]}),
})
</script>
<template>
	<div>
		<Slider v-model="minMax" range />
		<!-- <input type="range" v-model.number="min" />
		<input type="range" v-model.number="max" /> -->
	</div>
</template>
