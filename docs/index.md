---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "<span>Vue</span>Formify"
  text: "Unleash Form-Building Freedom!"
  image:
    src: /logo.svg
    alt: VueFormify logo
  tagline: Build forms faster with <strong>type-safety</strong> feature, create custom inputs or use any third party library with ease. Let VueFormify handle form values, changes, submissions and more.
  actions:
    - theme: brand
      text: Documentation
      link: /docs/getting-started/

features:
  - title: Auto collect values
    details: The Form component collect the values without using v-model.
  - title: Type-safe fields
    details: With the useForm composable ypu can create Type-safe fields
  - title: Form level validators
    details: You can use joi, yup, zod or valibot for form validation. (additional package needed)
  - title: Share data between forms
    details: You can easily share data between form without using any addtional store logic.
  - title: Easy integration
    details: You can easily create custom inputs, or use your favourite UI library.
  - title: Lightweight
    details: VueFormify is only ~4kb
---
