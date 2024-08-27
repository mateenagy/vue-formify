<script lang="ts" setup>
import { inject } from 'vue';
import { getValueByPath } from '@/utils/utils';
import { forms } from '@/utils/store';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
defineOptions({
	inheritAttrs: false,
});
defineProps<{
	errorFor: string;
}>();
defineSlots<{
	error(props: {error?: any}): any;
}>();
const { uid } = inject('formData', Object.create({}));
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
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
		<slot
			name="error"
			:error="getValueByPath(forms[uid].values, errorFor)?.error">
			<small
				v-bind="$attrs">{{ getValueByPath(forms[uid].values, errorFor)?.error }}</small>
		</slot>
	</div>
</template>
