import * as fs from "node:fs"
import * as path from "node:path"
import { validateConfig } from "./validate.js"
import { generateIndexContent } from "./template.js"

export function generate(packageDir: string): void {
  const configPath = path.resolve(packageDir, "package.exports.json")
  const outputPath = path.resolve(packageDir, "src", "index.ts")

  if (!fs.existsSync(configPath)) {
    throw new Error(`No package.exports.json found at ${configPath}`)
  }

  // Read and parse config
  const raw: unknown = JSON.parse(fs.readFileSync(configPath, "utf-8"))

  // Validate config against schema rules
  const config = validateConfig(raw, configPath)

  // Generate index.ts content from validated config
  const content = generateIndexContent(config)

  // Ensure src/ directory exists
  const srcDir = path.resolve(packageDir, "src")
  if (!fs.existsSync(srcDir)) {
    throw new Error(`src/ directory not found at ${srcDir}`)
  }

  fs.writeFileSync(outputPath, content, "utf-8")
  console.log(`Generated ${outputPath}`)
}