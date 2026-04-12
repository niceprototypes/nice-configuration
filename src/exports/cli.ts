#!/usr/bin/env node
import * as path from "node:path"
import { generate } from "./generate.js"

const targetDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : process.cwd()

try {
  generate(targetDir)
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}