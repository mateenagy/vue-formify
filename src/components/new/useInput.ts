import { computed, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted } from 'vue';
import { FieldType } from './Field';
import { forms } from '@/utils/store';
import { createFormInput, deleteByPath, getPropBooleanValue, getValueByPath } from '@/utils/utils';

export const useInput = (props: FieldType<any>, emit: any) => {
	const { uid, preserveForm } = inject('formData', Object.create({}));
	const vm = getCurrentInstance();
	const name = props.name;
	const defaultValue: any = {
		value: undefined,
		error: undefined,
		ignore: props.ignore,
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

	const onInput = (evt: any) => {
		(typeof evt === 'object' && 'target' in evt) ? setValue(getValueByInputType(evt.target)) : setValue(evt);
	};

	const onFocus = () => {
		getValueByPath(forms[uid].values, name)?.error && (getValueByPath(forms[uid].values, name).error = undefined);
		getValueByPath(forms[uid].values, name.replace(/\[\d+\]/, ''))?.error && (getValueByPath(forms[uid].values, name.replace(/\[\d+\]/, '')).error = undefined);
	};

	createFormInput(props.name, uid, defaultValue);
	getValueByPath(forms[uid].values, props.name).value = getInitialValue();

	onBeforeUnmount(() => {
		if (!getPropBooleanValue(preserveForm) || !getPropBooleanValue(props.preserve)) {
			deleteByPath(forms[uid].values, name);
		};
	});

	onMounted(async () => {
		console.log(name, forms[uid].initialValues, getInitialValue(), defaultValue);
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
		getError,
	};
};
