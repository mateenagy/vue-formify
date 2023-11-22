import { Component, h, inject, provide } from 'vue';
import type { FunctionalComponent } from 'vue';
import { formCore } from '@/core/formCore';
import { STORE } from '@/store/store';


export const VueForm: FunctionalComponent<any, any> = (
	props,
	context,
) => {
	provide('form', { formName: 'asd' });
	const cmp = h('form', {
		...props,
	},
	{ ...context.slots });

	return cmp;
};
