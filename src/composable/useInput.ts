import { MaybeRefOrGetter, computed, inject, onBeforeUnmount, onMounted, toValue, watch } from 'vue';
import { deleteByPath, getKey, getValueByPath, mergeDeep, stringToObject } from '@/utils/utils';

export const useInput = (path: MaybeRefOrGetter<string>, props: any, modelKey?: string, useKey: boolean = false) => {
	const name = computed(() => (toValue(path)));
	const form = inject<Record<string, any>>('formData', Object.create({}));

	const getDefault = (_default: string | Record<string, any>) => {
		if (!Array.isArray(_default) && typeof _default === 'object') {
			return _default[modelKey as string];
		}
		
		return _default;
	};

	console.log('create', props.name);
	
	
	const defaultValue = {
		value: (modelKey && props[modelKey as string]) ?? props.modelValue ?? getValueByPath(form.value, name.value)?.value ?? getDefault(props.default) ?? '',
		error: undefined,
	};

	const updateValue = (value: any, modelKey?: string) => {
		if (!name.value && !modelKey) {
			return;
		}

		if (modelKey) {
			const key = getKey(name.value, modelKey, useKey);
			getValueByPath(form.value, key).value = toValue(value);
		} else {
			getValueByPath(form.value, name.value).value = value;
		}
	};

	const getError = (modelKey?: string) => {
		if (modelKey) {
			const key = getKey(name.value, modelKey, useKey);

			return getValueByPath(form.value, key)?.error;
		}

		return getValueByPath(form.value, name.value).error;
	};

	const onFocus = (modelKey?: string) => {
		if (modelKey) {
			const key = getKey(name.value, modelKey, useKey);

			return getValueByPath(form.value, key)?.error && (getValueByPath(form.value, key).error = undefined);
		}

		return getValueByPath(form.value, name.value)?.error && (getValueByPath(form.value, name.value).error = undefined);
	};

	const createFormInput = (name: string) => {
		if (modelKey) {
			const key = getKey(name, modelKey, useKey);
			const obj = stringToObject(key, defaultValue);
			form.value = mergeDeep(form.value, obj);
		} else {
			const obj = stringToObject(name, defaultValue);
			form.value = mergeDeep(form.value, obj);
		}
	};

	watch(() => [props.name, props.ignore, props.default], (curr, prev) => {
		const [name, ignore] = curr;
		const [prevName] = prev;

		// deleteByPath(form.value, prevName);

		// if (!ignore) {
		// 	createFormInput(name);
		// }
	}, { deep: true });

	onMounted(() => {
		if (props.ignore) {
			return;
		}

		if (!name.value && !modelKey) {
			console.warn('Input `name` property is not defined on component!');

			return;
		}
		createFormInput(name.value);
	});

	onBeforeUnmount(() => {
		!props.preserve && deleteByPath(form.value, name.value);
	});

	return {
		updateValue,
		getError,
		onFocus,
	};
};
