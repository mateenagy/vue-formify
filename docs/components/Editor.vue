<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import { useStore } from '@vue/repl';
import { defineClientComponent } from 'vitepress';
import Monaco from '@vue/repl/monaco-editor';

const { showHeader = true, height, files = {} } = defineProps({
	showHeader: {
		type: Boolean,
		default: true,
	},
	files: {
		type: Object,
		default: () => ({}),
	},
	height: {
		type: String,
		default: '500px',
	},
});
const Repl = defineClientComponent(() => import('@vue/repl').then(m => m.Repl));
const replRef = ref(null);
const store = useStore({
	sfcOptions: {
		value: {
			lang: 'ts',
			sfc: true,
			script: {
				inlineTemplate: false,
				isProd: false,
				propsDestructure: true,
			},
		},
	},
	builtinImportMap: {
		value: {
			imports: {
				vue: 'https://unpkg.com/vue@3.4.0/dist/vue.esm-browser.js',
				'@vue/runtime-dom': 'https://unpkg.com/@vue/runtime-dom@3.4.0/dist/runtime-dom.esm-browser.js',
				'@vue/compiler-sfc': 'https://unpkg.com/@vue/compiler-sfc@3.4.0/dist/compiler-sfc.esm-browser.js',
				'vue-formify': 'https://cdn.jsdelivr.net/npm/vue-formify@2.0.11/dist/vue-formify.es.js',
			},
		},
	},

});
store.vueVersion = '3.5.17';
store.typescriptVersion = '5.8.3';

const tryInject = () => {
	const iframe = document.querySelector('iframe');
	if (!iframe) {
		return setTimeout(tryInject, 100);
	}
	
	const doc = iframe.contentDocument;
	if (!doc) {
		return setTimeout(tryInject, 100);
	}
	
	const link = doc.createElement('link');
	link.rel = 'stylesheet';
	link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css';
	doc.head.appendChild(link);
};

watch(replRef, async (newVal) => {
	if (newVal?.value) {
		await store.setFiles(files);
		await nextTick();
		tryInject();
	}
});
console.log('Files', files);

onMounted(async () => {
	await store.setFiles(files);
	await nextTick();
	requestAnimationFrame(() => {
		tryInject();
	});
});
</script>

<template>
	<div>
		<Repl
			ref="replRef"
			theme="dark"
			:store
			:editor="Monaco"
			:clear-console="false"
			:editor-options="{ autoSaveText: false, showErrorText: false }"
			:auto-resize="true"
			:style="`--vh: ${height}`"
			:class="!showHeader && 'header-hidden'" />
	</div>
</template>
<style>
:root {
	--vh: 500px;
	--nav-height: 50px;
}

.dark {
	color-scheme: dark;
}

.header-hidden {
	--nav-height: 0px;
	--header-height: 0px;
}

body {
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
		Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	margin: 0;
	--base: #444;
}

.vue-repl {
	border: 1px solid #4b4b4b;
	border-radius: 10px;
	height: calc(var(--vh) - var(--nav-height)) !important;

	iframe {
		margin-top: 0;
	}

	.import-map-wrapper,
	.tab-buttons button {
		display: none;
	}
}

button {
	border: none;
	outline: none;
	cursor: pointer;
	margin: 0;
	background-color: transparent;
}

</style>
