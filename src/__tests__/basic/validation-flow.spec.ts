import { describe, it, expect, afterEach } from 'vitest';
import { useForm } from '@/main';
import { forms } from '@/utils/store';
import { StandardSchemaV1 } from '@/utils/types';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';

const minLength = (field: string, min: number, message: string): StandardSchemaV1<any, any> => ({
	'~standard': {
		version: 1,
		vendor: 'test',
		validate: (value: any) => {
			const val = value as Record<string, any>;
			if (!val[field] || String(val[field]).length < min) {
				return { issues: [{ message, path: [{ key: field }] }] };
			}

			return { value: val };
		},
	},
});

describe('Validation flow', () => {
	afterEach(() => {
		for (const key of Object.keys(forms)) {
			if (key.startsWith('vf-')) {
				delete forms[key];
			}
		}
	});

	it('runs the schema exactly once per change in onChange mode', async () => {
		let count = 0;
		const countingSchema: StandardSchemaV1<any, any> = {
			'~standard': {
				version: 1,
				vendor: 'test',
				validate: (value: any) => {
					count++;

					return { value };
				},
			},
		};

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'vf-dedup', mode: 'onChange', schema: countingSchema });

			return () => h(Form, {}, () => [h(Field, { name: 'email' })]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		await nextTick();

		count = 0;
		await wrapper.find('input').setValue('x');
		await nextTick();
		await nextTick();

		// Previously the field emit + the values watcher each triggered a pass (2).
		expect(count).toBe(1);
		wrapper.unmount();
	});

	it('validate() surfaces schema errors and returns validity', async () => {
		let api: any;
		const cmp = defineComponent(() => {
			api = useForm({ name: 'vf-validate', mode: 'onChange', schema: minLength('email', 3, 'Too short') });
			const { Form, Field, Error } = api;

			return () => h(Form, {}, () => [h(Field, { name: 'email' }), h(Error, { errorFor: 'email' })]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		// Pristine in onChange mode: no error shown yet.
		expect(wrapper.find('span').text()).toBe('');

		const invalid = await api.validate();
		await nextTick();
		expect(invalid).toBe(false);
		// validate() marks the form submitted, so the gated message becomes visible.
		expect(wrapper.find('span').text()).toBe('Too short');

		await wrapper.find('input').setValue('abc');
		await nextTick();
		const valid = await api.validate();
		await nextTick();
		expect(valid).toBe(true);
		expect(wrapper.find('span').text()).toBe('');
		wrapper.unmount();
	});

	it('validate() resolves true when there is no schema', async () => {
		let api: any;
		const cmp = defineComponent(() => {
			api = useForm({ name: 'vf-noschema' });
			const { Form, Field } = api;

			return () => h(Form, {}, () => [h(Field, { name: 'email' })]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(await api.validate()).toBe(true);
		wrapper.unmount();
	});

	it('clearErrors() clears a single field or every field', async () => {
		let api: any;
		const cmp = defineComponent(() => {
			api = useForm({ name: 'vf-clear' });
			const { Form, Field } = api;

			return () => h(Form, {}, () => [h(Field, { name: 'email' }), h(Field, { name: 'name' })]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		api.setError('email', 'E1');
		api.setError('name', 'N1');
		await nextTick();
		expect(api.getFieldState('email').error).toBe('E1');
		expect(api.getFieldState('name').error).toBe('N1');

		// Clear a single field by name.
		api.clearErrors('email');
		await nextTick();
		expect(api.getFieldState('email').error).toBeUndefined();
		expect(api.getFieldState('name').error).toBe('N1');

		// Clear all remaining errors.
		api.setError('email', 'E2');
		api.clearErrors();
		await nextTick();
		expect(api.getFieldState('email').error).toBeUndefined();
		expect(api.getFieldState('name').error).toBeUndefined();
		wrapper.unmount();
	});
});
