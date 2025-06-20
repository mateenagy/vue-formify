import path from 'path';
import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts'

export default defineConfig({
	plugins: [
		dts({
			vue: true,
			parallel: true,
			resolve: true,
		}),
	],
	input: 'src/main.ts',
	external: ['vue'],
	output: {
		dir: 'distRolldown',
		entryFileNames: 'vue-formify.es.js',
		minify: true,
		format: 'esm',
		inlineDynamicImports: true,
		exports: 'named',
		globals: {
			vue: 'Vue',
		}
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	}
});
