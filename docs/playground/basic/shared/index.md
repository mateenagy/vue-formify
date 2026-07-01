---
aside: false
---

<script setup>
import App from './App.vue?raw'
import SideBar from './SideBar.vue?raw'
</script>

# Share data between forms

Sometimes, you may need to share form data across different pages, views, or components. For example, you might have a simple filter on the homepage and a more advanced filter in a sidebar that can be toggled.

In these scenarios, sharing data between forms ensures that changes in one form are automatically reflected in the other. This approach keeps your forms in sync and improves the user and developer experience.

<Playground :files="{ 'App.vue': App, 'SideBar.vue': SideBar }" height="640px" />
