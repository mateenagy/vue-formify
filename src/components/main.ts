import { App } from 'vue';
import { useCreateInput } from '../composable/useCreateInput';
import { Form, Input } from './index';

export default {
	install: (app: App) => {
		app.component('Form', Form);
		app.component('Input', Input);
	},
};

export {
	Form,
	Input,
	useCreateInput,
};
