import { getValueByPath, stringToObject } from '@/utils/utils';

type SchemaItem = Record<string, {
	rule: (value: any) => boolean;
	message: string;
}[]>

export const createSchema = (item: SchemaItem) => {
	const schema = {
		parse: (value: any) => {
			const errors: any = [];
			
			Object.keys(item).forEach((key: string) => {
				const obj = stringToObject(key, item[key]);
				
				const rulesArray = (getValueByPath(obj, key));
				
				rulesArray.forEach((rules: any) => {
					const _value = getValueByPath(value, key);
					
					if (_value !== undefined && rules.rule(_value)) {
						errors.push({ key: key, message:  rules.message });
					}
				});
			});

			return { errors };
		},
	};

	return schema;
};
