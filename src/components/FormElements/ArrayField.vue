<script lang="ts" setup>
import { deleteByPath, EventEmitter, getValueByPath } from '@/utils/utils';
import { nextTick } from 'vue';
import { inject, Ref, ref, toValue } from 'vue';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
const props = defineProps<{
	name: string;
	error?: any;
	initialValues?: any[];
}>();
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const fields = ref<any[]>([]);
const form = inject<Ref<Record<string, any>>>('form', Object.create({}));
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const add = () => {
	getValueByPath(form.value, props.name).error = undefined;
	
	fields.value.push({
		id: fields.value.length,
	});
};

const remove = (idx: number) => {
	getValueByPath(form.value, props.name).error = undefined;
	
	const removedIndex = fields.value.findIndex(field => field.id === idx);
	for (let index = removedIndex + 1; index < fields.value.length; index++) {
		const tmp = JSON.parse(JSON.stringify(getValueByPath(form.value, `${props.name}[${index}]`)));
		if (getValueByPath(form.value, `${props.name}[${index - 1}]`)) {
			getValueByPath(form.value, `${props.name}`).value[`[${index - 1}]`] = tmp;
		}
	}
	deleteByPath(form.value, `${fields.value[fields.value.length - 1].name}[${fields.value.length - 1}]`);
	fields.value.splice(-1);
};

const init = () => {
	fields.value = [];
	if (props.initialValues) {
		props.initialValues.forEach(() => {
			fields.value.push({
				id: fields.value.length,
			});
		});

		nextTick(() => {
			if (props.initialValues) {
				props.initialValues.forEach((value, idx) => {
					if (typeof value === 'object') {
						Object.keys(value).forEach((key) => {
							getValueByPath(form.value, `${props.name}`).value[`[${idx}]`][key].value = value[key];
						});
					} else {
						getValueByPath(form.value, `${props.name}`).value[`[${idx}]`].value = value;
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
