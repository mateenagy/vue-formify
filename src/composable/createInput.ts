import { Component, h, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { defineComponent } from 'vue';
import { STORE } from '@/store/store';


type BaseInput = {
	name: string;
	defaultValue?: any;
	modelValue?: any;
	error?: any;
	ignore?: boolean;
}

type CreateInputOptions = {
	modelKey: string;
}

export const createInput = <T>(component: Component, options?: CreateInputOptions) => {
	const cmp = defineComponent<T & BaseInput>({
		props: (component as any).props,
		emits: ['update:modelValue'],
		setup: (props, ctx) => {
			const { formName, updateFormData }: any = inject('form');
			const config: any = inject('config', undefined);
			const prevValue = ref<string>(props.name);
			console.log('[cmp]: ', component);

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
						value: props.defaultValue || '',
						error: '',
					};
				}
			});

			onBeforeUnmount(() => {
				delete STORE.value[formName][props.name];
			});

			watch(() => [props.name, props.defaultValue], () => {
				delete STORE.value[formName][prevValue.value];
				STORE.value[formName][props.name] = {
					value: props.defaultValue || '',
					error: '',
				};
				prevValue.value = props.name;
			});

			return () => {
				return h(component, {
					...(!config || config.useFocus && {
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
					error: STORE.value[formName][props.name]?.error || props.error,
					modelValue: props.modelValue || STORE.value[formName][props.name]?.value,
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
