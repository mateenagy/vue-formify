import * as path from 'path';
import vue from '@vitejs/plugin-vue';
import typescript2 from 'rollup-plugin-typescript2';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	server: {
		port: 4444,
	},
	plugins: [
		vue(),
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
					declarationMap: true,
				},
			},
			exclude: ['vite.config.ts'],
		}),
	],
	build: {
		cssCodeSplit: true,
		lib: {
			entry: 'src/components/main.ts',
			name: 'VueFormify',
			formats: ['es', 'cjs', 'umd'],
			fileName: format => `vue-formify.${format}.js`,
		},
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'src/components/main.ts'),
			},
			external: ['vue'],
			output: {
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === 'main.css') {
						return 'vue-formify.css';
					}

					return assetInfo.name;
				},
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
		},
	},
});
