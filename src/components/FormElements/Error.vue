<script lang="ts" setup>
import { inject } from 'vue';
import { getValueByPath } from '@/utils/utils';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
defineOptions({
	inheritAttrs: false,
});
defineProps<{
	errorFor: string;
}>();
const form = inject<Record<string, any>>('formData', Object.create({}));
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
			:error="getValueByPath(form, errorFor)?.error">
			<small
				v-bind="$attrs">{{ getValueByPath(form, errorFor)?.error }}</small>
		</slot>
	</div>
</template>
