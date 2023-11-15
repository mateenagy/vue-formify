import { App } from 'vue';

type PluginOptions = {
	useFocus: boolean;
}

const VueFormify = {
	install: (app: App, options: PluginOptions) => {
		const config: PluginOptions = {
			...{ useFocus: true },
			...options,
		};

		app.provide('config', config);
		app.config.globalProperties.config = config;
	},
};

export default VueFormify;
