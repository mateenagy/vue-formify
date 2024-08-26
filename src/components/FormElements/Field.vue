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
		value?: any;
		trueValue?: any;
		falseValue?: any;
		as?: 'input' | 'select' | undefined;
	}>(),
	{
		error: undefined,
		default: '',
		value: '',
		ignore: false,
		as: undefined,
		trueValue: true,
		falseValue: false,
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
				v-bind="{ ...$attrs, ...field }">
				<slot />
			</component>
		</template>
	</div>
</template>
