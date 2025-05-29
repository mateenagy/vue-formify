import { useForm } from '@/main';
import { StandardSchemaV1 } from '@/utils/types';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

export const createComponent = (options: {
	schema?: StandardSchemaV1<any, any>,
	fieldName: string,
	errorName?: string,
	mode?: 'onChange' | 'onSubmit';
}) => {
	const cmp = defineComponent(() => {
		const { Field, Form, Error, setError } = useForm({
			...(options.schema && { schema: options.schema }),
		});

		const onSubmit = () => {
			if (options.mode === 'onSubmit' && !options.schema) {
				setError(options.fieldName, 'Required field');
			}
		};

		return () => {
			return h(Form, { onSubmit }, () => [h(Field, { name: options.fieldName }), h(Error, { errorFor: options.errorName || options.fieldName })]);
		};
	});

	return mount(cmp);
};
