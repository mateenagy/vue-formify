import { forms } from '@/utils/store';
import { EventEmitter, getValueByPath, mergeDeep, stringToObject } from '@/utils/utils';
import { inject, onBeforeUpdate, reactive, watch } from 'vue';

export const useSimpleField = (props: Record<string, any>) => {
	const formData = inject('formData', Object.create({}));
	const defaultValue = JSON.stringify({
		value: (forms[formData.uid].initialValues && getValueByPath(forms[formData.uid].initialValues, props.name)) ?? props.modelValue ?? props.default ?? getValueByPath(forms[formData.uid].values, props.name)?.value ?? '',
		error: undefined,
	});

	const obj = stringToObject(props.name, JSON.parse(defaultValue));
	forms[formData.uid].values = mergeDeep(forms[formData.uid].values, obj);

	const field = reactive({
		name: props.name,
		modelValue: getValueByPath(forms[formData.uid].values, props.name)?.value,
		value: getValueByPath(forms[formData.uid].values, props.name)?.value,
		oninput(evt: any) {
			if (props.ignore) {
				return;
			}
			field.value = evt.target.value;
			field.modelValue = evt.target.value;
			getValueByPath(forms[formData.uid].values, props.name).value = field.modelValue;
		},
		onfocus: () => {
			!props.ignore && (getValueByPath(forms[formData.uid].values, props.name).error = undefined);
		},
	});

	const updateValue = (value: any, key: any = props.name) => {
		getValueByPath(forms[formData.uid].values, key).value = mergeDeep(getValueByPath(forms[formData.uid].values, key).value, value);
	};

	watch(() => getValueByPath(forms[formData.uid].values, props.name)?.value, () => {
		if (props.ignore) {
			return;
		}
		field.value = getValueByPath(forms[formData.uid].values, props.name)?.value;
		field.modelValue = getValueByPath(forms[formData.uid].values, props.name)?.value;
	});

	EventEmitter.on('reset', () => {
		if (field && getValueByPath(forms[formData.uid].values, props.name)) {
			getValueByPath(forms[formData.uid].values, props.name).value = JSON.parse(defaultValue).value;
			field.value = getValueByPath(forms[formData.uid].values, props.name)?.value;
			field.modelValue = getValueByPath(forms[formData.uid].values, props.name)?.value;
		}
	});

	onBeforeUpdate(() => {
		field.value = getValueByPath(forms[formData.uid].values, props.name)?.value;
		field.modelValue = getValueByPath(forms[formData.uid].values, props.name)?.value;
	});

	return {
		field,
		updateValue,
	};
};
