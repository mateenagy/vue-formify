import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { useForm } from 'vue-formify';
import * as yup from 'yup';
import { schemaFromYup } from '../index';
import { defineComponent, h } from 'vue';

const BaseComponent = (options: {
	fieldName: any,
	errorName?: any,
	schema: any,
}) => {
	const cmp = defineComponent(() => {
		const { Field, Form, Error } = useForm();
		const schema = schemaFromYup(yup.object({
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

describe('Yup validation', () => {
	it('Required field', async () => {
		const wrapper = BaseComponent({
			fieldName: 'email',
			schema: {
				email: yup.string().required('Required field').email('Email is not good'),
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
				user: yup.object({
					email: yup.string().required('Required field').email('Email is not good'),
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
				emails: yup.array().of(yup.string()).min(1, 'Minimum 1 item required'),
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
				user: yup.object({
					emails: yup.array().of(yup.string()).min(1, 'Minimum 1 item required'),
				}),
			},
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Minimum 1 item required');
	});
});
