import { mount, flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { FormifyForm, FormifyInput } from 'vue-formify';
import * as zod from 'zod';
import { schemaFromZod } from '../index';

const mountWithComponents = (component: Record<string, any>) => {
	component.components = {
		...component.components,
		FormifyForm,
		FormifyInput,
	};

	return mount(component);
};
describe('Zod validation', () => {
	it('Required field Zod', async () => {
		const wrapper = mountWithComponents({
			setup: () => {
				const scema = schemaFromZod(zod.object({
					email: zod.string({ required_error: 'Required field' }).min(5, { message: 'Required field' }),
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
		await input.setValue('a');
		await form.trigger('submit');
		await flushPromises();
		expect(wrapper.find('#error').text()).equals('Required field');
	});
	it('Email test', async () => {
		const wrapper = mountWithComponents({
			setup: () => {
				const schema = schemaFromZod(zod.object({
					email: zod.string().email('Invalid email'),
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
				const schema = schemaFromZod(zod.object({
					social: zod.object({
						github: zod.string().url({ message: 'Invalid url' }),
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
				const schema = schemaFromZod(zod.object({
					social: zod.array(zod.object({
						url: zod.string().url('Invalid url'),
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
