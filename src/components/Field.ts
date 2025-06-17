import { normalizeChildren, resolveTag } from '@/utils/utils';
import { computed, defineComponent, h, PropType, resolveDynamicComponent, SlotsType } from 'vue';
import { FieldType } from '@/utils/types';
import { useInput } from '@/composable/useInput';

//@ts-expect-error `name` does not exist in type. Vue don't like `FieldType` type definition, but it works fine.
export const FieldComp = <T extends Record<string, any> = Record<string, any>>() => defineComponent<
	FieldType<T>,
	any,
	string,
	SlotsType<{
		default: { field: { value: any, modelValue: any, isValid: boolean, error: any } }
	}>
>(
	(props: FieldType<T>, { slots, attrs: baseAttrs }) => {
		const {
			value,
			isValid,
			isTouched,
			isDirty,
			inputProps,
			getError,
		} = useInput(props);

		const sharedProps = computed(() => {
			const attrs: Record<string, any> = {
				...baseAttrs,
				name: props.name,
				error: getError(),
				onInput: (evt: any) => {
					inputProps.value.onInput?.(evt);
					if (typeof baseAttrs.onInput === 'function') {
						baseAttrs.onInput();
					}
				},
				onChange: (evt: any) => {
					inputProps.value.onInput?.(evt);
					if (typeof baseAttrs.onChange === 'function') {
						baseAttrs.onChange();
					}
				},
				onFocus: () => {
					inputProps.value.onFocus?.();
					if (typeof baseAttrs.onFocus === 'function') {
						baseAttrs.onFocus();
					}
				},
				onBlur: async () => {
					inputProps.value.onBlur?.();
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
					...inputProps.value,
					error: getError(),
					isValid: isValid.value,
					isTouched: isTouched.value,
					isDirty: isDirty.value,
					onFocus: inputProps.value.onFocus,
					onBlur: inputProps.value.onBlur,
				},

			};
		};

		return () => {
			const tag = resolveDynamicComponent(resolveTag(props, !!slots.default)) as string;
			const children = normalizeChildren(tag, slots, slotProps);


			if (tag) {
				return h(tag,
					{
						...props,
						...sharedProps.value,
						...inputProps.value,
						isValid: isValid.value,
						isTouched: isTouched.value,
						isDirty: isDirty.value,
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
			name: { type: String as unknown as PropType<FieldType<T>['name']>, default: '' },
			default: { type: [String, Array, Boolean, Number, Object] as PropType<FieldType<T>['default']>, default: undefined },
			preserve: { type: Boolean as PropType<FieldType<T>['preserve']>, default: false },
			modelValue: { type: [String, Array, Boolean, Number, Object] as PropType<FieldType<T>['modelValue']>, default: undefined },
			as: { type: String as PropType<FieldType<T>['as']>, default: undefined },
			rule: { type: [Object, Function] as PropType<FieldType<T>['rule']>, default: undefined },
		},
		emits: ['update:modelValue'],
	},
);
