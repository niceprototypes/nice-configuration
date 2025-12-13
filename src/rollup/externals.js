/**
 * External dependency detection for nice-* ecosystem
 *
 * Pattern-based matching that handles:
 * - All nice-* packages and subpaths (including CSS imports)
 * - React ecosystem
 * - styled-components
 */

const REACT_PACKAGES = ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime']
const STYLE_PACKAGES = ['styled-components']

/**
 * Determines if a module should be treated as external
 * @param {string} id - The module identifier
 * @returns {boolean}
 */
export function isNiceExternal(id) {
  // All nice-* packages and any subpath (handles nice-styles/variables.css, etc.)
  if (id.startsWith('nice-')) return true

  // React ecosystem
  if (REACT_PACKAGES.includes(id)) return true

  // styled-components
  if (STYLE_PACKAGES.includes(id)) return true

  return false
}

/**
 * Creates an external function with additional packages
 * @param {string[]} additional - Additional packages to externalize
 * @returns {function(string): boolean}
 */
export function createExternals(additional = []) {
  return (id) => isNiceExternal(id) || additional.includes(id)
}
