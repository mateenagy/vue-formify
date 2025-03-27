import { forms } from '@/utils/store';
import { createFormInput, deleteByPath, extractInitialValues, getPropBooleanValue, getValueByPath, mergeDeep } from '@/utils/utils';
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted } from 'vue';
import { CreateInputOptions } from './createInput';


export const useField = (props: Record<string, any>, emit: any, isArrayField: boolean = false, options?: CreateInputOptions, isCustom: boolean = false) => {
	/* VARIABLES */
	const form = inject<{ uid: number | string, preserve: boolean }>('formData', Object.create({}));
	const name = (!options?.useModelKeyAsState && options?.modelKey) || props.name;
	const vm = getCurrentInstance();

	const setInitialValues = () => {
		if (props.ignore) {
			return '';
		}
		if (Object.keys(forms[form.uid].initialValues).length && !isArrayField) {
			return extractInitialValues(name, forms[form.uid].initialValues, props, options);
		}

		return (options?.modelKey && props[options.modelKey]) ?? props.modelValue ?? props.default ?? options?.default ?? (isArrayField ? [] : '');
	};
	const defaultValue = {
		value: setInitialValues(),
		error: undefined,
		ignore: props.ignore,
	};

	const defaultValueCopy = JSON.parse(JSON.stringify(defaultValue.value));

	/* COMPUTED */
	const value = computed({
		get() {
			if (!getValueByPath(forms[form.uid].values, name)) {
				return;
			}

			return getValueByPath(forms[form.uid].values, name).value;
		},
		set(newVal) {
			getValueByPath(forms[form.uid].values, name).value = newVal;
			emit((options?.modelKey) ? `update:${options.modelKey}` : 'update:modelValue', newVal);
		},
	});

	/* METHODS */
	const getValueByInputType = (target: HTMLInputElement) => {
		if (target.type === 'checkbox') {
			return getCheckValue(target.checked);
		}
	
		if (target.type === 'file') {
			return target.multiple ? target.files : target.files?.[0];
		}

		if (target.type === 'select-multiple') {
			const options = Array.from((target as unknown as HTMLSelectElement).options);
			const selectedOptions = options.filter(option => option.selected).map(opt => opt.value);

			return selectedOptions;
		}

		return target.value;
	};

	const onInput = (evt: any) => {
		if (!isCustom) {
			(typeof evt === 'object' && 'target' in evt) ? setValue(getValueByInputType(evt.target)) : setValue(evt);
		}
	};

	const onFocus = () => {
		getValueByPath(forms[form.uid].values, name)?.error && (getValueByPath(forms[form.uid].values, name).error = undefined);
		getValueByPath(forms[form.uid].values, name.replace(/\[\d+\]/, ''))?.error && (getValueByPath(forms[form.uid].values, name.replace(/\[\d+\]/, '')).error = undefined);
	};

	const getCheckValue = (checked: boolean) => {
		return checked ? props.trueValue || true : props.falseValue || false;
	};

	const getError = () => {
		return getValueByPath(forms[form.uid].values, name)?.error;
	};

	const setValue = (newValue: any) => {
		value.value = newValue;
	};

	const setArrayValue = (value: any, key: any = name) => {
		getValueByPath(forms[form.uid].values, key).value = mergeDeep(getValueByPath(forms[form.uid].values, key).value, value);
	};

	/* CREATED */
	createFormInput(name, form.uid, defaultValue);

	onBeforeUnmount(() => {
		if (!getPropBooleanValue(form.preserve) && !getPropBooleanValue(props.preserve)) {
			deleteByPath(forms[form.uid].values, name);
		};
	});

	onMounted(() => {
		if (vm?.subTree?.el) {
			if (props.as === 'select') {
				const options = Array.from((vm.subTree.el as unknown as HTMLSelectElement).options);
				options.forEach((op) => {
					if (defaultValueCopy?.includes?.(op.value)) {
						op.selected = true;
					}
				});
			}
		}
	});

	/* LIFECYCLE HOOKS */
	return {
		value: value,
		getError,
		setValue,
		setArrayValue,
		onInput,
		onFocus,
	};
};
