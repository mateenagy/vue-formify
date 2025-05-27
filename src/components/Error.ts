import { GetKeys } from '@/composable/useForm';
import { forms } from '@/utils/store';
import { getErrorMessage, getValueByPath } from '@/utils/utils';
import { defineComponent, inject, h, SlotsType, PropType } from 'vue';

export const ErrorComp = <T extends Record<string, any> = Record<string, any>>() => defineComponent(
	(props: { errorFor: GetKeys<T> }, { slots, emit, attrs }) => {
		const { uid, mode } = inject('formData', Object.create({}));
		
		const getError = () => {
			if (mode === 'onSubmit' || getValueByPath(forms[uid].values, props.errorFor as string)?.isDirty) {
				return getErrorMessage(forms[uid].values, props.errorFor as string);
			}
		};

		return () => {
			return h('span',
				{ ...props, ...attrs, ...emit },
				slots.default ? slots.default?.({ error: getError() }) as SlotsType<{ error: any }> : Array.isArray(getError()) ? getError()?.[0] : getError(),
			);
		};
	},
	{
		name: 'FieldError',
		props: {
			errorFor: {
				type: String as PropType<any>,
				default: undefined,
			},
		},
		slots: Object as SlotsType<{
			default: { error: any }
		}>,
	},
);
