#!/usr/bin/env node

/**
 * Removes all .vsix files from a target directory. Intended as a pre-build
 * step so publish commands that glob the directory only pick up the freshly
 * built package.
 *
 * Usage:
 *   node scripts/clean-vsix.js [dir]
 *
 * If [dir] is omitted, defaults to "vsix/" relative to cwd.
 */

import {readdirSync, unlinkSync} from "node:fs"
import {join, resolve} from "node:path"

const dir = resolve(process.argv[2] || "vsix")

const vsixFiles = readdirSync(dir).filter(f => f.endsWith(".vsix"))

for(const file of vsixFiles) {
  console.log(`Removing ${file}`)
  unlinkSync(join(dir, file))
}
