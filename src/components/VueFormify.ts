import { default as CheckboxComponent } from './FormElements/Checkbox.vue';
import { default as InputComponent } from './FormElements/Input.vue';
import { default as RadioComponent } from './FormElements/Radio.vue';
import { ComponentProps } from '.';
import { createInput } from '@/composable/createInput';

const FormifyInput = createInput<ComponentProps<typeof InputComponent>>(InputComponent);
const FormifyCheckbox = createInput<ComponentProps<typeof CheckboxComponent>>(CheckboxComponent);
const FormifyRadio = createInput<ComponentProps<typeof RadioComponent>>(RadioComponent);

export { default as FormifyForm } from './FormElements/Form.vue';
export { default as FormifyError } from './FormElements/Error.vue';
export { 
	FormifyInput,
	FormifyCheckbox,
	FormifyRadio,
};
