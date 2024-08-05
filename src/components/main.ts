import { default as ArrayComponent } from './FormElements/ArrayField.vue';
import { default as FieldComponent } from './FormElements/Field.vue';
import { default as FormifyForm } from './FormElements/Form.vue';
import { default as FormifyError } from './FormElements/Error.vue';
import { FormType, ComponentProps } from './index';
import { createInput } from '@/composable/createInput';
// import { createSchema } from '@/composable/createSchema';

const ArrayField = createInput<ComponentProps<typeof ArrayComponent>>(ArrayComponent, { default: [] });
const Field = createInput<ComponentProps<typeof FieldComponent>>(FieldComponent);

export {
	createInput,
	// createSchema,
	FormifyForm,
	FormifyError,
	ArrayField,
	Field,
};

export type {
	FormType,
	ComponentProps,
};
