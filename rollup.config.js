import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(), // Resolves node_modules imports
    commonjs(), // Converts CommonJS modules to ES6
    peerDepsExternal(),
    typescript({
      tsconfig: './tsconfig.json',
      clean: true
    }),
    postcss()
  ],
  external: ['react', 'react-dom']
} 