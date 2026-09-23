import { readdir } from 'node:fs/promises'
import path from 'node:path'

export const VISUAL_STATES = ['normal', 'movement', 'distortion', 'unknown', 'lost']

export const VISUAL_CAMERAS = [
  { id: 'cam01_entrance', slug: 'cam01-entrance', displayName: 'Entrance' },
  { id: 'cam02_corridor', slug: 'cam02-corridor', displayName: 'Corridor' },
  { id: 'cam03_office', slug: 'cam03-office', displayName: 'Office' },
  { id: 'cam04_basement', slug: 'cam04-basement', displayName: 'Basement' },
  { id: 'cam05_storage', slug: 'cam05-storage', displayName: 'Storage' },
  { id: 'cam06_courtyard', slug: 'cam06-courtyard', displayName: 'Courtyard' },
  { id: 'cam07_room4', slug: 'cam07-room4', displayName: 'Room 4' },
]

export const STATE_FOLDER_ALIASES = {
  distortion: ['distortion', 'disortion'],
}

const CAMERA_BY_ID = new Map(VISUAL_CAMERAS.map((camera) => [camera.id, camera]))
const CAMERA_BY_SLUG = new Map(VISUAL_CAMERAS.map((camera) => [camera.slug, camera]))

export function getVisualCameraById(cameraId) {
  return CAMERA_BY_ID.get(cameraId) ?? null
}

export function getVisualCameraBySlug(slug) {
  return CAMERA_BY_SLUG.get(slug) ?? null
}

export function normalizeVisualState(state) {
  return state === 'disortion' ? 'distortion' : state
}

export function toPosixPath(relativePath) {
  return relativePath.split(path.sep).join('/')
}

async function readPngEntries(visualRoot, dirPath) {
  const entries = []

  let dirEntries = []
  try {
    dirEntries = await readdir(dirPath, { withFileTypes: true })
  } catch {
    return entries
  }

  for (const entry of dirEntries) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.png')) continue
    const match = entry.name.match(/^v(\d+)\.png$/i)
    if (!match) continue
    entries.push({
      variant: Number(match[1]),
      path: toPosixPath(path.relative(visualRoot, path.join(dirPath, entry.name))),
    })
  }

  entries.sort((left, right) => left.variant - right.variant)
  return entries
}

async function findMasterPath(visualRoot, slug) {
  const mastersDir = path.join(visualRoot, 'source', 'masters')
  let dirEntries = []

  try {
    dirEntries = await readdir(mastersDir, { withFileTypes: true })
  } catch {
    return null
  }

  const candidates = []
  for (const entry of dirEntries) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.png')) continue
    const match = entry.name.match(new RegExp(`^${slug}-normal-v(\\d+)\\.png$`, 'i'))
    if (!match) continue
    candidates.push({
      variant: Number(match[1]),
      path: toPosixPath(path.relative(visualRoot, path.join(mastersDir, entry.name))),
    })
  }

  candidates.sort((left, right) => right.variant - left.variant)
  return candidates[0]?.path ?? null
}

async function collectStateEntries(visualRoot, slug, state) {
  const folderAliases = STATE_FOLDER_ALIASES[state] ?? [state]
  const results = []

  for (const folder of folderAliases) {
    const stateDir = path.join(visualRoot, 'generated', slug, folder)
    const entries = await readPngEntries(visualRoot, stateDir)
    results.push(...entries)
  }

  results.sort((left, right) => left.variant - right.variant || left.path.localeCompare(right.path))
  return results
}

export async function buildVisualManifest(rootDir = process.cwd()) {
  const visualRoot = path.join(rootDir, 'src', 'assets', 'visual')
  const cameras = {}

  for (const camera of VISUAL_CAMERAS) {
    const master = await findMasterPath(visualRoot, camera.slug)
    const states = {}

    for (const state of VISUAL_STATES) {
      states[state] = await collectStateEntries(visualRoot, camera.slug, state)
    }

    cameras[camera.id] = {
      id: camera.id,
      slug: camera.slug,
      displayName: camera.displayName,
      master,
      states,
    }
  }

  return {
    version: 1,
    states: VISUAL_STATES,
    cameraOrder: VISUAL_CAMERAS.map((camera) => camera.id),
    cameras,
  }
}

export function sortManifestKeys(manifest) {
  return {
    ...manifest,
    cameraOrder: [...manifest.cameraOrder],
    states: [...manifest.states],
    cameras: Object.fromEntries(
      Object.entries(manifest.cameras).sort(([left], [right]) => left.localeCompare(right)),
    ),
  }
}
