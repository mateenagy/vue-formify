import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite'

export default defineConfig({
	server: {
		port: 5173,
	},
	plugins: [
		UnoCSS(),
	],
    optimizeDeps: {
		exclude: ['@vue/repl'],
	},
	ssr: {
		noExternal: ['@vue/repl'],
	}
});
