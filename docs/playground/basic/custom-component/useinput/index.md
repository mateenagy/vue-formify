---
aside: false
---

<script setup>
import App from './App.vue?raw'
import ColorPicker from './ColorPicker.vue?raw'
</script>

# Custom component with `useInput`

Build a self-contained input by calling `useInput` inside the component. It reads its `name` from props and exposes `inputProps`, so the component registers itself with the form directly — no `Field` wrapper needed.

<Playground :files="{ 'App.vue': App, 'ColorPicker.vue': ColorPicker }" />
