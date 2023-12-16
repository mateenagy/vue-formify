<script lang="ts" setup>
import { ref } from 'vue';
import { FormType } from './components';
import { STORE } from './store/store';
import { Formify } from '@/components/main';
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const form = ref<FormType>();
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
const send = (data: any) => {
	console.log('data', data);
};
/*---------------------------------------------
/  COMPUTED
---------------------------------------------*/
/*---------------------------------------------
/  WATCHERS
---------------------------------------------*/
/*---------------------------------------------
/  CREATED
---------------------------------------------*/
/*---------------------------------------------
/  HOOKS
---------------------------------------------*/
</script>
<template>
	<div class="wrapper">
		<div>
			<pre>{{ STORE }}</pre>
			<Formify.Form 
				@submit="send"
				ref="form"
				v-slot="{ data }">
				<pre>{{ data }}</pre>
				<div>
					<Formify.Input
						name="p"
						type="number"
						label="Page" />
				</div>
				<div>
					<Formify.Input
						name="links[0]"
						label="message" />
				</div>
				<div>
					<Formify.Checkbox
						default="yes"
						true-label="yes"
						false-label="no"
						name="check"
						label="hali" />
				</div>
				<div>
					<Formify.Radio
						name="radio"
						value="foo"
						label="foo" />
				</div>
				<div>
					<Formify.Radio
						name="radio"
						value="bar"
						label="bar" />
				</div>
				<div>
					<Formify.Input
						name="links[1]"
						label="message" />
				</div>
				<button>
					Send
				</button>
			</Formify.Form>
		</div>
		<button @click="form?.resetForm()">
			Reset
		</button>
	</div>
</template>
<style>
.wrapper {
	padding: 1rem;
}

.error-message {
	color: rgb(255, 77, 77);
}
</style>
