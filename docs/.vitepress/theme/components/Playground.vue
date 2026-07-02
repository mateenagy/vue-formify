<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { useData } from 'vitepress';

/**
 * A native, on-brand REPL for the docs — a drop-in replacement for the
 * `play.vuejs.org` iframes. Built on `@vue/repl` + the bundled Monaco editor,
 * so it keeps full TypeScript IntelliSense (autocomplete, hover, type errors).
 *
 * Types are resolved by the Volar worker straight from jsDelivr, driven by the
 * `dependencyVersion` map below — that's the piece that makes autocomplete for
 * `vue-formify` (and the validator libs) actually work.
 */

type LibName = 'zod' | 'valibot' | 'arktype';

const props = withDefaults(defineProps<{
	/** Map of `filename -> source`. The main file must be present (default `App.vue`). */
	files: Record<string, string>;
	/** Entry file rendered by the preview. */
	main?: string;
	/** Convenience presets that wire up a validator's import map + type version. */
	libs?: LibName | LibName[];
	/** Extra import-map entries (bare specifier -> ESM URL). */
	imports?: Record<string, string>;
	/** Extra type-acquisition versions (bare specifier -> version). */
	deps?: Record<string, string>;
	/** Height of the editor/preview area. */
	height?: string;
	/** `horizontal` = editor | preview, `vertical` = editor / preview. */
	layout?: 'horizontal' | 'vertical';
	/** Put the preview before the editor. */
	reverse?: boolean;
}>(), {
	main: 'App.vue',
	height: '540px',
	layout: 'horizontal',
	reverse: false,
});

/**
 * Bump this to move every example onto a new release at once.
 *
 * NOTE: the docs prose already targets the 3.0.0 API (e.g. `validate`,
 * `clearErrors`, `getFieldState`, `submitCount`). Flip this to '3.0.0' the
 * moment 3.0.0 is published to npm — jsDelivr can only resolve a version that
 * already exists, so setting it early 404s every playground. Until then the
 * REPL runs 2.1.6 (current `latest`), which supports every API the examples use.
 */
const VUE_FORMIFY_VERSION = '2.1.6';

const LIB_PRESETS: Record<LibName, { url: string; version: string }> = {
	zod: { url: 'https://cdn.jsdelivr.net/npm/zod@3.25.65/+esm', version: '3.25.65' },
	valibot: { url: 'https://cdn.jsdelivr.net/npm/valibot@1.1.0/dist/index.min.js', version: '1.1.0' },
	arktype: { url: 'https://cdn.jsdelivr.net/npm/arktype@2.1.20/+esm', version: '2.1.20' },
};

/**
 * Stylesheets injected into the preview iframe's `<head>`.
 *
 * CSS frameworks are plain stylesheets, not ES modules, so they can't ride the
 * import map like the validator libs above. Injecting them here (via
 * `previewOptions.headHTML`) styles every example from one place — no
 * `@import` line duplicated across each `App.vue`.
 */
const PREVIEW_STYLESHEETS = [
	'https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css',
];

/**
 * Cosmetic tweaks for the preview iframe, layered on top of the frameworks
 * above. The examples echo live form state with `<pre>{{ values }}</pre>`
 * (Vue already renders the object as indented JSON) — this turns that raw
 * monospace dump into a labelled, dark JSON card.
 */
const PREVIEW_STYLES = `
pre {
	position: relative;
	padding: 2.4rem 1.1rem 1.1rem;
	background: #0f172a;
	color: #e2e8f0;
	border-radius: 10px;
	font-size: 0.8125rem;
	line-height: 1.6;
	overflow: auto;
	box-shadow: 0 1px 3px rgba(15, 23, 42, 0.18);
}
pre::before {
	content: 'Form values';
	position: absolute;
	inset: 0 0 auto 0;
	padding: 0.5rem 1.1rem;
	font-family: system-ui, -apple-system, sans-serif;
	font-size: 0.68rem;
	font-weight: 600;
	letter-spacing: 0.05em;
	text-transform: uppercase;
	color: #7c8db0;
	background: rgba(148, 163, 184, 0.08);
	border-bottom: 1px solid rgba(148, 163, 184, 0.16);
}
`;

const previewHeadHTML = [
	...PREVIEW_STYLESHEETS.map((href) => `<link rel="stylesheet" href="${href}">`),
	`<style>${PREVIEW_STYLES}</style>`,
].join('\n');

const TSCONFIG = {
	compilerOptions: {
		allowJs: true,
		checkJs: true,
		strict: true,
		skipLibCheck: true,
		jsx: 'Preserve',
		target: 'ESNext',
		module: 'ESNext',
		moduleResolution: 'Bundler',
		allowImportingTsExtensions: true,
	},
	vueCompilerOptions: {
		target: 3.4,
	},
};

const { isDark } = useData();

// Loaded lazily on the client only — `@vue/repl` and Monaco both touch
// `window`/`Worker` and cannot be server-rendered.
const Repl = shallowRef<any>(null);
const editor = shallowRef<any>(null);
const store = shallowRef<any>(null);
const ready = ref(false);
const failed = ref(false);

const libList = computed<LibName[]>(() =>
	Array.isArray(props.libs) ? props.libs : props.libs ? [props.libs] : [],
);

onMounted(async () => {
	try {
		const [repl, monaco] = await Promise.all([
			import('@vue/repl'),
			import('@vue/repl/monaco-editor'),
		]);

		const { useStore, useVueImportMap } = repl;
		const { importMap: vueImportMap, vueVersion } = useVueImportMap();

		const imports: Record<string, string> = {
			'vue-formify': `https://cdn.jsdelivr.net/npm/vue-formify@${VUE_FORMIFY_VERSION}/dist/vue-formify.es.js`,
		};
		const deps: Record<string, string> = {
			'vue-formify': VUE_FORMIFY_VERSION,
		};

		for (const lib of libList.value) {
			const preset = LIB_PRESETS[lib];
			if (preset) {
				imports[lib] = preset.url;
				deps[lib] = preset.version;
			}
		}
		Object.assign(imports, props.imports ?? {});
		Object.assign(deps, props.deps ?? {});

		const replStore = useStore({
			builtinImportMap: vueImportMap,
			vueVersion,
			// Drives jsDelivr type acquisition in the Volar worker -> autocomplete.
			dependencyVersion: ref(deps),
			showOutput: ref(true),
			outputMode: ref('preview'),
		});

		await replStore.setFiles(
			{
				...props.files,
				'import-map.json': JSON.stringify({ imports }, null, 2),
				'tsconfig.json': JSON.stringify(TSCONFIG, null, 2),
			},
			props.main,
		);

		Repl.value = repl.Repl;
		editor.value = monaco.default;
		store.value = replStore;
		ready.value = true;
	} catch (error) {
		console.error('[Playground] failed to load the REPL editor:', error);
		failed.value = true;
	}
});

const theme = computed(() => (isDark.value ? 'dark' : 'light'));

// Keep Monaco/preview in sync with VitePress' appearance toggle.
watch(theme, () => store.value?.reloadLanguageTools?.());
</script>

<template>
	<ClientOnly>
		<div class="vf-repl" :style="{ '--vf-repl-height': height }">
			<component
				:is="Repl"
				v-if="ready"
				:store="store"
				:editor="editor"
				:theme="theme"
				:preview-theme="true"
				:layout="layout"
				:layout-reverse="reverse"
				:preview-options="{ headHTML: previewHeadHTML }"
				:ssr="false"
				:show-compile-output="false"
				:show-import-map="false"
				:show-ts-config="false"
				:clear-console="true"
				:editor-options="{ autoSaveText: false }"
			/>
			<div v-else class="vf-repl__placeholder">
				<template v-if="failed">
					<p>Couldn't load the interactive editor.</p>
				</template>
				<template v-else>
					<span class="vf-repl__spinner" aria-hidden="true" />
					<p>Loading interactive editor…</p>
				</template>
			</div>
		</div>
	</ClientOnly>
</template>

<style>
.vf-repl {
	height: var(--vf-repl-height, 540px);
	margin: 1.5rem 0 2rem;
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	overflow: hidden;
	background-color: var(--vp-c-bg-soft);
}

.vf-repl .iframe-container iframe {
	margin-top: 0;
}

/* Blend the @vue/repl surface into the VitePress theme. */
.vf-repl .vue-repl {
	height: 100%;
	--bg: var(--vp-c-bg);
	--bg-soft: var(--vp-c-bg-soft);
	--border: var(--vp-c-divider);
	--text-light: var(--vp-c-text-2);
	--color-branding: var(--vp-c-brand-1);
	--color-branding-dark: var(--vp-c-brand-2);
	--font-code: var(--vp-font-family-mono);
}

.vf-repl__placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.85rem;
	height: 100%;
	color: var(--vp-c-text-2);
	font-size: 0.9rem;
}

.vf-repl__spinner {
	width: 26px;
	height: 26px;
	border: 3px solid var(--vp-c-divider);
	border-top-color: var(--vp-c-brand-1);
	border-radius: 50%;
	animation: vf-repl-spin 0.7s linear infinite;
}

@keyframes vf-repl-spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
