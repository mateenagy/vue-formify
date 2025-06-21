import { deleteByPath, getValueByPath } from '@/utils/utils';
import { defineComponent, h, inject, nextTick, PropType, ref, SlotsType, toValue } from 'vue';
import { forms } from '@/utils/store';
import { FieldArrayType, FieldType, Prettify } from '@/utils/types';
import { useInput } from '@/composable/useInput';

//@ts-expect-error `name` does not exist in type. Vue don't like `FieldType` type definition, but it works fine.
export const FieldArrayComp = <T extends Record<string, any> = Record<string, any>>() => defineComponent<
	Prettify<FieldArrayType<T>>,
	any,
	string,
	SlotsType<{
		default: { fields: { id: number }[], add: () => void, remove: (idx: number) => void, error: any }
	}>
>(
	(props: FieldArrayType<T>, { slots, emit, attrs }) => {
		/*---------------------------------------------
		/  VARIABLES
		---------------------------------------------*/
		const fields = ref<any[]>([]);
		const { getError, setArrayValue } = useInput(props, true);
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

		const remove = async (idx: number) => {
			getValueByPath(forms[uid].values, props.name as string).error = undefined;
			const removedIndex = fields.value.findIndex(field => field.id === idx);

			for (let index = removedIndex + 1; index < fields.value.length; index++) {
				const currentPath = `${props.name as string}[${index}]`;
				const previousPath = `${props.name as string}[${index - 1}]`;
				getValueByPath(forms[uid].values, currentPath).error = undefined;
				getValueByPath(forms[uid].values, previousPath).error = undefined;

				if (getValueByPath(forms[uid].values, previousPath)) {
					setArrayValue({ [`[${index - 1}]`]: JSON.parse(JSON.stringify(getValueByPath(forms[uid].values, currentPath))) });
				}
			}
			await nextTick();
			deleteByPath(forms[uid].values, `${fields.value[fields.value.length - 1].name}[${fields.value.length - 1}]`);
			fields.value.splice(-1);
		};
		const init = async () => {
			fields.value = [];
			const initials = forms[uid].initialValues?.[props.name] || forms[uid].values[props.name].value;
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
				slots.default?.({ fields: toValue(fields), add, remove, error: getError }),
			);
		};
	},
	{
		name: 'FieldArray',
		props: {
			name: { type: String as unknown as PropType<FieldType<T>['name']>, default: '' },
			default: { type: [String, Array, Boolean, Number, Object] as PropType<FieldType<T>['default']>, default: undefined },
			preserve: { type: Boolean as PropType<FieldType<T>['preserve']>, default: false },
			modelValue: { type: [String, Array, Boolean, Number, Object] as PropType<FieldType<T>['modelValue']>, default: undefined },
			as: { type: String as PropType<FieldType<T>['as']>, default: 'input' },
			rule: { type: Object as PropType<FieldType<T>['rule']>, default: undefined },
		},
		emits: ['update:modelValue'],
		slots: Object as SlotsType<{
			default: { fields: { id: number }[], add: () => void, remove: (idx: number) => void, error: any }
		}>,
	},
);
