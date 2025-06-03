import { describe, it, expect } from 'vitest';
import { createComponent } from '../common';
import { z } from 'zod/v4';

describe('Valibot usage', () => {
	it('Simple error', async () => {
		const wrapper = createComponent({
			fieldName: 'email',
			mode: 'onSubmit',
			schema: z.object({
				email: z.string().min(1, 'Required field'),
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
			schema: z.object({
				user: z.object({
					email: z.string().min(1, 'Required field'),
				}),
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
			schema: z.object({
				users: z.array(z.string()).min(1, 'Required field'),
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
			schema: z.object({
				users: z.array(z.object({
						name: z.string().min(1, 'Required field'),
					}),
				),
			}),
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
	it('Mixed object and array error', async () => {
		const wrapper = createComponent({
			fieldName: 'socials[0].link[0].url',
			schema: z.object({
				socials: z.array(z.object({
					link: z.array(z.object({
						url: z.string().min(1, 'Required field'),
					})),
				})),
			}),
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
});
