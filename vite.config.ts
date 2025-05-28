import * as path from 'path';
import vue from '@vitejs/plugin-vue';
import typescript2 from 'rollup-plugin-typescript2';
// eslint-disable-next-line import/namespace
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import UnoCSS from 'unocss/vite'

export default defineConfig({
	server: {
		port: 4444,
	},
	plugins: [
		vue(),
		UnoCSS(),
		dts({
			insertTypesEntry: true,
			rollupTypes: true,
		}),
		typescript2({
			check: false,
			include: ['src/components/**/*.vue'],
			tsconfigOverride: {
				compilerOptions: {
					outDir: 'dist',
					sourceMap: true,
					declaration: true,
					declarationMap: false,
					emitDeclarationOnly: true,
				},
			},
			exclude: ['vite.config.ts'],
		}),
	],
	build: {
		cssCodeSplit: true,
		minify: 'esbuild',
		target: 'esnext',
		lib: {
			entry: 'src/main.ts',
			name: 'VueFormify',
			formats: ['es', 'umd'],
			fileName: format => `vue-formify.${format}.js`,
		},
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'src/main.ts'),
			},
			external: [
				'vue',
			],
			output: {
				compact: true,
				inlineDynamicImports: true,
				exports: 'named',
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@packages': path.resolve(__dirname, 'packages'),
		},
	},
});
