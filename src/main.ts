import ElementPlus from 'element-plus';
import { createApp } from 'vue';
import App from './App.vue';
import 'element-plus/dist/index.css';
import { VueFormify } from './components';

const app = createApp(App);
app
	.use(ElementPlus)
	.use(VueFormify, {
		globalErrorCSSClass: 'error-message',
	})
	.mount('#app');
