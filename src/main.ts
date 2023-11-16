import { createApp } from 'vue';
import App from './App.vue';
import VueFormify from './plugin/plugin';

const app = createApp(App);
app.use(VueFormify, {
	useFocus: true,
});

app.mount('#app');
