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

describe('Form lifecycle & isolation', () => {
	afterEach(() => {
		for (const key of Object.keys(forms)) {
			if (key.startsWith('lc-')) {
				delete forms[key];
			}
		}
	});

	it('removes the form store entry when the owner unmounts', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'lc-cleanup' });

			return () => h(Form, {}, () => [h(Field, { name: 'email' })]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		expect(forms['lc-cleanup']).toBeDefined();

		wrapper.unmount();
		await nextTick();
		expect(forms['lc-cleanup']).toBeUndefined();
	});

	it('keeps the form store entry on unmount when preserve is set', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'lc-preserve', preserve: true });

			return () => h(Form, {}, () => [h(Field, { name: 'email' })]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		expect(forms['lc-preserve']).toBeDefined();

		wrapper.unmount();
		await nextTick();
		expect(forms['lc-preserve']).toBeDefined();
	});

	it('does not leak onChange validation across separate forms', async () => {
		let aState: any;
		let bState: any;

		const cmp = defineComponent(() => {
			const a = useForm({ name: 'lc-a', mode: 'onChange', schema: minLength('email', 3, 'Too short') });
			const b = useForm({ name: 'lc-b', mode: 'onChange', schema: minLength('email', 3, 'Too short') });
			aState = a.getFieldState;
			bState = b.getFieldState;

			return () => h('div', [
				h(a.Form, {}, () => [h(a.Field, { name: 'email' })]),
				h(b.Form, {}, () => [h(b.Field, { name: 'email' })]),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		await nextTick();

		// Type an invalid value into form A only.
		const inputs = wrapper.findAll('input');
		await inputs[0].setValue('ab');
		await nextTick();
		await nextTick();

		// Form A is invalid; form B must be untouched (no cross-form bleed).
		expect(aState('email').error).toBe('Too short');
		expect(bState('email').error).toBeUndefined();
		wrapper.unmount();
	});
});
