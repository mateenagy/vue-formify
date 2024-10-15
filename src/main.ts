import ElementPlus from 'element-plus';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { createApp } from 'vue';
import App from './App.vue';
import 'element-plus/dist/index.css';

const app = createApp(App);
app
	.use(ElementPlus)
	.use(PrimeVue, {
		theme: {
			preset: Aura,
		},
	})
	.mount('#app');
