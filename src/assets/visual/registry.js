import manifest from './manifests/visual_assets.json'

const assetModules = import.meta.glob(['./generated/**/*.png', './source/masters/**/*.png'], {
  eager: true,
  import: 'default',
})

const STATE_ALIASES = {
  disortion: 'distortion',
  distortion: 'distortion',
  normal: 'normal',
  movement: 'movement',
  unknown: 'unknown',
  lost: 'lost',
}

const CAMERA_ID_ALIASES = {
  'cam-01': 'cam01_entrance',
  'cam-02': 'cam02_corridor',
  'cam-03': 'cam03_office',
  'cam-04': 'cam04_basement',
  'cam-05': 'cam05_storage',
  'cam-06': 'cam06_courtyard',
  'cam-07': 'cam07_room4',
}

function normalizeState(state) {
  return STATE_ALIASES[state] ?? state
}

function normalizeCameraId(cameraId) {
  return CAMERA_ID_ALIASES[cameraId] ?? cameraId
}

function resolveAssetPath(relativePath) {
  return assetModules[`./${relativePath}`] ?? null
}

export function getVisualCamera(cameraId) {
  return manifest.cameras[normalizeCameraId(cameraId)] ?? null
}

export function listVisualCameraIds() {
  return manifest.cameraOrder ?? Object.keys(manifest.cameras)
}

export function listVisualStates() {
  return manifest.states ?? ['normal', 'movement', 'distortion', 'unknown', 'lost']
}

export function listVisualVariants(cameraId, state) {
  const camera = getVisualCamera(cameraId)
  if (!camera) return []
  const normalizedState = normalizeState(state)
  return camera.states?.[normalizedState] ?? []
}

export function getVisualAsset(cameraId, state = 'normal', variant = 1) {
  const camera = getVisualCamera(cameraId)
  if (!camera) return null

  const normalizedState = normalizeState(state)
  const stateAssets = camera.states?.[normalizedState] ?? camera.states?.normal ?? []
  const selectedAsset =
    stateAssets.find((entry) => entry.variant === variant) ?? stateAssets[0] ?? null

  if (selectedAsset) {
    const resolved = resolveAssetPath(selectedAsset.path)
    if (resolved) return resolved
  }

  if (camera.master) {
    return resolveAssetPath(camera.master)
  }

  return null
}

export const visualAssetRegistry = {
  manifest,
  listVisualCameraIds,
  listVisualStates,
  listVisualVariants,
  getVisualAsset,
  getVisualCamera,
}
