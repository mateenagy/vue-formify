import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FormTestVue from './Views/FormTest.vue';
import { Input, Form } from '@/components';

describe('Form', () => {
	const wrapper = mount(FormTestVue);

	it('Render form with input', async () => {
		expect(wrapper.findComponent(Form).exists());
		expect(wrapper.findComponent(Input).exists());
		expect(wrapper.find('button').exists());
	});

	it('Send form', async () => {
		const input = wrapper.find('input');
		const form = wrapper.findComponent(Form);
		await input.setValue('Lorem');
		await form.trigger('submit');
		expect(wrapper.find('p').text()).toEqual('Lorem');
	});

	it('Get error', async () => {
		const input = wrapper.find('input');
		const form = wrapper.findComponent(Form);
		await input.setValue('');
		await form.trigger('submit');
		expect(wrapper.find('.custom-error').text()).toEqual('First name required');
	});
});
