<script lang="ts" setup>
import { ref } from 'vue';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const firstname = ref<string>('');
const lastname = ref<string>('');
defineModel({
	set: () => {
		return {
			firstname: firstname.value,
			lastname: lastname.value,
		}
	},
	get: () => {
		return {
			firstname: firstname.value,
			lastname: lastname.value,
		}
	}
})
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
	<div>
		<input type="text" v-model="firstname">
		<input type="text" v-model="lastname">
	</div>
</template>
