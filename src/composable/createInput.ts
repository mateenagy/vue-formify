import { Component, h } from 'vue';
import { formCore } from '@/core/formCore';

export const createInput = (component: Component) => {
	const cmp = {
		props: ['modelValue', 'name'],
		emits: ['update:modelValue'],
		setup: (props: any, { emit }: any) => {
			const { updateFormData, formElements } = formCore(emit);

			return () =>
				h(component, {
					name: '',
					modelValue: props.modelValue || formElements.value[props.name]?.value,
					'onUpdate:modelValue': (value: any) => {
						updateFormData(props.name, value);
						emit('update:modelValue', formElements.value[props.name]?.value || value);
					},
				});
		},
	};

	return cmp;
};
