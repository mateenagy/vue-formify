<script setup lang="ts">
import { useForm } from 'vue-formify';
import * as z from "zod"

const { Form, Field, Error, handleSubmit, values } = useForm({
  schema: z.object({
    first_name: z.string().min(1, 'Required field'),
    last_name: z.string().min(1, 'Required field'),
  }),
});

const submit = handleSubmit((data) => {
  alert(JSON.stringify(data, undefined, '\t'))
});
</script>

<template>
  <div class="container">
    <Form @submit="submit">
      <div>
        <label>Firstname</label>
        <Field name="first_name" class="form-control" />
        <Error error-for="first_name" />
      </div>
      <div>
        <label>Lastname</label>
        <Field name="last_name" class="form-control" />
        <Error error-for="last_name" />
      </div>
      <div>
        <button class="btn btn-primary mt-3">Submit</button>
      </div>
      <pre class="mt-3">{{ values }}</pre>
    </Form>
  </div>
</template>
<style>
.form-control {
  max-width: 300px;
}

span {
  color: salmon;
}
</style>
