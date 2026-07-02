---
aside: false
---

<script setup>
import App from './App.vue?raw'
import ColorPicker from './ColorPicker.vue?raw'
</script>

# Custom component with `Field`

Wrap any component in `Field` and bind the slot props to it. Here a small `ColorPicker` wraps a native color input and receives the field's `modelValue`/`onUpdate:modelValue` through `v-bind="field"`.

<Playground :files="{ 'App.vue': App, 'ColorPicker.vue': ColorPicker }" />
