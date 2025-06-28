import path from 'path';
import { defineConfig } from 'rolldown';
import { viteMinify } from 'rollup-plugin-swc3';
import dts from 'vite-plugin-dts';
// import { dts } from 'rolldown-plugin-dts'

export default defineConfig({
	plugins: [
		viteMinify({
			module: true,
		}),
		// dts({
		// 	vue: true,
		// 	parallel: true,
		// 	eager: true,
		// }),
		dts({
			insertTypesEntry: true,
			rollupTypes: true,
		}),
	],
	input: 'src/main.ts',
	external: ['vue'],
	output: [
		{
			dir: 'dist',
			entryFileNames: 'vue-formify.es.js',
			minify: true,
			format: 'es',
			inlineDynamicImports: true,
			exports: 'named',
			globals: {
				vue: 'Vue',
			}
		},
		{
			dir: 'dist',
			entryFileNames: 'vue-formify.umd.js',
			name: 'vue-formify',
			format: 'umd',
			minify: true,
			inlineDynamicImports: true,
			exports: 'named',
			globals: {
				vue: 'Vue',
			}
		}
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	}
});
