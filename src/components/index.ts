import { default as InputComponent } from './FormElements/Input.vue';
import { createInput } from '@/composable/createInput';

export { default as Form } from './FormElements/Form.vue';

export const Input = createInput(InputComponent);

export type FormValue = string | number | boolean | Date;
export type FormElement = Record<string, {
	value: FormValue;
	error: string | undefined;
}>

export type FormType<T = unknown> = {
	setError: (error: any) => void;
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
