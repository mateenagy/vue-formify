---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "<span>Vue</span>Formify"
  text: "Build powerful, <strong>type-safe</strong> forms in Vue."
  image:
    src: /logo-new.svg
    alt: VueFormify logo
  tagline: Designed for intuitive use, it keeps your app lightweight and efficient while offering robust form handling capabilities.
  actions:
    - theme: brand
      text: Get started
      link: /docs/getting-started/
    - theme: alt
      text: Playground
      link: /playground/basic/simple/index.md

features:
  - title: 🔒 Type safe 
    details: Ensures accurate data types and autocompletion across fields
  - title:  📥 Auto collect values
    details: Seamlessly gathers form data.
  - title: 🚧 Validation
    details: Use schema based validators like Zod, Valibot or ArkType.
  - title: 🔗 Share data between forms
    details: Share data between forms without using any addtional store logic.
  - title: 🚀 Easy integration
    details: Flexible to work with other libraries.
  - title:  🌱 Lightweight
    details: VueFormify is only ~4kb
---

<script setup>
import App from './playground/basic/simple/App.vue?raw'
</script>

<div class="vp-doc home-playground">

## Try it out

<Playground :files="{ 'App.vue': App }" />

</div>
