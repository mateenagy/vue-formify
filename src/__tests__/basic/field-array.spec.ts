import { describe, it, expect, afterEach } from 'vitest';
import { useForm } from '@/main';
import { forms } from '@/utils/store';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';

describe('FieldArray', () => {
	afterEach(() => {
		for (const key of Object.keys(forms)) {
			if (key.startsWith('fa-')) {
				delete forms[key];
			}
		}
	});

	it('should start with empty fields array', async () => {
		const cmp = defineComponent(() => {
			const { Form, FieldArray } = useForm({ name: 'fa-empty' });

			return () => h(Form, {}, () => [
				h(FieldArray, { name: 'tags' }, {
					default: ({ fields }: any) => [
						h('span', { class: 'count' }, `${fields.length}`),
					],
				}),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		expect(wrapper.find('.count').text()).toBe('0');
		wrapper.unmount();
	});

	it('should add items when add() is called', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field, FieldArray } = useForm({ name: 'fa-add' });

			return () => h(Form, {}, () => [
				h(FieldArray, { name: 'tags' }, {
					default: ({ fields, add }: any) => [
						...fields.map((field: any) =>
							h(Field, { key: field.id, name: `tags[${field.id}]` }),
						),
						h('button', { type: 'button', onClick: add }, 'Add'),
						h('span', { class: 'count' }, `${fields.length}`),
					],
				}),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		expect(wrapper.find('.count').text()).toBe('0');

		await wrapper.find('button').trigger('click');
		await nextTick();
		expect(wrapper.find('.count').text()).toBe('1');
		expect(wrapper.findAll('input')).toHaveLength(1);

		await wrapper.find('button').trigger('click');
		await nextTick();
		expect(wrapper.find('.count').text()).toBe('2');
		expect(wrapper.findAll('input')).toHaveLength(2);

		wrapper.unmount();
	});

	it('should remove item by id when remove() is called', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field, FieldArray } = useForm({ name: 'fa-remove' });

			return () => h(Form, {}, () => [
				h(FieldArray, { name: 'tags' }, {
					default: ({ fields, add, remove }: any) => [
						...fields.map((field: any) => h('div', { key: field.id }, [
							h(Field, { name: `tags[${field.id}]` }),
							h('button', { class: 'remove', type: 'button', onClick: () => remove(field.id) }, 'X'),
						])),
						h('button', { class: 'add', type: 'button', onClick: add }, 'Add'),
						h('span', { class: 'count' }, `${fields.length}`),
					],
				}),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		await wrapper.find('.add').trigger('click');
		await nextTick();
		await wrapper.find('.add').trigger('click');
		await nextTick();
		expect(wrapper.find('.count').text()).toBe('2');

		await wrapper.find('.remove').trigger('click');
		await nextTick();
		expect(wrapper.find('.count').text()).toBe('1');

		wrapper.unmount();
	});

	it('should shift values when removing from middle', async () => {
		let submittedValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field, FieldArray } = useForm({ name: 'fa-middle' });

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(FieldArray, { name: 'tags' }, {
					default: ({ fields, add, remove }: any) => [
						...fields.map((field: any) => h('div', { key: field.id }, [
							h(Field, { name: `tags[${field.id}]` }),
							h('button', { class: `remove-${field.id}`, type: 'button', onClick: () => remove(field.id) }, 'X'),
						])),
						h('button', { class: 'add', type: 'button', onClick: add }, 'Add'),
					],
				}),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		// Add 3 items
		await wrapper.find('.add').trigger('click');
		await nextTick();
		await wrapper.find('.add').trigger('click');
		await nextTick();
		await wrapper.find('.add').trigger('click');
		await nextTick();

		// Set values for all 3
		const inputs = wrapper.findAll('input');
		await inputs[0].setValue('first');
		await inputs[1].setValue('second');
		await inputs[2].setValue('third');
		await nextTick();

		// Remove middle item (id=1)
		await wrapper.find('.remove-1').trigger('click');
		await nextTick();

		// Submit to check values
		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues.tags).toEqual(['first', 'third']);
		wrapper.unmount();
	});

	it('should handle array of objects with nested fields', async () => {
		let submittedValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field, FieldArray } = useForm({ name: 'fa-objects' });

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(FieldArray, { name: 'users' }, {
					default: ({ fields, add }: any) => [
						...fields.map((field: any) => h('div', { key: field.id }, [
							h(Field, { name: `users[${field.id}].name` }),
							h(Field, { name: `users[${field.id}].email` }),
						])),
						h('button', { class: 'add', type: 'button', onClick: add }, 'Add'),
					],
				}),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		await wrapper.find('.add').trigger('click');
		await nextTick();

		const inputs = wrapper.findAll('input');
		await inputs[0].setValue('John');
		await inputs[1].setValue('john@test.com');
		await nextTick();

		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues.users).toEqual([
			{ name: 'John', email: 'john@test.com' },
		]);
		wrapper.unmount();
	});

	it('should populate FieldArray from initialValues', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field, FieldArray } = useForm({
				name: 'fa-init',
				initialValues: { tags: ['a', 'b'] },
			});

			return () => h(Form, {}, () => [
				h(FieldArray, { name: 'tags' }, {
					default: ({ fields }: any) => [
						...fields.map((field: any) =>
							h(Field, { key: field.id, name: `tags[${field.id}]` }),
						),
						h('span', { class: 'count' }, `${fields.length}`),
					],
				}),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		await nextTick();

		expect(wrapper.find('.count').text()).toBe('2');
		const inputs = wrapper.findAll('input');
		expect(inputs[0].element.value).toBe('a');
		expect(inputs[1].element.value).toBe('b');
		wrapper.unmount();
	});

	it('should include FieldArray values in form submission', async () => {
		let submittedValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field, FieldArray } = useForm({
				name: 'fa-submit',
				initialValues: { tags: ['x', 'y'] },
			});

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(FieldArray, { name: 'tags' }, {
					default: ({ fields }: any) => [
						...fields.map((field: any) =>
							h(Field, { key: field.id, name: `tags[${field.id}]` }),
						),
					],
				}),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		await nextTick();

		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues).toEqual({ tags: ['x', 'y'] });
		wrapper.unmount();
	});
});
