import { default as InputComponent } from './FormElements/Input.vue';
import { ComponentProps } from '.';
import { createInput } from '@/composable/createInput';

const Input = createInput<ComponentProps<typeof InputComponent>>(InputComponent);

export { default as Form } from './FormElements/Form.vue';
export { default as Error } from './FormElements/Error.vue';
export { Input };
