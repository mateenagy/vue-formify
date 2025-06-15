import { forms } from '@/utils/store';
import { FormOptions, GetKeys, RecursivePartial } from '@/utils/types';
import { createFormDataFromObject, EventEmitter, fetcher, flattenObject, getValueByPath, mergeDeep, objectToString, stringToObject, hasDirty, hasErrors, getErrorMessage } from '@/utils/utils';
import { validateSchema } from '@/utils/validator';
import { computed, defineComponent, h, nextTick, onMounted, PropType, provide, ref, SlotsType, watch } from 'vue';

type FormType<T extends Record<string, any>> = {
	enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data';
	action?: string;
	initialValues?: RecursivePartial<T>;
	name?: string;
	onValueChange?: (value?: any) => void;
	onSubmit?: (value?: any, $event?: SubmitEvent) => void | Promise<any>;
}

export const FormComponent = <T extends Record<string, any> = Record<string, any>>(opt?: FormOptions<T>) => {
	/*---------------------------------------------
	/  VARIABLES
	---------------------------------------------*/
	const uid: number | string = opt?.name || Math.floor(Math.random() * Date.now());
	const isSubmitting = ref<boolean>(false);
	const isFormReady = ref<boolean>(false);
	const isSubmitted = ref<boolean>(false);
	let originalForm = Object.create({});

	/*---------------------------------------------
	/  METHODS
	---------------------------------------------*/
	const reset = (force: boolean = false) => {
		isSubmitted.value = false;
		if (force) {
			forms[uid].initialValues = Object.create({});
			forms[uid].values = Object.create({});
			originalForm = JSON.stringify(Object.create({}));
		} else {
			forms[uid].values = JSON.parse(originalForm);
		}
		forms[uid].key++;
	};

	const handleSubmit = (cb?: (data?: T) => void | Promise<any>) => {
		return async () => {
			await cb?.(values.value as T);
		};
	};

	const setValue = (name: GetKeys<T>, value: any) => {
		if (getValueByPath(forms[uid].values, name as unknown as string)) {
			if (!Array.isArray(value)) {
				getValueByPath(forms[uid].values, name as unknown as string).value = value;
			}
		} else {
			const obj = stringToObject(name as string, { value, error: undefined });
			forms[uid].values = mergeDeep(forms[uid].values, obj);
		}
	};

	const setValues = (values: Partial<T>) => {
		const convertedKeys = objectToString(values);
		for (const key in convertedKeys) {
			if (getValueByPath(forms[uid].values, key as string) && 'value' in getValueByPath(forms[uid].values, key as string)) {
				getValueByPath(forms[uid].values, key as string).value = convertedKeys[key];
			}
		}
	};

	const setInitalValues = (initials: Partial<T>) => {
		forms[uid].initialValues = mergeDeep(forms[uid].initialValues, flattenObject(forms[uid].values), initials);
		forms[uid].key++;
	};

	const setError = (name: GetKeys<T>, error: any) => {
		if (getValueByPath(forms[uid].values, name as unknown as string)) {
			getValueByPath(forms[uid].values, name as unknown as string).error = error;
			getValueByPath(forms[uid].values, name as unknown as string).isValid = false;
		}
	};
	/*---------------------------------------------
	/  COMPUTED
	---------------------------------------------*/
	const values = computed({
		get: () => flattenObject(forms[uid]?.values) as T,
		set: (newValue: T) => newValue,
	});
	const isDirty = computed(() => hasDirty(flattenObject(forms[uid]?.values, 'isDirty')));
	const isValid = computed(() => isDirty.value && !hasErrors(flattenObject(forms[uid]?.values, 'error')));
	/*---------------------------------------------
	/  CREATED
	---------------------------------------------*/
	if (!forms[uid]) {
		forms[uid] = {
			values: Object.create({}),
			initialValues: opt?.initialValues || Object.create({}),
			key: 0,
		};
	} else {
		values.value = flattenObject(forms[uid].values) as T;
	}

	provide('formData', {
		uid,
		preserveForm: opt?.preserve,
		mode: opt?.mode,
		isSubmitted,
	});
	const cmp = defineComponent((props: FormType<T>, { slots, emit, attrs }) => {
		/*---------------------------------------------
		/  METHODS
		---------------------------------------------*/
		const getError = (name: GetKeys<T>) => {
			return getErrorMessage<T>(forms[uid].values, name);
		};
		const submit = async ($event: any) => {
			$event.preventDefault();
			isSubmitted.value = true;
			let _val = values.value;

			if (opt?.schema) {
				const isValid = await validateSchema(opt.schema, flattenObject(forms[uid].values), setError);
				if (!isValid) {
					return $event.preventDefault();
				}
			}

			if (props?.enctype === 'multipart/form-data') {
				_val = createFormDataFromObject(flattenObject(forms[uid].values)) as any;
			}

			if (props.action) {
				return;
			}
			$event.preventDefault();
			isSubmitting.value = true;

			await fetcher(props.onSubmit?.(_val, $event));
			isSubmitting.value = false;
		};
		const initialValueToValue = () => {
			const convertedKeys = objectToString(forms[uid].initialValues);
			for (const key in convertedKeys) {
				!forms[uid].values[key]?.value && setValue(key as GetKeys<T>, convertedKeys[key]);
			}
		};
		/*---------------------------------------------
		/  WATCHERS
		---------------------------------------------*/
		watch(values, (curr, prev) => {
			values.value = curr;
			if (isFormReady.value && JSON.stringify(curr) !== JSON.stringify(prev) && props.onValueChange) {
				EventEmitter.emit('value-change', uid);
			}
			if (opt?.mode === 'onChange' && isDirty.value) {
				EventEmitter.emit('validate');
			}
		}, { deep: true });
		/*---------------------------------------------
		/  CREATED
		---------------------------------------------*/
		if (Object.keys(props.initialValues as Record<string, any>).length) {
			forms[uid].initialValues = mergeDeep(forms[uid].initialValues, props.initialValues as Record<string, any>);
		}
		/*---------------------------------------------
		/  HOOKS
		---------------------------------------------*/
		onMounted(async () => {
			initialValueToValue();
			originalForm = JSON.stringify(forms[uid].values);

			if (props?.onValueChange && forms[uid]) {
				EventEmitter.on('value-change', (id: string) => {
					if (id === uid) {
						emit('value-change', values.value);
					}
				});
			}

			if (opt?.mode === 'onChange') {
				EventEmitter.on('validate', async () => {
					if (opt?.schema) {
						return await validateSchema(opt.schema, flattenObject(forms[uid].values), setError);
					}
				});
			}
			await nextTick();
			isFormReady.value = true;
		});

		return () => {
			return h('form',
				{ ...props, ...attrs, ...emit, key: forms[uid].key, onSubmit: submit },
				slots.default?.({ values: values.value, getError, isDirty: isDirty.value, isValid: isValid.value }),
			);
		};
	}, {
		name: 'FormComponent',
		props: {
			enctype: { type: String as PropType<FormType<T>['enctype']>, default: 'application/x-www-form-urlencoded' },
			initialValues: { type: Object as PropType<FormType<T>['initialValues']>, default: Object.create({}) },
			onValueChange: {
				type: Function as PropType<(value?: any) => void>,
				default: undefined,
			},
			onSubmit: {
				type: Function as PropType<(value?: any, $event?: SubmitEvent) => void | Promise<any>>,
				default: undefined,
			},
		},
		emits: ['submit', 'value-change'],
		slots: Object as SlotsType<{
			default: { values: T, getError: (name: GetKeys<T>) => string, isDirty: boolean, isValid: boolean }
		}>,
	});

	return {
		cmp,
		values,
		isSubmitting: isSubmitting,
		reset,
		setInitalValues,
		setValue,
		setValues,
		setError,
		handleSubmit,
	};
};
