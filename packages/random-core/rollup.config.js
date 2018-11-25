import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

const globals = {};

import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        sourcemap: true,
        format: 'cjs',
        globals: globals
      },
      {
        file: pkg.module,
        sourcemap: true,
        format: 'es',
        globals: globals
      },
      {
        file: pkg.iife,
        sourcemap: true,
        format: 'iife',
        name: 'xethya.' + pkg.shortName,
        globals: globals
      }
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      typescript({
        typescript: require('typescript')
      }),
      json({ compact: true })
    ]
  }
];