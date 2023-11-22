import ElementPlus from 'element-plus';
import { createApp } from 'vue';
import 'element-plus/dist/index.css';
import App from './App.vue';

const app = createApp(App);

app
	.use(ElementPlus)
	.mount('#app');
