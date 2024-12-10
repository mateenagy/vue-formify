import { mount, flushPromises } from '@vue/test-utils';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';
import { useForm } from 'vue-formify';
import { schemaFromValibot } from '../index';
import { defineComponent, h } from 'vue';

const BaseComponent = (options: {
	fieldName: any,
	errorName?: any,
	schema: any,
}) => {
	const cmp = defineComponent(() => {
		const { Field, Form, Error } = useForm();
		const schema = schemaFromValibot(v.object({
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

describe('Valibot validation', () => {
	it('Required field', async () => {
		const wrapper = BaseComponent({
			fieldName: 'email',
			schema: {
				email: v.pipe(v.string(), v.nonEmpty('Required field')),
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
				user: v.object({
					email: v.pipe(v.string(), v.nonEmpty('Required field')),
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
				emails: v.pipe(
					v.array(v.string()),
					v.nonEmpty('Min 1 item'),
					v.minLength(2, 'Min 2 item'),
				),
			},
		});

		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		await flushPromises();
		expect(wrapper.find('span').text()).equals('Min 1 item');
	});
	it('Nested array object', async () => {
		const wrapper = BaseComponent({
			fieldName: 'user.emails[0]',
			errorName: 'user.emails',
			schema: {
				user: v.object({
					emails: v.pipe(
						v.array(v.string()),
						v.nonEmpty('Min 1 item'),
						v.minLength(2, 'Min 2 item'),
					),
				}),
			},
		});

		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		await flushPromises();
		expect(wrapper.find('span').text()).equals('Min 1 item');
	});
});
