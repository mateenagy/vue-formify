import { describe, it, expect, afterEach, vi } from 'vitest';
import { useForm, type FieldAs } from '@/main';
import { forms } from '@/utils/store';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';

/** A minimal form-field web component: a `name`, a `value` and an `error` property. */
class TestInput extends HTMLElement {
	name = '';
	value = '';
	error: string | undefined = undefined;
}

if (!customElements.get('test-input')) {
	customElements.define('test-input', TestInput);
}

declare global {
	interface HTMLElementTagNameMap {
		'test-input': TestInput;
	}
}

const TextComponent = defineComponent({
	props: { modelValue: { type: String, default: '' } },
	emits: ['update:modelValue'],
	setup(props, { emit }) {
		return () => h('input', {
			value: props.modelValue,
			onInput: (evt: Event) => emit('update:modelValue', (evt.target as HTMLInputElement).value),
		});
	},
});

/** Field's own props and state that must not end up as attributes on an element. */
const LEAKED_ATTRIBUTES = ['as', 'custom', 'preserve', 'default', 'rule', 'ignore', 'modelvalue', 'istouched', 'isvalid', 'isdirty'];

describe('Field `as` prop', () => {
	afterEach(() => {
		for (const key of Object.keys(forms)) {
			if (key.startsWith('fa-')) {
				delete forms[key];
			}
		}
		vi.restoreAllMocks();
	});

	it('should render a custom element and collect its value', async () => {
		let submittedValues: any;
		let setFieldError: (name: string, error: any) => void = () => {};

		const cmp = defineComponent(() => {
			const { Form, Field, setError } = useForm({ name: 'fa-custom-element', initialValues: { email: 'start@test.com' } });
			setFieldError = setError;

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(Field, { name: 'email', as: 'test-input' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		const element = wrapper.find('test-input').element as TestInput;
		expect(element.value).toBe('start@test.com');
		expect(element.name).toBe('email');

		element.value = 'typed@test.com';
		element.dispatchEvent(new Event('input', { bubbles: true }));
		await wrapper.find('form').trigger('submit');
		await nextTick();
		expect(submittedValues).toEqual({ email: 'typed@test.com' });

		setFieldError('email', 'Already registered');
		await nextTick();
		expect(element.error).toBe('Already registered');

		wrapper.unmount();
	});

	it('should not leave Field props as attributes on a custom element', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fa-custom-attrs' });

			return () => h(Form, {}, () => [
				h(Field, { name: 'email', as: 'test-input', preserve: false, custom: false }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		const attributes = wrapper.find('test-input').element.getAttributeNames();
		expect(attributes.filter(name => LEAKED_ATTRIBUTES.includes(name))).toEqual([]);
		wrapper.unmount();
	});

	it('should not leave Field props as attributes on a native input', async () => {
		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fa-native-attrs' });

			return () => h(Form, {}, () => [
				h(Field, { name: 'email', type: 'email', placeholder: 'you@test.com' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		const input = wrapper.find('input');
		expect(input.element.getAttributeNames().filter(name => LEAKED_ATTRIBUTES.includes(name))).toEqual([]);
		// attributes the user set still arrive
		expect(input.attributes('type')).toBe('email');
		expect(input.attributes('placeholder')).toBe('you@test.com');
		expect(input.attributes('name')).toBe('email');
		wrapper.unmount();
	});

	it('should render a textarea and collect its value', async () => {
		let submittedValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fa-textarea' });

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(Field, { name: 'message', as: 'textarea' }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		await wrapper.find('textarea').setValue('Hello');
		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues).toEqual({ message: 'Hello' });
		wrapper.unmount();
	});

	it('should accept a component without a prop type warning', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		let submittedValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fa-component' });

			return () => h(Form, {
				onSubmit: (val: any) => { submittedValues = val; },
			}, () => [
				h(Field, { name: 'nickname', as: TextComponent }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		await wrapper.find('input').setValue('Ada');
		await wrapper.find('form').trigger('submit');
		await nextTick();

		expect(submittedValues).toEqual({ nickname: 'Ada' });
		expect(warn.mock.calls.flat().join(' ')).not.toContain('Invalid prop');
		wrapper.unmount();
	});
});

// Type-level checks, verified by `bun run lint:tsc`.
export const typeChecks = () => {
	const accepted: FieldAs[] = ['input', 'select', 'textarea', 'test-input', TextComponent];
	// @ts-expect-error a typo is not a field tag
	const typo: FieldAs = 'inptu';
	// @ts-expect-error a div has no name and value
	const div: FieldAs = 'div';
	// @ts-expect-error a button has a name and value but is not a field
	const button: FieldAs = 'button';

	return [accepted, typo, div, button];
};
