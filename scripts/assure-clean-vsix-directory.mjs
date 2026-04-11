#!/usr/bin/env node

/**
 * Removes all .vsix files from a target directory. Intended as a pre-build
 * step so publish commands that glob the directory only pick up the freshly
 * built package.
 *
 * Usage:
 *   node scripts/assure-clean-vsix-directory.mjs
 */

import {existsSync, mkdirSync, readdirSync, statSync, unlinkSync} from "node:fs"
import {join} from "node:path"

const dir = "vsix"

try {
  if(existsSync(dir)) {
    const stats = statSync(dir)
    if(!stats.isDirectory()) {
      console.error(`'${dir}' is not a directory.`)
      process.exit(1)
    }

    const vsixFiles = readdirSync(dir).filter(f => f.endsWith(".vsix"))
    for(const file of vsixFiles) {
      console.log(`Removing ${file}`)
      unlinkSync(join(dir, file))
    }
  } else {
    mkdirSync(dir)
  }
} catch(error) {
  console.error(error)
  process.exit(1)
}

const vsixFiles = readdirSync(dir).filter(f => f.endsWith(".vsix"))

for(const file of vsixFiles) {
  console.log(`Removing ${file}`)
  unlinkSync(join(dir, file))
}
