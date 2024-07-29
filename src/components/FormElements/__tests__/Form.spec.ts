import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import CustomInputVue from './Views/CustomInput.vue';
import NamedVModelVue from './Views/NamedVModel.vue';
import { FormifyForm, FormifyInput, createInput } from '@/components/main';

const ColorPicker = createInput(CustomInputVue);
const TitleInput = createInput(NamedVModelVue, { modelKeys: 'title' });
const mountWithComponents = (component: Record<string, any>) => {
	component.components = {
		...component.components,
		FormifyForm,
		FormifyInput,
		ColorPicker,
		TitleInput,
	};

	return mount(component);
};

const createWrapper = (template: string, errorField?: string, errorMessage?: string) => mountWithComponents({
	setup: () => {
		const result = ref();
		const form = ref();
		const send = (data: any) => {
			errorField && form.value.setError(errorField, errorMessage);
			result.value = data;
		};

		return { send, result, form };
	},
	template,
});

describe('Form', () => {
	it('Basic input', async () => {
		const wrapper = createWrapper(`
			<FormifyForm v-slot={errors} @submit="send">
				<FormifyInput name="email" />
				<span id="result">{{ result?.email }}</span>
				<button type="submit">Send</button>
			</FormifyForm>
		`);
		const form = wrapper.findComponent(FormifyForm);
		const input = wrapper.find('input[name="email"]');
		await input.setValue('test@test.com');
		await form.trigger('submit');
		expect(wrapper.find('#result').text()).equals('test@test.com');
	});

	it('Object input', async () => {
		const wrapper = createWrapper(`
			<FormifyForm v-slot={errors} @submit="send">
				<FormifyInput name="user.email" />
				<span id="result">{{ result?.user.email }}</span>
				<button type="submit">Send</button>
			</FormifyForm>
		`);
		const form = wrapper.findComponent(FormifyForm);
		const input = wrapper.find('input[name="user.email"]');
		await input.setValue('test@test.com');
		await form.trigger('submit');
		expect(wrapper.find('#result').text()).equals('test@test.com');
	});

	it('Array input', async () => {
		const wrapper = createWrapper(`
			<FormifyForm v-slot={errors} @submit="send">
				<FormifyInput name="links[0]" />
				<FormifyInput name="links[1]" />
				<span id="result">{{ result?.links }}</span>
				<button type="submit">Send</button>
			</FormifyForm>
		`);
		const form = wrapper.findComponent(FormifyForm);
		const input1 = wrapper.find('input[name="links[0]"]');
		const input2 = wrapper.find('input[name="links[1]"]');
		await input1.setValue('https://github.com');
		await input2.setValue('https://vuejs.org/');
		await form.trigger('submit');
		expect(wrapper.find('#result').text()).contains('https://github.com');
		expect(wrapper.find('#result').text()).contains('https://vuejs.org');
	});

	it('Object with array input', async () => {
		const wrapper = createWrapper(`
			<FormifyForm v-slot={errors} @submit="send">
				<FormifyInput name="favourite.links[0]" />
				<FormifyInput name="favourite.links[1]" />
				<span id="result">{{ result?.favourite.links }}</span>
				<button type="submit">Send</button>
			</FormifyForm>
		`);
		const form = wrapper.findComponent(FormifyForm);
		const input1 = wrapper.find('input[name="favourite.links[0]"]');
		const input2 = wrapper.find('input[name="favourite.links[1]"]');
		await input1.setValue('https://github.com');
		await input2.setValue('https://vuejs.org/');
		await form.trigger('submit');
		expect(wrapper.find('#result').text()).contains('https://github.com');
		expect(wrapper.find('#result').text()).contains('https://vuejs.org');
	});

	it('Set error', async () => {
		const wrapper = createWrapper(`
			<FormifyForm ref="form" v-slot={errors} @submit="send">
				<FormifyInput name="email" />
				<span id="result">{{ result?.email }}</span>
				<span id="error">{{ errors.email }}</span>
				<button type="submit">Send</button>
			</FormifyForm>
		`, 'email', 'Email required');
		const form = wrapper.findComponent(FormifyForm);
		await form.trigger('submit');
		expect(wrapper.find('#error').text()).equals('Email required');
	});

	it('Custom component', async () => {
		const wrapper = createWrapper(`
			<FormifyForm v-slot={errors} @submit="send">
				<ColorPicker name="color" />
				<span id="result">{{ result?.color }}</span>
				<button type="submit">Send</button>
			</FormifyForm>
		`);
		const form = wrapper.findComponent(FormifyForm);
		const input = wrapper.find('input[name="color"]');
		await input.setValue('#ffffff');
		await form.trigger('submit');
		expect(wrapper.find('#result').text()).equals('#ffffff');
	});

	it('Custom component with v-model arguments', async () => {
		const wrapper = createWrapper(`
			<FormifyForm v-slot={errors} @submit="send">
				<TitleInput name="title" />
				<span id="result">{{ result?.title }}</span>
				<button type="submit">Send</button>
			</FormifyForm>
		`);
		const form = wrapper.findComponent(FormifyForm);
		const input = wrapper.find('input[name="title"]');
		console.log('input', input);
		
		await input.setValue('Hi!');
		await form.trigger('submit');
		expect(wrapper.find('#result').text()).equals('Hi!');
	});
});
