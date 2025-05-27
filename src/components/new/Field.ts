import { normalizeChildren, resolveTag } from '@/utils/utils';
import { computed, defineComponent, h, PropType, resolveDynamicComponent, SlotsType } from 'vue';
import { useInput } from './useInput';
import { FieldType } from '@/utils/types';

//@ts-expect-error `name` does not exist in type. Vue don't like `FieldType` type definition, but it works fine.
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
			onBlur,
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
				onBlur: async () => {
					onBlur();
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
			default: { type: [String, Array, Boolean, Number, Object] as PropType<FieldType<T>['default']>, default: undefined },
			preserve: { type: Boolean as PropType<FieldType<T>['preserve']>, default: false },
			modelValue: { type: [String, Array, Boolean, Number, Object] as PropType<FieldType<T>['modelValue']>, default: undefined },
			as: { type: String as PropType<FieldType<T>['as']>, default: 'input' },
			schema: { type: Object as PropType<FieldType<T>['schema']>, default: undefined },
		},
		emits: ['update:modelValue'],
	},
);
