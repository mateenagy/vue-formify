---
aside: false
---

<script setup>
import FieldApp from './field/App.vue?raw'
import FieldColorPicker from './field/ColorPicker.vue?raw'
import UseInputApp from './useinput/App.vue?raw'
import UseInputColorPicker from './useinput/ColorPicker.vue?raw'
</script>

# Custom component with `Field`

<Playground :files="{ 'App.vue': FieldApp, 'ColorPicker.vue': FieldColorPicker }" />

# Custom component with `useInput`

<Playground :files="{ 'App.vue': UseInputApp, 'ColorPicker.vue': UseInputColorPicker }" />
