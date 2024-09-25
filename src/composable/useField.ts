import { deleteByPath, EventEmitter, getKey, getPropBooleanValue, getValueByPath, mergeDeep, stringToObject } from '@/utils/utils';
import { inject, onBeforeUnmount, toValue, watch } from 'vue';
import { CreateInputOptions } from './createInput';
import { forms } from '@/utils/store';

export const useField = (props: Record<string, any>, _emit: (event: string, ...args: any[]) => void, options?: CreateInputOptions) => {
	const { uid, preserve: preserveForm } = inject('formData', Object.create({}));
	const name = props.name;
	const defaultValue = {
		value: (forms[uid].initialValues && getValueByPath(forms[uid].initialValues, props.name)) ?? props.modelValue ?? (options?.defaultValueKey && props[options?.defaultValueKey as keyof typeof props]) ?? props.default ?? options?.default ?? getValueByPath(forms[uid].values, props.name).value ?? '',
		error: undefined,
	};

	if (props.ignore) {
		return;
	}

	watch(() => [props.name, props.ignore], (curr, prev) => {
		const [name, ignore] = curr;
		const [prevName] = prev;
		
		deleteByPath(forms[uid].values, prevName);
 
		if (!ignore) {
			createFormInput(name);
		}
	}, { deep: true });

	const createFormInput = (name: string = props.name) => {
		if (options?.modelKeys) {
			if (Array.isArray(options?.modelKeys)) {
				options?.modelKeys.forEach((key: string) => {
					const _key = getKey(props.name, key, options.useModelKeyAsState);
					const obj = stringToObject(_key, defaultValue);
					forms[uid].values = mergeDeep(forms[uid].values, obj);
				});
			} else {
				if (options.useModelKeyAsState) {
					const key1 = getKey(props.name, options.modelKeys, true);
					const key2 = getKey(props.name, options.modelKeys, false);
					const obj = { ...stringToObject(key1, defaultValue), ... stringToObject(key2, defaultValue) };
					forms[uid].values = mergeDeep(forms[uid].values, obj);
				} else {
					const key = getKey(props.name, options.modelKeys);
					const obj = stringToObject(key, defaultValue);
					forms[uid].values = mergeDeep(forms[uid].values, obj);
				}
			}
		}

		if (name && !options?.modelKeys) {
			const obj = stringToObject(name, defaultValue);
			forms[uid].values = mergeDeep(forms[uid].values, obj);
		}
	};

	const updateValue = (value: any, modelKey: string) => {
		if (modelKey) {
			const key = props.name ? `${props.name}.${getKey(name.value, modelKey)}` : getKey(name.value, modelKey);
			getValueByPath(forms[uid].values, key).value = toValue(value);
		} else {
			getValueByPath(forms[uid].values, name.value).value = value;
		}
		EventEmitter.emit('value-change', uid);
	};

	const getError = (modelKey?: string) => {
		if (modelKey) {
			const key = props.name ? `${props.name}.${getKey(name.value, modelKey)}` : getKey(name.value, modelKey);

			return options?.useModelKeyAsState ? getValueByPath(forms[uid].values, props.name)?.error : getValueByPath(forms[uid].values, key)?.error;
		}

		return getValueByPath(forms[uid].values, props.name).error;
	};

	if (!getValueByPath(forms[uid].values, props.name)) {
		createFormInput();
	}
	onBeforeUnmount(() => {
		if (!getPropBooleanValue(props.preserve) && !getPropBooleanValue(preserveForm)) {
			deleteByPath(forms[uid].values, props.name);
		};
	});

	return {
		updateValue,
		getError,
	};
};
