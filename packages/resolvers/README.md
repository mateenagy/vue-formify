<p align="center">
  <a href="https://vue-formify.matenagy.me/" target="_blank">
	<img src="https://raw.githubusercontent.com/mateenagy/vue-formify/main/logo.png"  width="250px"/>
  </a>
</p>
<p align="center" style="font-size: 20px">unplugin-vue-components resolvers</p>

## 📦 Install
```
npm i @vue-formify/resolvers
```
## 💻 Usage
Open `vite.config.ts` and use the resolver you need.
```ts
import Components from 'unplugin-vue-components/vite';
import { IonicResolver } from '@vue-formify/resolver'

export default defineConfig({
	plugins: [
		Components({
			resolvers: [
				IonicResolver(),
			],
			...
		}),
	]
})

```
