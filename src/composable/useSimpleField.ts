import { forms } from '@/utils/store';
import { deleteByPath, EventEmitter, getValueByPath, mergeDeep, stringToObject } from '@/utils/utils';
import { inject, onBeforeUnmount, onBeforeUpdate, reactive, watch } from 'vue';

export const useSimpleField = (props: Record<string, any>) => {
	const formData = inject('formData', Object.create({}));
	const defaultValue = {
		value: (forms[formData.uid].initialValues && getValueByPath(forms[formData.uid].initialValues, props.name)) ?? props.modelValue ?? props.default ?? getValueByPath(forms[formData.uid].values, props.name)?.value ?? '',
		error: undefined,
	};

	const obj = stringToObject(props.name, defaultValue);
	forms[formData.uid].values = mergeDeep(forms[formData.uid].values, obj);

	const field = reactive({
		name: props.name,
		modelValue: getValueByPath(forms[formData.uid].values, props.name)?.value,
		value: getValueByPath(forms[formData.uid].values, props.name)?.value,
		oninput(evt: any) {
			if (props.ignore) {
				return;
			}

			field.value = getValueByInputType(evt.target);
			field.modelValue = field.value;
			getValueByPath(forms[formData.uid].values, props.name).value = field.modelValue;
			EventEmitter.emit('value-change', formData.uid);
		},
		'onUpdate:modelValue': (val: any) => {
			if (!props.ignore) {
				getValueByPath(forms[formData.uid].values, props.name).value = val;
				field.modelValue = getValueByPath(forms[formData.uid].values, props.name).value;
				EventEmitter.emit('value-change', formData.uid);
			}
		},
		onfocus: () => {
			!props.ignore && (getValueByPath(forms[formData.uid].values, props.name).error = undefined);
		},
	});

	const updateValue = (value: any, key: any = props.name) => {
		getValueByPath(forms[formData.uid].values, key).value = mergeDeep(getValueByPath(forms[formData.uid].values, key).value, value);
	};

	const getValueByInputType = (target: HTMLInputElement) => {
		if (target.type === 'checkbox') {
			return getCheckValue(target.checked);
		}

		if (target.type === 'radio') {
			return props.value;
		}

		return target.value;
	};

	const getCheckValue = (checked: boolean) => {
		return checked ? props.trueValue : props.falseValue;
	};

	const getError = () => {
		return getValueByPath(forms[formData.uid].values, props.name).error;
	};

	watch(() => getValueByPath(forms[formData.uid].values, props.name)?.value, () => {
		if (props.ignore) {
			return;
		}
		field.value = getValueByPath(forms[formData.uid].values, props.name)?.value;
		field.modelValue = getValueByPath(forms[formData.uid].values, props.name)?.value;
	});

	watch(() => [props.name, props.ignore], (curr, prev) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [name, ignore] = curr;
		const [prevName] = prev;

		deleteByPath(forms[formData.uid].values, prevName);

		if (!ignore) {
			const obj = stringToObject(props.name, defaultValue);
			forms[formData.uid].values = mergeDeep(forms[formData.uid].values, obj);
		}
	}, { deep: true });

	EventEmitter.on('reset', () => {
		if (field && getValueByPath(forms[formData.uid].values, props.name)) {
			getValueByPath(forms[formData.uid].values, props.name).value = defaultValue.value;
			field.value = getValueByPath(forms[formData.uid].values, props.name)?.value;
			field.modelValue = getValueByPath(forms[formData.uid].values, props.name)?.value;
		}
	});

	onBeforeUpdate(() => {
		field.value = getValueByPath(forms[formData.uid].values, props.name)?.value;
		field.modelValue = getValueByPath(forms[formData.uid].values, props.name)?.value;
	});

	onBeforeUnmount(() => {
		if (!props.preserve && !formData.preserve) {
			deleteByPath(forms[formData.uid].values, props.name);
		};
	});

	return {
		field,
		updateValue,
		getError,
	};
};
