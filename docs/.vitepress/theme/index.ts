import './custom.css'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'virtual:group-icons.css'

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		app.use(PrimeVue, {
			theme: {
				preset: Aura
			}
		});
	}
} satisfies Theme

