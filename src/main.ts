import { FormType, ComponentProps } from './index';
import { createInput } from '@/composable/createInput';
import { useForm, Form, Field, FieldArray, Error } from '@/composable/useForm';

export {
	createInput,
	Form as FormifyForm,
	Form,
	Error,
	FieldArray,
	Field,
	useForm,
};

export type {
	FormType,
	ComponentProps,
};
