import { describe, it, expect, afterEach } from 'vitest';
import { useForm } from '@/main';
import { forms } from '@/utils/store';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';

describe('Form state and lifecycle', () => {
	afterEach(() => {
		for (const key of Object.keys(forms)) {
			if (key.startsWith('fs-')) {
				delete forms[key];
			}
		}
	});

	it('should report isDirty when all fields are modified', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fs-dirty' });

			return () => h(Form, {}, {
				default: ({ isDirty }: any) => [
					h(Field, { name: 'email' }),
					h(Field, { name: 'name' }),
					h('span', { class: 'dirty' }, `${isDirty}`),
				],
			});
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(wrapper.find('.dirty').text()).toBe('false');

		// Modify both fields (isDirty uses .every() so ALL fields must be dirty)
		const inputs = wrapper.findAll('input');
		await inputs[0].setValue('test@test.com');
		await inputs[1].setValue('John');
		await nextTick();

		expect(wrapper.find('.dirty').text()).toBe('true');
		wrapper.unmount();
	});

	it('should report isValid when form is dirty with no errors', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fs-valid' });

			return () => h(Form, {}, {
				default: ({ isValid }: any) => [
					h(Field, { name: 'email' }),
					h('span', { class: 'valid' }, `${isValid}`),
				],
			});
		});

		const wrapper = mount(cmp);
		await nextTick();

		// Not dirty yet, so isValid is false
		expect(wrapper.find('.valid').text()).toBe('false');

		// Make the field dirty by entering a value
		await wrapper.find('input').setValue('test@test.com');
		await nextTick();

		// Now dirty with no errors, so isValid is true
		expect(wrapper.find('.valid').text()).toBe('true');
		wrapper.unmount();
	});

	it('should return field error via getError slot prop', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field, setError } = useForm({ name: 'fs-geterror' });

			return () => h(Form, {}, {
				default: ({ getError }: any) => [
					h(Field, { name: 'email' }),
					h('button', {
						type: 'button',
						onClick: () => setError('email', 'Invalid email'),
					}, 'Set Error'),
					h('span', { class: 'error' }, getError('email') || ''),
				],
			});
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(wrapper.find('.error').text()).toBe('');

		await wrapper.find('button').trigger('click');
		await nextTick();

		expect(wrapper.find('.error').text()).toBe('Invalid email');
		wrapper.unmount();
	});

	it('should set isSubmitting during async submit', async () => {
		let resolveSubmit: () => void;
		let submittingRef: any;

		const cmp = defineComponent(() => {
			const { Form, Field, isSubmitting } = useForm({ name: 'fs-submitting' });
			submittingRef = isSubmitting;

			return () => h(Form, {
				onSubmit: () => new Promise<void>((resolve) => {
					resolveSubmit = resolve;
				}),
			}, () => [
				h(Field, { name: 'email' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(submittingRef.value).toBe(false);

		// Trigger submit (async handler keeps it pending)
		wrapper.find('form').trigger('submit');
		await nextTick();
		await nextTick();

		expect(submittingRef.value).toBe(true);

		// Resolve the submit
		resolveSubmit!();
		await nextTick();
		await nextTick();

		expect(submittingRef.value).toBe(false);
		wrapper.unmount();
	});

	it('should fire onValueChange when values change after mount', async () => {
		const changes: any[] = [];

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fs-valuechange' });

			return () => h(Form, {
				onValueChange: (val: any) => { changes.push(val); },
			}, () => [
				h(Field, { name: 'email' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		await nextTick();

		// Changes should be empty since isFormReady fires after mount
		expect(changes).toHaveLength(0);

		await wrapper.find('input').setValue('test@test.com');
		await nextTick();

		expect(changes.length).toBeGreaterThanOrEqual(1);
		wrapper.unmount();
	});

	it('should set field isTouched after focus and blur', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fs-touched' });

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }, {
					default: ({ field }: any) => [
						h('input', {
							value: field.value,
							onInput: field.onInput,
							onFocus: field.onFocus,
							onBlur: field.onBlur,
						}),
						h('span', { class: 'touched' }, `${field.isTouched}`),
					],
				}),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(wrapper.find('.touched').text()).toBe('false');

		await wrapper.find('input').trigger('focus');
		await wrapper.find('input').trigger('blur');
		await nextTick();

		expect(wrapper.find('.touched').text()).toBe('true');
		wrapper.unmount();
	});

	it('should set field isDirty after value change', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fs-field-dirty' });

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }, {
					default: ({ field }: any) => [
						h('input', {
							value: field.value,
							onInput: field.onInput,
							onFocus: field.onFocus,
							onBlur: field.onBlur,
						}),
						h('span', { class: 'dirty' }, `${field.isDirty}`),
					],
				}),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(wrapper.find('.dirty').text()).toBe('false');

		// Input a value — first input sets isTouched, second sets isDirty
		const input = wrapper.find('input');
		await input.setValue('a');
		await input.trigger('input');
		await nextTick();
		await input.setValue('ab');
		await input.trigger('input');
		await nextTick();

		expect(wrapper.find('.dirty').text()).toBe('true');
		wrapper.unmount();
	});

	it('should clear error on focus', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field, Error, setError } = useForm({ name: 'fs-focus-clear' });

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }),
				h(Error, { errorFor: 'email' }),
				h('button', {
					type: 'button',
					onClick: () => setError('email', 'Required'),
				}, 'Set Error'),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		// Make field dirty first so error will be visible
		await wrapper.find('input').setValue('x');
		await nextTick();

		// Set an error after field is dirty
		await wrapper.find('button').trigger('click');
		await nextTick();
		expect(wrapper.find('span').text()).toBe('Required');

		// Focus the field to clear error
		await wrapper.find('input').trigger('focus');
		await nextTick();

		expect(wrapper.find('span').text()).toBe('');
		wrapper.unmount();
	});
});
