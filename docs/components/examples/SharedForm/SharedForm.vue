<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vue-formify';
import SideBar from './SideBar.vue';

type UserData = {
	cars: string;
	color: string;
	fuel_type: string;
}

const showSidebar = ref(false);
const { Form, Field, handleSubmit, values } = useForm<UserData>({
	name: 'filter',
	preserve: true,
	initialValues: {
		cars: 'volvo',
	},
});

const submit = handleSubmit((data) => {
	alert(JSON.stringify(data, undefined, '\t'));
});
</script>

<template>
	<div class="relative">
		<SideBar v-model="showSidebar" />
		<div class="container filter">
			<Form @submit="submit">
				<label>Car</label>
				<Field
					name="cars"
					class="form-control"
					as="select">
					<option value="volvo">
						Volvo
					</option>
					<option value="saab">
						Saab
					</option>
					<option value="mercedes">
						Mercedes
					</option>
					<option value="audi">
						Audi
					</option>
				</Field>
				<label>Color</label>
				<Field
					name="color"
					class="form-control"
					as="select">
					<option value="red">
						Red
					</option>
					<option value="green">
						Green
					</option>
					<option value="white">
						White
					</option>
				</Field>
				<button class="btn btn-primary mt-3">
					Filter
				</button>
				<button
					class="btn btn-primary mt-3 ms-2"
					type="button"
					@click="showSidebar = !showSidebar">
					Show sidebar
					filter
				</button>
				<pre class="mt-3">{{ values }}</pre>
			</Form>
		</div>
	</div>
</template>
<style>
:root {
  &:has(.sidebar) {
    .filter {
      filter: blur(5px);
    }
  }
}
.filter {
  transition: filter 0.25s;
}
</style>
