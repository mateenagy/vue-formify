import presetUno from '@unocss/preset-uno';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig } from 'unocss';
import { presetGrid } from 'unocss-preset-grid'

export default defineConfig({ 
	presets: [
		presetUno(),
		presetGrid()
	],
	transformers: [
		transformerVariantGroup(),
		transformerDirectives(),
	],
	theme: {
		breakpoints: {
			sm: '576px',
			md: '768px',
			lg: '992px',
			xl: '1200px',
			xxl: '1366px',
			xxxl: '1500px',
		},

	},
	rules: []
});
