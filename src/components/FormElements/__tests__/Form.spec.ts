import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FormTestVue from './Views/FormTest.vue';
import { Input } from '@/components';

describe('Form', () => {
	it('Render form with input', async () => {
		const wrapper = mount(FormTestVue);
		const InputWrapper = wrapper.findComponent(Input);
		await wrapper.get('button').trigger('click');
		wrapper.vm.$emit('submit', {
			first_name: '',
		});
		await wrapper.vm.$nextTick();
		expect(wrapper.emitted().submit[0]).toEqual([{ first_name: '' }]);
		expect((wrapper.vm as any).foo).toEqual('');
		expect(InputWrapper.props().name).toBe('first_name');
	});
});
