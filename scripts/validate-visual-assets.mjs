import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { buildVisualManifest, sortManifestKeys } from './visual-assets.shared.mjs'

const rootDir = process.cwd()
const manifestPath = path.join(rootDir, 'src', 'assets', 'visual', 'manifests', 'visual_assets.json')

const expected = JSON.stringify(sortManifestKeys(await buildVisualManifest(rootDir)), null, 2)
const actual = JSON.stringify(
  sortManifestKeys(JSON.parse(await readFile(manifestPath, 'utf8'))),
  null,
  2,
)

if (actual !== expected) {
  throw new Error(
    [
      'Visual asset manifest is out of sync with the filesystem.',
      `Run \`npm run generate:visual-manifest\` and re-check ${path.relative(rootDir, manifestPath)}.`,
    ].join('\n'),
  )
}

console.log('Visual asset manifest is in sync.')
