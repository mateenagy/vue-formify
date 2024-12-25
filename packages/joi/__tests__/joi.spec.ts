import { mount } from '@vue/test-utils';
import joi from 'joi';
import { describe, expect, it } from 'vitest';
import { useForm } from 'vue-formify';
import { schemaFromJoi } from '../index';
import { defineComponent, h } from 'vue';

const BaseComponent = (options: {
	fieldName: any,
	errorName?: any,
	schema: any,
}) => {
	const cmp = defineComponent(() => {
		const { Field, Form, Error } = useForm();
		const schema = schemaFromJoi(joi.object({
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

describe('Joi validation', () => {
	it('Required field', async () => {
		const wrapper = BaseComponent({
			fieldName: 'email',
			schema: {
				email: joi.string().required().messages({ 'any.required': 'Required field', 'string.empty': 'Required field' }),
			},
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
	it('Nested object', async () => {
		const wrapper = BaseComponent({
			fieldName: 'user.email',
			schema: {
				user: joi.object({
					email: joi.string().required().messages({ 'any.required': 'Required field', 'string.empty': 'Required field' }),
				}),
			},
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
	it('Array', async () => {
		const wrapper = BaseComponent({
			fieldName: 'emails[0]',
			errorName: 'emails',
			schema: {
				emails: joi.array().items(joi.string()).min(1).message('Minimum 1 item required'),
			},
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Minimum 1 item required');
	});
	it('Nested array object', async () => {
		const wrapper = BaseComponent({
			fieldName: 'user.emails[0]',
			errorName: 'user.emails',
			schema: {
				user: joi.object({
					emails: joi.array().items(joi.string()).min(1).message('Minimum 1 item required'),
				}),
			},
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Minimum 1 item required');
	});
});
