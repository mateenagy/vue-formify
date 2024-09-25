import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import CustomInputVue from './Views/CustomInput.vue';
import NamedVModelVue from './Views/NamedVModel.vue';
import { Form, Field, FieldArray, createInput } from '@/components/main';

const ColorPicker = createInput(CustomInputVue);
const TitleInput = createInput(NamedVModelVue, { modelKeys: 'title' });
const mountWithComponents = (component: Record<string, any>) => {
	component.components = {
		...component.components,
		Form,
		ColorPicker,
		Field,
		TitleInput,
		FieldArray,
	};

	return mount(component);
};

const createW = (template: string, errorField?: string, errorMessage?: string) => mountWithComponents({
	setup: () => {
		const result = ref();
		const form = ref();
		const initial = { foo: 'Foo' };
		const send = (data: any) => {
			errorField && form.value.setError(errorField, errorMessage);
			result.value = data;
		};

		return { send, result, form, initial };
	},
	template: `
		<Form ref="form" :initial-values="initial" v-slot="{values, errors}" @submit="send">
			${template}
			<span id="result">{{ result }}</span>
			<span id="error">{{ errors }}</span>
			<button type="submit">Send</button>
		</Form>`,
});

describe('Form', () => {
	it('Basic input', async () => {
		const wrapper = createW('<Field name="email" />');
		const form = wrapper.findComponent(Form);
		const input = wrapper.find('input[name="email"]');
		await input.setValue('test@test.com');
		await form.trigger('submit');
		expect(wrapper.find('#result').text()).contain('test@test.com');
	});

	it('Object input', async () => {
		const wrapper = createW('<Field name="user.email" />');
		const form = wrapper.findComponent(Form);
		const input = wrapper.find('input[name="user.email"]');
		await input.setValue('test@test.com');
		await form.trigger('submit');
		expect(wrapper.find('#result').text()).contain('test@test.com');
	});

	it('Array input', async () => {
		const wrapper = createW('<Field name="links[0]" />');
		const form = wrapper.findComponent(Form);
		const input = wrapper.find('input[name="links[0]"]');
		await input.setValue('https://github.com');
		await form.trigger('submit');
		expect(wrapper.find('#result').text()).contain('https://github.com');
	});

	it('Array object input', async () => {
		const wrapper = createW('<Field name="user.links[0]" />');
		const form = wrapper.findComponent(Form);
		const input = wrapper.find('input[name="user.links[0]"]');
		await input.setValue('https://github.com');
		await form.trigger('submit');
		expect(wrapper.find('#result').text()).contain('https://github.com');
	});

	it('Error', async () => {
		const wrapper = createW('<Field name="email" />', 'email', 'Required');
		const form = wrapper.findComponent(Form);
		const input = wrapper.find('input[name="email"]');
		await input.setValue('test@test.com');
		await form.trigger('submit');
		expect(wrapper.find('#error').text()).contain('Required');
	});

	it('Initial values', async () => {
		const wrapper = createW('<Field name="foo" />');
		const form = wrapper.findComponent(Form);
		await form.trigger('submit');
		expect(wrapper.find('#result').text()).contain('Foo');
	});

	it('Custom Field', async () => {
		const wrapper = createW('<ColorPicker name="color" />');
		const form = wrapper.findComponent(Form);
		const input = wrapper.find('input[name="color"]');
		await input.setValue('#ffffff');
		await form.trigger('submit');
		expect(wrapper.find('#result').text()).contain('#ffffff');
	});

	it('Custom Field with named v-model', async () => {
		const wrapper = createW('<TitleInput />');
		const form = wrapper.findComponent(Form);
		const input = wrapper.find('input');
		await input.setValue('Hi!');
		await form.trigger('submit');
		expect(wrapper.find('#result').text()).contain('Hi!');
	});
});
