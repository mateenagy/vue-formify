// Get and Set input value either in store and in input
// Handle v-model logic
// Set default value
// Implement OnInput, OnFocus, OnBlur events
// Handle checkbox, radiobox, select and multiple select values and UI states
import { forms } from '@/utils/store';
import { deleteByPath, EventEmitter, getPropBooleanValue, getValueByPath, mergeDeep, stringToObject } from '@/utils/utils';
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted } from 'vue';
import { CreateInputOptions } from './createInput';


export const useField = (props: Record<string, any>, emit: any, isArrayField: boolean = false, options?: CreateInputOptions, isCustom: boolean = false) => {
	/* VARIABLES */
	const form = inject<{ uid: number | string, preserve: boolean }>('formData', Object.create({}));
	const name = (!options?.useModelKeyAsState && options?.modelKey) || props.name;
	const vm = getCurrentInstance();

	const setInitialValues = () => {
		if (forms[form.uid].initialValues && getValueByPath(forms[form.uid].initialValues, name) && !isArrayField) {
			return getValueByPath(forms[form.uid].initialValues, name);
		}

		return (options?.modelKey && props[options.modelKey]) ?? props.modelValue ?? props.default ?? options?.default ?? (isArrayField ? [] : '');
	};
	const defaultValue = {
		value: setInitialValues(),
		error: undefined,
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

		if (target.type === 'select-multiple') {
			const options = Array.from((target as unknown as HTMLSelectElement).options);
			const selectedOptions = options.filter(option => option.selected).map(opt => opt.value);

			return selectedOptions;
		}

		return target.value;
	};

	const onInput = (evt: any) => {
		(!isCustom && 'target' in evt && typeof evt.target === 'object') && setValue(getValueByInputType(evt.target));
	};

	const onFocus = () => {
		getValueByPath(forms[form.uid].values, name).error = undefined;
	};

	const getCheckValue = (checked: boolean) => {
		return checked ? props.trueValue || true : props.falseValue || false;
	};

	const getError = () => {
		return getValueByPath(forms[form.uid].values, name)?.error;
	};

	const setValue = (newValue: any) => {
		value.value = newValue;
		EventEmitter.emit('value-change', form.uid);
	};

	const setArrayValue = (value: any, key: any = name) => {
		getValueByPath(forms[form.uid].values, key).value = mergeDeep(getValueByPath(forms[form.uid].values, key).value, value);
	};

	const createFormInput = () => {
		if (name && !(name in forms[form.uid].values)) {
			const obj = stringToObject(name, defaultValue);
			forms[form.uid].values = mergeDeep(forms[form.uid].values, obj);
		}
	};

	/* CREATED */
	createFormInput();

	EventEmitter.on('reset', () => {
		if (value.value && getValueByPath(forms[form.uid].values, name) && !isArrayField) {
			setValue(defaultValueCopy);
		}
	});

	onBeforeUnmount(() => {
		if (!getPropBooleanValue(form.preserve) && !getPropBooleanValue(props.preserve)) {
			deleteByPath(forms[form.uid].values, name);
		};
	});

	onMounted(() => {
		if (vm?.subTree?.el) {
			if (props.as === 'select') {
				const options = Array.from((vm?.subTree?.el as unknown as HTMLSelectElement).options);
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
