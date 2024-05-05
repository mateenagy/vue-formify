import { mount } from '@vue/test-utils';
import Joi from 'joi';
import { describe, expect, it } from 'vitest';
import { FormifyForm, FormifyInput } from 'vue-formify';
import { schemaFromJoi } from '../index';

const mountWithComponents = (component: Record<string, any>) => {
	component.components = {
		...component.components,
		FormifyForm,
		FormifyInput,
	};

	return mount(component);
};

describe('Jpi validation', () => {
	it('Required field', async () => {
		const wrapper = mountWithComponents({
			setup: () => {
				const schema = schemaFromJoi(Joi.object({
					email: Joi.string().required().messages({ 'any.required': 'Required field', 'string.empty': 'Required field' }),
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
		await form.trigger('submit');
		expect(wrapper.find('#error').text()).equals('Required field');
	});
	it('Email test', async () => {
		const wrapper = mountWithComponents({
			setup: () => {
				const schema = schemaFromJoi(Joi.object({
					email: Joi.string().email().messages({ 'any.required': 'Required field', 'string.email': 'Invalid email' }),
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
		expect(wrapper.find('#error').text()).equals('Invalid email');
	});
	it('Minimum length', async () => {
		const wrapper = mountWithComponents({
			setup: () => {
				const schema = schemaFromJoi(Joi.object({
					password: Joi.string().min(8).messages({ 'string.min': 'Password too short' }),
				}));
		
				const send = (data: any) => {
					console.log(data);
				};
		
				return { schema, send };
			},
			template: `
				<FormifyForm v-slot={errors} :validation-schema="schema" @submit="send">
					<FormifyInput name="password" default="asd123@" />
					<span id="error">{{ errors.password }}</span>
					<button type="submit">Send</button>
				</FormifyForm>
			`,
		});
		const form = wrapper.findComponent(FormifyForm);
		await form.trigger('submit');
		expect(wrapper.find('#error').text()).equals('Password too short');
	});
	it('Nested object', async () => {
		const wrapper = mountWithComponents({
			setup: () => {
				const schema = schemaFromJoi(Joi.object({
					social: Joi.object({
						github: Joi.string().uri().messages({ 'string.uri': 'Invalid url' }),
					}),
				}));
		
				const send = (data: any) => {
					console.log(data);
				};
		
				return { schema, send };
			},
			template: `
				<FormifyForm v-slot={errors} :validation-schema="schema" @submit="send">
					<FormifyInput name="social.github" default="https:/github" />
					<span id="error">{{ errors.social?.github }}</span>
					<button type="submit">Send</button>
				</FormifyForm>
			`,
		});
		const form = wrapper.findComponent(FormifyForm);
		await form.trigger('submit');
		expect(wrapper.find('#error').text()).equals('Invalid url');
	});
	it('Nested array object', async () => {
		const wrapper = mountWithComponents({
			setup: () => {
				const schema = schemaFromJoi(Joi.object({
					social: Joi.array().items(Joi.object({
						url: Joi.string().uri().messages({ 'string.uri': 'Invalid url' }),
					})),
				}));
		
				const send = (data: any) => {
					console.log(data);
				};
		
				return { schema, send };
			},
			template: `
				<FormifyForm v-slot={errors} :validation-schema="schema" @submit="send">
					<FormifyInput name="social[0].url" default="https:/github" />
					<span id="error">{{ errors.social?.[0]?.url }}</span>
					<button type="submit">Send</button>
				</FormifyForm>
			`,
		});
		const form = wrapper.findComponent(FormifyForm);
		await form.trigger('submit');
		expect(wrapper.find('#error').text()).equals('Invalid url');
	});
});
