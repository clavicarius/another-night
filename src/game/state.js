import { NIGHT_END_MINUTE, STORAGE_KEY, cameraDefinitions, nightDefinitions, sensorDefinitions } from './content.js'

const DEFAULT_PROGRESS = {
  unlockedNight: 1,
  highestCompletedNight: 0,
  discoveredDocuments: [],
  knownFacts: [],
  decisions: {},
  buildingFlags: {},
}

function createBaseCameras() {
  return cameraDefinitions.map((camera, index) => ({
    ...camera,
    status: index === 0 ? 'NORMAL' : 'BEREIT',
    detail: camera.description,
  }))
}

function createBaseSensors() {
  return sensorDefinitions.map((sensor) => ({
    ...sensor,
    value: sensor.id === 'temperature-basement' ? '11' : sensor.id === 'power-grid' ? '100' : 'OK',
    severity: 'normal',
  }))
}

export function loadProgress() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_PROGRESS)
    return {
      ...structuredClone(DEFAULT_PROGRESS),
      ...JSON.parse(raw),
    }
  } catch {
    return structuredClone(DEFAULT_PROGRESS)
  }
}

export function saveProgress(progress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function createSessionState(progress) {
  const availableNightNumber = Math.min(progress.unlockedNight, nightDefinitions.length)
  const nightDefinition =
    nightDefinitions.find((night) => night.number === availableNightNumber) ?? nightDefinitions[0]

  return {
    gameplay: {
      nightNumber: nightDefinition.number,
      phase: 'intro',
      currentMinute: 0,
      ended: false,
      paused: false,
      resources: {
        energy: 100,
        attention: 15,
      },
      buildingState: {
        unknownRoomReferenced: Boolean(progress.buildingFlags.unknownRoomReferenced),
      },
      cameras: createBaseCameras(),
      sensors: createBaseSensors(),
      logs: [],
      eventQueue: [],
      processedEvents: [],
      activeDecision: null,
      decisionHistory: [],
      availableDocuments: [],
      justTriggeredEventId: null,
    },
    ui: {
      selectedCameraId: 'cam-01',
      activePanel: 'log',
      toast: null,
    },
    progress,
    meta: {
      nightDefinition,
      gameDuration: NIGHT_END_MINUTE,
    },
  }
}

export function resetForNight(state, nextNightNumber) {
  const nextNight =
    nightDefinitions.find((night) => night.number === nextNightNumber) ??
    nightDefinitions[nightDefinitions.length - 1]

  const nextState = createSessionState({
    ...state.progress,
    unlockedNight: Math.max(state.progress.unlockedNight, nextNight.number),
  })

  nextState.gameplay.nightNumber = nextNight.number
  nextState.meta.nightDefinition = nextNight
  nextState.ui.selectedCameraId = nextState.gameplay.cameras[0]?.id ?? 'cam-01'

  return nextState
}
