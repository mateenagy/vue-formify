import { getValueByPath } from '@/utils/utils';
import { forms } from '@/utils/store';
import { FieldDefaults } from '@/utils/types';
import { validateSchema } from '@/utils/validator';

export const useFieldValidation = (
	uid: string,
	name: string,
	rule: any,
	fieldItem: { value: FieldDefaults },
	value: { value: any },
	isSubmitted: { value: boolean },
	mode: string,
) => {
	const setError = (fieldName: string, error: any) => {
		const field = getValueByPath(forms[uid].values, fieldName);
		if (field) {
			field.error = error;
		}
	};

	const resetError = () => {
		fieldItem.value?.error && (fieldItem.value.error = undefined);
		const parentPath = name.replace(/\[\d+\]/, '');
		const parent = getValueByPath(forms[uid].values, parentPath);
		parent?.error && (parent.error = undefined);
	};

	const validateField = async () => {
		if (rule) {
			const result = await validateSchema(rule, value.value, setError, name);
			if (fieldItem.value) {
				fieldItem.value.isValid = result;
			}
		}
	};

	const getError = () =>
		(fieldItem.value?.isDirty || isSubmitted.value || mode === 'onSubmit') ? fieldItem.value?.error : undefined;

	return { setError, resetError, validateField, getError };
}
