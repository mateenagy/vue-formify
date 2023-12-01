import { Component, h, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { defineComponent } from 'vue';
import { PluginOptions } from '@/components';
import { STORE } from '@/store/store';

type BaseInput = {
	name: string;
	default?: any;
	value?: any;
	modelValue?: any;
	error?: any;
	ignore?: boolean;
	preserve?: boolean;
}

type CreateInputOptions = {
	modelKey?: string;
	defaultValueKey?: any;
}

type NestedObject = Record<string, any | string>;

export const createInput = <T>(component: Component, options?: CreateInputOptions) => {
	const cmp = defineComponent<T & BaseInput>({
		props: {
			...(component as any).props,
			name: {
				type: String,
				default: '',
			},
			default: {
				type: [String, Boolean, Number, Object],
				default: '',
			},
			ignore: {
				type: Boolean,
				default: false,
			},
			preserve: {
				type: Boolean,
				default: false,
			},
		},
		emits: ['update:modelValue'],
		setup: (props, ctx) => {
			const { formName, updateFormData }: any = inject('form');
			const config: PluginOptions | undefined = inject('config', undefined);
			const prevValue = ref<string>(props.name);

			const createModelBindings = () => {
				const bindingMethod = Object.create({});
				bindingMethod[`onUpdate:${options?.modelKey}`] = (value: any) => {
					updateFormData(props.name, value);
					STORE.value[formName][props.name]?.value || value;
					ctx.emit(`update:${options?.modelKey}`, STORE.value[formName][props.name]?.value || value);
				};

				return bindingMethod;
			};

			/* TODO
			/ - Check the props name if contains . if not add to store.
			/ - if contains then split
			/ - create object from splitted strings (recursivly)
			/ - check if property exist if yes then concat
			*/
			const addToStore = (store: any, path: string) => {
				const keys = path.split('.');
				let currentObject = store;

				keys.forEach((key, index) => {
					if (!currentObject[key]) {
						currentObject[key] = {};
					}

					if (index === keys.length - 1) {
						// If it's the last key, set it to an empty string
						console.log('[props]: ', props.default);
						currentObject[key] = {
							value: (props[options?.defaultValueKey as keyof typeof props] || props.default),
							error: '',
						};
					}

					currentObject = currentObject[key];
				});
			};


			const mergeObjects = (obj1: any, obj2: any) => {
				for (const key in obj2) {
					if (Object.prototype.hasOwnProperty.call(obj2, key)) {
						if (typeof obj2[key] === 'object' && Object.prototype.hasOwnProperty.call(obj1, key) && typeof obj1[key] === 'object') {
							// Recursively merge sub-objects
							mergeObjects(obj1[key], obj2[key]);
						} else {
							// Merge values
							obj1[key] = obj2[key];
						}
					}
				}
			};


			const getValueFromNestedObject = (nestedObject: any, path: string): string | undefined => {
				const keys = path.split('.');
				let currentObj: any | { value: string } | undefined = nestedObject;

				for (const key of keys) {
					if (!currentObj || typeof currentObj !== 'object') {
						// Property doesn't exist or it's not an object
						return undefined;
					}
					currentObj = currentObj[key] as NestedObject | { value: string } | undefined;
				}

				// At this point, currentObj should contain the final value
				return currentObj?.value;
			};

			const removeObjectFromStore = (nestedObject: any, path: string) => {
				const keys = path.split('.');
				let currentObj = nestedObject;

				keys.forEach((key) => {
					if (!currentObj || typeof currentObj !== 'object') {
						// Property doesn't exist or it's not an object
						return;
					}
					currentObj = currentObj[key];
				});

				console.log('[current]: ', currentObj);
				const lastKey = keys[keys.length - 1];


				if (currentObj && typeof currentObj === 'object' && lastKey in currentObj) {
					// Delete the property at the specified path
					delete currentObj[lastKey];
				}
			};

			onMounted(() => {
				if (props.name.includes('.')) {
					const store = {};
					addToStore(store, props.name);
					mergeObjects(STORE.value[formName], store);
				} else {
					if (!STORE.value[formName][props.name] && !props.ignore) {
						STORE.value[formName][props.name] = {
							value: (props[options?.defaultValueKey as keyof typeof props] || props.default),
							error: '',
						};
					}
				}
			});

			onBeforeUnmount(() => {
				!props.preserve && delete STORE.value[formName][props.name];
				console.log('[piorp]: ', props.name);
				// !props.preserve && removeObjectFromStore(STORE.value[formName], props.name);
			});

			watch(() => [props.name, props.value, props.default, props.ignore], (curr) => {
				// delete STORE.value[formName][prevValue.value];
				if (!curr[3]) {
					if (props.name.includes('.')) {
						const store = {};
						addToStore(store, props.name);
						mergeObjects(STORE.value[formName], store);
					} else {
						STORE.value[formName][props.name] = {
							value: (props[options?.defaultValueKey as keyof typeof props] || props.default),
							error: '',
						};
					}
					prevValue.value = props.name;
				}
			}, { deep: true });

			return () => {
				return h(component, {
					...((!config || (config as PluginOptions).useFocus) && {
						// onFocus: () => {
						// 	(!props.ignore && STORE.value[formName][props.name].error) && (STORE.value[formName][props.name].error = undefined);
						// },
						// onChange: () => {
						// 	(!props.ignore && STORE.value[formName][props.name].error) && (STORE.value[formName][props.name].error = undefined);
						// },
						// onBlur: () => {
						// 	(!props.ignore && STORE.value[formName][props.name].error) && (STORE.value[formName][props.name].error = undefined);
						// },
					}),
					...props,
					name: props.name,
					error: STORE.value?.[formName]?.[props?.name]?.error || props.error,
					modelValue: getValueFromNestedObject(STORE.value?.[formName], props.name) || props.modelValue,
					ignore: false,
					'onUpdate:modelValue': (value: any) => {
						ctx.emit('update:modelValue', value);
						updateFormData(props.name, value);
					},
					...(options?.modelKey && { ...createModelBindings() }),
				},
				{ ...ctx.slots });
			};
		},
	});

	return cmp;
};
