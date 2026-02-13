import { describe, it, expect, afterEach } from 'vitest';
import { useForm } from '@/main';
import { forms } from '@/utils/store';
import { deleteByPath } from '@/utils/utils';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';

const collectErrors = () => {
	const errors: unknown[] = [];

	return {
		errors,
		errorHandler: (err: unknown) => {
			errors.push(err);
		},
	};
};

describe('Field unmount safety', () => {
	afterEach(() => {
		for (const key of Object.keys(forms)) {
			if (key.startsWith('unmount-test')) {
				delete forms[key];
			}
		}
	});

	it('should not throw when input fires after field store entry is removed', async () => {
		const { errors, errorHandler } = collectErrors();

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'unmount-test-input' });

			return () => h(Form, {}, () => [
				h(Field, { name: 'email' }),
			]);
		});

		const wrapper = mount(cmp, {
			global: { config: { errorHandler } },
		});

		const input = wrapper.find('input');

		// Simulate race condition: store entry removed while DOM element still alive
		deleteByPath(forms['unmount-test-input'].values, 'email');

		// Trigger input on the orphaned field — without the fix this throws:
		// TypeError: Cannot set properties of undefined (setting 'value')
		await input.setValue('test@test.com');
		await nextTick();

		expect(errors).toHaveLength(0);

		wrapper.unmount();
	});

	it('should not throw when field is toggled off via v-if', async () => {
		const { errors, errorHandler } = collectErrors();
		const show = ref(true);

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'unmount-test-vif' });

			return () => h(Form, {}, () => [
				show.value ? h(Field, { name: 'username' }) : null,
				h(Field, { name: 'password' }),
			]);
		});

		const wrapper = mount(cmp, {
			global: { config: { errorHandler } },
		});

		expect(wrapper.findAll('input')).toHaveLength(2);

		// Unmount the conditional field
		show.value = false;
		await nextTick();

		expect(wrapper.findAll('input')).toHaveLength(1);

		// The remaining field should still accept input without errors
		await wrapper.find('input').setValue('secret');
		await nextTick();

		expect(errors).toHaveLength(0);

		wrapper.unmount();
	});

	it('should not throw when modelValue update arrives after field store entry is removed', async () => {
		const { errors, errorHandler } = collectErrors();
		const model = ref('initial');

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'unmount-test-model' });

			return () => h(Form, {}, () => [
				h(Field, {
					name: 'email',
					modelValue: model.value,
					'onUpdate:modelValue': (val: string) => {
 model.value = val; 
},
				}),
			]);
		});

		const wrapper = mount(cmp, {
			global: { config: { errorHandler } },
		});

		// Remove the store entry to simulate the race condition
		deleteByPath(forms['unmount-test-model'].values, 'email');

		// Update modelValue after store entry is gone
		model.value = 'updated@test.com';
		await nextTick();

		expect(errors).toHaveLength(0);

		wrapper.unmount();
	});
});
