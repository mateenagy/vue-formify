import { FormOptions } from '@/utils/types';
import { FieldArrayComp } from '@/components/FieldArray';
import { ErrorComp } from '@/components/Error';
import { FormComponent } from '@/components/Form';
import { FieldComp } from '@/components/Field';

export type UseFormReturn<T extends Record<string, any>> = {
	Form: ReturnType<typeof FormComponent<T>>['cmp'];
	Field: ReturnType<typeof FieldComp<T>>;
	FieldArray: ReturnType<typeof FieldArrayComp<T>>;
	Error: ReturnType<typeof ErrorComp<T>>;
	reset: ReturnType<typeof FormComponent<T>>['reset'];
	setInitalValues: ReturnType<typeof FormComponent<T>>['setInitalValues'];
	setValue: ReturnType<typeof FormComponent<T>>['setValue'];
	values: ReturnType<typeof FormComponent<T>>['values'];
};

export const useForm = <T extends Record<string, any>>(opt?: FormOptions<T>): UseFormReturn<T> => {
	const FormBase = FormComponent<T>(opt);
	const Field = FieldComp<T>();
	const FieldArray = FieldArrayComp<T>();
	const Error = ErrorComp<T>();

	return {
		Form: FormBase.cmp,
		Field,
		FieldArray,
		Error,
		reset: FormBase.reset,
		setInitalValues: FormBase.setInitalValues,
		setValue: FormBase.setValue,
		values: FormBase.values,
	};
};
