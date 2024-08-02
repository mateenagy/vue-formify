import ElementPlus from 'element-plus';
import PrimeVue from 'primevue/config';
import { createApp } from 'vue';
import App from './App.vue';
import 'element-plus/dist/index.css';
import 'primevue/resources/themes/aura-light-green/theme.css';

const app = createApp(App);
app
	.use(ElementPlus)
	.use(PrimeVue)
	.mount('#app');
