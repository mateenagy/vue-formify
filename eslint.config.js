import js from "@eslint/js";
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';

export default [
	{
		ignores: [
			'/**/*.d.ts',
			'src/**/*.d.ts',
			'src/**/App.vue',
			'/**/*.spec.js',
			'/*.js',
			'*.config.ts',
		],
	},
	js.configs.recommended,
	...pluginVue.configs['flat/strongly-recommended'],
	...tseslint.configs.recommended,
    {
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tsParser,
				project: [
					"tsconfig.json",
					"tsconfig.node.json"
				],
				extraFileExtensions: [
					'vue'
				]
			},
		},
		files: [
			'src/**/*.{ts,js,vue}',
			'packages/**/*.{ts,js,vue}'
		],
        rules: {
			"array-bracket-spacing": ["error", "never"],
			"arrow-spacing": "error",
			"arrow-parens": ["error", "as-needed", {
				"requireForBlockBody": true
			}],
			"brace-style": "error",
			"comma-dangle": ["error", "always-multiline"],
			"comma-style": ["error", "last"],
			"computed-property-spacing": ["error", "never"],
			"curly": ["error", "all"],
			"dot-notation": "error",
			"eqeqeq": ["error", "always"],
			"func-call-spacing": 0,
			"func-style": ["error", "declaration", {
				"allowArrowFunctions": true
			}],
			"key-spacing": ["error", {
				"afterColon": true,
				"mode": "minimum"
			}],
			"keyword-spacing": ["error", {
				"before": true,
				"after": true
			}],
			"linebreak-style": ["error", "unix"],
			"lines-between-class-members": ["error", "always", {
				"exceptAfterSingleLine": true
			}],
			"object-curly-spacing": ["error", "always"],
			"one-var": ["error", "never"],
			"no-console": 0,
			"no-constant-condition": 0,
			"no-unused-vars": 0,
			"no-mixed-spaces-and-tabs": "error",
			"no-multi-spaces": "error",
			"no-multiple-empty-lines": ["error", {
				"max": 3,
				"maxBOF": 0,
				"maxEOF": 0
			}],
			"no-unreachable": "warn",
			"no-var": "error",
			"padded-blocks": ["error", "never"],
			"padding-line-between-statements": ["error", {
				"blankLine": "always",
				"prev": "*",
				"next": "return"
			}],
			"import/namespace": 0,
			"prefer-arrow-callback": "error",
			"prefer-const": "warn",
			"quote-props": ["error", "as-needed"],
			"quotes": ["error", "single"],
			"semi": ["error", "always"],
			"semi-spacing": ["error", {
				"before": false,
				"after": true
			}],
			"no-undef": 0,
			"space-infix-ops": "error",
			// "prefer-arrow/prefer-arrow-functions": "warn",
			// "import/first": "error",
			// "import/exports-last": "error",
			// "import/newline-after-import": "error",
			// "import/no-unresolved": 0,
			// "import/order": ["error", {
			// 	"alphabetize": {
			// 		"order": "asc"
			// 	}
			// }],
			// "import/named": 0,
			"vue/no-setup-props-destructure": 0,
			"vue/array-bracket-spacing": ["error", "never"],
			"vue/arrow-spacing": "error",
			"vue/component-name-in-template-casing": ["error"],
			"vue/eqeqeq": ["error", "always"],
			"vue/html-closing-bracket-newline": ["error", {
				"singleline": "never",
				"multiline": "never"
			}],
			"vue/html-indent": ["error", "tab"],
			"vue/match-component-file-name": 0,
			"vue/multi-word-component-names": 0,
			"vue/no-v-for-template-key": "warn",
			"vue/no-template-key": 0,
			"vue/max-attributes-per-line": ["error", {
				"singleline": {
				"max": 1
				},      
				"multiline": {
				"max": 1
				}
			}],
			"vue/object-curly-spacing": ["error", "always"],
			"vue/order-in-components": "error",
			"vue/no-v-html": 0,
			"vue/html-self-closing": 0,
			"vue/require-direct-export": "error",
			"vue/script-indent": ["error", "tab", {"switchCase": 2}],
			"@typescript-eslint/array-type": "error",
			"@typescript-eslint/consistent-type-assertions": "error",
			"@typescript-eslint/explicit-module-boundary-types": 0,
			"@typescript-eslint/no-explicit-any": 0,
			"@typescript-eslint/no-inferrable-types": 0,
			"@typescript-eslint/prefer-optional-chain": "error",
			"@typescript-eslint/no-unused-expressions": 0,
		}
    }
];
