import { describe, it, expect } from 'vitest';
import { createComponent } from '../common';

describe('Basic usage', () => {
	it('Simple error', async () => {
		const wrapper = createComponent({
			fieldName: 'email',
			mode: 'onSubmit',
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
	it('Nested error', async () => {
		const wrapper = createComponent({
			fieldName: 'user.email',
			mode: 'onSubmit',
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
	it('Array error', async () => {
		const wrapper = createComponent({
			fieldName: 'users[0]',
			mode: 'onSubmit',
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
	it('Object array error', async () => {
		const wrapper = createComponent({
			fieldName: 'users[0].name',
			mode: 'onSubmit',
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
	it('Mixed object and array error', async () => {
		const wrapper = createComponent({
			fieldName: 'socials[0].link[0].url',
			mode: 'onSubmit',
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
});
