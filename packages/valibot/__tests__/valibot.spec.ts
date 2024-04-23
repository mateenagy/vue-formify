import { mount, flushPromises } from '@vue/test-utils';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';
import { FormifyForm, FormifyInput } from 'vue-formify';
import { schemaFromValibot } from '../index';

const mountWithComponents = (component: Record<string, any>) => {
	component.components = {
		...component.components,
		FormifyForm,
		FormifyInput,
	};

	return mount(component);
};
describe('Valibot validation', () => {
	it('Required field Valibot', async () => {
		const wrapper = mountWithComponents({
			setup: () => {
				const scema = schemaFromValibot(v.object({
					email: v.string('Must be a string', [
						v.minLength(1, 'Required field'),
					]),
				}));

				const send = (data: any) => {
					console.log(data);
				};

				return { scema, send };
			},
			template: `
				<FormifyForm v-slot="{data, errors}" :validation-schema="scema" @submit="send">
					<FormifyInput name="email" />
					<span id="error">{{ errors.email }}</span>
				</FormifyForm>
			`,
		});
		const form = wrapper.findComponent(FormifyForm);
		const input = wrapper.find('input[name="email"]');

		expect(wrapper.find('input[name="email"]'));
		await input.setValue('');
		await form.trigger('submit');
		await flushPromises();
		expect(wrapper.find('#error').text()).equals('Required field');
	});
	it('Email test', async () => {
		const wrapper = mountWithComponents({
			setup: () => {
				const schema = schemaFromValibot(v.object({
					email: v.string('Must be a string', [
						v.minLength(1, 'Required field'),
						v.email('Invalid email'),
					]),
				}));

				const send = (data: any) => {
					console.log(data);
				};

				return { schema, send };
			},
			template: `
				<FormifyForm v-slot={errors} :validation-schema="schema" @submit="send">
					<FormifyInput name="email" />
					<span id="error">{{ errors.email }}</span>
					<button type="submit">Send</button>
				</FormifyForm>
			`,
		});
		const form = wrapper.findComponent(FormifyForm);
		const input = wrapper.find('input[name="email"]');
		await input.setValue('asd@');
		await form.trigger('submit');
		await flushPromises();
		expect(wrapper.find('#error').text()).equals('Invalid email');
	});
	it('Nested object', async () => {
		const wrapper = mountWithComponents({
			setup: () => {
				const schema = schemaFromValibot(v.object({
					social: v.object({
						github: v.string([
							v.minLength(1, 'Required field'),
							v.url('Invalid url'),
						]),
					}),
				}));

				const send = (data: any) => {
					console.log(data);
				};

				return { schema, send };
			},
			template: `
				<FormifyForm v-slot={errors} :validation-schema="schema" @submit="send">
					<FormifyInput name="social.github" />
					<span id="error">{{ errors.social?.github }}</span>
					<button type="submit">Send</button>
				</FormifyForm>
			`,
		});
		const form = wrapper.findComponent(FormifyForm);
		const input = wrapper.find('input[name="social.github"]');
		await input.setValue('qwe.com');
		await form.trigger('submit');
		await flushPromises();
		expect(wrapper.find('#error').text()).equals('Invalid url');
	});
	it('Nested array object', async () => {
		const wrapper = mountWithComponents({
			setup: () => {
				const schema = schemaFromValibot(v.object({
					social: v.array(v.object({
						url: v.string([
							v.minLength(1, 'Required field'),
							v.url('Invalid url'),
						]),
					})),
				}));

				const send = (data: any) => {
					console.log(data);
				};

				return { schema, send };
			},
			template: `
				<FormifyForm v-slot={errors} :validation-schema="schema" @submit="send">
					<FormifyInput name="social[0].url" />
					<span id="error">{{ errors.social?.[0]?.url }}</span>
					<button type="submit">Send</button>
				</FormifyForm>
			`,
		});
		const form = wrapper.findComponent(FormifyForm);
		const input = wrapper.find('input[name="social[0].url"]');
		await input.setValue('qwe.com');
		await form.trigger('submit');
		await flushPromises();
		expect(wrapper.find('#error').text()).equals('Invalid url');
	});
});
