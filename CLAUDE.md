# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is vue-formify

A lightweight (~4kb gzipped) type-safe form management library for Vue 3. It provides automatic form value collection, schema validation (Zod, Valibot, ArkType via StandardSchemaV1), nested object/array support, and third-party UI component integration.

## Commands

```bash
# Install dependencies
bun install

# Build (runs tests + oxlint + type-check + vite build)
bun run build

# Build without checks
bun run build:npm

# Run all tests
bun run vitest

# Run tests in watch mode
bun run vitest:hot

# Run a single test file
bunx vitest run src/__tests__/basic/basic.spec.ts

# Lint
bun run oxl:lint       # oxlint (primary, used in CI)
bun run lint           # eslint
bun run lint:fix       # eslint with --fix

# Type check
bun run lint:tsc       # vue-tsc --noEmit
```

CI runs `oxl:lint` and `vitest` on PRs to main.

## Architecture

### Core pattern: Generic factory components

Components (`Form`, `Field`, `FieldArray`, `Error`) are factory functions that accept a generic type parameter and return typed `defineComponent` results. This enables full TypeScript generics propagation from `useForm<T>()` through to component props (e.g., `name` autocompletes all valid nested paths of `T`).

### Source layout (`src/`)

- **`composable/useForm.ts`** — Primary public API. `useForm<T>(options?)` returns typed component instances (`Form`, `Field`, `FieldArray`, `Error`) plus imperative methods (`handleSubmit`, `setError`, `resetForm`, etc.).
- **`composable/useInput.ts`** — Internal composable shared by Field/FieldArray. Manages per-field reactive state (value, error, dirty, touched, valid) in the store.
- **`components/Form.ts`** — Form component factory. Manages form store, provides context via `provide/inject`, handles submit validation.
- **`components/Field.ts`** — Field component factory. Renders `<input>` or custom component via `as` prop or slot. Delegates to `useInput()`.
- **`components/FieldArray.ts`** — Dynamic array field management. Slot exposes `{ fields, add, remove, error }`.
- **`components/Error.ts`** — Error display component. Uses `errorFor` prop to bind to a named field.
- **`utils/store.ts`** — Singleton reactive store (`Record<string, FormStore>`) keyed by form UID.
- **`utils/validator.ts`** — Runs StandardSchemaV1-compliant validators and maps issues to field errors.
- **`utils/types.ts`** — All TypeScript types including `StandardSchemaV1`, `GetKeys<T>` (deep path autocomplete), `FormType`.
- **`utils/utils.ts`** — Path parsing (dot/bracket notation), `mergeDeep`, `EventEmitter`, `flattenObject`.
- **`main.ts`** — Public entry point exporting `useForm`, `useInput`, `FormType`, `InputProps`.

### Key concepts

- **Field paths**: Fields use dot-notation (`user.email`) and bracket notation (`users[0].name`) for nested/array values. The `GetKeys<T>` type generates all valid paths for autocomplete.
- **Validation modes**: `'onSubmit'` (default) validates on submit; `'onChange'` validates live using `EventEmitter` for cross-component coordination.
- **Store structure**: Field values are stored internally as `{ value, error, isDirty, isTouched, isValid, ignore }` objects and flattened when surfaced to the user.
- **StandardSchemaV1**: Vendor-neutral validation interface — any schema library implementing `~standard.validate()` works without adapters.

### Testing

Tests use Vitest with `happy-dom` environment and `@vue/test-utils`. Test files are in `src/__tests__/`. The shared `createComponent()` helper in `src/__tests__/common.ts` mounts a form with Field/Error components for testing.

### Style rules (ESLint)

Tabs for indentation, single quotes, semicolons required, trailing commas, unix line endings.
