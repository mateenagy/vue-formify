import { inject, computed } from 'vue';

export const useCreateInput = (props: any, emit: any) => {
	const { updateFormData, formElements } = inject<any>('formModel');
	/*---------------------------------------------
	/  METHODS
	---------------------------------------------*/
	const value = computed({
		get: () => {
			return props.modelValue || formElements.value[props.name]?.value;
		},
		set: (value) => {
			updateFormData(props.name, value);
			emit('update:modelValue', value);

			return value;
		},
	});

	return {
		value,
	};
};
