<script lang="ts" setup>
import MultiSelect from 'primevue/multiselect';
import { useInput, type InputProps } from '@/main';
import { ref } from 'vue';

const props = defineProps<InputProps>();
const { inputProps, getError } = useInput(props, true);
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const cities = ref([
	{ name: 'New York', code: 'NY' },
	{ name: 'Rome', code: 'RM' },
	{ name: 'London', code: 'LDN' },
	{ name: 'Istanbul', code: 'IST' },
	{ name: 'Paris', code: 'PRS' },
]);
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
/*---------------------------------------------
/  WATCHERS
---------------------------------------------*/
/*---------------------------------------------
/  CREATED
---------------------------------------------*/
/*---------------------------------------------
/  HOOKS
---------------------------------------------*/
</script>
<template>
	<MultiSelect
		v-bind="inputProps"
		:options="cities"
		option-label="name"
		option-value="code" />
</template>
