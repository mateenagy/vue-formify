import { App } from 'vue';
import { Form, Input, Error, FormType, ComponentProps } from './index';
import { createInput } from '@/composable/createInput';
import VueFormify from '@/plugin/plugin';


export default {
	install: (app: App) => {
		app.component('Form', Form);
		app.component('Input', Input);
		app.component('Error', Error);
	},
};

export {
	Form,
	Input,
	createInput,
	VueFormify,
};

export type {
	FormType,
	ComponentProps,
};
