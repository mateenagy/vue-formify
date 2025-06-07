<script lang="ts" setup>
/*---------------------------------------------
/  PROPS & EMITS
---------------------------------------------*/
defineProps<{
	id: string;
}>();
/*---------------------------------------------
/  VARIABLES
---------------------------------------------*/
const value = defineModel<boolean>({
	default: false,
});
/*---------------------------------------------
/  METHODS
---------------------------------------------*/
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
	<div class="custom-checkbox">
		<input
			:id
			v-model="value"
			type="checkbox" />
		<label :for="id">
			<slot></slot>
		</label>
	</div>
</template>
<style scoped>
.custom-checkbox {
	input[type="checkbox"] {
		appearance: none;
		width: 1.5rem;
		height: 1.5rem;

		+label {
			position: relative;
			display: flex;
			align-items: center;
			gap: 0.5rem;
			cursor: pointer;

			&::before {
				content: '';
				position: relative;
				width: 24px;
				height: 24px;
				border: 2px solid #fff;
				border-radius: 8px;
				background-color: transparent;
				transition: background-color 0.3s, border-color 0.3s;
			}

			&::after {
				content: '';
				position: absolute;
				width: 15px;
				height: 15px;
				left: 4.5px;
				border-radius: 5px;
				background-color: #fff;
				transform: scaleX(0);
				transform-origin: center;
				transition: background-color 0.3s, border-color 0.3s, transform 0.2s;
			}
		}

		&:checked {
			+ label {
				&::before {
					background-color: var(--color-lime);
				}

				&::after {
					background-color: #fff;
					transform: scaleX(1);
				}
			}
		}
	}

	label {
		cursor: pointer;
	}
}
</style>
