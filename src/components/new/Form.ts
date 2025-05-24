import { forms } from '@/utils/store';
import { EventEmitter, flattenObject, getValueByPath, mergeDeep, stringToObject } from '@/utils/utils';
import { TypedSchema } from '@packages/utils/types';
import { computed, defineComponent, h, onMounted, PropType, provide, ref, watch } from 'vue';
import { GetKeys } from './useForm';

type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends Record<string, any> ? RecursivePartial<T[P]> : T[P];
};

export type FormOptions<T extends Record<string, any>> = {
	initialValues?: T extends Record<string, any> ? RecursivePartial<T> : Record<string, any>;
	schema?: TypedSchema<any, T>;
	name?: string // Refactor to use standard-schema
}

type FormType<T extends Record<string, any>> = {
	enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data';
	validationSchema?: any;
	action?: string;
	initialValues?: RecursivePartial<T>;
	name?: string;
	preserve?: boolean;
	onValueChange?: (value?: any) => void;
	onSubmit?: (value?: any, $event?: SubmitEvent) => void | Promise<any>;
}

export const FormComponent = <T extends Record<string, any> = Record<string, any>>(opt?: FormOptions<T>) => {
	/*---------------------------------------------
	/  VARIABLES
	---------------------------------------------*/
	const uid: number | string = opt?.name || Math.floor(Math.random() * Date.now());
	let originalForm = Object.create({});
	const _value = ref<T>(opt?.initialValues || Object.create({}));
	const isSubmitting = ref<boolean>(false);
	const formState = ref<'unmounted' | 'mounted'>('unmounted');

	/*---------------------------------------------
	/  METHODS
	---------------------------------------------*/
	const reset = (force: boolean = false) => {
		if (force) {
			forms[uid].initialValues = Object.create({});
			forms[uid].values = Object.create({});
			originalForm = JSON.stringify(Object.create({}));
		} else {
			forms[uid].values = JSON.parse(originalForm);
		}
		forms[uid].key++;
	};

	const setValue = (name: GetKeys<T>, value: any) => {
		if (getValueByPath(forms[uid].values, name as unknown as string)) {
			getValueByPath(forms[uid].values, name as unknown as string).value = value;
		} else {
			const obj = stringToObject(name as string, { value, error: undefined });
			forms[uid].values = mergeDeep(forms[uid].values, obj);
		}
	};

	const setInitalValues = (initials: Partial<T>) => {
		forms[uid].initialValues = mergeDeep(flattenObject(forms[uid].values), initials);
		forms[uid].key++;
		console.log(forms[uid]);
	};

	/*---------------------------------------------
	/  CREATED
	---------------------------------------------*/
	if (!forms[uid]) {
		forms[uid] = {
			values: Object.create({}),
			initialValues: opt?.initialValues || Object.create({}),
			key: 0,
		};
	}

	const cmp = defineComponent((props: FormType<T>, { slots, emit, attrs }) => {
		/*---------------------------------------------
		/  VARIABLES
		---------------------------------------------*/

		/*---------------------------------------------
		/  COMPUTED
		---------------------------------------------*/
		const errors = computed(() => {
			return flattenObject(forms[uid].values, 'error');
		});
		const values = computed(() => {
			return flattenObject(forms[uid]?.values) as T;
		});
		/*---------------------------------------------
		/  METHODS
		---------------------------------------------*/
		const submit = async ($event: any) => {
			$event.preventDefault();
			console.log('Form submitted');

			return $event.preventDefault();
		};
		/*---------------------------------------------
		/  WATCHERS
		---------------------------------------------*/
		watch(values, (curr, prev) => {
			_value.value = curr;
			if (JSON.stringify(curr) !== JSON.stringify(prev) && props.onValueChange) {
				EventEmitter.emit('value-change', uid);
			}
		}, { deep: true });
		/*---------------------------------------------
		/  CREATED
		---------------------------------------------*/
		if (Object.keys(props.initialValues as Record<string, any>).length) {
			forms[uid].initialValues = mergeDeep(forms[uid].initialValues, props.initialValues as Record<string, any>);
		}

		provide('formData', {
			uid,
			preserveForm: props.preserve,
		});
		/*---------------------------------------------
		/  HOOKS
		---------------------------------------------*/
		onMounted(async () => {
			formState.value = 'mounted';
			originalForm = JSON.stringify(forms[uid].values);

			EventEmitter.on('value-change', (id: string) => {
				if (id === uid && props?.onValueChange && forms[uid]) {
					emit('value-change', values.value);
				}
			});
		});

		return () => {
			return h('form',
				{ ...props, ...attrs, ...emit, key: forms[uid].key, onSubmit: submit },
				slots.default?.({ values: values.value, errors: errors.value }),
			);
		};
	}, {
		name: 'FormComponent',
		props: {
			enctype: { type: String as PropType<FormType<T>['enctype']>, default: 'application/x-www-form-urlencoded' },
			preserve: { type: Boolean as PropType<FormType<T>['preserve']>, default: false },
			initialValues: { type: Object as PropType<FormType<T>['initialValues']>, default: Object.create({}) },
		},
	});

	return {
		cmp,
		values: _value,
		reset,
		setInitalValues,
		setValue,
	};
};
