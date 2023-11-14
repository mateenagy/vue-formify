import { App } from 'vue';
import { Form, Input } from './index';
import { createInput } from '@/composable/createInput';

export default {
	install: (app: App) => {
		app.component('Form', Form);
		app.component('Input', Input);
	},
};

export {
	Form,
	Input,
	createInput,
};
