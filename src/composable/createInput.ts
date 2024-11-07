import { Component, computed, defineComponent, h, resolveDynamicComponent } from 'vue';
import { GetKeys } from './useForm';
import { useField } from './useField';
import { FieldType } from '@/components/Field';

export type BaseInput<T extends Record<string, any>> = {
	name?: GetKeys<T>;
	default?: any;
	modelValue?: any;
	error?: any;
	ignore?: boolean;
	preserve?: boolean;
	trueValue?: any;
	falseValue?: any;
}

export type CreateInputOptions = {
	default?: any;
	modelKey?: string;
	useModelKeyAsState?: boolean;
	defaultValueKey?: any;
}

export const createInput = <T, K extends Record<string, any> = Record<string, any>>(component: Component, options?: CreateInputOptions) => defineComponent(
	(props: T & FieldType<K>, { emit, slots, attrs: baseAttrs }) => {
		const {
			value,
			onInput,
			onFocus,
			setValue,
			getError,
		} = useField(props, emit, false, options, true);

		const sharedProps = computed(() => {
			const attrs: Record<string, any> = {
				...baseAttrs,
				name: props.name,
				error: getError(),
				modelValue: value.value,

				onInput: (evt: any) => {
					onInput(evt);
					if (typeof baseAttrs.onInput === 'function') {
						baseAttrs.onInput();
					}
				},
				onChange: (evt: any) => {
					onInput(evt);
					if (typeof baseAttrs.onChange === 'function') {
						baseAttrs.onChange();
					}
				},
				onFocus: () => {
					onFocus();
					if (typeof baseAttrs.onFocus === 'function') {
						baseAttrs.onFocus();
					}
				},
				onBlur: () => {
					if (typeof baseAttrs.onBlur === 'function') {
						baseAttrs.onBlur();
					}
				},
				['onUpdate:modelValue']: (value: any) => {
					setValue(value);
				},
				...options?.modelKey && {
					[options?.modelKey]: value.value,
					[`onUpdate:${options.modelKey}`]: (value: any) => {
						setValue(value);
					},
				},
			};

			return attrs;
		});

		return () => {
			const cmp = resolveDynamicComponent(component) as string;

			return h(cmp,
				{
					...props,
					...sharedProps.value,
				},
				{
					...slots,
				},
			);
		};
	},
	{
		name: 'CustomField',
		props: {
			default: {
				type: [String, Number, Array, Object, Boolean],
				default: options?.default ?? '',
			},
			...(component as Component & { props: any }).props,
			name: {
				type: String,
				default: '',
			},
			ignore: {
				type: Boolean,
				default: false,
			},
			preserve: {
				type: Boolean,
				default: false,
			},
			...options?.defaultValueKey && {
				[options?.defaultValueKey]: {
					type: [String, Boolean, Number, Object, Array],
					default: '',
				},
			},
			modelValue: {
				type: [String, Boolean, Number, Object, Array],
				default: undefined,
			},
			trueValue: {
				type: [String, Number, Array, Object, Boolean],
				default: true,
			},
			falseValue: {
				type: [String, Number, Array, Object, Boolean],
				default: false,
			},
		},
		emits: ['update:modelValue', `update:${options?.modelKey}`],
	},
);
