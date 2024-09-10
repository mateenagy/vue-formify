import { EventEmitter, getKey, getValueByPath } from '@/utils/utils';
import { Component, defineComponent, h, inject, resolveDynamicComponent } from 'vue';
import { useField } from './useField';
import { forms } from '@/utils/store';

export type BaseInput = {
	name?: string;
	default?: any;
	modelValue?: any;
	error?: any;
	ignore?: boolean;
	preserve?: boolean;
}

export type CreateInputOptions = {
	default?: any;
	modelKeys?: string | string[];
	useModelKeyAsState?: boolean;
	defaultValueKey?: any;
}

export const createInput = <T>(component: Component, options?: CreateInputOptions) => {
	const emitsArray: string[] = [];
	if (Array.isArray(options?.modelKeys)) {
		options?.modelKeys.forEach((key) => {
			emitsArray.push(`update:${key}`);
		});
	}

	if (typeof options?.modelKeys === 'string') {
		emitsArray.push(`update:${options.modelKeys}`);
	}

	return defineComponent<BaseInput & T>({
		name: 'Field',
		props: {
			default: {
				type: [String, Number, Array, Object, Boolean],
				default: options?.default ?? '',
			},
			...(component as Component & { props: any }).props,
			name: {
				type: String,
				default: '',
			},
			ignore: {
				type: Boolean,
				default: false,
			},
			preserve: {
				type: Boolean,
				default: false,
			},
			[options?.defaultValueKey]: {
				type: [String, Boolean, Number, Object, Array],
				default: '',
			},
			modelValue: {
				type: [String, Boolean, Number, Object, Array],
				default: undefined,
			},
		},
		emits: ['update:modelValue', ...emitsArray],
		setup: (props, { emit, slots, attrs }) => {
			const { uid } = inject('formData', Object.create({}));
			const fields = new Map();

			if (options?.modelKeys) {
				if (Array.isArray(options.modelKeys)) {
					options.modelKeys.forEach((modelKey: string) => {
						fields.set(modelKey, useField(props, emit, options));
					});
				} else {
					fields.set(options?.modelKeys, useField(props, emit, options));
				}
			} else {
				fields.set('modelValue', useField(props, emit, options));
			}

			const setDefaultValue = () => {
				const obj: Record<string, any> = {
					modelValue: props.modelValue || getValueByPath(forms[uid].values, props.name)?.value || props.default || '',
				};

				if (options?.modelKeys) {
					if (Array.isArray(options.modelKeys)) {
						options.modelKeys.forEach((key) => {
							obj[key] = getValueByPath(forms[uid].values, props.name)?.[key]?.value || props.modelValue || props.default[key];
						});
					} else {
						obj[options.modelKeys] = props[options.modelKeys as keyof typeof props] ?? getValueByPath(forms[uid].values, props.name)?.[options.modelKeys]?.value ?? props.modelValue ?? props.default;
						options.useModelKeyAsState && (
							obj.modelValue = props[options.modelKeys as keyof typeof props] ?? getValueByPath(forms[uid].values, props.name)?.[options.modelKeys]?.value,
							getValueByPath(forms[uid].values, props.name)[options.modelKeys].value = obj[options.modelKeys]
						);
						const key = getKey(props.name, options.modelKeys, options.useModelKeyAsState);
						getValueByPath(forms[uid].values, key).value = obj[options.modelKeys];
					}
				}
				
				return obj;
			};

			const createModelBindings = () => {
				if (options?.modelKeys) {
					if (Array.isArray(options.modelKeys)) {
						return options.modelKeys?.reduce((bindingMethod: Record<string, any>, modelKey) => {
							bindingMethod[`onUpdate:${modelKey}`] = (value: any) => {
								emit(`update:${modelKey}`, value);
								!props.ignore && fields.get(modelKey).updateValue(value, modelKey);
							};

							return bindingMethod;
						}, {});
					} else {
						return {
							[`onUpdate:${options.modelKeys}`]: (value: any) => {
								emit(`update:${options.modelKeys}`, value);
								(!props.ignore) && fields.get(options.modelKeys).updateValue(value, options.modelKeys);
							},
							...options.useModelKeyAsState && {
								['onUpdate:modelValue']: (value: any) => {
									emit('update:modelValue', value);
									(!props.ignore && getValueByPath(forms[uid].values, props.name)) && (getValueByPath(forms[uid].values, props.name).value = value);
									EventEmitter.emit('value-change', uid);
								},
							},
						};
					}
				} else {
					return {
						['onUpdate:modelValue']: (value: any) => {
							emit('update:modelValue', value);
							(!props.ignore && getValueByPath(forms[uid].values, props.name)) && (getValueByPath(forms[uid].values, props.name).value = value);
							EventEmitter.emit('value-change', uid);
						},
					};
				}
			};

			const getError = () => {
				if (!options?.modelKeys || options?.useModelKeyAsState) {
					return getValueByPath(forms[uid].values, props.name)?.error;
				}

				if (Array.isArray(options?.modelKeys)) {
					return options.modelKeys.reduce((error: Record<string, any>, modelKey) => {
						error[modelKey] = fields.get(modelKey).getError(modelKey);

						return error;
					}, {});
				}

				return fields.get(options.modelKeys).getError(options.modelKeys);
			};

			return () => {
				const c = resolveDynamicComponent(component) as string;

				return h(c,
					{
						...props,
						...attrs,
						name: props.name,
						error: getError() || props?.error,
						onFocus: (key?: string) => {
							if (key && typeof key === 'string') {
								const _key = getKey(props.name, key, options?.useModelKeyAsState);
								getValueByPath(forms[uid].values, _key)?.error && (getValueByPath(forms[uid].values, _key).error = undefined);
							} else if (props.name?.match(/.\[/)) {
								const _key = props.name?.split(/\[/)[0];

								getValueByPath(forms[uid].values, _key)?.error && (getValueByPath(forms[uid].values, _key).error = undefined);
							} else {
								getValueByPath(forms[uid].values, props.name)?.error && (getValueByPath(forms[uid].values, props.name).error = undefined);
							}
						},
						...{ ...setDefaultValue() },
						...createModelBindings(),
					},
					{
						...slots,
					});
			};
		},
	});
};
