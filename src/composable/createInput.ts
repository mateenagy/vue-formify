import { getValueByPath } from '@/utils/utils';
import { Component, defineComponent, h, inject, Ref, resolveDynamicComponent } from 'vue';
import { useField } from './useField';
//TODO: Custom default key
export type BaseInput = {
	name?: string;
	default?: any;
	modelValue?: any;
	error?: any;
	ignore?: boolean;
	preserve?: boolean;
}

export type CreateInputOptions = {
	default?: string | number | any[];
	modelKeys?: string | string[];
	// defaultValueKey?: any;
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
				type: [String, Number, Array],
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
			modelValue: {
				type: [String, Boolean, Number, Object, Array],
				default: undefined,
			},
		},
		emits: ['update:modelValue', ...emitsArray],
		setup: (props, { emit, slots, attrs }) => {
			const form = inject<Ref<Record<string, any>>>('form', Object.create({}));
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
					modelValue: props.modelValue || props.default || getValueByPath(form.value, props.name)?.value || '',
				};

				if (options?.modelKeys) {
					if (Array.isArray(options.modelKeys)) {
						options.modelKeys.forEach((key) => {
							obj[key] = props.name ? getValueByPath(form.value, props.name)?.[key]?.value : key || props.modelValue || props.default[key];
						});
					} else {
						obj[options.modelKeys] = props.name ? getValueByPath(form.value, props.name)?.[options.modelKeys]?.value : options.modelKeys;
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
								!props.ignore && fields.get(options.modelKeys).updateValue(value, options.modelKeys);
							},
						};
					}
				} else {
					return {
						['onUpdate:modelValue']: (value: any) => {
							emit('update:modelValue', value);
							(!props.ignore && getValueByPath(form.value, props.name)) && (getValueByPath(form.value, props.name).value = value);
						},
					};
				}
			};

			const getError = () => {
				if (!options?.modelKeys) {
					return getValueByPath(form.value, props.name)?.error;
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
						onFocus: (key?: string) => {
							if (key && typeof key === 'string') {
								const _key = props.name ? `${props.name}.${key}` : key;
								getValueByPath(form.value, _key)?.error && (getValueByPath(form.value, _key).error = undefined);
							} else if (props.name?.match(/.\[/)) {
								const _key = props.name?.split(/\[/)[0];

								getValueByPath(form.value, _key)?.error && (getValueByPath(form.value, _key).error = undefined);
							} else {
								getValueByPath(form.value, props.name)?.error && (getValueByPath(form.value, props.name).error = undefined);
							}
						},
						error: getError() || props?.error,
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
