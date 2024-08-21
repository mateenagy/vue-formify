import ArrayField from './FormElements/ArrayField.vue';
import Field from './FormElements/Field.vue';
import { default as FormifyForm } from './FormElements/Form.vue';
import { default as Error } from './FormElements/Error.vue';
import { FormType, ComponentProps } from './index';
import { createInput } from '@/composable/createInput';
// import { createSchema } from '@/composable/createSchema';

export {
	createInput,
	// createSchema,
	FormifyForm,
	Error,
	ArrayField,
	Field,
};

export type {
	FormType,
	ComponentProps,
};
