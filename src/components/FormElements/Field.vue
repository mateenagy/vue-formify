<script lang="ts" setup>
import { useSimpleField } from '@/composable/useSimpleField';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const props = withDefaults(
	defineProps<{
		name: string;
		error?: any;
		default?: any;
		ignore?: any;
		as?: 'input' | 'select' | undefined;
	}>(),
	{
		error: undefined,
		default: '',
		ignore: false,
		as: undefined,
	},
);
defineSlots<{
	default(props: {field?: any, error?: any}): any;
}>();
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const { field } = useSimpleField(props);
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
		<template v-if="!as">
			<slot
				:field="field"
				:error="error" />
		</template>
		<template v-else>
			<component
				:is="props.as"
				v-bind="field">
				<slot />
			</component>
		</template>
	</div>
</template>
