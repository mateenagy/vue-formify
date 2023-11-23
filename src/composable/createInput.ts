import { Component, h, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { defineComponent } from 'vue';
import { PluginOptions } from '@/components';
import { STORE } from '@/store/store';

type BaseInput = {
	name: string;
	default?: any;
	value?: any;
	modelValue?: any;
	error?: any;
	ignore?: boolean;
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
		},
		emits: ['update:modelValue'],
		setup: (props, ctx) => {
			const { formName, updateFormData }: any = inject('form');
			const config: PluginOptions | undefined = inject('config', undefined);
			const prevValue = ref<string>(props.name);

			const createModelBindings = () => {
				const bindingMethod = Object.create({});
				bindingMethod[`onUpdate:${options?.modelKey}`] = (value: any) => {
					updateFormData(props.name, value);
					STORE.value[formName][props.name]?.value || value;
					ctx.emit(`update:${options?.modelKey}`, STORE.value[formName][props.name]?.value || value);
				};

				return bindingMethod;
			};

			onMounted(() => {
				if (!STORE.value[formName][props.name]) {
					STORE.value[formName][props.name] = {
						value: (props.value || props[options?.defaultValueKey as keyof typeof props] || props.default),
						error: '',
					};
				}
			});

			onBeforeUnmount(() => {
				delete STORE.value[formName][props.name];
			});

			watch(() => [props.name, props.value, props.default], () => {
				delete STORE.value[formName][prevValue.value];
				STORE.value[formName][props.name] = {
					value: (props.value || props[options?.defaultValueKey as keyof typeof props] || props.default),
					error: '',
				};
				prevValue.value = props.name;
			});

			return () => {
				return h(component, {
					...((!config || (config as PluginOptions).useFocus) && {
						onFocus: () => {
							STORE.value[formName][props.name].error && (STORE.value[formName][props.name].error = undefined);
						},
						onChange: () => {
							STORE.value[formName][props.name].error && (STORE.value[formName][props.name].error = undefined);
						},
						onBlur: () => {
							STORE.value[formName][props.name].error && (STORE.value[formName][props.name].error = undefined);
						},
					}),
					...props,
					name: props.name,
					error: STORE.value?.[formName]?.[props?.name]?.error || props.error,
					modelValue: STORE.value?.[formName]?.[props.name]?.value || props.modelValue,
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
