// vite.config.ts
import * as path from "path";
import vue from "file:///Users/matenagy/Sites/vue-formify/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import typescript2 from "file:///Users/matenagy/Sites/vue-formify/node_modules/rollup-plugin-typescript2/dist/rollup-plugin-typescript2.cjs.js";
import { defineConfig } from "file:///Users/matenagy/Sites/vue-formify/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/matenagy/Sites/vue-formify/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/matenagy/Sites/vue-formify";
var vite_config_default = defineConfig({
  server: {
    port: 4444
  },
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true
    }),
    typescript2({
      check: false,
      include: ["src/components/**/*.vue"],
      tsconfigOverride: {
        compilerOptions: {
          outDir: "dist",
          sourceMap: true,
          declaration: true,
          declarationMap: false,
          emitDeclarationOnly: true
        }
      },
      exclude: ["vite.config.ts"]
    })
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: "src/components/main.ts",
      name: "VueFormify",
      formats: ["es", "umd"],
      fileName: (format) => `vue-formify.${format}.js`
    },
    rollupOptions: {
      input: {
        main: path.resolve(__vite_injected_original_dirname, "src/components/main.ts")
      },
      external: [
        "vue"
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "main.css") {
            return "vue-formify.css";
          }
          return assetInfo.name;
        },
        exports: "named",
        globals: {
          vue: "Vue"
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src"),
      packages: path.resolve(__vite_injected_original_dirname, "packages")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWF0ZW5hZ3kvU2l0ZXMvdnVlLWZvcm1pZnlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tYXRlbmFneS9TaXRlcy92dWUtZm9ybWlmeS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWF0ZW5hZ3kvU2l0ZXMvdnVlLWZvcm1pZnkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IHR5cGVzY3JpcHQyIGZyb20gJ3JvbGx1cC1wbHVnaW4tdHlwZXNjcmlwdDInO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uYW1lc3BhY2VcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuXHRzZXJ2ZXI6IHtcblx0XHRwb3J0OiA0NDQ0LFxuXHR9LFxuXHRwbHVnaW5zOiBbXG5cdFx0dnVlKCksXG5cdFx0ZHRzKHtcblx0XHRcdGluc2VydFR5cGVzRW50cnk6IHRydWUsXG5cdFx0XHRyb2xsdXBUeXBlczogdHJ1ZSxcblx0XHR9KSxcblx0XHR0eXBlc2NyaXB0Mih7XG5cdFx0XHRjaGVjazogZmFsc2UsXG5cdFx0XHRpbmNsdWRlOiBbJ3NyYy9jb21wb25lbnRzLyoqLyoudnVlJ10sXG5cdFx0XHR0c2NvbmZpZ092ZXJyaWRlOiB7XG5cdFx0XHRcdGNvbXBpbGVyT3B0aW9uczoge1xuXHRcdFx0XHRcdG91dERpcjogJ2Rpc3QnLFxuXHRcdFx0XHRcdHNvdXJjZU1hcDogdHJ1ZSxcblx0XHRcdFx0XHRkZWNsYXJhdGlvbjogdHJ1ZSxcblx0XHRcdFx0XHRkZWNsYXJhdGlvbk1hcDogZmFsc2UsXG5cdFx0XHRcdFx0ZW1pdERlY2xhcmF0aW9uT25seTogdHJ1ZSxcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0XHRleGNsdWRlOiBbJ3ZpdGUuY29uZmlnLnRzJ10sXG5cdFx0fSksXG5cdF0sXG5cdGJ1aWxkOiB7XG5cdFx0Y3NzQ29kZVNwbGl0OiB0cnVlLFxuXHRcdGxpYjoge1xuXHRcdFx0ZW50cnk6ICdzcmMvY29tcG9uZW50cy9tYWluLnRzJyxcblx0XHRcdG5hbWU6ICdWdWVGb3JtaWZ5Jyxcblx0XHRcdGZvcm1hdHM6IFsnZXMnLCAndW1kJ10sXG5cdFx0XHRmaWxlTmFtZTogZm9ybWF0ID0+IGB2dWUtZm9ybWlmeS4ke2Zvcm1hdH0uanNgLFxuXHRcdH0sXG5cdFx0cm9sbHVwT3B0aW9uczoge1xuXHRcdFx0aW5wdXQ6IHtcblx0XHRcdFx0bWFpbjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9jb21wb25lbnRzL21haW4udHMnKSxcblx0XHRcdH0sXG5cdFx0XHRleHRlcm5hbDogW1xuXHRcdFx0XHQndnVlJyxcblx0XHRcdF0sXG5cdFx0XHRvdXRwdXQ6IHtcblx0XHRcdFx0YXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcblx0XHRcdFx0XHRpZiAoYXNzZXRJbmZvLm5hbWUgPT09ICdtYWluLmNzcycpIHtcblx0XHRcdFx0XHRcdHJldHVybiAndnVlLWZvcm1pZnkuY3NzJztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gYXNzZXRJbmZvLm5hbWU7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGV4cG9ydHM6ICduYW1lZCcsXG5cdFx0XHRcdGdsb2JhbHM6IHtcblx0XHRcdFx0XHR2dWU6ICdWdWUnLFxuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHR9LFxuXHR9LFxuXHRyZXNvbHZlOiB7XG5cdFx0YWxpYXM6IHtcblx0XHRcdCdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuXHRcdFx0cGFja2FnZXM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdwYWNrYWdlcycpLFxuXHRcdH0sXG5cdH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVIsWUFBWSxVQUFVO0FBQzNTLE9BQU8sU0FBUztBQUNoQixPQUFPLGlCQUFpQjtBQUV4QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFMaEIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsUUFBUTtBQUFBLElBQ1AsTUFBTTtBQUFBLEVBQ1A7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxNQUNILGtCQUFrQjtBQUFBLE1BQ2xCLGFBQWE7QUFBQSxJQUNkLENBQUM7QUFBQSxJQUNELFlBQVk7QUFBQSxNQUNYLE9BQU87QUFBQSxNQUNQLFNBQVMsQ0FBQyx5QkFBeUI7QUFBQSxNQUNuQyxrQkFBa0I7QUFBQSxRQUNqQixpQkFBaUI7QUFBQSxVQUNoQixRQUFRO0FBQUEsVUFDUixXQUFXO0FBQUEsVUFDWCxhQUFhO0FBQUEsVUFDYixnQkFBZ0I7QUFBQSxVQUNoQixxQkFBcUI7QUFBQSxRQUN0QjtBQUFBLE1BQ0Q7QUFBQSxNQUNBLFNBQVMsQ0FBQyxnQkFBZ0I7QUFBQSxJQUMzQixDQUFDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ04sY0FBYztBQUFBLElBQ2QsS0FBSztBQUFBLE1BQ0osT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBLE1BQ3JCLFVBQVUsWUFBVSxlQUFlLE1BQU07QUFBQSxJQUMxQztBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2QsT0FBTztBQUFBLFFBQ04sTUFBVyxhQUFRLGtDQUFXLHdCQUF3QjtBQUFBLE1BQ3ZEO0FBQUEsTUFDQSxVQUFVO0FBQUEsUUFDVDtBQUFBLE1BQ0Q7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNQLGdCQUFnQixDQUFDLGNBQWM7QUFDOUIsY0FBSSxVQUFVLFNBQVMsWUFBWTtBQUNsQyxtQkFBTztBQUFBLFVBQ1I7QUFFQSxpQkFBTyxVQUFVO0FBQUEsUUFDbEI7QUFBQSxRQUNBLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQSxVQUNSLEtBQUs7QUFBQSxRQUNOO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixPQUFPO0FBQUEsTUFDTixLQUFVLGFBQVEsa0NBQVcsS0FBSztBQUFBLE1BQ2xDLFVBQWUsYUFBUSxrQ0FBVyxVQUFVO0FBQUEsSUFDN0M7QUFBQSxFQUNEO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
