import { computed, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, ref, warn } from 'vue';
import { forms } from '@/utils/store';
import { createFormInput, deleteByPath, EventEmitter, getPropBooleanValue, getValueByPath, mergeDeep, objectToModelValue } from '@/utils/utils';
import { FieldDefaults, FieldType, InputProps } from '@/utils/types';
import { validateSchema } from '@/utils/validator';

export const useInput = (props: FieldType<any> | InputProps<any>, isArray: boolean = false) => {
	const { uid, preserveForm, mode } = inject('formData', Object.create({}));
	const vm = getCurrentInstance();
	const name = props.name as string;
	const defaultValue: FieldDefaults = {
		value: undefined,
		error: undefined,
		ignore: props.ignore,
		isDirty: false,
		isFocused: false,
		isValid: true,
	};
	/* COMPUTED */
	const fieldItem = computed<FieldDefaults>(() => getValueByPath(forms[uid].values, name));
	const value = computed({
		get() {
			if (!fieldItem.value) {
				return;
			}

			return fieldItem.value.value;
		},
		set(newVal) {
			if (isArray || Array.isArray(newVal)) {
				fieldItem.value.value = [];
				for (let index = 0; index < newVal.length; index++) {
					setArrayValue({ [`[${index}]`]: { value: newVal[index] } }, name);
				}

				return fieldItem.value.value;
			}

			fieldItem.value.value = newVal;
		},
	});

	const isValid = computed(() => !(fieldItem.value?.error && fieldItem.value.isDirty));

	const getInitialValue = () => {
		if (isArray || Array.isArray(getValueByPath(forms[uid].initialValues, name))) {
			if (getValueByPath(forms[uid].initialValues, name)) {
				const items = getValueByPath(forms[uid].initialValues, name);
				let result = {};
				for (let index = 0; index < items.length; index++) {
					result = {
						...result,
						[`[${index}]`]: {
							value: items[index],
							error: undefined,
						},
					};
				}

				return result;
			}

			return [];
		}

		return props.modelValue ?? props.default ?? getValueByPath(forms[uid].initialValues, name) ?? '';
	};

	const validateField = async () => {
		if (props?.schema) {
			const result = await validateSchema(props.schema, value.value, setError, name);
			fieldItem.value.isValid = result;
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
	const getError = () => fieldItem.value?.error;

	const resetError = () => {
		fieldItem.value?.error && (fieldItem.value.error = undefined);
		getValueByPath(forms[uid].values, name.replace(/\[\d+\]/, ''))?.error && (getValueByPath(forms[uid].values, name.replace(/\[\d+\]/, '')).error = undefined);
	};

	const onInput = async (evt: any) => {
		fieldItem.value.isFocused = true;
		if (fieldItem.value?.isFocused && defaultValue.value !== value.value) {
			fieldItem.value.isDirty = true;
		}
		(typeof evt === 'object' && 'target' in evt) ? setValue(getValueByInputType(evt.target)) : setValue(evt);
		resetError();
		if (mode === 'onChange') {
			EventEmitter.emit('validate');
			validateField();
		}
	};

	const onFocus = () => {
		resetError();
		fieldItem.value?.isFocused && (fieldItem.value.isFocused = true);
	};

	const onBlur = async () => {
		await validateField();
	};

	const setArrayValue = (value: any, key: any = name) => {
		getValueByPath(forms[uid].values, key).value = mergeDeep(getValueByPath(forms[uid].values, key).value, value);
		getValueByPath(forms[uid].values, key).error = undefined;
	};

	createFormInput(name, uid, JSON.parse(JSON.stringify(defaultValue)));

	if (!name) {
		warn('`name` prop is required');
	} else {
		fieldItem.value.value = getInitialValue();
	}

	onBeforeUnmount(() => {
		if (!getPropBooleanValue(preserveForm) || !getPropBooleanValue(props.preserve)) {
			deleteByPath(forms[uid].values, name);
		};
	});

	onMounted(async () => {
		await nextTick();
		value.value && (fieldItem.value.isDirty = true);
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


	const inputProps = {
		modelValue: ref(objectToModelValue(value)),
		'onUpdate:modelValue': (val: any) => {
			fieldItem.value.error = undefined;
			fieldItem.value.isFocused = true;
			fieldItem.value.isDirty = true;
			value.value = val;
			if (mode === 'onChange') {
				EventEmitter.emit('validate');
				validateField();
			}
		},
		onInput,
		onFocus,
		onBlur,
	};

	return {
		value,
		isValid,
		inputProps,
		onInput,
		onFocus,
		onBlur,
		getError,
		setError,
		setArrayValue,
	};
};
