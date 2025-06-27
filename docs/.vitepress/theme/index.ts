import './custom.css'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { defineClientComponent } from 'vitepress';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'virtual:group-icons.css'
import 'virtual:uno.css'
const Editor = defineClientComponent(() => import('../../components/Editor.vue'));
export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		app.use(PrimeVue, {
			theme: {
				preset: Aura
			}
		})
		.component('Editor', Editor);
	}
} satisfies Theme

