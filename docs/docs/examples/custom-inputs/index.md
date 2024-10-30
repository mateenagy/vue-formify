# Advance custom input
In this example we are going to make and advance yet simple drag and drop file upload input.

Our first task is to create the component of course. Here is what we do:

- We define the file prop which will be our v-model. The reason why I don't use modelValue is because createInput can handle named v-model (e.g. v-model:file).
- We define the emit to update the value
- We define two method:
    - onDrop will handle drag and drop file upload
    - onChange will handle the standard file input change
- Then we have the html and some basic CSS

```vue
<script lang="ts" setup>
import { ref } from 'vue';

/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
defineProps<{
	file?: File;
}>();
const emits = defineEmits(['update:file']);
const name = ref<string>();
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const onDrop = ($event: any) => {
	emits('update:file', $event.dataTransfer.files[0]);
	name.value = $event.dataTransfer.files[0]?.name;
};
const onChange = ($event: any) => {
	emits('update:file', $event.target.files[0]);
	name.value = $event.target.files[0]?.name;
};
</script>
<template>
	<div class="file_upload_contianer">
		<input type="file" id="file" @change="onChange">
		<label for="file" class="file-upload-body" @drop.prevent="onDrop" @dragenter.prevent @dragover.prevent>
			<strong>Choose a file</strong> or drag it here.
		</label>
		<p class="uploaded-file">
			{{ file }}
			Selected file: {{ name }}
		</p>
	</div>
</template>

<style lang="scss" scoped>
.file_upload_contianer {
	input[type="file"] {
		display: none;
	}

	.file-upload-body {
		padding: 2rem;
		border: 1px dashed #fff;
		width: 100%;
		text-align: center;
		border-radius: 10px;
	}

	.uploaded-file {
		margin-top: 1rem;
	}
}
</style>
```
And we make it work with the form.

- We import createInput and ComponentProps.
- We create use the createInput to make it usable with the Form component
    - We use the ComponentProps type helper to have all the props from the original component
    - We add the modelKey: 'file' option to define the named v-model we want to use. (If you use the basic modelValue then you don't need this option)

```vue
<script lang="ts" setup>
import { FormifyForm, createInput, ComponentProps } from 'vue-formify';
import FileUpload from './FileUpload.vue';

const Upload = createInput<ComponentProps<typeof FileUpload>>(FileUpload, { modelKeys: 'file' });

const send = (data: any) => {
	console.log('[send]: ', data);
};
</script>
<template>
	<FormifyForm @submit="send" v-slot="{ data }">
		<pre>{{ data }}</pre>
		<Upload name="file" />
		<button class="btn btn-outline">
			Send
		</button>
	</FormifyForm>
</template>
<style src="" lang="scss" scoped />
```
And that's all! We can now use it! 🎉
