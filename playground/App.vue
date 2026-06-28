<script lang="ts" setup>
import { type } from 'arktype';
import { useForm } from '@/main';

/*---------------------------------------------
/  SCHEMA
/  Validation runs live because mode is 'onChange'.
---------------------------------------------*/
const schema = type({
	username: type.string.atLeastLength(3).configure({ message: 'Username must be at least 3 characters' }),
	email: type.string.atLeastLength(5).configure({ message: 'Email must be at least 5 characters' }),
});

/*---------------------------------------------
/  FORM
/  Starts with VALID initial values, so on mount the form is
/  pristine (not dirty) AND valid — that combination is the whole
/  point of Batch 2.
---------------------------------------------*/
const { Form, Field, Error, reset, setError } = useForm({
	name: 'state-demo',
	mode: 'onChange',
	initialValues: {
		username: 'alice',
		email: 'alice@example.com',
	},
	schema,
});

// Batch 2 demo: set an error WITHOUT touching the field. Validity flips to
// false immediately, but the message stays hidden until the field is dirty
// or the form is submitted (error display is gated, validity is not).
const flagEmail = () => setError('email', 'Flagged invalid programmatically');
</script>

<template>
	<div class="page">
		<header>
			<h1>vue-formify — field state demo</h1>
			<p class="sub">
				Live demonstration of <strong>Batch 1 (isDirty)</strong> and
				<strong>Batch 2 (isValid)</strong>. The form starts with valid initial
				values, so it mounts <em>pristine and valid</em>.
			</p>
		</header>

		<div class="cards">
			<div class="card">
				<h2>Batch 1 — <code>isDirty</code></h2>
				<ul>
					<li>A field with an initial value is <b>not</b> dirty on mount.</li>
					<li>The form is dirty when <b>any single</b> field changes.</li>
					<li>Editing a value back to its initial clears dirty (not sticky).</li>
				</ul>
			</div>
			<div class="card">
				<h2>Batch 2 — <code>isValid</code></h2>
				<ul>
					<li>A pristine form with no errors is <b>valid</b> (independent of dirty).</li>
					<li>Validity is derived purely from error state.</li>
					<li>A field error makes the form invalid — even while pristine.</li>
				</ul>
			</div>
		</div>

		<Form v-slot="{ values, isDirty, isValid }">
			<!-- FORM-LEVEL STATE -->
			<div class="statusbar">
				<span class="badge" :class="isDirty ? 'on' : 'off'">
					form.isDirty: {{ isDirty }}
				</span>
				<span class="badge" :class="isValid ? 'valid' : 'invalid'">
					form.isValid: {{ isValid }}
				</span>
			</div>

			<!-- USERNAME -->
			<Field name="username" v-slot="{ field }">
				<div class="row">
					<label>Username</label>
					<input
						:value="field.value"
						@input="field.onInput"
						@focus="field.onFocus"
						@blur="field.onBlur"
					>
					<div class="field-state">
						<span class="badge sm" :class="field.isDirty ? 'on' : 'off'">dirty: {{ field.isDirty }}</span>
						<span class="badge sm" :class="field.isTouched ? 'on' : 'off'">touched: {{ field.isTouched }}</span>
						<span class="badge sm" :class="field.isValid ? 'valid' : 'invalid'">valid: {{ field.isValid }}</span>
					</div>
					<Error error-for="username" class="error" />
				</div>
			</Field>

			<!-- EMAIL -->
			<Field name="email" v-slot="{ field }">
				<div class="row">
					<label>Email</label>
					<input
						:value="field.value"
						@input="field.onInput"
						@focus="field.onFocus"
						@blur="field.onBlur"
					>
					<div class="field-state">
						<span class="badge sm" :class="field.isDirty ? 'on' : 'off'">dirty: {{ field.isDirty }}</span>
						<span class="badge sm" :class="field.isTouched ? 'on' : 'off'">touched: {{ field.isTouched }}</span>
						<span class="badge sm" :class="field.isValid ? 'valid' : 'invalid'">valid: {{ field.isValid }}</span>
					</div>
					<Error error-for="email" class="error" />
				</div>
			</Field>

			<div class="actions">
				<button type="submit">Submit</button>
				<button type="button" @click="reset()">Reset</button>
				<button type="button" @click="flagEmail">
					Flag email invalid (programmatic)
				</button>
			</div>

			<p class="hint">
				Try: type 2 chars in Username → <code>form.isDirty</code> becomes
				<code>true</code> and that field's <code>isValid</code> becomes
				<code>false</code>. Type the original value back → dirty returns to
				<code>false</code>. Click <em>Flag email invalid</em> while you haven't
				touched the email → <code>isValid</code> flips to <code>false</code> but
				the message only appears after you focus the field or submit.
			</p>

			<pre>{{ values }}</pre>
		</Form>
	</div>
</template>

<style scoped>
.page {
	max-width: 720px;
	margin: 0 auto;
	padding: 2rem 1.25rem 4rem;
	font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
	color: #1f2933;
}

h1 {
	font-size: 1.5rem;
	margin: 0 0 0.25rem;
}

.sub {
	margin: 0 0 1.5rem;
	color: #52606d;
	font-size: 0.9rem;
}

.cards {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
	margin-bottom: 2rem;
}

.card {
	border: 1px solid #e4e7eb;
	border-radius: 10px;
	padding: 1rem 1.25rem;
	background: #f9fafb;
}

.card h2 {
	font-size: 1rem;
	margin: 0 0 0.5rem;
}

.card ul {
	margin: 0;
	padding-left: 1.1rem;
	font-size: 0.85rem;
	color: #3e4c59;
	line-height: 1.5;
}

code {
	background: #eef2f7;
	padding: 0.1em 0.35em;
	border-radius: 4px;
	font-size: 0.85em;
}

.statusbar {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 1.5rem;
	position: sticky;
	top: 0;
	background: #fff;
	padding: 0.5rem 0;
	z-index: 1;
}

.row {
	margin-bottom: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

label {
	font-weight: 600;
	font-size: 0.85rem;
}

input {
	padding: 0.55rem 0.7rem;
	border: 1px solid #cbd2d9;
	border-radius: 8px;
	font-size: 0.95rem;
	max-width: 320px;
}

input:focus {
	outline: 2px solid #3b82f6;
	outline-offset: 0;
	border-color: transparent;
}

.field-state {
	display: flex;
	gap: 0.4rem;
	flex-wrap: wrap;
}

.badge {
	font-size: 0.78rem;
	font-weight: 600;
	padding: 0.2rem 0.55rem;
	border-radius: 999px;
	border: 1px solid transparent;
}

.badge.sm {
	font-size: 0.72rem;
}

.badge.on {
	background: #fff7ed;
	color: #c2410c;
	border-color: #fed7aa;
}

.badge.off {
	background: #f1f5f9;
	color: #64748b;
	border-color: #e2e8f0;
}

.badge.valid {
	background: #ecfdf5;
	color: #047857;
	border-color: #a7f3d0;
}

.badge.invalid {
	background: #fef2f2;
	color: #b91c1c;
	border-color: #fecaca;
}

.error {
	color: #b91c1c;
	font-size: 0.8rem;
	min-height: 1rem;
}

.actions {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
	margin: 1.5rem 0;
}

button {
	padding: 0.5rem 0.9rem;
	border: 1px solid #cbd2d9;
	border-radius: 8px;
	background: #fff;
	font-size: 0.85rem;
	cursor: pointer;
}

button[type='submit'] {
	background: #3b82f6;
	border-color: #3b82f6;
	color: #fff;
}

button:hover {
	filter: brightness(0.97);
}

.hint {
	font-size: 0.82rem;
	color: #52606d;
	line-height: 1.6;
	background: #f9fafb;
	border-left: 3px solid #3b82f6;
	padding: 0.75rem 1rem;
	border-radius: 0 8px 8px 0;
}

pre {
	background: #0f172a;
	color: #e2e8f0;
	padding: 1rem;
	border-radius: 8px;
	font-size: 0.8rem;
	overflow-x: auto;
}
</style>
