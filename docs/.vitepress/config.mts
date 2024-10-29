import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "VueFormify",
    description: "Unleash Form-Building Freedom!",
    sitemap: {
        hostname: 'https://vue-formify.matenagy.me'
    },
    head: [
        ['link', { rel: 'icon', href: '/favicon.png' }],
        ['meta', { name: 'description', content: 'Unleash Form-Building Freedom! 🚀' }],
        ['meta', { name: 'og:title', content: 'VueFormify' }],
        ['meta', { name: 'og:description', content: 'Unleash Form-Building Freedom! 🚀' }],
        ['meta', { name: 'og:image', content: 'https://vue-formify.matenagy.me/share.jpg' }],
    ],
    themeConfig: {
        logo: '/logo.svg',
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Documentation', link: '/docs/getting-started/index.md' },
            { text: '<img src="https://img.shields.io/npm/v/vue-formify" />', link: 'https://www.npmjs.com/package/vue-formify' },
        ],

        search: {
            provider: 'local'
        },

        outline: {
            level: [2, 3],
        },

        sidebar: [
            {
                text: 'Getting started',
                link: '/docs/getting-started/index.md',
            },
            {
                text: 'Components',
                link: '/docs/components/index.md',
                items: [
                    { text: 'FormifyForm', link: '/docs/components/form/index.md' },
                    { text: 'Field', link: '/docs/components/field/index.md' },
                    { text: 'FieldArray', link: '/docs/components/fieldArray/index.md' },
                    { text: 'Error', link: '/docs/components/error/index.md' },
                ]
            },
            {
                text: 'createInput',
                link: '/docs/composables/create-input/index.md',
            },
            {
                text: 'useForm - <strong>Type-safe</strong> form',
                link: '/docs/composables/use-form/index.md',
            },
            {
                text: 'Form level validation',
                link: '/docs/form-level-validation/index.md',
                items: [
                    { text: 'Yup', link: '/docs/form-level-validation/yup/index.md' },
                    { text: 'Zod', link: '/docs/form-level-validation/zod/index.md' },
                    { text: 'Valibot', link: '/docs/form-level-validation/valibot/index.md' },
                    { text: 'Joi', link: '/docs/form-level-validation/joi/index.md' },
                ]
            },
            {
                text: 'Examples',
                items: [
                    { text: 'Nested objects and arrays', link: '/docs/examples/nested-objects-and-arrays/index.md' },
                    { text: 'Shared form values', link: '/docs/examples/shared-form-values/index.md' },
                    { text: 'Custom inputs', link: '/docs/examples/custom-inputs/index.md' },
                    { text: 'Third party UI components', link: '/docs/examples/third-party-components/index.md' },
                    { text: 'Multi step form', link: '/docs/examples/multi-step-form/index.md' },
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

        socialLinks: [
            { icon: 'github', link: 'https://github.com/mateenagy/vue-formify' },
            { icon: 'npm', link: 'https://www.npmjs.com/package/vue-formify' }
        ]
    }
})
