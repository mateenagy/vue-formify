import { reactive } from 'vue';

type FormStore = {
	values: Record<string, any>;
	initialValues: Record<string, any>;
	key: number;
}
export const forms = reactive<Record<string, FormStore>>({});
