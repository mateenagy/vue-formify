import { describe, it, expect, afterEach, vi } from 'vitest';
import { useForm } from '@/main';
import { forms } from '@/utils/store';
import { StandardSchemaV1 } from '@/utils/types';
import { mount } from '@vue/test-utils';
import { defineComponent, h, mergeProps, nextTick } from 'vue';

/** A rule that accepts anything and counts how often Field ran it. */
const countingRule = () => {
	const rule = {
		calls: 0,
		'~standard': {
			version: 1,
			vendor: 'test',
			validate: (value: unknown) => {
				rule.calls++;

				return { value };
			},
		},
	};

	return rule as typeof rule & StandardSchemaV1;
};

/** Listeners for every event, each recording the event it received. */
const recordingListeners = () => {
	const received: Record<string, unknown[]> = { input: [], change: [], focus: [], blur: [] };
	const listeners = {
		onInput: (evt: unknown) => received.input.push(evt),
		onChange: (evt: unknown) => received.change.push(evt),
		onFocus: (evt: unknown) => received.focus.push(evt),
		onBlur: (evt: unknown) => received.blur.push(evt),
	};

	return { received, listeners };
};

class ListenerInput extends HTMLElement {
	name = '';
	value = '';
}

if (!customElements.get('listener-input')) {
	customElements.define('listener-input', ListenerInput);
}

declare global {
	interface HTMLElementTagNameMap {
		'listener-input': ListenerInput;
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

describe('Field listeners', () => {
	afterEach(() => {
		for (const key of Object.keys(forms)) {
			if (key.startsWith('fl-')) {
				delete forms[key];
			}
		}
		vi.restoreAllMocks();
	});

	it('should call the user\'s listeners on a native input, with the event, and still run its own', async () => {
		const { received, listeners } = recordingListeners();
		const rule = countingRule();
		let formValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field, values } = useForm({ name: 'fl-native' });
			formValues = values;

			return () => h(Form, {}, () => [
				h(Field, { name: 'email', rule, ...listeners }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		const input = wrapper.find('input');

		await input.trigger('focus');
		// set by hand: `setValue` would fire `change` too
		input.element.value = 'ada@test.com';
		await input.trigger('input');
		await input.trigger('change');
		await input.trigger('blur');
		await nextTick();

		for (const [type, events] of Object.entries(received)) {
			expect(events, type).toHaveLength(1);
			expect((events[0] as Event).type, type).toBe(type);
		}
		// Field's own handlers ran too: the value is collected and blur validated the field.
		expect(formValues.value.email).toBe('ada@test.com');
		expect(rule.calls).toBeGreaterThan(0);
		wrapper.unmount();
	});

	it('should call every listener when several are bound to the same event', async () => {
		const first = vi.fn();
		const second = vi.fn();

		const cmp = defineComponent(() => {
			const { Form, Field } = useForm({ name: 'fl-many' });

			return () => h(Form, {}, () => [
				// what a parent passing `@input` next to `v-bind="{ onInput }"` produces: an array
				h(Field, mergeProps({ name: 'email', onInput: first }, { onInput: second }) as { name: string }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();

		await wrapper.find('input').setValue('a');
		expect(first).toHaveBeenCalledTimes(1);
		expect(second).toHaveBeenCalledTimes(1);
		wrapper.unmount();
	});

	it('should call the user\'s listeners on a custom element', async () => {
		const { received, listeners } = recordingListeners();
		let formValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field, values } = useForm({ name: 'fl-custom-element' });
			formValues = values;

			return () => h(Form, {}, () => [
				h(Field, { name: 'email', as: 'listener-input', ...listeners }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		const element = wrapper.find('listener-input').element as ListenerInput;

		element.dispatchEvent(new FocusEvent('focus'));
		element.value = 'ada@test.com';
		element.dispatchEvent(new Event('input', { bubbles: true }));
		element.dispatchEvent(new FocusEvent('blur'));
		await nextTick();

		expect(received.focus).toHaveLength(1);
		expect(received.input).toHaveLength(1);
		expect(received.blur).toHaveLength(1);
		expect(formValues.value.email).toBe('ada@test.com');
		wrapper.unmount();
	});

	it('should call the user\'s listeners on a component', async () => {
		const { received, listeners } = recordingListeners();
		let formValues: any;

		const cmp = defineComponent(() => {
			const { Form, Field, values } = useForm({ name: 'fl-component' });
			formValues = values;

			return () => h(Form, {}, () => [
				h(Field, { name: 'nickname', as: TextComponent, ...listeners }),
			]);
		});

		const wrapper = mount(cmp);
		await nextTick();
		const input = wrapper.find('input');

		await input.trigger('focus');
		await input.setValue('Ada');
		await input.trigger('blur');
		await nextTick();

		expect(received.focus).toHaveLength(1);
		expect(received.input).toHaveLength(1);
		expect(received.blur).toHaveLength(1);
		expect(formValues.value.nickname).toBe('Ada');
		wrapper.unmount();
	});
});
