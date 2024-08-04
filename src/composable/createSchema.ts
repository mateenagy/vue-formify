type SchemaItem = Record<string, {
	rule: (value: any) => boolean;
	message: string;
}[]>

export const createSchema = (item: SchemaItem) => {
	const schema = {
		parse: (value: any) => {
			const errors: any = [];
			Object.keys(item).forEach((key: string) => {
				item[key].forEach((rules) => {
					if (rules.rule(value[key])) {
						errors.push({ key: key, message:  rules.message });
					}
				});
			});

			return { errors };
		},
	};

	return schema;
};
