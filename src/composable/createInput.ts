import { Component, defineComponent, h, inject, resolveDynamicComponent, toRef } from 'vue';
import { useInput } from './useInput';
import { getKey, getValueByPath } from '@/utils/utils';


type BaseInput = {
	name?: string;
	id?: string;
	default?: any;
	value?: any;
	error?: any;
	onFocus?: void;
	modelValue?: any;
	ignore?: boolean;
	preserve?: boolean;
}

type CreateInputOptions = {
	modelKeys?: string | string[];
	useKey?: boolean;
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
		inheritAttrs: false,
		props: {
			default: {
				type: [String, Boolean, Number, Object, Array],
				default: '',
			},
			...(component as Component & { props: any }).props,
			name: {
				type: String,
				default: '',
			},
			id: {
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
			const form = inject<Record<string, any>>('formData', Object.create({}));
			const name = toRef(props, 'name');
			const inputs = new Map();			

			if (options?.modelKeys) {
				if (Array.isArray(options?.modelKeys)) {
					for (let index = 0; index < options?.modelKeys.length; index++) {
						inputs.set(options.modelKeys[index], useInput(name.value, props, options.modelKeys[index], options.useKey));
					}
				} else {
					inputs.set(options.modelKeys, useInput(name.value, props, options.modelKeys, options.useKey));
				}
			} else {
				inputs.set('modelValue', useInput(name.value, props));
			}

			const createModelBindings = () => {
				if (Array.isArray(options?.modelKeys)) {
					return options?.modelKeys?.reduce((bindingMethod: Record<string, any>, modelKey) => {
						bindingMethod[`onUpdate:${modelKey}`] = (value: any) => {
							emit(`update:${modelKey}`, value);
							!props.ignore && inputs.get(modelKey).updateValue(value, modelKey);
						};

						return bindingMethod;
					}, {});
				} else {
					return {
						[`onUpdate:${options?.modelKeys}`]: (value: any) => {
							emit(`update:${options?.modelKeys}`, value);
							!props.ignore && inputs.get(options?.modelKeys).updateValue(value, options?.modelKeys);
						},
					};
				}
			};

			const setDefaultValue = () => {
				const obj: Record<string, any> = {
					modelValue: props.modelValue || props.default || getValueByPath(form.value, props.name)?.value || '',
				};

				if (Array.isArray(options?.modelKeys) && typeof props.default === 'object') {
					options?.modelKeys.forEach((key) => {
						obj[key] = props.modelValue || props.default[key];
					});
				}

				return obj;
			};

			const getError = () => {
				if (!options?.modelKeys) {
					return getValueByPath(form.value, name.value)?.error;
				}

				if (Array.isArray(options?.modelKeys)) {
					return options.modelKeys.reduce((error: Record<string, any>, modelKey) => {
						error[modelKey] = inputs.get(modelKey).getError(modelKey);

						return error;
					}, {});
				}

				return inputs.get(options.modelKeys).getError(options.modelKeys);
			};

			return () => {
				const c = resolveDynamicComponent(component) as string;

				return h(c,
					{
						...props,
						...attrs,
						name: props.name,
						id: props.id || Math.floor(Math.random() * Date.now()).toString(),
						value: props.modelValue || props.default || form.value[props.name]?.value,
						...{ ...setDefaultValue() },
						error: getError() || props.error,
						onFocus: (key?: string) => {
							if (key && typeof key === 'string') {
								const _key = getKey(name.value, key, options?.useKey);
								getValueByPath(form.value, _key)?.error && (getValueByPath(form.value, _key).error = undefined);
							} else if (name.value.match(/.\[/)) {
								const _key = name.value.split(/\[/)[0];

								getValueByPath(form.value, _key)?.error && (getValueByPath(form.value, _key).error = undefined);
							} else {
								getValueByPath(form.value, name.value)?.error && (getValueByPath(form.value, name.value).error = undefined);
							}
						},
						...(options?.modelKeys && { ...createModelBindings() }),
						'onUpdate:modelValue': (value: any) => {
							emit('update:modelValue', value);
							!props.ignore && inputs.get('modelValue')?.updateValue?.(value);
						},
					},
					{
						...slots,
					});
			};
		},
	});
};
