import { App } from 'vue';
import * as Formify from './VueFormify';
import { FormType, ComponentProps } from './index';
import { createInput } from '@/composable/createInput';
import VueFormify from '@/plugin/plugin';


export default {
	install: (app: App) => {
		app.component('Formify', Formify);
	},
};

export {
	createInput,
	VueFormify,
	Formify,
};

export type {
	FormType,
	ComponentProps,
};
