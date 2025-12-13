/**
 * Rollup configuration factory for nice-* packages
 */

import { isNiceExternal, createExternals } from './externals.js'

/**
 * Creates a standard rollup configuration for nice-* packages
 *
 * @param {Object} options
 * @param {string} [options.input='src/index.ts'] - Entry point
 * @param {Object} [options.output] - Custom output config (merged with defaults)
 * @param {Function[]} [options.plugins] - Plugins array (required - allows consumer to control plugin instances)
 * @param {string[]} [options.additionalExternals] - Extra packages to externalize
 * @param {boolean} [options.dts=true] - Generate declaration bundle
 * @param {string} [options.dtsInput] - Custom input for dts (default: dist/esm/types/index.d.ts)
 * @returns {Object[]} Rollup configuration array
 */
export function createConfig(options = {}) {
  const {
    input = 'src/index.ts',
    output = {},
    plugins = [],
    additionalExternals = [],
    dts = true,
    dtsInput = 'dist/esm/types/index.d.ts',
    dtsPlugin = null,
  } = options

  if (!plugins.length) {
    throw new Error('nice-config: plugins array is required. Import and pass your rollup plugins.')
  }

  const external = additionalExternals.length
    ? createExternals(additionalExternals)
    : isNiceExternal

  const configs = [
    {
      input,
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
      plugins,
      external,
    },
  ]

  if (dts && dtsPlugin) {
    configs.push({
      input: dtsInput,
      output: [{ file: 'dist/index.d.ts', format: 'esm' }],
      plugins: [dtsPlugin],
    })
  }

  return configs
}
