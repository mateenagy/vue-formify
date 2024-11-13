import { FormType, ComponentProps } from './index';
import { createInput } from '@/composable/createInput';
import { useForm, Form, Field, FieldArray, Error } from '@/composable/useForm';
import { SchemaField } from '@/components/SchemaField';

export {
	createInput,
	Form as FormifyForm,
	Form,
	Error,
	FieldArray,
	Field,
	SchemaField,
	useForm,
};

export type {
	FormType,
	ComponentProps,
};
