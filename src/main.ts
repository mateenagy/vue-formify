import { createApp } from 'vue';
import App from './App.vue';
import { VueFormify } from './components';

const app = createApp(App);
app
	.use(VueFormify, {
		globalErrorCSSClass: 'error-message',
	})
	.mount('#app');
