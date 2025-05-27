import { deleteByPath, getValueByPath } from '@/utils/utils';
import { defineComponent, h, inject, nextTick, PropType, ref, SlotsType, toValue } from 'vue';
import { forms } from '@/utils/store';
import { useField } from '../composable/useField';
import { GetKeys } from '@/composable/useForm';

type FieldArrayType<T extends Record<string, any>> = {
	name: GetKeys<T>;
	error?: any;
	ignore?: boolean;
	initialValues?: any[];
	preserve?: boolean;
	default?: any[];
}

export const FieldArrayComp = <T extends Record<string, any> = Record<string, any>>() => defineComponent(
	(props: FieldArrayType<T>, { slots, emit, attrs }) => {
		/*---------------------------------------------
		/  VARIABLES
		---------------------------------------------*/
		const fields = ref<any[]>([]);
		const { setArrayValue, getError } = useField(props, emit, true);
		const { uid } = inject('formData', Object.create({}));

		/*---------------------------------------------
		/  METHODS
		---------------------------------------------*/
		const add = () => {
			!props.ignore && (getValueByPath(forms[uid].values, props.name as string).error = undefined);

			fields.value.push({
				id: fields.value.length,
				name: props.name,
			});
		};

		const remove = (idx: number) => {
			getValueByPath(forms[uid].values, props.name as string).error = undefined;
			const removedIndex = fields.value.findIndex(field => field.id === idx);

			for (let index = removedIndex + 1; index < fields.value.length; index++) {
				const currentPath = `${props.name as string}[${index}]`;
				const previousPath = `${props.name as string}[${index - 1}]`;

				const tmp = getValueByPath(forms[uid].values, currentPath);

				if (getValueByPath(forms[uid].values, previousPath)) {
					setArrayValue({ [`[${index - 1}]`]: JSON.parse(JSON.stringify(tmp)) });
				}
			}
			deleteByPath(forms[uid].values, `${fields.value[fields.value.length - 1].name}[${fields.value.length - 1}]`);
			fields.value.splice(-1);
		};

		const init = async () => {
			fields.value = [];
			const initials = props.initialValues || forms[uid].initialValues?.[props.name] || forms[uid].values[props.name].value;
			if (initials) {
				initials.forEach?.(() => {
					fields.value.push({
						id: fields.value.length,
						name: props.name,
					});
				});
				await nextTick();
				initials.forEach?.((value: any, idx: any) => {
					if (typeof value === 'object') {
						Object.keys(value).forEach((key) => {
							setArrayValue({
								[`[${idx}]`]: {
									[key]: {
										value: value[key],
									},
								},
							});
						});
					} else {
						setArrayValue({
							[`[${idx}]`]: {
								value,
							},
						});
					}
				});
			}
		};
		/*---------------------------------------------
		/  CREATED
		---------------------------------------------*/
		init();

		return () => {
			return h('div',
				{ ...props, ...attrs, ...emit },
				slots.default?.({ fields: toValue(fields), add, remove, error: getError() }),
			);
		};
	},
	{
		name: 'FieldArray',
		props: {
			name: {
				type: String as PropType<any>,
				required: true,
			},
			error: {
				type: String as PropType<string>,
				default: undefined,
			},
			ignore: {
				type: Boolean as PropType<boolean>,
				default: undefined,
			},
			initialValues: {
				type: Object as PropType<any>,
				default: undefined,
			},
			default: {
				type: Array as PropType<any[]>,
				default: undefined,
			},
			preserve: {
				type: Boolean as PropType<boolean>,
				default: undefined,
			},
		},
		emits: ['update:modelValue'],
		slots: Object as SlotsType<{
			default: { fields: { id: number }[], add: () => void, remove: (idx: number) => void, error: any }
		}>,
	},
);
