import { describe, it, expect, afterEach } from 'vitest';
import { useForm, useInput, type InputProps } from '@/main';
import { forms } from '@/utils/store';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';

const makeObjectField = () => defineComponent({
	props: ['name', 'default', 'modelValue'],
	setup(props) {
		const { value, setValue, inputProps } = useInput(props as InputProps);

		return { value, setValue, inputProps };
	},
	render() {
		return h('div');
	},
});

describe('Object value fields', () => {
	afterEach(() => {
		for (const key of Object.keys(forms)) {
			if (key.startsWith('obj-')) {
				delete forms[key];
			}
		}
	});

	it('should submit object value set via default prop', async () => {
		let submittedValues: any;
		const ObjectField = makeObjectField();

		const cmp = defineComponent(() => {
			const { Form } = useForm({ name: 'obj-default' });

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(ObjectField, { name: 'range', default: { min: 0, max: 100 } }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues).toEqual({ range: { min: 0, max: 100 } });
		wrapper.unmount();
	});

	it('should pre-populate object value from initialValues', async () => {
		let formValues: any;
		const ObjectField = makeObjectField();

		const cmp = defineComponent(() => {
			const { Form, values } = useForm({
				name: 'obj-init',
				initialValues: { range: { min: 10, max: 90 } },
			});
			formValues = values;

			return () => h(Form, {}, () => [
				h(ObjectField, { name: 'range' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(formValues.value.range).toEqual({ min: 10, max: 90 });
		wrapper.unmount();
	});

	it('should submit object value from initialValues', async () => {
		let submittedValues: any;
		const ObjectField = makeObjectField();

		const cmp = defineComponent(() => {
			const { Form } = useForm({
				name: 'obj-init-submit',
				initialValues: { range: { min: 10, max: 90 } },
			});

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(ObjectField, { name: 'range' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues).toEqual({ range: { min: 10, max: 90 } });
		wrapper.unmount();
	});

	it('should update object value via setValue', async () => {
		let setValueFn: any;
		let formValues: any;
		const ObjectField = defineComponent({
			props: ['name', 'default'],
			setup(props) {
				const { setValue } = useInput(props as InputProps);
				setValueFn = setValue;

				return () => h('div');
			},
		});

		const cmp = defineComponent(() => {
			const { Form, values } = useForm({
				name: 'obj-setvalue',
				initialValues: { range: { min: 0, max: 100 } },
			});
			formValues = values;

			return () => h(Form, {}, () => [
				h(ObjectField, { name: 'range' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		setValueFn({ min: 20, max: 80 });
		await nextTick();

		expect(formValues.value.range).toEqual({ min: 20, max: 80 });
		wrapper.unmount();
	});

	it('should expose full object via inputProps.modelValue', async () => {
		let capturedInputProps: any;
		const ObjectField = defineComponent({
			props: ['name', 'default'],
			setup(props) {
				const { inputProps } = useInput(props as InputProps);
				capturedInputProps = inputProps;

				return () => h('div');
			},
		});

		const cmp = defineComponent(() => {
			const { Form } = useForm({ name: 'obj-modelvalue' });

			return () => h(Form, {}, () => [
				h(ObjectField, { name: 'range', default: { min: 0, max: 100 } }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(capturedInputProps.value.modelValue).toEqual({ min: 0, max: 100 });
		wrapper.unmount();
	});

	it('should update object value via onUpdate:modelValue', async () => {
		let capturedInputProps: any;
		let formValues: any;
		const ObjectField = defineComponent({
			props: ['name', 'default'],
			setup(props) {
				const { inputProps } = useInput(props as InputProps);
				capturedInputProps = inputProps;

				return () => h('div');
			},
		});

		const cmp = defineComponent(() => {
			const { Form, values } = useForm({ name: 'obj-update' });
			formValues = values;

			return () => h(Form, {}, () => [
				h(ObjectField, { name: 'range', default: { min: 0, max: 100 } }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		capturedInputProps.value['onUpdate:modelValue']({ min: 25, max: 75 });
		await nextTick();

		expect(formValues.value.range).toEqual({ min: 25, max: 75 });
		wrapper.unmount();
	});

	it('should not confuse plain object value with nested fields on submit', async () => {
		let submittedValues: any;
		const ObjectField = makeObjectField();

		const cmp = defineComponent(() => {
			const { Form } = useForm({ name: 'obj-vs-nested' });

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(ObjectField, { name: 'range', default: { min: 0, max: 100 } }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		await wrapper.find('form').trigger('submit');
		await nextTick();

		// The value should be the plain object, not decomposed into sub-fields
		expect(submittedValues.range).toEqual({ min: 0, max: 100 });
		expect(submittedValues['range.min']).toBeUndefined();
		expect(submittedValues['range.max']).toBeUndefined();
		wrapper.unmount();
	});
});
