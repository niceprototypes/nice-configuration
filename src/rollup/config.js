/**
 * Rollup configuration factory for nice-* packages
 */

import { isNiceExternal, createExternals } from './externals.js'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import dts from 'rollup-plugin-dts'

/**
 * Creates a standard rollup configuration for nice-* packages
 *
 * @param {Object} options
 * @param {string} [options.input='src/index.ts'] - Entry point
 * @param {string} [options.tsconfig='./tsconfig.json'] - Path to tsconfig
 * @param {Object} [options.output] - Custom output config (merged with defaults)
 * @param {Array} [options.plugins] - Override default plugins (escape hatch)
 * @param {string[]} [options.additionalExternals] - Extra packages to externalize
 * @param {string[]} [options.bundlePackages] - nice-* packages to bundle instead of externalize
 * @param {boolean} [options.dts=true] - Generate declaration bundle
 * @param {string} [options.dtsInput='dist/types/index.d.ts'] - Custom input for dts
 * @returns {Object[]} Rollup configuration array
 */
export function createConfiguration(options = {}) {
  const {
    input = 'src/index.ts',
    tsconfig = './tsconfig.json',
    output = {},
    plugins = null,
    additionalExternals = [],
    bundlePackages = [],
    dts: includeDts = true,
    dtsInput = 'dist/types/index.d.ts',
  } = options

  const defaultPlugins = [
    peerDepsExternal(),
    resolve({ browser: true }),
    commonjs(),
    typescript({
      tsconfig,
      sourceMap: true,
      inlineSources: true
    })
  ]

  const external = (additionalExternals.length || bundlePackages.length)
    ? createExternals({ additional: additionalExternals, bundle: bundlePackages })
    : isNiceExternal

  const configs = [
    {
      input,
      cache: false,
      watch: {
        buildDelay: 200,
        clearScreen: false,
        chokidar: {
          awaitWriteFinish: {
            stabilityThreshold: 150,
            pollInterval: 50
          },
          usePolling: true,
          interval: 100
        }
      },
      output: [
        {
          file: 'dist/index.js',
          format: 'cjs',
          sourcemap: true,
          exports: 'named',
          ...output,
        },
        {
          file: 'dist/index.esm.js',
          format: 'esm',
          sourcemap: true,
          exports: 'named',
          ...output,
        },
      ],
      plugins: plugins ?? defaultPlugins,
      external,
    },
  ]

  if (includeDts) {
    configs.push({
      input: dtsInput,
      output: [{ file: 'dist/index.d.ts', format: 'esm' }],
      plugins: [dts()],
    })
  }

  return configs
}
