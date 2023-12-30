<script lang="ts" setup>
import { inject } from 'vue';
import { PluginOptions } from '..';
import { STORE } from '@/store/store';
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
const { formUID }: any = inject('form');
const config: PluginOptions | undefined = inject('config', undefined);
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
			:error="getValueByPath(STORE[formUID], errorFor)?.error">
			<small
				:class="(config as any)?.globalErrorCSSClass"
				v-bind="$attrs">{{ getValueByPath(STORE[formUID], errorFor)?.error }}</small>
		</slot>
	</div>
</template>
