# Vue Formify

## Create custom input
```ts
import { useCreateInput } from '@/composable/useCreateInput';
import { ElOption, ElSelect } from 'element-plus';

const props = defineProps<{
	name: string;
	label?: string;
	modelValue?: any[];
}>();
const emit = defineEmits(['update:modelValue']);
const { value } = useCreateInput(props, emit);
```
