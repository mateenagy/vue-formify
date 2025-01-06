import { FieldComp } from '@/components/Field';
import { FieldArrayComp } from '@/components/FieldArray';
import { ErrorComp } from '@/components/Error';
import { FormCompBase, FormOptions } from '@/components/Form';

type GetNestedArray<T> = T extends object
	? {
		[K in keyof T]: T[K] extends (infer U)[]
		? `${K & string}[]${U extends object ? `.${GetNestedArray<U>}` : ''}` | `${K & string}[${number}]${U extends object ? `.${GetNestedArray<U>}` : ''}` | `${K & string}` | `${K & string}[${number}]`
		: `${K & string}${T[K] extends object ? `.${GetNestedArray<T[K]>}` : `${GetNestedArray<T[K]>}`}`;
	}[keyof T]
	: '';

export type GetKeys<T extends Record<string, any>> = keyof {
	[K in keyof T as (
		T[K] extends any[] ? T[K] extends Record<string, any>[] ? `${K & string}[].${GetNestedArray<T[K][0]>}` | `${K & string}[${number}].${GetNestedArray<T[K][0]>}` | `${K & string}` : `${K & string}[]` | `${K & string}[${number}]` :
		T[K] extends Record<string, any> ? `${K & string}.${GetNestedArray<T[K]> & string}` : `${K & string}`
	)]: any;
}

export const Form = FormCompBase().cmp;
export const Field = FieldComp();
export const FieldArray = FieldArrayComp();
export const Error = ErrorComp();

export const useForm = <T extends Record<string, any>>(opt?: FormOptions<T>) => {
	const FormBase = FormCompBase<T>(opt);
	const Field = FieldComp<T>();
	const FieldArray = FieldArrayComp<T>();
	const Error = ErrorComp<T>();

	return {
		Form: FormBase.cmp,
		Field,
		FieldArray,
		Error,
		handleSubmit: FormBase.handleSubmit,
		setError: FormBase.setError,
		setInitalValues: FormBase.setInitalValues,
		reset: FormBase.reset,
		isSubmitting: FormBase.isSubmitting,
		values: FormBase.values,
	};
};
