import { default as CheckboxComponent } from './FormElements/Checkbox.vue';
import { default as InputComponent } from './FormElements/Input.vue';
import { default as RadioComponent } from './FormElements/Radio.vue';
import { ComponentProps } from '.';
import { createInput } from '@/composable/createInput';

const Input = createInput<ComponentProps<typeof InputComponent>>(InputComponent);
const Checkbox = createInput<ComponentProps<typeof CheckboxComponent>>(CheckboxComponent);
const Radio = createInput<ComponentProps<typeof RadioComponent>>(RadioComponent);

export { default as Form } from './FormElements/Form.vue';
export { default as Error } from './FormElements/Error.vue';
export { 
	Input,
	Checkbox,
	Radio,
};
