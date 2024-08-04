import { deleteByPath, getKey, getValueByPath, mergeDeep, stringToObject } from '@/utils/utils';
import { inject, onBeforeUnmount, Ref, toValue, watch } from 'vue';
import { CreateInputOptions } from './createInput';

export const useField = (props: Record<string, any>, _emit: (event: string, ...args: any[]) => void, options?: CreateInputOptions) => {
	const name = props.name;
	const form = inject<Ref<Record<string, any>>>('form', Object.create({}));
	const defaultValue = {
		value: props.modelValue ?? (options?.defaultValueKey && props[options?.defaultValueKey as keyof typeof props]) ?? props.default ?? options?.default ?? getValueByPath(form.value, props.name).value ?? '',
		error: undefined,
	};

	if (props.ignore) {
		return;
	}

	watch(() => [props.name, props.ignore], (curr, prev) => {
		const [name, ignore] = curr;
		const [prevName] = prev;

		deleteByPath(form.value, prevName);

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
					form.value = mergeDeep(form.value, obj);
				});
			} else {
				if (options.useModelKeyAsState) {
					const key1 = getKey(props.name, options.modelKeys, true);
					const key2 = getKey(props.name, options.modelKeys, false);
					const obj1 = stringToObject(key1, defaultValue);
					const obj2 = stringToObject(key2, defaultValue);
					form.value = mergeDeep(form.value, obj1);
					form.value = mergeDeep(form.value, obj2);
				} else {
					const key = getKey(props.name, options.modelKeys);
					const obj = stringToObject(key, defaultValue);
					form.value = mergeDeep(form.value, obj);
				}
			}
		}
	
		if (name && !options?.modelKeys) {
			const obj = stringToObject(name, defaultValue);
			form.value = mergeDeep(form.value, obj);
		}
	};

	const updateValue = (value: any, modelKey: string) => {
		if (modelKey) {
			const key = props.name ? `${props.name}.${getKey(name.value, modelKey)}` : getKey(name.value, modelKey);
			getValueByPath(form.value, key).value = toValue(value);
		} else {
			getValueByPath(form.value, name.value).value = value;
		}
	};

	const getError = (modelKey?: string) => {
		if (modelKey) {
			const key = props.name ? `${props.name}.${getKey(name.value, modelKey)}` : getKey(name.value, modelKey);

			return options?.useModelKeyAsState ? getValueByPath(form.value, props.name)?.error : getValueByPath(form.value, key)?.error;
		}

		return getValueByPath(form.value, props.name).error;
	};

	createFormInput();

	onBeforeUnmount(() => {
		!props.preserve && deleteByPath(form.value, props.name);
	});

	return {
		updateValue,
		getError,
	};
};
