import * as path from 'path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { rollup } from 'rollup';
import typescript2 from 'rollup-plugin-typescript2';
import * as Terser from 'terser';

type BuildData = {
	pckg: string;
}

const buildPackage = async ({ pckg }: BuildData) => {
	const pckgout = path.join(__dirname, `/packages/${pckg}/dist/`);

	for (const format of ['es', 'umd']) {
		const bundle = await rollup({
			input: path.resolve(__dirname, `./packages/${pckg}/index.ts`),
			output: { file: path.join(__dirname, `/packages/${pckg}/dist/index.d.ts`), format: 'es' },
			external: [
				'vue-formify',
				'yup',
				'zod',
				'valibot',
				'joi',
				'element-plus',
				'radix-vue',
				'@ionic/vue',
				'primevue/*',
			],
			plugins: [
				typescript2({
					include: path.resolve(__dirname, `./packages/${pckg}/*.ts`),
					check: false,
					useTsconfigDeclarationDir: true,
					tsconfig: path.join(__dirname, '/tsconfig.json'),
					tsconfigOverride: {
						compilerOptions: {
							declaration: true,
							outDir: pckgout,
							declarationDir: pckgout,
						},
					},
				}),
			],
		});

		let {
			output: [{ code }],
		} = await bundle.generate({
			exports: 'named',
			globals: {
				vue: 'Vue',
			},
		});
		if (format === 'umd') {
			code = (await Terser.minify(code, {
				compress: true,
				mangle: true,
			})).code as string;
		}
		const outputPath = path.join(pckgout, `vue-formify-${pckg}.${format}.js`);
		fs.outputFileSync(outputPath, code);
	}
};

inquirer
	.prompt([
		{
			type: 'checkbox',
			name: 'packages',
			message: 'Choose which packages you want to build:',
			choices: [
				{
					name: 'Zod',
					value: 'zod',
				},
				{
					name: 'Yup',
					value: 'yup',
				},
				{
					name: 'Valibot',
					value: 'valibot',
				},
				{
					name: 'Joi',
					value: 'joi',
				},
				{
					name: 'Primevue',
					value: 'primevue',
				},
				{
					name: 'Element Plus',
					value: 'element-plus',
				},
				{
					name: 'Ionic Vue',
					value: 'ionic-vue',
				},
				{
					name: 'Radix Vue',
					value: 'radix-vue',
				},
				{
					name: 'Resolvers',
					value: 'resolvers',
				},
			],
		},
	])
	.then((answers) => {
		answers.packages.forEach((pckg: string) => {
			buildPackage({ pckg }).then(() => {
				console.log(`${pckg} build finished successfully`);
				
			});
		});
	})
	.catch((error) => {
		if (error.isTtyError) {
			// Prompt couldn't be rendered in the current environment
		} else {
			// Something else went wrong
		}
	});
