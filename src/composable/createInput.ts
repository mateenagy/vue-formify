import { Component, h, inject } from 'vue';
import type { FunctionalComponent } from 'vue';
import { formCore } from '@/core/formCore';

type BaseInput = {
	name: string;
	modelValue?: any;
	error?: any;
	ignore?: boolean;
}

type CreateInputOptions = {
	modelKey: string;
}

export const createInput = <T>(component: Component, options?: CreateInputOptions) => {
	const FComponent: FunctionalComponent<T & BaseInput, any> = (
		props,
		context,
	) => {
		const { updateFormData, formElements } = formCore(context.emit);
		const config: any = inject('config', undefined);

		const createModelBindings = () => {
			const bindingMethod = Object.create({});
			bindingMethod[`onUpdate:${options?.modelKey}`] = (value: any) => {
				updateFormData(props.name, value);
				formElements.value[props.name]?.value || value;
				context.emit(`update:${options?.modelKey}`, formElements.value[props.name]?.value || value);
			};

			return bindingMethod;
		};

		return h(component, {
			error: formElements.value[props.name]?.error || props.error,
			modelValue: props.modelValue || formElements.value[props.name]?.value,
			ignore: false,
			...(!config || config.useFocus && {
				onFocus: () => {
					formElements.value[props.name].error && (formElements.value[props.name].error = undefined);
				},
				onChange: () => {
					formElements.value[props.name].error && (formElements.value[props.name].error = undefined);
				},
				onBlur: () => {
					formElements.value[props.name].error && (formElements.value[props.name].error = undefined);
				},
			}),
			...props,
			'onUpdate:modelValue': (value: any) => {
				updateFormData(props.name, value);
				formElements.value[props.name]?.value || value;
				context.emit('update:modelValue', formElements.value[props.name]?.value || value);
			},
			...(options?.modelKey && { ...createModelBindings() }),
		},
		{ ...context.slots });
	};

	return FComponent;
};
