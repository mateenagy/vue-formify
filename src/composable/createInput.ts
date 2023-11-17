import { Component, h, inject } from 'vue';
import type { FunctionalComponent } from 'vue';
import { formCore } from '@/core/formCore';

type Events = {
	'update:modelValue'(message: string): void;
	'change'(cb: () => void): void;
	update(value: any): void;
}

type BaseInput = {
	name: string;
	modelValue?: any;
	error?: any;
	ignore?: boolean;
}

export const createInput = <T>(component: Component) => {
	const FComponent: FunctionalComponent<T & BaseInput, Events> = (
		props,
		context,
	) => {
		const { updateFormData, formElements } = formCore(context.emit);
		const config: any = inject('config', undefined);

		return h(component, {
			error: formElements.value[props.name]?.error || props.error,
			modelValue: props.modelValue || formElements.value[props.name]?.value,
			ignore: false,
			'onUpdate:modelValue': (value: any) => {
				updateFormData(props.name, value);
				formElements.value[props.name]?.value || value;
				context.emit('update:modelValue', formElements.value[props.name]?.value || value);
			},
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
		},
		{ ...context.slots });
	};

	return FComponent;
};
