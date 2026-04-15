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
 * Checks if an id matches a package (exact match or subpath)
 * @param {string} id - The module identifier
 * @param {string} pkg - The package name to match
 * @returns {boolean}
 */
function matchesPackage(id, pkg) {
  return id === pkg || id.startsWith(pkg + '/')
}

/**
 * Determines if a module should be treated as external
 * @param {string} id - The module identifier
 * @param {string[]} [bundlePackages] - nice-* packages to bundle instead of externalize
 * @returns {boolean}
 */
export function isNiceExternal(id, bundlePackages = []) {
  // Check if this package should be bundled instead of externalized
  for (const pkg of bundlePackages) {
    if (matchesPackage(id, pkg)) return false
  }

  // All nice-* packages and any subpath (handles nice-styles/variables.css, etc.)
  if (id.startsWith('nice-')) return true

  // React ecosystem
  if (REACT_PACKAGES.includes(id)) return true

  // styled-components
  if (STYLE_PACKAGES.includes(id)) return true

  return false
}

/**
 * Creates an external function with additional packages and bundle overrides
 * @param {Object} options - Configuration options
 * @param {string[]} [options.additional] - Additional packages to externalize
 * @param {string[]} [options.bundle] - nice-* packages to bundle instead of externalize
 * @returns {function(string): boolean}
 */
export function createExternals(options = {}) {
  // Support legacy array format for backwards compatibility
  const { additional = [], bundle = [] } = Array.isArray(options)
    ? { additional: options, bundle: [] }
    : options

  return (id) => {
    // Check bundle overrides first
    for (const pkg of bundle) {
      if (matchesPackage(id, pkg)) return false
    }
    return isNiceExternal(id) || additional.includes(id)
  }
}
