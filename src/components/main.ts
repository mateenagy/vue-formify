import { App } from 'vue';
import { FormifyForm, FormifyInput, FormifyCheckbox, FormifyRadio, FormifyError } from './VueFormify';
import { FormType, ComponentProps } from './index';
import { createInput } from '@/composable/createInput';
import VueFormify from '@/plugin/plugin';


export default {
	install: (app: App) => {
		app.component('FormifyForm', FormifyForm);
		app.component('FormifyInput', FormifyInput);
		app.component('FormifyCheckbox', FormifyCheckbox);
		app.component('FormifyRadio', FormifyRadio);
		app.component('FormifyError', FormifyError);
	},
};

export {
	createInput,
	VueFormify,
	FormifyForm,
	FormifyInput,
	FormifyCheckbox,
	FormifyRadio,
	FormifyError,
};

export type {
	FormType,
	ComponentProps,
};
