<script lang="ts" setup>
import { useSimpleField } from '@/composable/useSimpleField';
import { forms } from '@/utils/store';
import { deleteByPath, EventEmitter, getValueByPath } from '@/utils/utils';
import { nextTick } from 'vue';
import { inject, ref, toValue } from 'vue';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const props = withDefaults(
	defineProps<{
		name: string;
		error?: any;
		ignore?: boolean;
		initialValues?: any[];
		default?: any[];
	}>(),
	{
		error: undefined,
		initialValues: () => [],
		default: () => [],
	},
);
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const fields = ref<any[]>([]);
const { updateValue } = useSimpleField(props);
const { uid } = inject('formData', Object.create({}));
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const add = () => {
	!props.ignore && (getValueByPath(forms[uid].values, props.name).error = undefined);

	fields.value.push({
		id: fields.value.length,
		name: props.name,
	});
};

const remove = (idx: number) => {
	getValueByPath(forms[uid].values, props.name).error = undefined;

	const removedIndex = fields.value.findIndex(field => field.id === idx);
	for (let index = removedIndex + 1; index < fields.value.length; index++) {
		const tmp = JSON.parse(JSON.stringify(getValueByPath(forms[uid].values, `${props.name}[${index}]`)));
		if (getValueByPath(forms[uid].values, `${props.name}[${index - 1}]`)) {
			updateValue({
				[`[${index - 1}]`]: tmp,
			});
		}
	}
	deleteByPath(forms[uid].values, `${fields.value[fields.value.length - 1].name}[${fields.value.length - 1}]`);
	fields.value.splice(-1);
};

const init = () => {
	fields.value = [];
	if (props.initialValues) {
		props.initialValues.forEach(() => {
			fields.value.push({
				id: fields.value.length,
				name: props.name,
			});
		});

		nextTick(() => {
			if (props.initialValues) {
				props.initialValues.forEach((value, idx) => {
					if (typeof value === 'object') {
						Object.keys(value).forEach((key) => {
							updateValue({
								[`[${idx}]`]: {
									[key]: {
										value: value[key],
									},
								},
							});
						});
					} else {
						updateValue({
							[`[${idx}]`]: {
								value,
							},
						});
					}
				});
			}
		});
	}
};

EventEmitter.on('reset', () => {
	init();
});
/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
/*---------------------------------------------
/  WATCHERS
---------------------------------------------*/
/*---------------------------------------------
/  CREATED
---------------------------------------------*/
init();
/*---------------------------------------------
/  HOOKS
---------------------------------------------*/
</script>
<template>
	<div>
		<slot
			:fields="toValue(fields)"
			:add="add"
			:remove="remove"
			:error="error" />
	</div>
</template>
