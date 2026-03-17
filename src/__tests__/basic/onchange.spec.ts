import { describe, it, expect, afterEach } from 'vitest';
import { useForm } from '@/main';
import { forms } from '@/utils/store';
import { StandardSchemaV1 } from '@/utils/types';
import { EventEmitter } from '@/utils/utils';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';

const createMinLengthSchema = (field: string, min: number, message: string): StandardSchemaV1<any, any> => ({
	'~standard': {
		version: 1,
		vendor: 'test',
		validate: (value: any) => {
			const val = value as Record<string, any>;
			if (!val[field] || String(val[field]).length < min) {
				return {
					issues: [{ message, path: [{ key: field }] }],
				};
			}
			return { value: val };
		},
	},
});

const createFieldRule = (min: number, message: string): StandardSchemaV1 => ({
	'~standard': {
		version: 1,
		vendor: 'test',
		validate: (value: any) => {
			if (!value || String(value).length < min) {
				return {
					issues: [{ message, path: [] }],
				};
			}
			return { value };
		},
	},
});

describe('onChange validation mode', () => {
	afterEach(() => {
		(EventEmitter as any).eventListeners = {};
		for (const key of Object.keys(forms)) {
			if (key.startsWith('oc-')) {
				delete forms[key];
			}
		}
	});

	it('should show schema validation error immediately on change', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field, Error } = useForm({
				name: 'oc-schema',
				mode: 'onChange',
				schema: createMinLengthSchema('email', 3, 'Too short'),
			});

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }),
				h(Error, { errorFor: 'email' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		await nextTick();

		// Type a short value (invalid)
		await wrapper.find('input').setValue('ab');
		await nextTick();
		await nextTick();

		expect(wrapper.find('span').text()).toBe('Too short');
		wrapper.unmount();
	});

	it('should validate per-field rule on change', async () => {
		const rule = createFieldRule(3, 'Min 3 chars');

		const cmp = defineComponent(() => {
			const { Form, Field, Error } = useForm({
				name: 'oc-rule',
				mode: 'onChange',
			});

			return () => h(Form, {}, () => [
				h(Field, { name: 'username', rule }),
				h(Error, { errorFor: 'username' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		await nextTick();

		await wrapper.find('input').setValue('ab');
		await nextTick();
		await nextTick();

		expect(wrapper.find('span').text()).toBe('Min 3 chars');
		wrapper.unmount();
	});

	it('should clear errors when input becomes valid', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field, Error } = useForm({
				name: 'oc-clear',
				mode: 'onChange',
				schema: createMinLengthSchema('email', 3, 'Too short'),
			});

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }),
				h(Error, { errorFor: 'email' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		await nextTick();

		// Type invalid value
		await wrapper.find('input').setValue('ab');
		await nextTick();
		await nextTick();
		expect(wrapper.find('span').text()).toBe('Too short');

		// Type valid value
		await wrapper.find('input').setValue('abc');
		await nextTick();
		await nextTick();
		expect(wrapper.find('span').text()).toBe('');

		wrapper.unmount();
	});
});
