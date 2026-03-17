import { normalizeChildren, resolveTag } from '@/utils/utils';
import { computed, defineComponent, h, PropType, resolveDynamicComponent, SlotsType } from 'vue';
import { FieldType, Prettify } from '@/utils/types';
import { useInput } from '@/composable/useInput';

//@ts-expect-error `name` does not exist in type. Vue don't like `FieldType` type definition, but it works fine.
export const FieldComp = <T extends Record<string, any> = Record<string, any>>() => defineComponent<
	Prettify<FieldType<T>>,
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
		} = useInput(props, { isComponent: !!props.custom, isCheckbox: baseAttrs.type === 'checkbox' });

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

			if (attrs.type === 'checkbox') {
				attrs.checked = props.trueValue !== undefined
					? value.value === props.trueValue
					: !!value.value;
			}

			if (baseAttrs.type !== 'file' && baseAttrs.type !== 'checkbox' && (props.as !== 'select' && !attrs.multiple)) {
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
				const { value: _v, modelValue: _mv, ...inputPropsNoValue } = inputProps.value;
				const resolvedInputProps = baseAttrs.type === 'checkbox' ? inputPropsNoValue : inputProps.value;
				return h(tag,
					{
						...props,
						...sharedProps.value,
						...resolvedInputProps,
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
			custom: { type: Boolean as PropType<FieldType<T>['preserve']>, default: false },
			modelValue: { type: [String, Array, Boolean, Number, Object] as PropType<FieldType<T>['modelValue']>, default: undefined },
			as: { type: String as PropType<FieldType<T>['as']>, default: undefined },
			rule: { type: [Object, Function] as PropType<FieldType<T>['rule']>, default: undefined },
			ignore: { type: Boolean as PropType<FieldType<T>['ignore']>, default: undefined },
			trueValue: { type: [String, Boolean, Number, Object] as PropType<FieldType<T>['trueValue']>, default: undefined },
			falseValue: { type: [String, Boolean, Number, Object] as PropType<FieldType<T>['falseValue']>, default: undefined },
		},
		emits: ['update:modelValue'],
	},
);
