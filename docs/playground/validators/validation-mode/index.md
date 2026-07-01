---
aside: false
---

<script setup>
import App from './App.vue?raw'
</script>

# Validation Mode

Vue Formify provides two validation modes for forms:

- `onSubmit` (default): Validation occurs only when the form is submitted. This mode is useful when you want to minimize validation feedback until the user is ready to submit their data.
- `onChange`: Validation runs on every input event, providing immediate feedback as the user types or changes form values.

Choose the mode that best fits your user experience needs.

<Playground :files="{ 'App.vue': App }" libs="arktype" />
