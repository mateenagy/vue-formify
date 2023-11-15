import ElementPlus from 'element-plus';
import PrimeVue from 'primevue/config';
import { createApp } from 'vue';
import App from './App.vue';
import 'primevue/resources/themes/lara-light-teal/theme.css';
import 'element-plus/dist/index.css';
import VueFormify from './plugin/plugin';
// import './style.css';

const app = createApp(App);
app.use(PrimeVue);
app.use(ElementPlus);
app.use(VueFormify, {
	useFocus: true,
});

app.mount('#app');
