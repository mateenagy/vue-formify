<script lang="ts" setup>
import { inject, Ref } from 'vue';
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
const form = inject<Ref<Record<string, any>>>('form', Object.create({}));
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
