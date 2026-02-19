import { describe, it, expect, afterEach } from 'vitest';
import { useForm } from '@/main';
import { forms } from '@/utils/store';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';

describe('Field component props', () => {
	afterEach(() => {
		for (const key of Object.keys(forms)) {
			if (key.startsWith('fp-')) {
				delete forms[key];
			}
		}
	});

	it('should set initial value from default prop', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fp-default' });

			return () => h(Form, {}, () => [
				h(Field, { name: 'email', default: 'default@test.com' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(wrapper.find('input').element.value).toBe('default@test.com');
		wrapper.unmount();
	});

	it('should exclude ignored field from submitted values', async () => {
		let submittedValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fp-ignore' });

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(Field, { name: 'email' }),
				h(Field, { name: 'internal', ignore: true }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		const inputs = wrapper.findAll('input');
		await inputs[0].setValue('test@test.com');
		await inputs[1].setValue('secret');
		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues).toEqual({ email: 'test@test.com' });
		expect(submittedValues.internal).toBeUndefined();
		wrapper.unmount();
	});

	it('should preserve field value across unmount/remount cycle', async () => {
		const show = ref(true);

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fp-preserve' });

			return () => h(Form, {}, () => [
				show.value ? h(Field, { name: 'email', preserve: true }) : null,
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		await wrapper.find('input').setValue('keep@test.com');
		await nextTick();

		// Unmount the field
		show.value = false;
		await nextTick();
		expect(wrapper.findAll('input')).toHaveLength(0);

		// Remount the field
		show.value = true;
		await nextTick();

		expect(wrapper.find('input').element.value).toBe('keep@test.com');
		wrapper.unmount();
	});

	it('should toggle checkbox between trueValue and falseValue', async () => {
		let submittedValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fp-checkbox' });

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(Field, { name: 'agree', type: 'checkbox', trueValue: 'yes', falseValue: 'no' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		// Check the checkbox
		const checkbox = wrapper.find('input[type="checkbox"]');
		await checkbox.setValue(true);
		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues.agree).toBe('yes');

		// Uncheck the checkbox
		await checkbox.setValue(false);
		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues.agree).toBe('no');
		wrapper.unmount();
	});

	it('should render select element with as="select"', async () => {
		let submittedValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fp-select' });

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(Field, { name: 'color', as: 'select' }, () => [
					h('option', { value: 'red' }, 'Red'),
					h('option', { value: 'blue' }, 'Blue'),
				]),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(wrapper.find('select').exists()).toBe(true);

		await wrapper.find('select').setValue('blue');
		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues.color).toBe('blue');
		wrapper.unmount();
	});

	it('should keep form values in sync with field input', async () => {
		let formValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field, values } = useForm({ name: 'fp-model' });
			formValues = values;

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		await wrapper.find('input').setValue('sync@test.com');
		await nextTick();

		expect(formValues.value.email).toBe('sync@test.com');
		wrapper.unmount();
	});
});
