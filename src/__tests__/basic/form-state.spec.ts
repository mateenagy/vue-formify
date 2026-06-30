import { describe, it, expect, afterEach } from 'vitest';
import { useForm } from '@/main';
import { forms } from '@/utils/store';
import { StandardSchemaV1 } from '@/utils/types';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';

const createMinLengthSchema = (fields: string[], min: number, message: string): StandardSchemaV1<any, any> => ({
	'~standard': {
		version: 1,
		vendor: 'test',
		validate: (value: any) => {
			const val = value as Record<string, any>;
			const issues = fields
				.filter(f => !val[f] || String(val[f]).length < min)
				.map(f => ({ message, path: [{ key: f }] }));
			return issues.length ? { issues } : { value: val };
		},
	},
});

describe('Form state and lifecycle', () => {
	afterEach(() => {
		for (const key of Object.keys(forms)) {
			if (key.startsWith('fs-')) {
				delete forms[key];
			}
		}
	});

	it('should report isDirty when any single field is modified', async () => {
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

		// Modifying a single field is enough to make the form dirty.
		const inputs = wrapper.findAll('input');
		await inputs[0].setValue('test@test.com');
		await nextTick();

		expect(wrapper.find('.dirty').text()).toBe('true');
		wrapper.unmount();
	});

	it('should not be dirty on mount when fields have initial values', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({
				name: 'fs-dirty-initial',
				initialValues: { email: 'test@test.com', name: 'John' },
			});

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
		await nextTick();

		// A field carrying an initial value is unchanged, so the form is pristine.
		expect(wrapper.find('.dirty').text()).toBe('false');
		wrapper.unmount();
	});

	it('should reset isDirty when a field returns to its initial value', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({
				name: 'fs-dirty-revert',
				initialValues: { email: 'initial@test.com' },
			});

			return () => h(Form, {}, {
				default: ({ isDirty }: any) => [
					h(Field, { name: 'email' }),
					h('span', { class: 'dirty' }, `${isDirty}`),
				],
			});
		});

		const wrapper = mount(cmp);
		await nextTick();
		await nextTick();

		expect(wrapper.find('.dirty').text()).toBe('false');

		const input = wrapper.find('input');
		await input.setValue('changed@test.com');
		await nextTick();
		expect(wrapper.find('.dirty').text()).toBe('true');

		// Typing the original value back clears the dirty state.
		await input.setValue('initial@test.com');
		await nextTick();
		expect(wrapper.find('.dirty').text()).toBe('false');
		wrapper.unmount();
	});

	it('should report isValid for a pristine form with no errors (independent of dirty)', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fs-valid' });

			return () => h(Form, {}, {
				default: ({ isValid, isDirty }: any) => [
					h(Field, { name: 'email' }),
					h('span', { class: 'valid' }, `${isValid}`),
					h('span', { class: 'dirty' }, `${isDirty}`),
				],
			});
		});

		const wrapper = mount(cmp);
		await nextTick();

		// Pristine and error-free: valid is true even though dirty is false.
		expect(wrapper.find('.dirty').text()).toBe('false');
		expect(wrapper.find('.valid').text()).toBe('true');

		// Entering a value makes it dirty but it stays valid (no errors).
		await wrapper.find('input').setValue('test@test.com');
		await nextTick();

		expect(wrapper.find('.dirty').text()).toBe('true');
		expect(wrapper.find('.valid').text()).toBe('true');
		wrapper.unmount();
	});

	it('should report invalid when a field has an error, regardless of dirty state', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field, setError } = useForm({ name: 'fs-valid-error' });

			return () => h(Form, {}, {
				default: ({ isValid, isDirty }: any) => [
					h(Field, { name: 'email' }),
					h('button', {
						type: 'button',
						onClick: () => setError('email', 'Invalid email'),
					}, 'Set Error'),
					h('span', { class: 'valid' }, `${isValid}`),
					h('span', { class: 'dirty' }, `${isDirty}`),
				],
			});
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(wrapper.find('.valid').text()).toBe('true');

		// An error makes the form invalid even though it is still pristine.
		await wrapper.find('button').trigger('click');
		await nextTick();

		expect(wrapper.find('.dirty').text()).toBe('false');
		expect(wrapper.find('.valid').text()).toBe('false');
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

		// A value differing from the initial value marks the field dirty.
		const input = wrapper.find('input');
		await input.setValue('a');
		await input.trigger('input');
		await nextTick();

		expect(wrapper.find('.dirty').text()).toBe('true');
		wrapper.unmount();
	});

	it('should stay valid after setValue when no schema introduces errors', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field, setValue } = useForm({ name: 'fs-setvalue-valid' });

			return () => h(Form, {}, {
				default: ({ isValid }: any) => [
					h(Field, { name: 'email' }),
					h('button', {
						type: 'button',
						onClick: () => setValue('email', 'test@test.com'),
					}, 'Set'),
					h('span', { class: 'valid' }, `${isValid}`),
				],
			});
		});

		const wrapper = mount(cmp);
		await nextTick();

		// Valid from the start (no errors), and a programmatic setValue keeps it so.
		expect(wrapper.find('.valid').text()).toBe('true');

		await wrapper.find('button').trigger('click');
		await nextTick();

		expect(wrapper.find('.valid').text()).toBe('true');
		wrapper.unmount();
	});

	it('should stay valid after setValues when no schema introduces errors', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field, setValues } = useForm({ name: 'fs-setvalues-valid' });

			return () => h(Form, {}, {
				default: ({ isValid }: any) => [
					h(Field, { name: 'email' }),
					h(Field, { name: 'name' }),
					h('button', {
						type: 'button',
						onClick: () => setValues({ email: 'test@test.com', name: 'John' } as any),
					}, 'Set'),
					h('span', { class: 'valid' }, `${isValid}`),
				],
			});
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(wrapper.find('.valid').text()).toBe('true');

		await wrapper.find('button').trigger('click');
		await nextTick();

		expect(wrapper.find('.valid').text()).toBe('true');
		wrapper.unmount();
	});

	it('should keep isValid false after setValues when schema validation fails', async () => {
		const schema = createMinLengthSchema(['firstName', 'lastName'], 2, 'Too short');

		const cmp = defineComponent(() => {
			const { Form, Field, setValues } = useForm({ name: 'fs-setvalues-schema-invalid', schema });

			return () => h(Form, {}, {
				default: ({ isValid }: any) => [
					h(Field, { name: 'firstName' }),
					h(Field, { name: 'lastName' }),
					h('button', {
						type: 'button',
						onClick: () => setValues({ firstName: '', lastName: '' } as any),
					}, 'Set'),
					h('span', { class: 'valid' }, `${isValid}`),
				],
			});
		});

		const wrapper = mount(cmp);
		await nextTick();

		await wrapper.find('button').trigger('click');
		await nextTick();
		await nextTick();

		expect(wrapper.find('.valid').text()).toBe('false');
		wrapper.unmount();
	});

	it('should set isValid true after setValues when schema validation passes', async () => {
		const schema = createMinLengthSchema(['firstName', 'lastName'], 2, 'Too short');

		const cmp = defineComponent(() => {
			const { Form, Field, setValues } = useForm({ name: 'fs-setvalues-schema-valid', schema });

			return () => h(Form, {}, {
				default: ({ isValid }: any) => [
					h(Field, { name: 'firstName' }),
					h(Field, { name: 'lastName' }),
					h('button', {
						type: 'button',
						onClick: () => setValues({ firstName: 'John', lastName: 'Doe' } as any),
					}, 'Set'),
					h('span', { class: 'valid' }, `${isValid}`),
				],
			});
		});

		const wrapper = mount(cmp);
		await nextTick();

		// Pristine with no validation run yet → valid.
		expect(wrapper.find('.valid').text()).toBe('true');

		await wrapper.find('button').trigger('click');
		await nextTick();
		await nextTick();

		expect(wrapper.find('.valid').text()).toBe('true');
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

	it('should expose form-level isDirty and isValid from the useForm() return', async () => {
		let formApi: any;
		const cmp = defineComponent(() => {
			formApi = useForm({ name: 'fs-return-state' });
			const { Form, Field } = formApi;

			return () => h(Form, {}, () => [h(Field, { name: 'email' })]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		// Pristine, no errors.
		expect(formApi.isDirty.value).toBe(false);
		expect(formApi.isValid.value).toBe(true);

		await wrapper.find('input').setValue('hello');
		await nextTick();

		expect(formApi.isDirty.value).toBe(true);
		expect(formApi.isValid.value).toBe(true);
		wrapper.unmount();
	});

	it('should report form-level isTouched after a field is blurred', async () => {
		let formApi: any;
		const cmp = defineComponent(() => {
			formApi = useForm({ name: 'fs-touched-form' });
			const { Form, Field } = formApi;

			return () => h(Form, {}, () => [h(Field, { name: 'email' })]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(formApi.isTouched.value).toBe(false);

		await wrapper.find('input').trigger('focus');
		await wrapper.find('input').trigger('blur');
		await nextTick();

		expect(formApi.isTouched.value).toBe(true);
		wrapper.unmount();
	});

	it('should track isSubmitted and submitCount across submits and reset', async () => {
		let formApi: any;
		const cmp = defineComponent(() => {
			formApi = useForm({ name: 'fs-submitcount' });
			const { Form, Field } = formApi;

			return () => h(Form, { onSubmit: () => {} }, () => [h(Field, { name: 'email' })]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(formApi.isSubmitted.value).toBe(false);
		expect(formApi.submitCount.value).toBe(0);

		await wrapper.find('form').trigger('submit');
		await nextTick();
		expect(formApi.isSubmitted.value).toBe(true);
		expect(formApi.submitCount.value).toBe(1);

		await wrapper.find('form').trigger('submit');
		await nextTick();
		expect(formApi.submitCount.value).toBe(2);

		formApi.reset();
		await nextTick();
		expect(formApi.isSubmitted.value).toBe(false);
		expect(formApi.submitCount.value).toBe(0);
		wrapper.unmount();
	});

	it('should return a per-field snapshot via getFieldState', async () => {
		let formApi: any;
		const cmp = defineComponent(() => {
			formApi = useForm({ name: 'fs-getfieldstate', initialValues: { email: 'a@b.co' } });
			const { Form, Field } = formApi;

			return () => h(Form, {}, () => [h(Field, { name: 'email' })]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		await nextTick();

		let state = formApi.getFieldState('email');
		expect(state.value).toBe('a@b.co');
		expect(state.isDirty).toBe(false);
		expect(state.isTouched).toBe(false);
		expect(state.isValid).toBe(true);
		expect(state.error).toBeUndefined();

		await wrapper.find('input').setValue('changed@b.co');
		await nextTick();

		state = formApi.getFieldState('email');
		expect(state.value).toBe('changed@b.co');
		expect(state.isDirty).toBe(true);

		formApi.setError('email', 'Bad email');
		await nextTick();

		state = formApi.getFieldState('email');
		expect(state.isValid).toBe(false);
		expect(state.error).toBe('Bad email');
		wrapper.unmount();
	});
});
