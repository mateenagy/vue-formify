import { describe, it, expect, afterEach } from 'vitest';
import { useForm } from '@/main';
import { forms } from '@/utils/store';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';

describe('Form value collection', () => {
	afterEach(() => {
		for (const key of Object.keys(forms)) {
			if (key.startsWith('values-')) {
				delete forms[key];
			}
		}
	});

	it('should collect simple form values on submit', async () => {
		let submittedValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'values-simple' });

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(Field, { name: 'email' }),
			]);
		});

		const wrapper = mount(cmp);
		await wrapper.find('input').setValue('test@test.com');
		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues).toEqual({ email: 'test@test.com' });
		wrapper.unmount();
	});

	it('should collect nested field values', async () => {
		let submittedValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'values-nested' });

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(Field, { name: 'user.email' }),
				h(Field, { name: 'user.name' }),
			]);
		});

		const wrapper = mount(cmp);
		const inputs = wrapper.findAll('input');
		await inputs[0].setValue('test@test.com');
		await inputs[1].setValue('John');
		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues).toEqual({
			user: { email: 'test@test.com', name: 'John' },
		});
		wrapper.unmount();
	});

	it('should collect array field values', async () => {
		let submittedValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'values-array' });

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(Field, { name: 'items[0]' }),
				h(Field, { name: 'items[1]' }),
			]);
		});

		const wrapper = mount(cmp);
		const inputs = wrapper.findAll('input');
		await inputs[0].setValue('first');
		await inputs[1].setValue('second');
		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues).toEqual({ items: ['first', 'second'] });
		wrapper.unmount();
	});

	it('should collect deeply nested mixed path values', async () => {
		let submittedValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'values-deep' });

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(Field, { name: 'users[0].addresses[0].street' }),
			]);
		});

		const wrapper = mount(cmp);
		await wrapper.find('input').setValue('123 Main St');
		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues).toEqual({
			users: [{ addresses: [{ street: '123 Main St' }] }],
		});
		wrapper.unmount();
	});

	it('should call handleSubmit callback with current values', async () => {
		let cbValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field, handleSubmit } = useForm({ name: 'values-handle' });

			const onSubmit = handleSubmit((vals: any) => {
				cbValues = vals;
			});

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }),
				h('button', { type: 'button', onClick: onSubmit }, 'Submit'),
			]);
		});

		const wrapper = mount(cmp);
		await wrapper.find('input').setValue('test@test.com');
		await wrapper.find('button').trigger('click');
		await nextTick();

		expect(cbValues).toEqual({ email: 'test@test.com' });
		wrapper.unmount();
	});

	it('should reflect current form state in values computed ref', async () => {
		let formValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field, values } = useForm({ name: 'values-ref' });
			formValues = values;

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(formValues.value).toEqual({ email: '' });

		await wrapper.find('input').setValue('hello@test.com');
		await nextTick();

		expect(formValues.value).toEqual({ email: 'hello@test.com' });
		wrapper.unmount();
	});
});
