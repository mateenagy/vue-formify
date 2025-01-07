export type TypedSchema<TInput = Record<string, any>, TOutput = Record<string, any>> = {
	parse: (value: TInput) => Promise<{value?: TOutput, errors: Record<string,any>}>;
	cast?: () => void;
}
