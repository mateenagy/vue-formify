import { mount, flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { useForm } from 'vue-formify';
import * as zod from 'zod';
import { schemaFromZod } from '../index';
import { defineComponent, h } from 'vue';

const BaseComponent = (options: {
	fieldName: any,
	errorName?: any,
	schema: any,
}) => {
	const cmp = defineComponent(() => {
		const { Field, Form, Error } = useForm();
		const schema = schemaFromZod(zod.object({
			...options.schema,
		}));

		return () => {
			return h(Form, {
				'validation-schema': schema,
			}, () => [h(Field, { name: options.fieldName }), h(Error, { errorFor: options.errorName || options.fieldName })]);
		};
	});

	return mount(cmp);
};
describe('Zod validation', () => {
	it('Required field', async () => {
		const wrapper = BaseComponent({
			fieldName: 'email',
			schema: {
				email: zod.string({ required_error: 'Required field' }).min(1, { message: 'Required field' }),
			},
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		await flushPromises();
		expect(wrapper.find('span').text()).equals('Required field');
	});
	it('Nested object', async () => {
		const wrapper = BaseComponent({
			fieldName: 'user.email',
			schema: {
				user: zod.object({
					email: zod.string({ required_error: 'Required field' }).min(1, { message: 'Required field' }),
				}),
			},
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		await flushPromises();
		expect(wrapper.find('span').text()).equals('Required field');
	});
	it('Array', async () => {
		const wrapper = BaseComponent({
			fieldName: 'emails[0]',
			errorName: 'emails',
			schema: {
				emails: zod.array(zod.string()).min(1, { message: 'Minimum 1 item required' }),
			},
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		await flushPromises();
		expect(wrapper.find('span').text()).equals('Minimum 1 item required');
	});
	it('Nested array object', async () => {
		const wrapper = BaseComponent({
			fieldName: 'user.emails[0]',
			errorName: 'user.emails',
			schema: {
				user: zod.object({
					emails: zod.array(zod.string()).min(1, { message: 'Minimum 1 item required' }),
				}),
			},
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		await flushPromises();
		expect(wrapper.find('span').text()).equals('Minimum 1 item required');
	});
});
