import { forms } from '@/utils/store';
import { deleteByPath, EventEmitter, getPropBooleanValue, getValueByPath, mergeDeep, stringToObject } from '@/utils/utils';
import { ref, inject, watch, onBeforeUnmount, computed, getCurrentInstance, onMounted } from 'vue';

export const useSimpleField = (props: any, emit: any, isArrayField: boolean = false) => {
	const formData = inject('formData', Object.create({}));
	const instance = getCurrentInstance();
	const defaultValue = {
		value: ((forms[formData.uid].initialValues && !isArrayField) && getValueByPath(forms[formData.uid].initialValues, props.name)) ?? props.modelValue ?? props.default ?? getValueByPath(forms[formData.uid].values, props.name)?.value ?? (isArrayField ? [] : ''),
		error: undefined,
	};
	const tmpDefaultValue = JSON.stringify(defaultValue.value);
	const value = ref(defaultValue.value);
	const obj = stringToObject(props.name, defaultValue);
	forms[formData.uid].values = mergeDeep(forms[formData.uid].values, obj);

	const onInput = (evt: any) => {
		value.value = (typeof evt === 'object') ? getValueByInputType(evt.target) : evt;
		getValueByPath(forms[formData.uid].values, props.name).value = value.value;
		// emit('update:modelValue', value.value);
	};

	const onFocus = () => {
		getValueByPath(forms[formData.uid].values, props.name).error = undefined;
	};

	const getValueByInputType = (target: HTMLInputElement) => {
		console.log('asf');
		if (target.type === 'checkbox') {
			return getCheckValue(target.checked);
		}

		if (target.type === 'radio') {
			return props.value;
		}

		if (target.type === 'select-multiple') {
			const options = Array.from((target as unknown as HTMLSelectElement).options);
			const selectedOptions = options.filter(option => option.selected).map(opt => opt.value);

			return selectedOptions;
		}

		return target.value;
	};

	const getCheckValue = (checked: boolean) => {
		return checked ? props.trueValue || true : props.falseValue || false;
	};

	const getError = () => {
		return getValueByPath(forms[formData.uid].values, props.name)?.error;
	};

	const valueProxy = computed(() => {
		return value.value;
	});

	// watch(() => getValueByPath(forms[formData.uid].values, props.name)?.value, () => {
	// 	if (props.ignore) {
	// 		return;
	// 	}
	// 	value.value = getValueByPath(forms[formData.uid].values, props.name)?.value;
	// 	emit('update:modelValue', getValueByPath(forms[formData.uid].values, props.name)?.value);
	// });

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

	const updateValue = (value: any, key: any = props.name) => {
		getValueByPath(forms[formData.uid].values, key).value = mergeDeep(getValueByPath(forms[formData.uid].values, key).value, value);
	};

	EventEmitter.on('reset', () => {
		if (value.value && getValueByPath(forms[formData.uid].values, props.name)) {
			getValueByPath(forms[formData.uid].values, props.name).value = JSON.parse(tmpDefaultValue);
			value.value = JSON.parse(tmpDefaultValue);
			emit('update:modelValue', JSON.parse(tmpDefaultValue));
		}
	});

	onBeforeUnmount(() => {
		if (!getPropBooleanValue(formData.preserve) && !getPropBooleanValue(props.preserve)) {
			deleteByPath(forms[formData.uid].values, props.name);
		};
	});

	onMounted(() => {
		if (instance?.subTree?.el) {
			if (props.as === 'select') {
				const options = Array.from((instance?.subTree?.el as unknown as HTMLSelectElement).options);
				options.forEach((op) => {
					if (JSON.parse(tmpDefaultValue)?.includes?.(op.value)) {
						op.selected = true;
					}
				});
			}
		}
	});

	return {
		value: valueProxy,
		onInput,
		onFocus,
		getError,
		updateValue,
	};
};
