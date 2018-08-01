import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import flow from 'rollup-plugin-flow'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import pkg from './package.json'

const minify = process.env.MINIFY
const format = process.env.FORMAT
const es = format === 'es'
const umd = format === 'umd'
const cjs = format === 'cjs'

let output

if (es) {
  output = { file: `dist/final-form-focus.es.js`, format: 'es' }
} else if (umd) {
  if (minify) {
    output = {
      file: `dist/final-form-focus.umd.min.js`,
      format: 'umd'
    }
  } else {
    output = { file: `dist/final-form-focus.umd.js`, format: 'umd' }
  }
} else if (cjs) {
  output = { file: `dist/final-form-focus.cjs.js`, format: 'cjs' }
} else if (format) {
  throw new Error(`invalid format specified: "${format}".`)
} else {
  throw new Error('no format specified. --environment FORMAT:xxx')
}

export default {
  input: 'src/index.js',
  output: Object.assign(
    {
      name: 'final-form-focus',
      exports: 'named'
    },
    output
  ),
  external: umd
    ? []
    : [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {})
      ],
  plugins: [
    resolve({ jsnext: true, main: true }),
    flow(),
    commonjs({ include: 'node_modules/**' }),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [['env', { modules: false }], 'stage-2'],
      plugins: ['external-helpers']
    }),
    umd
      ? replace({
          'process.env.NODE_ENV': JSON.stringify(
            minify ? 'production' : 'development'
          )
        })
      : null,
    minify ? uglify() : null
  ].filter(Boolean)
}
