import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FormTestVue from './Views/FormTest.vue';
import { Formify } from '@/components/main';

describe('Form', () => {
	const wrapper = mount(FormTestVue);

	it('Render form with input', async () => {
		expect(wrapper.findComponent(Formify.Form).exists());
		expect(wrapper.findComponent(Formify.Input).exists());
		expect(wrapper.find('button').exists());
	});

	it('Send form', async () => {
		const input = wrapper.find('input[name="first_name"]');
		const form = wrapper.findComponent(Formify.Form);
		await input.setValue('Lorem');
		await form.trigger('submit');
		expect(wrapper.find('p').text()).toEqual('Lorem');
	});

	it('Send form with object input name', async () => {
		const input = wrapper.find('input[name="social.facebook"]');
		const form = wrapper.findComponent(Formify.Form);
		await input.setValue('Lorem ipsum');
		await form.trigger('submit');
		expect(wrapper.find('#respObj').text()).toEqual('Lorem ipsum');
	});

	it('Send form with array input name', async () => {
		const input = wrapper.find('input[name="links[0]"]');
		const input2 = wrapper.find('input[name="links[1]"]');
		const form = wrapper.findComponent(Formify.Form);
		await input.setValue('Lorem ipsum');
		await input2.setValue('Dolor sit amet');
		await form.trigger('submit');
		expect(wrapper.find('#respArray').text()).contains('Lorem ipsum');
		expect(wrapper.find('#respArray').text()).contains('Dolor sit amet');
	});

	it('Get error', async () => {
		const input = wrapper.find('input');
		const form = wrapper.findComponent(Formify.Form);
		await input.setValue('');
		await form.trigger('submit');
		expect(wrapper.find('.custom-error').text()).toEqual('First name required');
	});
});
