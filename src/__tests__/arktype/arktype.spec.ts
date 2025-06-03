import { describe, it, expect } from 'vitest';
import { createComponent } from '../common';
import { type } from 'arktype';

const requiredField = type('string >= 1');
const requiredFieldObject = type({
	name: requiredField.configure({ message: 'Required field' }),
});

describe('ArkType usage', () => {
	it('Simple error', async () => {
		const wrapper = createComponent({
			fieldName: 'email',
			mode: 'onSubmit',
			schema: type({
				email: requiredField.configure({ message: 'Required field' }),
			}),
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
	it('Nested error', async () => {
		const wrapper = createComponent({
			fieldName: 'user.email',
			mode: 'onSubmit',
			schema: type({
				user: {
					email: requiredField.configure({ message: 'Required field' }),
				},
			}),
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
	it('Array error', async () => {
		const wrapper = createComponent({
			fieldName: 'users[0]',
			errorName: 'users',
			mode: 'onSubmit',
			schema: type({
				users: requiredField.array().atLeastLength(1).configure({ message: 'Required field' }),
			}),
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
	it('Object array error', async () => {
		const wrapper = createComponent({
			fieldName: 'users[0].name',
			mode: 'onSubmit',
			schema: type({
				users: requiredFieldObject.array().atLeastLength(1).configure({ message: 'Required field' }),
			}),
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
	it('Mixed object and array error', async () => {
		const wrapper = createComponent({
			fieldName: 'socials[0].link[0].url',
			schema: type({
				socials: type({
					link: type({ url: requiredField.configure({ message: 'Required field' }) }).array(),
				}).array(),
			}),
			mode: 'onSubmit',
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
});
