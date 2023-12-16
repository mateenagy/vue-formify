import { Component, h, inject, onBeforeUnmount, onMounted, watch } from 'vue';
import { defineComponent } from 'vue';
import { PluginOptions } from '@/components';
import { STORE } from '@/store/store';
import { deleteByPath, getValueByPath, mergeDeep, stringToObject } from '@/utils/utils';

type BaseInput = {
	name: string;
	default?: any;
	value?: any;
	modelValue?: any;
	error?: any;
	ignore?: boolean;
	preserve?: boolean;
}

type CreateInputOptions = {
	modelKey?: string;
	defaultValueKey?: any;
}

export const createInput = <T>(component: Component, options?: CreateInputOptions) => {
	const cmp = defineComponent<T & BaseInput>({
		props: {
			...(component as any).props,
			name: {
				type: String,
				default: '',
			},
			default: {
				type: [String, Boolean, Number, Object],
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
		},
		emits: ['update:modelValue'],
		setup: (props, ctx) => {
			const { formName, updateFormData }: any = inject('form');
			const config: PluginOptions | undefined = inject('config', undefined);
			const defaultValue = {
				value: props[options?.defaultValueKey as keyof typeof props] || props.default,
				error: undefined,
				ignore: props.ignore,
			};

			const createModelBindings = () => {
				const bindingMethod = Object.create({});
				bindingMethod[`onUpdate:${options?.modelKey}`] = (value: any) => {
					updateFormData(props.name, value);
					getValueByPath(STORE.value[formName], props.name)?.value || value;
					ctx.emit(`update:${options?.modelKey}`, getValueByPath(STORE.value[formName], props.name)?.value || value);
				};

				return bindingMethod;
			};

			onMounted(() => {
				if (!getValueByPath(STORE.value[formName], props.name) && !props.ignore) {
					const current = stringToObject(props.name, defaultValue);
					STORE.value[formName] = mergeDeep(STORE.value[formName], current);
				}
			});

			onBeforeUnmount(() => {
				!props.preserve && deleteByPath(STORE.value[formName], props.name);
			});

			watch(() => [props.name, props.value, props.default, props.ignore], (curr) => {
				const [name, value, def, ignore] = curr;
				deleteByPath(STORE.value[formName], name);
				if (!ignore) {
					const current = stringToObject(props.name, { ...defaultValue, ...{ value: def } });
					STORE.value[formName] = mergeDeep(STORE.value[formName], current);
				}
			}, { deep: true });

			return () => {
				return h(component, {
					...((!config || (config as PluginOptions).useFocus) && {
						onFocus: () => {
							(!props.ignore && getValueByPath(STORE.value[formName], props.name)?.error) && (getValueByPath(STORE.value[formName], props.name).error = undefined);
						},
						onChange: () => {
							(!props.ignore && getValueByPath(STORE.value[formName], props.name)?.error) && (getValueByPath(STORE.value[formName], props.name).error = undefined);
						},
						onBlur: () => {
							(!props.ignore && getValueByPath(STORE.value[formName], props.name)?.error) && (getValueByPath(STORE.value[formName], props.name).error = undefined);
						},
					}),
					...props,
					name: props.name,
					error: getValueByPath(STORE.value[formName], props.name)?.error || props.error,
					modelValue: getValueByPath(STORE.value[formName], props.name)?.value || props.modelValue,
					ignore: false,
					'onUpdate:modelValue': (value: any) => {
						ctx.emit('update:modelValue', value);
						updateFormData(props.name, value);
					},
					...(options?.modelKey && { ...createModelBindings() }),
				},
				{ ...ctx.slots });
			};
		},
	});

	return cmp;
};
