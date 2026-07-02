import './custom.css'
import '@vue/repl/style.css'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'virtual:group-icons.css'
import Playground from './components/Playground.vue'

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		app.use(PrimeVue, {
			theme: {
				preset: Aura
			}
		});
		app.component('Playground', Playground);
	}
} satisfies Theme

