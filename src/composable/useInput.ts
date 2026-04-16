import { computed, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, warn } from 'vue';
import { forms } from '@/utils/store';
import { createFormInput, deleteByPath, EventEmitter, getValueByPath, mergeDeep, objectToModelValue } from '@/utils/utils';
import { FieldArrayType, FieldDefaults, FieldType, InputProps, UseInputOption } from '@/utils/types';
import { useFieldValidation } from './useFieldValidation';

/* PURE FUNCTIONS */
const getCheckValue = (checked: boolean, trueValue: any, falseValue: any): boolean =>
	(checked) ? trueValue || true : falseValue || false;

const normalizeCheckboxValue = (target: HTMLInputElement, trueValue: any, falseValue: any) => {
	if (target.value !== 'on') {
		return target.checked ? target.value : undefined;
	}

	return getCheckValue(target.checked, trueValue, falseValue);
};

const getValueByInputType = (target: HTMLInputElement, trueValue: any, falseValue: any) => {
	if (target.type === 'checkbox') {
		return normalizeCheckboxValue(target, trueValue, falseValue);
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

export const useInput = <T extends Record<string, any> = InputProps>(
	props: FieldType<T> | FieldArrayType<T> & { trueValue: any, falseValue: any } | InputProps<any>, opt: UseInputOption = { isArray: false, isComponent: false }) => {
	/* INJECTIONS & CONTEXT */
	const { uid, preserveForm, mode, isSubmitted } = inject('formData', Object.create({}));
	const vm = getCurrentInstance();
	const name = props.name as string;

	/* FIELD STATE */
	const defaultValue: FieldDefaults = {
		value: getValueByPath(forms[uid].values, name)?.value ?? undefined,
		error: undefined,
		ignore: props.ignore,
		isDirty: false,
		isTouched: false,
		isValid: true,
	};

	const fieldItem = computed<FieldDefaults>(() => getValueByPath(forms[uid].values, name));
	const isValid = computed(() => !(fieldItem.value?.error && (fieldItem.value.isDirty || isSubmitted.value || mode === 'onSubmit')));
	const isTouched = computed(() => fieldItem.value?.isTouched);
	const isDirty = computed(() => fieldItem.value?.isDirty);

	const setArrayValue = (value: any, key: any = name) => {
		const field = getValueByPath(forms[uid].values, key);
		if (!field) {
			return;
		}
		field.value = mergeDeep(field.value, value);
		field.error = undefined;
	};

	const value = computed({
		get() {
			if (!fieldItem.value) {
				return;
			}

			return fieldItem.value.value;
		},
		set(newVal) {
			if (!fieldItem.value) {
				return;
			}
			if (fieldItem.value?.isTouched && defaultValue.value !== value.value) {
				fieldItem.value.isDirty = true;
			}
			if (opt.isArray || Array.isArray(newVal)) {
				fieldItem.value.value = [];
				for (let index = 0; index < newVal.length; index++) {
					setArrayValue({ [`[${index}]`]: { value: newVal[index] } }, name);
				}

				return fieldItem.value.value;
			}

			fieldItem.value.value = newVal ?? '';
		},
	});

	const model = computed(() => {
		return objectToModelValue(value);
	});

	/* VALIDATION */
	const { setError, resetError, validateField, getError } = useFieldValidation(
		uid, name, props?.rule, fieldItem, value, isSubmitted, mode,
	);

	/* EVENT HANDLERS */
	const setValue = (newValue: any) => value.value = newValue;

	const onInput = async (evt: any) => {
		if (!opt.isComponent) {
			if (typeof evt === 'object' && evt !== null && 'target' in evt) {
				// Skip native events that bubbled from internal elements of a component wrapper.
				// When onInput is applied to a component root via inheritAttrs, internal inputs
				// fire native events that bubble up — currentTarget is the root, target is the inner element.
				const isBubbled = evt.currentTarget != null && evt.target !== evt.currentTarget;
				if (!isBubbled) {
					setValue(getValueByInputType(evt.target, props.trueValue, props.falseValue));
				}
			} else if (typeof evt !== 'object' || evt === null) {
				setValue(evt);
			} else if ('value' in evt) {
				setValue(evt.value);
			}
		}
		if (!fieldItem.value) {
			return;
		}
		(fieldItem.value && !fieldItem.value?.isTouched) && (fieldItem.value.isTouched = true);
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

	/* INITIALIZATION */
	const getInitialValue = () => {
		if (opt.isArray || Array.isArray(getValueByPath(forms[uid].initialValues, name))) {
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

		return getValueByPath(forms[uid].values, name).value ?? props.modelValue ?? props.default ?? getValueByPath(forms[uid].initialValues, name) ?? (opt.isCheckbox ? (props.falseValue ?? false) : '');
	};

	createFormInput(name, uid, JSON.parse(JSON.stringify(defaultValue)));

	if (!name) {
		warn('`name` prop is required');
	} else {
		fieldItem.value.value = getInitialValue();
	}

	/* LIFECYCLE */
	onBeforeUnmount(() => {
		if (props.preserve || preserveForm) {
			return;
		}
		deleteByPath(forms[uid].values, name);
	});

	onMounted(async () => {
		await nextTick();
		(value.value && !Array.isArray(value.value) && fieldItem.value) && (fieldItem.value.isDirty = true);
		if (vm?.subTree?.el) {
			if ('as' in props && props.as === 'select') {
				const options = Array.from((vm.subTree.el as unknown as HTMLSelectElement).options);
				options.forEach((op) => {
					if (defaultValue.value?.includes?.(op.value)) {
						op.selected = true;
					}
				});
			}
		}
	});

	/* INPUT PROPS */
	const inputProps = computed(() => ({
		modelValue: model.value,
		value: model.value,
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
	})) as any;

	return {
		value,
		isValid,
		isTouched,
		isDirty,
		inputProps,
		getError,
		setError,
		setArrayValue,
		setValue,
	};
};
