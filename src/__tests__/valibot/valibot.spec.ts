import { describe, it, expect } from 'vitest';
import { createComponent } from '../common';
import * as v from 'valibot';
describe('Valibot usage', () => {
	it('Simple error', async () => {
		const wrapper = createComponent({
			fieldName: 'email',
			mode: 'onSubmit',
			schema: v.object({
				email: v.pipe(v.string(), v.minLength(1, 'Required field')),
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
			schema: v.object({
				user: v.object({
					email: v.pipe(v.string(), v.minLength(1, 'Required field')),
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
			schema: v.object({
				users: v.pipe(
					v.array(v.string()),
					v.minLength(1, 'Required field'),
				),
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
			schema: v.object({
				users: v.pipe(
					v.array(v.object({
						name: v.pipe(v.string(), v.minLength(1, 'Required field')),
					})),
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
			schema: v.object({
				socials: v.array(v.object({
					link: v.array(v.object({
						url: v.pipe(v.string(), v.minLength(1, 'Required field')),
					})),
				})),
			}),
		});
		const form = wrapper.findComponent('form');
		await form.trigger('submit');
		expect(wrapper.find('span').text()).equals('Required field');
	});
});
