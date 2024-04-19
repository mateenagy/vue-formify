import { FormifyForm, FormifyInput, FormifyCheckbox, FormifyRadio, FormifyError } from './VueFormify';
import { FormType, ComponentProps } from './index';
import { createInput } from '@/composable/createInput';
import VueFormify from '@/plugin/plugin';

export {
	createInput,
	VueFormify,
	FormifyForm,
	FormifyError,
	FormifyInput,
	FormifyCheckbox,
	FormifyRadio,
};

export type {
	FormType,
	ComponentProps,
};
