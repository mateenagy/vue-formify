import { normalizeChildren, resolveTag } from '@/utils/utils';
import { computed, defineComponent, h, PropType, resolveDynamicComponent, SlotsType, InputHTMLAttributes } from 'vue';
import { useInput } from './useInput';
import { GetKeys } from './useForm';

type UnwrapArray<T> = T extends (infer U)[] ? U[] | U : T;

export type ExtractValue<T, K extends string> =
	K extends `${infer Root}.${infer Rest}`
	? Root extends keyof T
	? ExtractValue<T[Root], Rest>
	: Root extends `${infer ArrayRoot}[${number}]`
	? ArrayRoot extends keyof T
	? T[ArrayRoot] extends (infer U)[]
	? ExtractValue<U, Rest>
	: never
	: never
	: never
	: K extends `${infer Root}[${number}]`
	? Root extends keyof T
	? T[Root] extends (infer U)
	? UnwrapArray<U>
	: never
	: never
	: K extends keyof T
	? UnwrapArray<T[K]>
	: never;

export type FieldType<T extends Record<string, any>> = {
	[K in GetKeys<T>]: {
		name: K;
		default?: ExtractValue<T, K>;
	} & {
		error?: any;
		ignore?: boolean;
		trueValue?: any;
		modelValue?: any;
		falseValue?: any;
		preserve?: boolean;
		as?: 'input' | 'select';
	} & InputHTMLAttributes
}[GetKeys<T>];

//@ts-expect-error Object props throw error with `FieldWithAutoComplete` but it's working actually
export const FieldComp = <T extends Record<string, any> = Record<string, any>>() => defineComponent<
	FieldType<T>,
	any,
	string,
	SlotsType<{
		default: { field: { value: any }, error: any }
	}>
>(
	(props: FieldType<T>, { slots, emit, attrs: baseAttrs }) => {
		const {
			value,
			onInput,
			onFocus,
			getError,
		} = useInput(props, emit);

		const sharedProps = computed(() => {
			const attrs: Record<string, any> = {
				...baseAttrs,
				name: props.name,
				error: getError(),
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
			};

			if (attrs.type === 'checkbox' && value.value) {
				attrs.checked = true;
			}

			if (baseAttrs.type !== 'file' && (props.as !== 'select' && !attrs.multiple)) {
				attrs.value = value.value;
			}

			return attrs;
		});

		const slotProps = () => {
			return {
				field: {
					...sharedProps.value,
					modelValue: value.value,
				},
				componentField: {
					value: value.value,
				},
				value: value.value,
				modelValue: value.value,
				error: getError(),
			};
		};

		return () => {
			const tag = resolveDynamicComponent(resolveTag(props, slots)) as string;
			const children = normalizeChildren(tag, slots, slotProps);
			if (tag) {
				return h(tag,
					{
						...props,
						...sharedProps.value,
					},
					children,
				);
			} else {
				return children;
			}
		};
	},
	{
		name: 'Field',
		inheritAttrs: false,
		props: {
			name: { type: String as PropType<FieldType<T>['name']>, default: '' },
			preserve: { type: Boolean as PropType<FieldType<T>['preserve']>, default: false },
			default: { type: [String, Array, Boolean, Number, Object] as PropType<FieldType<T>['default']>, default: undefined },
			modelValue: { type: [String, Array, Boolean, Number, Object] as PropType<FieldType<T>['modelValue']>, default: undefined },
			as: { type: String as PropType<FieldType<T>['as']>, default: 'input' },
		},
		emits: ['update:modelValue'],
	},
);
