<script setup lang="ts">
import { useForm } from 'vue-formify';
const show = defineModel<boolean>();

type UserData = {
	cars: string;
	color: string;
	fuel_type: string;
}

const { Form, Field, values } = useForm<UserData>({
	name: 'filter',
	preserve: true,
});
</script>

<template>
	<div
		class="sidebar"
		v-if="show">
		<Form>
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
			<label>Fuel type</label>
			<Field
				name="fuel_type"
				class="form-control"
				as="select">
				<option value="gas">
					Gas
				</option>
				<option value="diesel">
					Diesel
				</option>
				<option value="electric">
					Electric
				</option>
			</Field>
			<button
				class="btn btn-primary mt-3 ms-2"
				type="button"
				@click="show = false">
				Close sidebar
				filter
			</button>
			<pre class="mt-3">{{ values }}</pre>
		</Form>
	</div>
</template>
<style>
.sidebar {
  padding: 1rem;
  position: absolute;
  z-index: 99;
  right: 0;
  height: 100%;
  width: 400px;
  background-color: #fff;
  box-shadow: 0 0 34px 3px #878787;
}
</style>
