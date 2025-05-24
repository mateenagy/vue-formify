import { FieldComp } from './Field';
import { FormComponent, FormOptions } from './Form';
type GetNestedArray<T> = T extends object
	? {
		[K in keyof T]: T[K] extends (infer U)[]
		? `${K & string}[]${U extends object ? `.${GetNestedArray<U>}` : ''}` | `${K & string}[${number}]${U extends object ? `.${GetNestedArray<U>}` : ''}` | `${K & string}` | `${K & string}[${number}]`
		: `${K & string}${T[K] extends object ? `.${GetNestedArray<T[K]>}` : `${GetNestedArray<T[K]>}`}`;
	}[keyof T]
	: '';

export type GetKeys<T extends Record<string, any>> = keyof {
	[K in keyof T as (
		T[K] extends (any | undefined)[] ? T[K] extends Record<string, any>[] ? `${K & string}[].${GetNestedArray<T[K][0]>}` | `${K & string}[${number}].${GetNestedArray<T[K][0]>}` | `${K & string}` : `${K & string}[]` | `${K & string}[${number}]` | `${K & string}` :
		T[K] extends Record<string, any> ? `${K & string}.${GetNestedArray<T[K]> & string}` : `${K & string}`
	)]: any;
}

export const useForm = <T extends Record<string, any>>(opt?: FormOptions<T>) => {
	const FormBase = FormComponent<T>(opt);
	const Field = FieldComp<T>();

	return {
		Form: FormBase.cmp,
		Field,
		reset: FormBase.reset,
		values: FormBase.values,
		setInitalValues: FormBase.setInitalValues,
		setValue: FormBase.setValue,
	};
};
