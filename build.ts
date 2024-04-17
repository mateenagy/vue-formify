import * as path from 'path';
import fs from 'fs-extra';
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
			plugins: [
				typescript2({
					include: path.resolve(__dirname, `./packages/${pckg}/*.ts`),
					check: false,
					useTsconfigDeclarationDir: true,
					tsconfig: 'tsconfig.json',
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

// buildPackage({ pckg: 'zod' });
// buildPackage({ pckg: 'yup' });
// buildPackage({ pckg: 'valibot' });
buildPackage({ pckg: 'primevue' });
buildPackage({ pckg: 'element-plus' });
// buildPackage({ pckg: 'ionic-vue' });
// buildPackage({ pckg: 'resolvers' });
