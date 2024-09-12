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
		modelValue?: any;
		falseValue?: any;
		as?: 'input' | 'select' | 'div';
	}>(),
	{
		error: undefined,
		modelValue: undefined,
		default: '',
		value: '',
		as: 'input',
		ignore: false,
		trueValue: true,
		falseValue: false,
	},
);
const emits = defineEmits(['update:modelValue']);
defineSlots<{
	default(props: {field?: {value: any; }, error?: any}): any;
}>();
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const { field, getError } = useSimpleField(props, emits);
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
		<template v-if="as === 'div'">
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
