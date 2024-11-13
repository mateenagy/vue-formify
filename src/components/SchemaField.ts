import { GetKeys } from '@/composable/useForm';
import { defineComponent, h, PropType } from 'vue';

export type JSONSchema<T extends Record<string, any>> = {
	name?: GetKeys<T> | 'error';
	component: any;
	attrs?: Record<string, any>;
}[];

const SchemaFieldComponent = <T extends Record<string, any>>() => defineComponent((props: { schema: JSONSchema<T> }) => {
	return () => {
		return [
			props.schema.map((schema) => {
				if (Array.isArray(schema.component)) {
					const cmps: any = [];
					schema.component.forEach((cmp) => {
						cmps.push(h(cmp, {
							name: schema.name,
							...schema.attrs,
							...cmp.name === 'FieldError' && {
								'error-for': schema.name,
							},
						}));		
					});

					return cmps;
				}

				if (typeof schema.component === 'string') {
					h(schema.component, {
						name: schema.name,
						...schema.attrs,
					});
				}

				return h(schema.component, {
					name: schema.name,
					...schema.attrs,
					...schema.component.name === 'FieldError' && {
						'error-for': schema.name,
					},
				});
			}),
		];
	};
}, {
	props: {
		schema: {
			type: Object as PropType<any>,
			required: true,
		},
	},
});

const cmp = SchemaFieldComponent();

export {
	cmp as SchemaField,
};
