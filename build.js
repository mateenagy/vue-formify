import * as path from 'path';
import { rollup } from 'rollup';
import fs from 'fs-extra';
import * as Terser from 'terser';
import typescript2 from 'rollup-plugin-typescript2';

const build = async ({ pckg }) => {
	const pkgout = path.join(__dirname, `/dist/`);
	for (const format of ['es', 'umd']) {

		const bundle = await rollup({
			input: path.resolve(__dirname, `./src/packages/${pckg}/index.ts`),
			plugins: [
				typescript2({
					include: path.resolve(__dirname, `./src/packages/${pckg}/index.ts`),
					check: false,
					useTsconfigDeclarationDir: path.resolve(pkgout)
				}),
			]
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
			  })).code;
		  }
		  const outputPath = path.join(pkgout, `vue-formify-${pckg}.${format}.js`);
		  fs.outputFileSync(outputPath, code)
	}
}

build({pckg: 'zod'});
