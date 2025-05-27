import { computed, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, warn } from 'vue';
import { forms } from '@/utils/store';
import { createFormInput, deleteByPath, EventEmitter, getPropBooleanValue, getValueByPath } from '@/utils/utils';
import { FieldType } from '@/utils/types';
import { validateSchema } from './validator';

export const useInput = (props: FieldType<any>, emit: any) => {
	const { uid, preserveForm, mode } = inject('formData', Object.create({}));
	const vm = getCurrentInstance();
	const name = props.name;
	const defaultValue: any = {
		value: undefined,
		error: undefined,
		ignore: props.ignore,
		isDirty: false,
		isFocused: false,
	};

	/* COMPUTED */
	const value = computed({
		get() {
			if (!getValueByPath(forms[uid].values, name)) {
				return;
			}

			return getValueByPath(forms[uid].values, name).value;
		},
		set(newVal) {
			getValueByPath(forms[uid].values, name).value = newVal;
			emit('update:modelValue', newVal);
		},
	});

	const getInitialValue = () => {
		return props.modelValue ?? props.default ?? getValueByPath(forms[uid].initialValues, props.name) ?? '';
	};

	const validateField = async () => {
		if (props?.schema) {
			const result = await validateSchema(props.schema, value.value, setError, props.name);
			getValueByPath(forms[uid].values, props.name).isValid = result;
		}
	};

	const setError = (name: string, error: any) => {
		if (getValueByPath(forms[uid].values, name as unknown as string)) {
			getValueByPath(forms[uid].values, name as unknown as string).error = error;
		}
	};

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

	const setValue = (newValue: any) => value.value = newValue;
	const getCheckValue = (checked: boolean): boolean => checked ? props.trueValue || true : props.falseValue || false;
	const getError = () => getValueByPath(forms[uid].values, name)?.error;

	const resetError = () => {
		getValueByPath(forms[uid].values, name)?.error && (getValueByPath(forms[uid].values, name).error = undefined);
		getValueByPath(forms[uid].values, name.replace(/\[\d+\]/, ''))?.error && (getValueByPath(forms[uid].values, name.replace(/\[\d+\]/, '')).error = undefined);
	};

	const onInput = async (evt: any) => {
		resetError();
		if (getValueByPath(forms[uid].values, props.name)?.isFocused && defaultValue.value !== value.value) {
			getValueByPath(forms[uid].values, props.name).isDirty = true;
		}
		(typeof evt === 'object' && 'target' in evt) ? setValue(getValueByInputType(evt.target)) : setValue(evt);
		if (mode === 'onChange') {
			EventEmitter.emit('validate');
			validateField();
		}
	};

	const onFocus = () => {
		resetError();
		getValueByPath(forms[uid].values, props.name).isFocused = true;
	};

	const onBlur = async () => {
		await validateField();
	};

	createFormInput(props.name, uid, JSON.parse(JSON.stringify(defaultValue)));

	if (!props.name) {
		warn('`name` prop is required');
	} else {
		getValueByPath(forms[uid].values, props.name).value = getInitialValue();
	}

	onBeforeUnmount(() => {
		if (!getPropBooleanValue(preserveForm) || !getPropBooleanValue(props.preserve)) {
			deleteByPath(forms[uid].values, name);
		};
	});

	onMounted(async () => {
		await nextTick();
		if (vm?.subTree?.el) {
			if (props.as === 'select') {
				const options = Array.from((vm.subTree.el as unknown as HTMLSelectElement).options);
				options.forEach((op) => {
					if (defaultValue.value?.includes?.(op.value)) {
						op.selected = true;
					}
				});
			}
		}
	});

	return {
		value,
		onInput,
		onFocus,
		onBlur,
		getError,
		setError,
	};
};
