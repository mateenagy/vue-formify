import { Component, h, inject, onBeforeUnmount, watch } from 'vue';
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
	id?: string;
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
			id: {
				type: String,
				default: '',
			},
		},
		emits: ['update:modelValue'],
		setup: (props, ctx) => {
			const { formUID }: any = inject('form');
			const config: PluginOptions | undefined = inject('config', undefined);
			const defaultValue = {
				value: props.modelValue || props[options?.defaultValueKey as keyof typeof props] || props.default,
				error: undefined,
				ignore: props.ignore,
			};

			const createModelBindings = () => {
				const bindingMethod = Object.create({});
				bindingMethod[`onUpdate:${options?.modelKey}`] = (value: any) => {
					!props.ignore && (getValueByPath(STORE.value[formUID], props.name).value = value);
					getValueByPath(STORE.value[formUID], props.name)?.value || value;
					ctx.emit(`update:${options?.modelKey}`, getValueByPath(STORE.value[formUID], props.name)?.value || value);
				};

				return bindingMethod;
			};

			if (!getValueByPath(STORE.value[formUID], props.name) && !props.ignore) {
				const current = stringToObject(props.name, defaultValue);
				STORE.value[formUID] = mergeDeep(STORE.value[formUID], current);
			}

			onBeforeUnmount(() => {
				!props.preserve && deleteByPath(STORE.value[formUID], props.name);
			});

			watch(() => [props.name, props.value, props.default, props[options?.defaultValueKey as keyof typeof props], props.ignore], (curr, prev) => {
				const [name, value, def, customDef, ignore] = curr;
				const [prevName] = prev;
				deleteByPath(STORE.value[formUID], prevName);
				if (!ignore) {
					const current = stringToObject(props.name, { ...defaultValue, ...{ value: def || customDef } });
					STORE.value[formUID] = mergeDeep(STORE.value[formUID], current);
				}
			}, { deep: true });

			return () => {
				return h(component, {
					...((!config || (config as PluginOptions).useFocus) && {
						onFocus: () => {
							(!props.ignore && getValueByPath(STORE.value[formUID], props.name)?.error) && (getValueByPath(STORE.value[formUID], props.name).error = undefined);
						},
						onChange: () => {
							(!props.ignore && getValueByPath(STORE.value[formUID], props.name)?.error) && (getValueByPath(STORE.value[formUID], props.name).error = undefined);
						},
						onBlur: () => {
							(!props.ignore && getValueByPath(STORE.value[formUID], props.name)?.error) && (getValueByPath(STORE.value[formUID], props.name).error = undefined);
						},
					}),
					...props,
					id: props.id || Math.floor(Math.random() * Date.now()).toString(),
					name: props.name,
					error: getValueByPath(STORE.value[formUID], props.name)?.error || props.error,
					modelValue: props.modelValue || getValueByPath(STORE.value[formUID], props.name)?.value,
					ignore: false,
					'onUpdate:modelValue': (value: any) => {
						ctx.emit('update:modelValue', value);
						!props.ignore && 
							(getValueByPath(STORE.value[formUID], props.name) && (getValueByPath(STORE.value[formUID], props.name).value = value));
					},
					...(options?.modelKey && { ...createModelBindings() }),
				},
				{ ...ctx.slots });
			};
		},
	});

	return cmp;
};
