<script setup lang="ts">
import { useForm } from 'vue-formify';
import ColorPicker from './ColorPicker.vue';

type UserData = {
  color: string
}

const { Form, handleSubmit, values } = useForm<UserData>();

const submit = handleSubmit((data) => {
  alert(JSON.stringify(data, undefined, '\t'))
});
</script>

<template>
  <div class="container">
    <Form @submit="submit">
      <ColorPicker name="color" />
      <button class="btn btn-primary mt-3">Submit</button>
      <pre class="mt-3">{{ values }}</pre>
    </Form>
  </div>
</template>
<style>
@import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css';

.form-control {
  max-width: 300px;
}
</style>
