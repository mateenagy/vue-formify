import { normalizeChildren, resolveTag } from '@/utils/utils';
import { Component, computed, defineComponent, h, PropType, resolveDynamicComponent, SlotsType } from 'vue';
import { FieldType, Prettify } from '@/utils/types';
import { useInput } from '@/composable/useInput';

/** Calls a listener from `attrs`: one function, or an array when several are bound to the same event. */
const callListener = (listener: unknown, ...args: unknown[]) => {
	if (Array.isArray(listener)) {
		listener.forEach(fn => callListener(fn, ...args));
	} else if (typeof listener === 'function') {
		listener(...args);
	}
};

//@ts-expect-error `name` does not exist in type. Vue don't like `FieldType` type definition, but it works fine.
export const FieldComp = <T extends Record<string, any> = Record<string, any>>() => defineComponent<
	Prettify<FieldType<T>>,
	any,
	string,
	SlotsType<{
		default: {
			field: {
				value: any,
				modelValue: any,
				'onUpdate:modelValue': (val: any) => void,
				onInput: (evt: any) => void,
				onFocus: () => void,
				onBlur: () => void,
				error: any,
				isValid: boolean,
				isDirty: boolean,
				isTouched: boolean,
			}
		}
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
				// Field's own handler first, then the user's (`<Field @input="…">`), with the event.
				onInput: (evt: any) => {
					const result = inputProps.value.onInput?.(evt);
					callListener(baseAttrs.onInput, evt);

					return result;
				},
				onChange: (evt: any) => {
					const result = inputProps.value.onInput?.(evt);
					callListener(baseAttrs.onChange, evt);

					return result;
				},
				onFocus: (evt: any) => {
					const result = inputProps.value.onFocus?.();
					callListener(baseAttrs.onFocus, evt);

					return result;
				},
				onBlur: (evt: any) => {
					const result = inputProps.value.onBlur?.();
					callListener(baseAttrs.onBlur, evt);

					return result;
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
			const tag = resolveDynamicComponent(resolveTag(props, !!slots.default));
			const children = normalizeChildren(tag, slots, slotProps);


			if (tag) {
				// The handlers come from `sharedProps`, which call Field's own and the user's. Spreading
				// `inputProps` with its handlers after it would replace them and drop the user's.
				const { onInput: _i, onFocus: _f, onBlur: _b, ...bindings } = inputProps.value;
				const { value: _v, modelValue: _mv, ...bindingsNoValue } = bindings;
				const resolvedInputProps = baseAttrs.type === 'checkbox' ? bindingsNoValue : bindings;

				if (typeof tag === 'string') {
					// An element, native or custom: only what belongs on the DOM. Field's own props and the
					// component-only bindings would otherwise land on it as attributes (`istouched="false"`, …).
					const { modelValue: _m, 'onUpdate:modelValue': _u, isTouched: _t, ...domInputProps } = resolvedInputProps;

					return h(tag, { ...sharedProps.value, ...domInputProps }, children);
				}

				return h(tag as Component,
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
			as: { type: [String, Object, Function] as PropType<FieldType<T>['as']>, default: undefined },
			rule: { type: [Object, Function] as PropType<FieldType<T>['rule']>, default: undefined },
			ignore: { type: Boolean as PropType<FieldType<T>['ignore']>, default: undefined },
			trueValue: { type: [String, Boolean, Number, Object] as PropType<FieldType<T>['trueValue']>, default: undefined },
			falseValue: { type: [String, Boolean, Number, Object] as PropType<FieldType<T>['falseValue']>, default: undefined },
		},
		emits: ['update:modelValue'],
	},
);
