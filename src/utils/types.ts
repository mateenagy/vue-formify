import { InputHTMLAttributes } from 'vue';

type IsPlainObject<T> =
	T extends object
	? T extends Date | RegExp | Map<any, any> | Set<any> | WeakMap<any, any> | WeakSet<any> | any[]
	? false
	: true
	: false;

type GetNestedArray<T> =
	T extends object
	? IsPlainObject<T> extends true
	? {
		[K in keyof T]: T[K] extends (infer U)[]
		? U extends object
		? IsPlainObject<U> extends true
		? | `${K & string}[]`
		| `${K & string}[${number}]`
		| `${K & string}[].${GetNestedArray<U>}`
		| `${K & string}[${number}].${GetNestedArray<U>}`
		: `${K & string}[]` | `${K & string}[${number}]`
		: `${K & string}[]` | `${K & string}[${number}]`
		: T[K] extends object
		? IsPlainObject<T[K]> extends true
		? `${K & string}` | `${K & string}.${GetNestedArray<T[K]>}`
		: `${K & string}`
		: `${K & string}`;
	}[keyof T]
	: ''
	: '';


export type GetKeys<T extends Record<string, any>> = keyof {
	[K in keyof T as (
		T[K] extends (infer U)[]
		? U extends object
		? IsPlainObject<U> extends true
		? `${K & string}` |
		`${K & string}[]` |
		`${K & string}[${number}]` |
		`${K & string}[].${GetNestedArray<U>}` |
		`${K & string}[${number}].${GetNestedArray<U>}`
		: `${K & string}` | `${K & string}[]` | `${K & string}[${number}]`
		: `${K & string}` | `${K & string}[]` | `${K & string}[${number}]`
		: T[K] extends object
		? IsPlainObject<T[K]> extends true
		? `${K & string}` | `${K & string}.${GetNestedArray<T[K]>}`
		: `${K & string}`
		: `${K & string}`
	)]: any;
};

type UnwrapArray<T> = T extends (infer U)[] ? U[] | U : T;

export type ExtractValue<T, K extends string> =
	K extends `${infer Root}.${infer Rest}`
	? Root extends keyof T
	? ExtractValue<T[Root], Rest>
	: Root extends `${infer ArrayRoot}[${number}]`
	? ArrayRoot extends keyof T
	? T[ArrayRoot] extends (infer U)[]
	? ExtractValue<U, Rest>
	: never
	: never
	: never
	: K extends `${infer Root}[${number}]`
	? Root extends keyof T
	? T[Root] extends (infer U)
	? UnwrapArray<U>
	: never
	: never
	: K extends keyof T
	? UnwrapArray<T[K]>
	: never;

export type FieldType<T extends Record<string, any>> = {
	[K in GetKeys<T>]: {
		name: K;
		default?: ExtractValue<T, K>;
	} & {
		error?: any;
		ignore?: boolean;
		trueValue?: any;
		modelValue?: any;
		falseValue?: any;
		preserve?: boolean;
		as?: 'input' | 'select';
		schema?: StandardSchemaV1;
	} & InputHTMLAttributes
}[GetKeys<T>];

export type InputProps<T extends Record<string, any> = Record<string, any>> = {
	name?: GetKeys<T>;
	default?: any;
	error?: any;
	ignore?: boolean;
	trueValue?: any;
	modelValue?: any;
	falseValue?: any;
	preserve?: boolean;
	as?: 'input' | 'select';
	schema?: StandardSchemaV1;
};

export type FieldDefaults = {
	value: any,
	error: any,
	ignore: boolean | undefined,
	isDirty: boolean,
	isFocused: boolean,
	isValid: boolean,
}

export type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends Record<string, any> ? RecursivePartial<T[P]> : T[P];
};

export type FormOptions<T extends Record<string, any>> = {
	initialValues?: T extends Record<string, any> ? RecursivePartial<T> : Record<string, any>;
	schema?: StandardSchemaV1<any, T>;
	name?: string // Refactor to use standard-schema
}

/** The Standard Schema interface. */
export interface StandardSchemaV1<Input = unknown, Output = Input> {
	/** The Standard Schema properties. */
	readonly '~standard': StandardSchemaV1.Props<Input, Output>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace StandardSchemaV1 {
	/** The Standard Schema properties interface. */
	export interface Props<Input = unknown, Output = Input> {
		/** The version number of the standard. */
		readonly version: 1;
		/** The vendor name of the schema library. */
		readonly vendor: string;
		/** Default input values. */
		default?: unknown;
		/** Validates unknown input values. */
		readonly validate: (
			value: unknown
		) => Result<Output> | Promise<Result<Output>>;
		/** Inferred types associated with the schema. */
		readonly types?: Types<Input, Output> | undefined;
	}

	/** The result interface of the validate function. */
	export type Result<Output> = SuccessResult<Output> | FailureResult;

	/** The result interface if validation succeeds. */
	export interface SuccessResult<Output> {
		/** The typed output value. */
		readonly value: Output;
		/** The non-existent issues. */
		readonly issues?: undefined;
	}

	/** The result interface if validation fails. */
	export interface FailureResult {
		/** The issues of failed validation. */
		readonly issues: readonly Issue[];
	}

	/** The issue interface of the failure output. */
	export interface Issue {
		/** The error message of the issue. */
		readonly message: string;
		/** The path of the issue, if any. */
		readonly path?: readonly (PropertyKey | PathSegment)[] | undefined;
	}

	/** The path segment interface of the issue. */
	export interface PathSegment {
		/** The key representing a path segment. */
		readonly key: PropertyKey;
	}

	/** The Standard Schema types interface. */
	export interface Types<Input = unknown, Output = Input> {
		/** The input type of the schema. */
		readonly input: Input;
		/** The output type of the schema. */
		readonly output: Output;
	}

	/** Infers the input type of a Standard Schema. */
	export type InferInput<Schema extends StandardSchemaV1> = NonNullable<
		Schema['~standard']['types']
	>['input'];

	/** Infers the output type of a Standard Schema. */
	export type InferOutput<Schema extends StandardSchemaV1> = NonNullable<
		Schema['~standard']['types']
	>['output'];
}
export type StandardSchema<TInput = unknown, TOutput = TInput> = StandardSchemaV1<TInput, TOutput>;
