import { GetKeys } from '@/composable/useForm';
import { forms } from '@/utils/store';
import { getValueByPath } from '@/utils/utils';
import { defineComponent, inject, h, SlotsType, PropType } from 'vue';

export const ErrorComp = <T extends Record<string, any> = Record<string, any>>() => defineComponent(
	(props: { errorFor: GetKeys<T> }, { slots, emit, attrs }) => {
		const { uid } = inject('formData', Object.create({}));

		const getError = () => {
			return getValueByPath(forms[uid].values, props.errorFor as string)?.error;
		};

		return () => {
			return h('span',
				{ ...props, ...attrs, ...emit },
				slots.default ? slots.default?.({ error: getError() }) as SlotsType<{ error: any }> : getError(),
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
