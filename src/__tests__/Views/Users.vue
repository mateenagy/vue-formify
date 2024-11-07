<script lang="ts" setup>
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
defineProps<{
	name?: string;
	error?: any;
}>();
const emit = defineEmits(['focus']);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const firstname = defineModel<string>('firstname');
const lastname = defineModel<string>('lastname');
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
		<input
			type="text"
			v-bind="$attrs"
			@focus="emit('focus', 'firstname')"
			v-model="firstname" />
		{{ error?.firstname }}
		<input
			type="text"
			v-bind="$attrs"
			@focus="emit('focus', 'lastname')"
			v-model="lastname" />
	</div>
</template>
