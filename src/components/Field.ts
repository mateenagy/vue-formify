import { GetKeys } from '@/composable/useForm';
import { defineComponent, h, PropType } from 'vue';

type ExtractValue<T, K extends string> =
	K extends `${infer Root}.${infer Rest}`
		? Root extends keyof T
			? ExtractValue<T[Root], Rest>
			: Root extends `${infer ArrayRoot}[${number}]`
				? ArrayRoot extends keyof T
					? T[ArrayRoot] extends (infer U)[]
						? ExtractValue<U, Rest>
						: never
					: never
				: never
	: K extends `${infer Root}[${number}]`
		? Root extends keyof T
			? T[Root] extends (infer U)
				? U
				: never
			: never
	: K extends keyof T
		? T[K]
		: never;

type FieldOptions<T extends Record<string, any>> = {
	[K in GetKeys<T>]: ExtractValue<T, K>;
};

type FieldWithAutoComplete<T extends Record<string, any>> = {
	[K in keyof FieldOptions<T>]: {
		name: K;
		default?: FieldOptions<T>[K]; // ensures `default` type is based on `name`
	} & {
		error?: any
	}
}[keyof FieldOptions<T>];


//@ts-expect-error Object props throw error with `FieldWithAutoComplete` but it's working actually
export const FieldComp = <T extends Record<string, any> = Record<string, any>>() => defineComponent((props: FieldWithAutoComplete<T>) => {
	console.log(props.name);
	
	return () => {
		return h('input');
	};
}, {
	props: {
		name: {
			type: String as PropType<any>,
			required: true,
		},
		default: {
			type: [String] as PropType<any>,
			default: undefined,
		},
	},
});
