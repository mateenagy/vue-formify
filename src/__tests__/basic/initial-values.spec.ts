import { describe, it, expect, afterEach } from 'vitest';
import { useForm } from '@/main';
import { forms } from '@/utils/store';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';

describe('Initial values and reset', () => {
	afterEach(() => {
		for (const key of Object.keys(forms)) {
			if (key.startsWith('init-')) {
				delete forms[key];
			}
		}
	});

	it('should pre-populate input from initialValues option', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({
				name: 'init-option',
				initialValues: { email: 'pre@test.com' },
			});

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(wrapper.find('input').element.value).toBe('pre@test.com');
		wrapper.unmount();
	});

	it('should pre-populate input from initialValues prop', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'init-prop' });

			return () => h(Form, {
				initialValues: { email: 'prop@test.com' },
			}, () => [
				h(Field, { name: 'email' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(wrapper.find('input').element.value).toBe('prop@test.com');
		wrapper.unmount();
	});

	it('should update form when setInitialValues is called', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field, setInitialValues } = useForm({
				name: 'init-set',
				initialValues: { email: 'old@test.com' },
			});

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }),
				h('button', {
					type: 'button',
					onClick: () => setInitialValues({ email: 'new@test.com' }),
				}, 'Set'),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		expect(wrapper.find('input').element.value).toBe('old@test.com');

		await wrapper.find('button').trigger('click');
		await nextTick();
		await nextTick();

		expect(wrapper.find('input').element.value).toBe('new@test.com');
		wrapper.unmount();
	});

	it('should update specific field with setValue', async () => {
		let setValueFn: any;

		const cmp = defineComponent(() => {
			const { Form, Field, setValue } = useForm({ name: 'init-setvalue' });
			setValueFn = setValue;

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		setValueFn('email', 'updated@test.com');
		await nextTick();

		expect(wrapper.find('input').element.value).toBe('updated@test.com');
		wrapper.unmount();
	});

	it('should batch-set multiple fields with setValues', async () => {
		let setValuesFn: any;

		const cmp = defineComponent(() => {
			const { Form, Field, setValues } = useForm({ name: 'init-setvalues' });
			setValuesFn = setValues;

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }),
				h(Field, { name: 'name' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		setValuesFn({ email: 'batch@test.com', name: 'John' });
		await nextTick();

		const inputs = wrapper.findAll('input');
		expect(inputs[0].element.value).toBe('batch@test.com');
		expect(inputs[1].element.value).toBe('John');
		wrapper.unmount();
	});

	it('should restore form to original initial values on reset()', async () => {
		let resetFn: any;

		const cmp = defineComponent(() => {
			const { Form, Field, reset } = useForm({
				name: 'init-reset',
				initialValues: { email: 'original@test.com' },
			});
			resetFn = reset;

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		await wrapper.find('input').setValue('changed@test.com');
		await nextTick();
		expect(wrapper.find('input').element.value).toBe('changed@test.com');

		resetFn();
		await nextTick();
		await nextTick();

		expect(wrapper.find('input').element.value).toBe('original@test.com');
		wrapper.unmount();
	});

	it('should clear all values on reset(true)', async () => {
		let resetFn: any;
		let formValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field, reset, values } = useForm({
				name: 'init-reset-force',
				initialValues: { email: 'original@test.com' },
			});
			resetFn = reset;
			formValues = values;

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		expect(formValues.value).toEqual({ email: 'original@test.com' });

		resetFn(true);
		await nextTick();

		expect(forms['init-reset-force'].initialValues).toEqual({});
		wrapper.unmount();
	});
});
