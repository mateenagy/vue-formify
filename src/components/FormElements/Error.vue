<script lang="ts" setup>
import { inject } from 'vue';
import { PluginOptions } from '..';
import { STORE } from '@/store/store';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
defineOptions({
	inheritAttrs: false,
});
const props = defineProps<{
	errorFor: string;
}>();
const { formName }: any = inject('form');
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
		<span
			:class="(config as any)?.globalErrorCSSClass"
			v-bind="$attrs">{{ STORE.value?.[formName][props.errorFor]?.error }}</span>
	</div>
</template>
