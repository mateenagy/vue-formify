import * as path from 'path';
import fs from 'fs-extra';
import { rollup } from 'rollup';
import typescript2 from 'rollup-plugin-typescript2';
import * as Terser from 'terser';

type BuildData = {
	pckg: string;
}

const buildPackage = async ({ pckg }: BuildData) => {
	const pckgout = path.join(__dirname, '/dist/');
	for (const format of ['es', 'umd']) {
		const bundle = await rollup({
			input: path.resolve(__dirname, `./packages/${pckg}/index.ts`),
			plugins: [
				typescript2({
					include: path.resolve(__dirname, `./packages/${pckg}/index.ts`),
					check: false,
					useTsconfigDeclarationDir: true,
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

buildPackage({ pckg: 'zod' });
