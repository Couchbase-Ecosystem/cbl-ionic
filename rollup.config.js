import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'dist/esm/index.js',
  output: [
    {
      file: 'dist/plugin.js',
      format: 'iife',
      name: 'capacitorIonicCouchbaseLite',
      globals: {
        '@capacitor/core': 'capacitorExports',
        'cblite': 'cbliteExports'
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: 'dist/plugin.cjs.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  external: ['@capacitor/core', 'cblite'],
  plugins: [
    resolve(), // add the resolve plugin
    commonjs(), // add the commonjs plugin
    typescript(), //add typescript plugin
  ],
};
