import type { ExportsConfig } from "./types.js"

const MAX_DESCRIPTION_LINES = 5

function fail(configPath: string, message: string): never {
  throw new Error(`${configPath}: ${message}`)
}

// Validate that a value is a string array, return it or empty array
function asStringArray(value: unknown, fieldName: string, configPath: string): string[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value)) {
    fail(configPath, `"${fieldName}" must be an array of strings`)
  }
  for (let i = 0; i < value.length; i++) {
    if (typeof value[i] !== "string") {
      fail(configPath, `"${fieldName}[${i}]" must be a string, got ${typeof value[i]}`)
    }
  }
  return value as string[]
}

export function validateConfig(raw: unknown, configPath: string): ExportsConfig {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    fail(configPath, "config must be a JSON object")
  }

  const obj = raw as Record<string, unknown>

  // Required: components
  if (!("components" in obj)) {
    fail(configPath, `missing required field "components"`)
  }
  const components = asStringArray(obj.components, "components", configPath)
  if (components.length === 0) {
    fail(configPath, `"components" must contain at least one entry`)
  }

  // Optional: description (string, max 5 lines)
  let description: string | undefined
  if (obj.description !== undefined) {
    if (typeof obj.description !== "string") {
      fail(configPath, `"description" must be a string`)
    }
    const lineCount = obj.description.split("\n").length
    if (lineCount > MAX_DESCRIPTION_LINES) {
      fail(configPath, `"description" exceeds ${MAX_DESCRIPTION_LINES} lines (${lineCount} found). Move long-form content to README.md.`)
    }
    description = obj.description
  }

  // Optional: default (string, must be in components)
  let defaultExport: string | undefined
  if (obj.default !== undefined) {
    if (typeof obj.default !== "string") {
      fail(configPath, `"default" must be a string`)
    }
    if (!components.includes(obj.default)) {
      fail(configPath, `"default" value "${obj.default}" is not listed in "components"`)
    }
    defaultExport = obj.default
  }

  // Optional arrays
  const tokens = asStringArray(obj.tokens, "tokens", configPath)
  const services = asStringArray(obj.services, "services", configPath)
  const constants = asStringArray(obj.constants, "constants", configPath)

  // Validate tokens is a subset of components
  for (const token of tokens) {
    if (!components.includes(token)) {
      fail(configPath, `"tokens" entry "${token}" is not listed in "components"`)
    }
  }

  // Warn about unknown keys
  const knownKeys = new Set(["$schema", "description", "default", "components", "tokens", "services", "constants"])
  for (const key of Object.keys(obj)) {
    if (!knownKeys.has(key)) {
      fail(configPath, `unknown field "${key}"`)
    }
  }

  return {
    ...(description !== undefined && { description }),
    ...(defaultExport !== undefined && { default: defaultExport }),
    components,
    tokens,
    services,
    constants,
  }
}