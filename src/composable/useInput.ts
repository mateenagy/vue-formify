import { computed, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, Ref, ref, warn } from 'vue';
import { forms } from '@/utils/store';
import { createFormInput, deleteByPath, EventEmitter, getValueByPath, mergeDeep, objectToModelValue } from '@/utils/utils';
import { FieldDefaults, FieldType, InputProps } from '@/utils/types';
import { validateSchema } from '@/utils/validator';

export const useInput = <T extends Record<string, any> = InputProps>(props: FieldType<T> | InputProps<any>, isArray: boolean = false) => {
	const { uid, preserveForm, mode, isSubmitted } = inject('formData', Object.create({}));
	const vm = getCurrentInstance();
	const name = props.name as string;
	const defaultValue: FieldDefaults = {
		value: getValueByPath(forms[uid].values, name)?.value ?? undefined,
		error: undefined,
		ignore: props.ignore,
		isDirty: false,
		isTouched: false,
		isValid: true,
	};
	/* COMPUTED */
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

			fieldItem.value.value = newVal || typeof newVal === 'boolean' ? newVal : '';
		},
	});
	const fieldItem = computed<FieldDefaults>(() => getValueByPath(forms[uid].values, name));
	const isValid = computed(() => !(fieldItem.value?.error && (fieldItem.value.isDirty || isSubmitted.value || mode === 'onSubmit')));
	const isTouched = computed(() => fieldItem.value?.isTouched);
	const isDirty = computed(() => fieldItem.value?.isDirty);
	const model = computed(() => {
		return objectToModelValue(value);
	});

	/* METRHODS */
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

		return getValueByPath(forms[uid].values, name).value ?? props.modelValue ?? props.default ?? getValueByPath(forms[uid].initialValues, name) ?? '';
	};

	const validateField = async () => {
		if (props?.rule) {
			const result = await validateSchema(props.rule, value.value, setError, name);
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
	const getError = () => (fieldItem.value?.isDirty || isSubmitted.value || mode === 'onSubmit') ? fieldItem.value?.error : undefined;

	const resetError = () => {
		fieldItem.value?.error && (fieldItem.value.error = undefined);
		getValueByPath(forms[uid].values, name.replace(/\[\d+\]/, ''))?.error && (getValueByPath(forms[uid].values, name.replace(/\[\d+\]/, '')).error = undefined);
	};

	const onInput = async (evt: any) => {
		(typeof evt === 'object' && 'target' in evt) ? setValue(getValueByInputType(evt.target)) : setValue(evt);
		fieldItem.value.error = undefined;
		(fieldItem.value && !fieldItem.value?.isTouched) && (fieldItem.value.isTouched = true);
		if (fieldItem.value?.isTouched && defaultValue.value !== value.value) {
			fieldItem.value.isDirty = true;
		}
		resetError();
		if (mode === 'onChange') {
			EventEmitter.emit('validate');
			validateField();
		}
	};

	const onFocus = () => {
		resetError();
	};

	const onBlur = async () => {
		(fieldItem.value && !fieldItem.value?.isTouched) && (fieldItem.value.isTouched = true);
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
		if (props.preserve || preserveForm) {
			return;
		}
		deleteByPath(forms[uid].values, name);
	});

	onMounted(async () => {
		await nextTick();
		(value.value && !Array.isArray(value.value)) && (fieldItem.value.isDirty = true);
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

	const inputProps = ref({
		modelValue: model,
		value: model,
		'onUpdate:modelValue': (val: any) => {
			value.value = val;
			if (mode === 'onChange') {
				EventEmitter.emit('validate');
				validateField();
			}
		},
		isTouched: isTouched.value,
		onInput,
		onFocus,
		onBlur,
	}) as Ref<any>;

	return {
		value,
		isValid,
		isTouched,
		isDirty,
		inputProps,
		getError,
		setError,
		setArrayValue,
	};
};
