import { GetKeys } from '@/composable/useForm';
import { forms } from '@/utils/store';
import { getValueByPath, mergeDeep, flattenObject, createFormDataFromObject, fetcher, EventEmitter } from '@/utils/utils';
import { ref, defineComponent, computed, onMounted, provide, h, PropType, SlotsType, watch } from 'vue';

type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P];
};

type FormType<T extends Record<string, any>> = {
	enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data';
	validationSchema?: any;
	action?: string;
	initialValues?: RecursivePartial<T>;
	name?: string;
	preserve?: boolean;
	onValueChange?: (value?: any) => void;
	onSubmit?: (value?: any, $event?: SubmitEvent) => void | Promise<any>;
}

export type FormOptions<T extends Record<string, any>> = {
	initialValues: T extends Record<string, any> ? Partial<T> : Record<string, any>
}

export const FormCompBase = <T extends Record<string, any> = Record<string, any>>(opt?: FormOptions<T>) => {
	let uid: number | string = Math.floor(Math.random() * Date.now());
	let originalForm = Object.create({});
	const _val = ref<T>(Object.create({}));
	const isSubmitting = ref<boolean>(false);

	const handleSubmit = (cb?: (data?: T) => void | Promise<any>) => {
		return async () => {
			await cb?.(_val.value as T);
		};
	};

	const setError = (name: GetKeys<T>, error: any) => {
		if (getValueByPath(forms[uid].values, name as unknown as string)) {
			getValueByPath(forms[uid].values, name as unknown as string).error = error;
		}
	};

	const setInitalValues = (initials: Partial<T>) => {
		forms[uid].initialValues = mergeDeep(flattenObject(forms[uid].values), initials);
		forms[uid].key++;
	};

	const reset = () => {
		EventEmitter.emit('reset');
		forms[uid].values = JSON.parse(originalForm);
		forms[uid].key++;
	};

	const cmp = defineComponent(
		(props: FormType<T>, { slots, emit, attrs, expose }) => {
			props.name && (uid = props.name);

			const updateField = (name: string, value: any) => {
				if (getValueByPath(forms[uid].values, name)) {
					getValueByPath(forms[uid].values, name).value = value;

					EventEmitter.emit('value-change', uid);
				}
			};

			EventEmitter.on('value-change', (id: string) => {
				if (id === uid && props?.onValueChange) {
					emit('value-change', values.value);
				}
			});

			const submit = async ($event: any) => {
				$event.preventDefault();
				let _val = values.value;

				if (props.validationSchema) {
					const result = await props.validationSchema.parse(flattenObject(forms[uid].values));
					if (Object.keys(result.errors).length) {
						for (const key in result.errors) {
							setError(key as any, result.errors[key]);
						}

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

			const flush = () => {
				forms[uid].initialValues = Object.create({});
				forms[uid].values = Object.create({});
				forms[uid].key++;
			};

			/*---------------------------------------------
			/  COMPUTED
			---------------------------------------------*/
			const errors = computed(() => {
				return flattenObject(forms[uid].values, 'error');
			});
			const values = computed(() => {
				return flattenObject(forms[uid]?.values) as T;
			});

			watch(values, curr => _val.value = curr);

			/*---------------------------------------------
			/  CREATED
			---------------------------------------------*/
			if (!forms[uid]) {
				forms[uid] = {
					values: Object.create({}),
					initialValues: opt?.initialValues || props.initialValues || {},
					key: 0,
				};
			} else {
				props.initialValues && (forms[uid].initialValues = opt?.initialValues || props.initialValues);
			}

			if (props.validationSchema && typeof props.validationSchema.cast === 'function') {
				forms[uid].initialValues = props.initialValues ? mergeDeep(props.initialValues, opt?.initialValues || {}, props.validationSchema.cast(flattenObject(forms[uid].values))) : mergeDeep(opt?.initialValues || {}, props.validationSchema.cast(flattenObject(forms[uid].values)));
			}

			/*---------------------------------------------
			/  HOOKS
			---------------------------------------------*/
			onMounted(() => {
				originalForm = JSON.stringify(forms[uid].values);
			});

			provide('formData', {
				uid,
				preserve: props.preserve,
			});

			expose({
				values,
				errors,
				setError,
				updateField,
				reset,
				flush,
				isSubmitting,
			});


			return () => {
				return h('form',
					{ ...props, ...attrs, ...emit, key: forms[uid].key, onSubmit: submit },
					slots.default?.({ values: values.value, errors: errors.value }),
				);
			};
		},
		{
			name: 'FormifyForm',
			props: {
				enctype: {
					type: String as PropType<'application/x-www-form-urlencoded' | 'multipart/form-data'>,
					default: undefined,
				},
				validationSchema: {
					type: Object as PropType<Record<string, any>>,
					default: undefined,
				},
				initialValues: {
					type: Object as PropType<any>,
					default: undefined,
				},
				name: {
					type: String as PropType<string>,
					default: undefined,
				},
				action: {
					type: String as PropType<string>,
					default: undefined,
				},
				preserve: {
					type: Boolean as PropType<boolean>,
					default: undefined,
				},
				onValueChange: {
					type: Function as PropType<(value?: any) => void>,
					default: undefined,
				},
				onSubmit: {
					type: Function as PropType<(value?: any, $event?: SubmitEvent) => void | Promise<any>>,
					default: undefined,
				},
			},
			slots: Object as SlotsType<{
				default: { values: T, errors: any }
			}>,
			emits: ['submit', 'value-change'],
		},
	);

	return {
		cmp,
		handleSubmit,
		setError,
		setInitalValues,
		reset,
		values: _val,
		isSubmitting,
	};
};
