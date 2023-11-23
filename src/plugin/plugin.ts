import { App } from 'vue';
import { PluginOptions } from '@/components';

const VueFormify = {
	install: (app: App, options?: PluginOptions) => {
		const config: PluginOptions = {
			...{ useFocus: true },
			...options,
		};

		app.provide('config', config);
		app.config.globalProperties.config = config;
	},
};

export default VueFormify;
