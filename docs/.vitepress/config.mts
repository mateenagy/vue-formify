import { defineConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
// https://vitepress.dev/reference/site-config
export default defineConfig({
	markdown: {
		config(md) {
			md.use(groupIconMdPlugin)
		},
	},
	vite: {
		plugins: [
			groupIconVitePlugin()
		],
	},
	title: "VueFormify",
	description: "Build powerful, type-safe forms in Vue.",
	sitemap: {
		hostname: 'https://vue-formify.matenagy.me'
	},
	head: [
		['link', { rel: 'icon', href: '/logo-new.svg' }],
		['meta', { name: 'description', content: 'Build powerful, type-safe forms in Vue.' }],
		['meta', { name: 'og:title', content: 'VueFormify' }],
		['meta', { name: 'og:description', content: 'Build powerful, type-safe forms in Vue.' }],
		['meta', { name: 'og:image', content: 'https://vue-formify.matenagy.me/share.jpg' }],
	],
	themeConfig: {
		logo: '/logo-new.svg',
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Documentation', link: '/docs/introduction/index.md', activeMatch: '/docs/' },
			// { text: 'Playground', link: '/playground/basic/simple/index.md', activeMatch: '/playground/' },
			{ text: '<img src="https://img.shields.io/npm/v/vue-formify" />', link: 'https://www.npmjs.com/package/vue-formify' },
			{ text: '<img src="https://badgen.net/bundlephobia/minzip/vue-formify?label=%F0%9F%92%BE" />', link: 'https://bundlephobia.com/package/vue-formify@2.0.3' },
		],

		search: {
			provider: 'local'
		},

		outline: {
			level: 'deep',
		},

		sidebar: {
			'/docs/': [
				{
					text: 'Setup',
					items: [
						{
							text: 'Introduction',
							link: '/docs/introduction/index.md',
						},
						{
							text: 'Getting started',
							link: '/docs/getting-started/index.md',
						},
					]
				},
				{
					text: 'Core concepts',
					items: [
						{
							text: 'Creating forms',
							link: '/docs/core-concepts/creating-forms/index.md',
						},
						{
							text: 'Creating fields',
							link: '/docs/core-concepts/creating-fields/index.md',
						},
						{
							text: 'Handle submission',
							link: '/docs/core-concepts/handle-submission/index.md',
						},
						{
							text: 'Handle errors',
							link: '/docs/core-concepts/handle-errors/index.md',
						},
						{
							text: 'Validation',
							link: '/docs/core-concepts/validators/index.md',
						},
					]
				},
				{
					text: 'Components',
					items: [
						{ text: 'Form', link: '/docs/components/form/index.md' },
						{ text: 'Field', link: '/docs/components/field/index.md' },
						{ text: 'FieldArray', link: '/docs/components/fieldArray/index.md' },
						{ text: 'Error', link: '/docs/components/error/index.md' },
					]
				},
				{
					text: 'Composables',
					items: [
						{
							text: 'useForm',
							link: '/docs/composables/use-form/index.md',
						},
						{
							text: 'useInput',
							link: '/docs/composables/create-input/index.md',
						},
					]
				},
				// {
				// 	text: 'Validation',
				// 	link: '/docs/form-level-validation/index.md',
				// },
				{
					text: 'Examples',
					items: [
						{ text: 'Nested objects and arrays', link: '/docs/examples/nested-objects-and-arrays/index.md' },
						{ text: 'Shared form values', link: '/docs/examples/shared-form-values/index.md' },
						// { text: 'Custom inputs', link: '/docs/examples/custom-inputs/index.md' },
						{ text: 'Third party UI components', link: '/docs/examples/third-party-components/index.md' },
						// { text: 'Multi step form', link: '/docs/examples/multi-step-form/index.md' },
					]
				},
				// {
				//     text: 'Third party UI library integrations',
				//     link: '/docs/third-party-ui-integrations/index.md',
				//     items: [
				//         {
				//             text: 'PrimeVue',
				//             link: '/docs/third-party-ui-integrations/primevue/index.md',
				//         },
				//         {
				//             text: 'Element Plus',
				//             link: '/docs/third-party-ui-integrations/element-plus/index.md',
				//         },
				//         {
				//             text: 'Ionic Vue',
				//             link: '/docs/third-party-ui-integrations/ionic-vue/index.md',
				//         },
				//         {
				//             text: 'Radix Vue',
				//             link: '/docs/third-party-ui-integrations/radix-vue/index.md',
				//         }
				//     ],
				// }
			],
			'/playground/': [
				{
					text: 'Basic',
					items: [
						{
							text: 'Simple',
							link: '/playground/basic/simple/index.md',
						},
						{
							text: 'More coming soon...',
						},
					]
				},
			]
		},

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/mateenagy/vue-formify' },
			{ icon: 'npm', link: 'https://www.npmjs.com/package/vue-formify' }
		]
	}
})
