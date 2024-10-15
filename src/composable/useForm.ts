/* eslint-disable vue/one-component-per-file */
import { createFormDataFromObject, deleteByPath, EventEmitter, flattenObject, getValueByPath, normalizeChildren, resolveTag } from '@/utils/utils';
import { computed, defineComponent, h, inject, InputHTMLAttributes, nextTick, onMounted, PropType, provide, ref, resolveDynamicComponent, SlotsType, toValue } from 'vue';
import { forms } from '@/utils/store';
import { useField } from './useField';

type GetNestedArray<T> = T extends (infer U)[]
	? `${GetNestedArray<U>}[]` | `${GetNestedArray<U>}[${number}]`
	: T extends object
	? {
		[K in keyof T]: T[K] extends (infer U)[]
		? `${K & string}[]${U extends object ? `.${GetNestedArray<U>}` : ''}` | `${K & string}${U extends object ? `.${GetNestedArray<U>}` : ''}` | `${K & string}[${number}]${U extends object ? `.${GetNestedArray<U>}` : ''}`
		: `${K & string}${T[K] extends object ? `.${GetNestedArray<T[K]>}` : ''}`;
	}[keyof T]
	: '';

export type GetKeys<T extends Record<string, any>> = keyof {
	[K in keyof T as (
		T[K] extends string | number | boolean | Date ? `${K & string}` :
		T[K] extends (string | number | boolean | Date | undefined)[] | undefined ? `${K & string}[]` | `${K & string}[${number}]` | `${K & string}` :
		T[K] extends any[] ? `${K & string}[]` | `${K & string}[${number}]` | `${K & string}` :
		T[K] extends object ? `${K & string}.${GetNestedArray<T[K]> & string}` : `${K & string}`
	)]: any
}

type FormType = {
	enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data';
	validationSchema?: any;
	initialValues?: any;
	name?: string;
	preserve?: boolean;
	onValueChange?: (value?: any) => void;
}

type FieldType<T extends Record<string, any>> = {
	name: GetKeys<T>;
	error?: any;
	default?: any;
	ignore?: any;
	trueValue?: any;
	modelValue?: any;
	falseValue?: any;
	preserve?: boolean;
	as?: 'input' | 'select';
} & InputHTMLAttributes

type FieldArrayType<T extends Record<string, any>> = {
	name: GetKeys<T>;
	error?: any;
	ignore?: boolean;
	initialValues?: any[];
	preserve?: boolean;
	default?: any[];
}

const FormComp = <T extends Record<string, any> = Record<string, any>>() => defineComponent(
	(props: FormType, { slots, emit, attrs, expose }) => {
		const uid = props.name || Math.floor(Math.random() * Date.now());
		let originalForm = Object.create({});
		const setError = (name: string, error: any) => {
			if (getValueByPath(forms[uid].values, name)) {
				getValueByPath(forms[uid].values, name).error = error;
			}
		};

		const updateField = (name: string, value: any) => {
			if (getValueByPath(forms[uid].values, name)) {
				getValueByPath(forms[uid].values, name).value = value;

				EventEmitter.emit('value-change', uid);
			}
		};

		const reset = () => {
			EventEmitter.emit('reset');
			forms[uid].values = JSON.parse(originalForm);
			forms[uid].key++;
		};

		EventEmitter.on('value-change', (id: string) => {
			if (id === uid && props?.onValueChange) {
				emit('value-change', values.value);
			}
		});

		const submit = async ($event: any) => {
			$event.preventDefault();
			let _value: any = values.value;
			if (props.validationSchema) {
				const result = await props.validationSchema.parse(flattenObject(forms[uid].values));

				if (result.errors.length) {
					result.errors.forEach((err: any) => {
						setError(err.key, err.message);
					});

					return;
				}
			}

			if (props?.enctype === 'multipart/form-data') {
				_value = createFormDataFromObject(flattenObject(forms[uid].values));
			}
			emit('submit', _value, $event);
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
			return flattenObject(forms[uid].values) as T;
		});

		/*---------------------------------------------
		/  CREATED
		---------------------------------------------*/
		if (!forms[uid]) {
			forms[uid] = {
				values: Object.create({}),
				initialValues: props.initialValues,
				key: 0,
			};
		} else {
			props.initialValues && (forms[uid].initialValues = props.initialValues);
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
				type: Object as PropType<Record<string, any>>,
				default: undefined,
			},
			name: {
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
		},
		slots: Object as SlotsType<{
			default: { values: T, errors: any }
		}>,
		emits: ['submit', 'value-change'],
	},
);

const FieldComp = <T extends Record<string, any> = Record<string, any>>() => defineComponent(
	(props: FieldType<T>, { emit, slots, attrs: baseAttrs }) => {
		const {
			value,
			onInput,
			onFocus,
			getError,
		} = useField(props, emit);

		const sharedProps = computed(() => {
			const attrs: Record<string, any> = {
				...baseAttrs,
				name: props.name,
				onInput: (evt: any) => {
					onInput(evt);
					if (typeof baseAttrs.onInput === 'function') {
						baseAttrs.onInput();
					}
				},
				onChange: (evt: any) => {
					onInput(evt);
					if (typeof baseAttrs.onChange === 'function') {
						baseAttrs.onChange();
					}
				},
				onFocus: () => {
					onFocus();
					if (typeof baseAttrs.onFocus === 'function') {
						baseAttrs.onFocus();
					}
				},
				onBlur: () => {
					if (typeof baseAttrs.onBlur === 'function') {
						baseAttrs.onBlur();
					}
				},
			};

			if (attrs.type === 'checkbox' && value.value) {
				attrs.checked = true;
			}

			if (props.as !== 'select' && !attrs.multiple) {
				attrs.value = value.value;
			}

			return attrs;
		});

		const slotProps = () => {
			return {
				field: {
					...sharedProps.value,
					modelValue: value.value,
				},
				componentField: {
					value: value.value,
				},
				value: value.value,
				modelValue: value.value,
				error: getError(),
			};
		};

		return () => {
			const tag = resolveDynamicComponent(resolveTag(props, slots)) as string;
			const children = normalizeChildren(tag, slots, slotProps);
			if (tag) {
				return h(tag,
					{
						...props,
						...sharedProps.value,
					},
					children,
				);
			} else {
				return children;
			}
		};
	},
	{
		name: 'Field',
		inheritAttrs: false,
		props: {
			name: {
				type: String as PropType<any>,
				required: true,
			},
			default: {
				type: [String, Array, Boolean, Number, Object] as PropType<any>,
				default: '',
			},
			error: {
				type: String,
				default: undefined,
			},
			ignore: {
				type: Boolean,
				default: false,
			},
			preserve: {
				type: Boolean,
				default: false,
			},
			trueValue: {
				type: [Boolean, String, Number],
				default: true,
			},
			falseValue: {
				type: [Boolean, String, Number],
				default: false,
			},
			modelValue: {
				type: [String, Array, Boolean, Number, Object] as PropType<any>,
				default: undefined,
			},
			as: {
				type: String as PropType<'input' | 'select' | undefined>,
				default: undefined,
			},
		},
		emits: ['update:modelValue'],
		slots: Object as SlotsType<{
			default: { field: { value: any }, error: any }
		}>,
	},
);

const FieldArrayComp = <T extends Record<string, any> = Record<string, any>>() => defineComponent(
	(props: FieldArrayType<T>, { slots, emit, attrs }) => {
		/*---------------------------------------------
		/  VARIABLES
		---------------------------------------------*/
		const fields = ref<any[]>([]);
		const { setArrayValue, getError } = useField(props, emit, true);
		const { uid } = inject('formData', Object.create({}));

		/*---------------------------------------------
		/  METHODS
		---------------------------------------------*/
		const add = () => {
			!props.ignore && (getValueByPath(forms[uid].values, props.name as string).error = undefined);

			fields.value.push({
				id: fields.value.length,
				name: props.name,
			});
		};

		const remove = (idx: number) => {
			getValueByPath(forms[uid].values, props.name as string).error = undefined;

			const removedIndex = fields.value.findIndex(field => field.id === idx);
			for (let index = removedIndex + 1; index < fields.value.length; index++) {
				const tmp = JSON.parse(JSON.stringify(getValueByPath(forms[uid].values, `${props.name as string}[${index}]`)));
				if (getValueByPath(forms[uid].values, `${props.name as string}[${index - 1}]`)) {
					setArrayValue({
						[`[${index - 1}]`]: tmp,
					});
				}
			}
			deleteByPath(forms[uid].values, `${fields.value[fields.value.length - 1].name}[${fields.value.length - 1}]`);
			fields.value.splice(-1);
		};

		const init = () => {
			fields.value = [];
			const initials = forms[uid].initialValues?.[props.name] || props.initialValues;
			if (initials) {
				initials.forEach(() => {
					fields.value.push({
						id: fields.value.length,
						name: props.name,
					});
				});

				nextTick(() => {
					if (initials) {
						initials.forEach((value: any, idx: any) => {
							if (typeof value === 'object') {
								Object.keys(value).forEach((key) => {
									setArrayValue({
										[`[${idx}]`]: {
											[key]: {
												value: value[key],
											},
										},
									});
								});
							} else {
								setArrayValue({
									[`[${idx}]`]: {
										value,
									},
								});
							}
						});
					}
				});
			}
		};
		/*---------------------------------------------
		/  CREATED
		---------------------------------------------*/
		init();
		EventEmitter.on('reset', () => {
			init();
		});

		return () => {
			return h('div',
				{ ...props, ...attrs, ...emit },
				slots.default?.({ fields: toValue(fields), add, remove, error: getError() }),
			);
		};
	},
	{
		name: 'FieldArray',
		props: {
			name: {
				type: String as PropType<any>,
				required: true,
			},
			error: {
				type: String as PropType<string>,
				default: undefined,
			},
			ignore: {
				type: Boolean as PropType<boolean>,
				default: undefined,
			},
			initialValues: {
				type: Object as PropType<any>,
				default: undefined,
			},
			default: {
				type: Array as PropType<any[]>,
				default: undefined,
			},
			preserve: {
				type: Boolean as PropType<boolean>,
				default: undefined,
			},
		},
		slots: Object as SlotsType<{
			default: { fields: any[], add: () => void, remove: (idx: number) => void, error: any }
		}>,
		emits: ['update:modelValue'],
	},
);

const ErrorComp = <T extends Record<string, any> = Record<string, any>>() => defineComponent(
	(props: { errorFor: GetKeys<T> }, { slots, emit, attrs }) => {
		const { uid } = inject('formData', Object.create({}));

		const getError = () => {
			return getValueByPath(forms[uid].values, props.errorFor as string)?.error;
		};

		return () => {
			return h('span',
				{ ...props, ...attrs, ...emit },
				slots.default ? slots.default?.({ error: getError() }) as SlotsType<{ error: any }> : getError(),
			);
		};
	},
	{
		props: {
			errorFor: {
				type: String as PropType<any>,
				default: undefined,
			},
		},
		slots: Object as SlotsType<{
			default: { error: any }
		}>,
	},
);

export const Form = FormComp();
export const Field = FieldComp();
export const FieldArray = FieldArrayComp();
export const Error = ErrorComp();

export const useForm = <T extends Record<string, any>>() => {
	const Form = FormComp<T>();
	const Field = FieldComp<T>();
	const FieldArray = FieldArrayComp<T>();
	const Error = ErrorComp<T>();

	return {
		Form,
		Field,
		FieldArray,
		Error,
	};
};
