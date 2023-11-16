import { AllowedComponentProps, Component, VNodeProps } from 'vue';
import { default as InputComponent } from './FormElements/Input.vue';
import { createInput } from '@/composable/createInput';

const Input = createInput<ComponentProps<typeof InputComponent>>(InputComponent);

export type ComponentProps<C extends Component> = C extends new (...args: any) => any
	? Omit<InstanceType<C>['$props'], keyof VNodeProps | keyof AllowedComponentProps>
	: never;

export {
	Input,
};

export type FormValue = string | number | boolean | Date;
export type FormElement = Record<string, {
	value: FormValue;
	error: string | undefined;
}>

export type FormType<T = unknown> = {
	setError: (name: string, error: any) => void;
	errorHandler: any;
	hideInputError: (name: string) => void;
	resetForm: () => void;
	formData: T;
}

export type HTMLInputAttributeType =
| 'button'
| 'checkbox'
| 'color'
| 'date'
| 'datetime-local'
| 'email'
| 'file'
| 'hidden'
| 'image'
| 'month'
| 'number'
| 'password'
| 'radio'
| 'range'
| 'reset'
| 'search'
| 'submit'
| 'tel'
| 'text'
| 'time'
| 'url'
| 'week';

export { default as Form } from './FormElements/Form.vue';
export { default as Error } from './FormElements/Error.vue';
export { default as VueFormify } from '@/plugin/plugin';
