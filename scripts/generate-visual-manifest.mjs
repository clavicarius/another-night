import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { buildVisualManifest, sortManifestKeys } from './visual-assets.shared.mjs'

const rootDir = process.cwd()
const manifest = sortManifestKeys(await buildVisualManifest(rootDir))
const manifestPath = path.join(rootDir, 'src', 'assets', 'visual', 'manifests', 'visual_assets.json')

await mkdir(path.dirname(manifestPath), { recursive: true })
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

console.log(`Wrote ${path.relative(rootDir, manifestPath)}`)
