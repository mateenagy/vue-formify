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
		<input
			type="file"
			id="file"
			@change="onChange">
		<label
			for="file"
			class="file-upload-body"
			@drop.prevent="onDrop"
			@dragenter.prevent
			@dragover.prevent>
			<strong>Choose a file</strong> or drag it here.
		</label>
		<p class="uploaded-file">
			{{ file }}
			Selected file: {{ name }}
		</p>
	</div>
</template>

<style scoped>
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
</style>
