import { GetKeys } from '@/composable/useForm';
import { AllowedComponentProps, Component, VNodeProps } from 'vue';

export type ComponentProps<C extends Component> = C extends new (...args: any) => any
	? Omit<InstanceType<C>['$props'], keyof VNodeProps | keyof AllowedComponentProps>
	: never;

export type FormType<T extends Record<string, any> = Record<string, any>> = {
	values: T;
	errors: T;
	isSubmitting: boolean;
	setError: (name: GetKeys<T>, error: any) => void;
	updateField: (name: GetKeys<T>, value: any) => void;
	reset: () => void;
	flush: () => void;
}
