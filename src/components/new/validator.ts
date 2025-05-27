import { StandardSchemaV1 } from '@/utils/types';
import { getDotPath } from '@/utils/utils';

export const validateSchema = async (
	schema: StandardSchemaV1,
	value: Record<string, any>,
	setError: (name: any, error: any) => void,
	key?: string,
): Promise<boolean> => {
	const result = await schema['~standard'].validate(value);
	if (result.issues) {
		for (const issue of result.issues) {
			setError(key ? key : getDotPath(issue) as string, issue.message);
		}

		return false;
	}

	return true;
};
