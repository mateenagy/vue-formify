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
		as: 'input',
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
const { field, getError } = useSimpleField(props);
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
				:error="getError()" />
		</template>
		<template v-else>
			<component
				:is="props.as"
				v-bind="{ ...$attrs, ...field }">
				<slot :error="getError()" />
			</component>
		</template>
	</div>
</template>
