import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { createApp } from 'vue';
import App from './App.vue';
import 'virtual:uno.css';
const app = createApp(App);
app
	.use(PrimeVue, {
		theme: {
			preset: Aura,
		},
	})
	.mount('#app');
