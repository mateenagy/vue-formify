import ElementPlus from 'element-plus';
import { createApp } from 'vue';
import 'element-plus/dist/index.css';
import App from './App.vue';
import { VueFormify } from './components';

const app = createApp(App);
app
	.use(VueFormify, {
		globalErrorCSSClass: 'error-message',
	})
	.use(ElementPlus)
	.mount('#app');
