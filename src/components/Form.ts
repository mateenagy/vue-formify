import { forms } from '@/utils/store';
import { FieldState, FormOptions, GetKeys, Prettify, RecursivePartial } from '@/utils/types';
import { createFormDataFromObject, clearStoreErrors, EventEmitter, fetcher, flattenObject, getValueByPath, mergeDeep, objectToString, stringToObject, isFieldDirty, isFormDirty, isFormTouched, hasErrors, getErrorMessage } from '@/utils/utils';
import { validateSchema } from '@/utils/validator';
import { computed, defineComponent, getCurrentInstance, h, nextTick, onBeforeUnmount, onMounted, onUnmounted, PropType, provide, ref, SlotsType, watch } from 'vue';

type FormType<T extends Record<string, any>> = {
	enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data';
	action?: string;
	initialValues?: RecursivePartial<T>;
	name?: string;
	onValueChange?: (value?: any) => void;
	onSubmit?: (value?: any, $event?: SubmitEvent) => void | Promise<any>;
}

// Monotonic counter for auto-generated form ids — collision-free and
// deterministic, unlike the previous Math.random()/Date.now() scheme.
let formIdCounter = 0;

export const FormComponent = <T extends Record<string, any> = Record<string, any>>(opt?: FormOptions<T>) => {
	/*---------------------------------------------
	/  VARIABLES
	---------------------------------------------*/
	const uid: number | string = opt?.name || `form-${++formIdCounter}`;
	const isSubmitting = ref<boolean>(false);
	const isFormReady = ref<boolean>(false);
	const isSubmitted = ref<boolean>(false);
	const submitCount = ref<number>(0);
	// One event bus per form instance — keeps validate/value-change events from
	// bleeding into other mounted forms (the old global static EventEmitter did).
	const emitter = new EventEmitter();
	let originalForm = Object.create({});

	/*---------------------------------------------
	/  METHODS
	---------------------------------------------*/
	const reset = (force: boolean = false) => {
		isSubmitted.value = false;
		submitCount.value = 0;
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
			const field = getValueByPath(forms[uid].values, name as unknown as string);
			field.value = value;
			field.error = undefined;
		} else {
			const obj = stringToObject(name as string, { value, error: undefined });
			forms[uid].values = mergeDeep(forms[uid].values, obj);
		}
		if (opt?.schema) {
			validateSchema(opt.schema, flattenObject(forms[uid].values), setError);
		}
	};

	const setValues = (values: Partial<T>) => {
		const convertedKeys = objectToString(values);
		for (const key in convertedKeys) {
			if (getValueByPath(forms[uid].values, key as string) && 'value' in getValueByPath(forms[uid].values, key as string)) {
				const field = getValueByPath(forms[uid].values, key as string);
				field.value = convertedKeys[key];
				field.error = undefined;
			}
		}
		if (opt?.schema) {
			validateSchema(opt.schema, flattenObject(forms[uid].values), setError);
		}
	};

	const setInitialValues = (initials: Partial<T>) => {
		forms[uid].initialValues = initials;
		forms[uid].key++;
	};

	const setError = (name: GetKeys<T>, error: any) => {
		if (getValueByPath(forms[uid].values, name as unknown as string)) {
			getValueByPath(forms[uid].values, name as unknown as string).error = error;
		}
	};

	const getFieldState = (name: GetKeys<T>): FieldState => {
		const field = getValueByPath(forms[uid].values, name as unknown as string);

		return {
			value: field?.value,
			error: field?.error,
			isDirty: isFieldDirty(field),
			isTouched: !!field?.isTouched,
			isValid: !field?.error,
		};
	};

	// Imperatively run the form's schema against the current values, surfacing
	// any errors (marks the form submitted so gated messages become visible).
	// Returns whether the form is valid; forms without a schema are always valid.
	const validate = async (): Promise<boolean> => {
		isSubmitted.value = true;
		if (opt?.schema) {
			return await validateSchema(opt.schema, flattenObject(forms[uid].values), setError);
		}

		return true;
	};

	// Clear a single field's error (by name) or every field's error.
	const clearErrors = (name?: GetKeys<T>) => {
		if (name) {
			const field = getValueByPath(forms[uid].values, name as unknown as string);
			if (field) {
				field.error = undefined;
			}

			return;
		}

		clearStoreErrors(forms[uid].values);
	};
	/*---------------------------------------------
	/  COMPUTED
	---------------------------------------------*/
	const values = computed({
		get: () => flattenObject(forms[uid]?.values) as T,
		set: (newValue: T) => newValue,
	});
	const isDirty = computed(() => isFormDirty(forms[uid]?.values));
	const isTouched = computed(() => isFormTouched(forms[uid]?.values));
	// Validity is independent of dirtiness: a pristine form with no errors is valid.
	const isValid = computed(() => !hasErrors(flattenObject(forms[uid]?.values, 'error')));
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

	// Free the store entry when the owning component unmounts so forms don't
	// accumulate for the life of the app. Skipped when `preserve` is set, and
	// tied to the owner (not the <Form> element) so it survives v-if toggles.
	if (getCurrentInstance() && !opt?.preserve) {
		onUnmounted(() => {
			delete forms[uid];
		});
	}

	const cmp = defineComponent((props: Prettify<FormType<T>>, { slots, emit, attrs }) => {
		provide('formData', {
			uid,
			preserveForm: opt?.preserve,
			mode: opt?.mode,
			isSubmitted,
			emitter,
		});
		/*---------------------------------------------
		/  METHODS
		---------------------------------------------*/
		const getError = (name: GetKeys<T>) => {
			return getErrorMessage<T>(forms[uid].values, name);
		};
		const submit = async ($event: any) => {
			$event.preventDefault();
			isSubmitted.value = true;
			submitCount.value++;
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
				if (!forms[uid].values[key]?.value) {
					const field = getValueByPath(forms[uid].values, key);
					if (field) {
						field.value = convertedKeys[key];
					} else {
						forms[uid].values = mergeDeep(forms[uid].values, stringToObject(key, { value: convertedKeys[key], error: undefined }));
					}
				}
			}
		};
		/*---------------------------------------------
		/  WATCHERS
		---------------------------------------------*/
		watch(values, (curr, prev) => {
			values.value = curr;
			if (isFormReady.value && JSON.stringify(curr) !== JSON.stringify(prev) && props.onValueChange) {
				emitter.emit('value-change', uid);
			}
			if (opt?.mode === 'onChange' && isDirty.value) {
				emitter.emit('validate');
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
		let onValueChangeHandler: ((id: string) => void) | undefined;
		let onValidateHandler: (() => Promise<boolean | undefined>) | undefined;

		onMounted(async () => {
			initialValueToValue();
			originalForm = JSON.stringify(forms[uid].values);

			if (props?.onValueChange && forms[uid]) {
				onValueChangeHandler = (id: string) => {
					if (id === uid) {
						emit('value-change', values.value);
					}
				};
				emitter.on('value-change', onValueChangeHandler);
			}

			if (opt?.mode === 'onChange') {
				onValidateHandler = async () => {
					if (opt?.schema) {
						return await validateSchema(opt.schema, flattenObject(forms[uid].values), setError);
					}
				};
				emitter.on('validate', onValidateHandler);
			}
			await nextTick();
			isFormReady.value = true;
		});

		// Remove this <Form>'s listeners on unmount so they don't fire after the
		// component is gone or pile up across v-if remounts.
		onBeforeUnmount(() => {
			if (onValueChangeHandler) {
				emitter.off('value-change', onValueChangeHandler);
			}
			if (onValidateHandler) {
				emitter.off('validate', onValidateHandler);
			}
		});

		return () => {
			return h('form',
				{ ...props, ...attrs, ...emit, key: forms[uid].key, onSubmit: submit },
				slots.default?.({
					values: values.value,
					getError,
					getFieldState,
					isDirty: isDirty.value,
					isValid: isValid.value,
					isTouched: isTouched.value,
					isSubmitted: isSubmitted.value,
					submitCount: submitCount.value,
				}),
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
			default: {
				values: T,
				getError: (name: GetKeys<T>) => string,
				getFieldState: (name: GetKeys<T>) => FieldState,
				isDirty: boolean,
				isValid: boolean,
				isTouched: boolean,
				isSubmitted: boolean,
				submitCount: number,
			}
		}>,
	});

	return {
		cmp,
		values,
		isSubmitting,
		isSubmitted,
		isDirty,
		isValid,
		isTouched,
		submitCount,
		getFieldState,
		reset,
		setInitialValues,
		setValue,
		setValues,
		setError,
		validate,
		clearErrors,
		handleSubmit,
	};
};
