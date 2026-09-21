import { NIGHT_END_MINUTE, TICK_INTERVAL_MS, actionDefinitions } from './content.js'
import { resetForNight, saveProgress } from './state.js'

function padTime(value) {
  return value.toString().padStart(2, '0')
}

export function formatMinute(minute) {
  const hours = Math.floor(minute / 60)
  const minutes = minute % 60
  return `${padTime(hours)}:${padTime(minutes)}`
}

function getById(items, id) {
  return items.find((item) => item.id === id)
}

function pushUnique(list, value) {
  if (!list.includes(value)) list.push(value)
}

function addLogs(gameplay, entries = []) {
  for (const entry of entries) {
    gameplay.logs.unshift(entry)
  }
  gameplay.logs = gameplay.logs.slice(0, 40)
}

function applyCameraUpdates(gameplay, cameraUpdates = []) {
  for (const update of cameraUpdates) {
    const camera = getById(gameplay.cameras, update.id)
    if (!camera) continue
    Object.assign(camera, update)
  }
}

function applySensorUpdates(gameplay, sensorUpdates = []) {
  for (const update of sensorUpdates) {
    const sensor = getById(gameplay.sensors, update.id)
    if (!sensor) continue
    Object.assign(sensor, update)
  }
}

function applyBuildingState(gameplay, buildingState = []) {
  for (const update of buildingState) {
    gameplay.buildingState[update.key] = update.value
  }
}

function applyDynamicCamera(gameplay, dynamicCamera) {
  if (!dynamicCamera) return
  const existing = getById(gameplay.cameras, dynamicCamera.id)
  if (existing) {
    Object.assign(existing, dynamicCamera)
    return
  }
  gameplay.cameras.push(dynamicCamera)
}

function applyEffects(state, effects = {}) {
  const { gameplay, progress } = state

  addLogs(gameplay, effects.logs)
  applyCameraUpdates(gameplay, effects.cameraUpdates)
  applySensorUpdates(gameplay, effects.sensorUpdates)
  applyBuildingState(gameplay, effects.buildingState)
  applyDynamicCamera(gameplay, effects.dynamicCamera)

  for (const documentId of effects.discoverDocuments ?? []) {
    pushUnique(gameplay.availableDocuments, documentId)
    pushUnique(progress.discoveredDocuments, documentId)
  }

  for (const fact of effects.knownFacts ?? []) {
    pushUnique(progress.knownFacts, fact)
  }
}

function evaluateCondition(condition, state) {
  const { gameplay, progress } = state

  switch (condition.type) {
    case 'timeAfter':
      return gameplay.currentMinute >= condition.minute
    case 'flagAny':
      return condition.values.some((value) => progress.decisions[value] || gameplay.buildingState[value])
    case 'factKnown':
      return progress.knownFacts.includes(condition.value)
    default:
      return true
  }
}

function canTriggerEvent(event, state) {
  const { gameplay } = state
  if (gameplay.processedEvents.includes(event.id)) return false
  if (event.trigger.minute !== gameplay.currentMinute) return false
  return (event.conditions ?? []).every((condition) => evaluateCondition(condition, state))
}

function applyChoice(state, event, choice) {
  const { gameplay, progress } = state
  const definition = actionDefinitions[choice.id]
  if (definition) {
    gameplay.resources.energy = Math.max(0, Math.min(100, gameplay.resources.energy + definition.energy))
    gameplay.resources.attention = Math.max(0, Math.min(100, gameplay.resources.attention + definition.attention))
    for (const effect of definition.effects) {
      progress.decisions[effect] = true
    }
  }

  progress.decisions[choice.id] = true
  gameplay.decisionHistory.unshift({
    timestamp: formatMinute(gameplay.currentMinute),
    eventId: event.id,
    choiceId: choice.id,
    label: choice.label,
    outcome: choice.outcome,
  })
  gameplay.decisionHistory = gameplay.decisionHistory.slice(0, 10)
  gameplay.activeDecision = null
  addLogs(gameplay, [
    `${formatMinute(gameplay.currentMinute)}  Entscheidung – ${choice.label}`,
    `${formatMinute(gameplay.currentMinute)}  Ergebnis – ${choice.outcome}`,
  ])
  saveProgress(progress)
}

function triggerEvent(state, event) {
  const { gameplay } = state
  gameplay.processedEvents.push(event.id)
  gameplay.justTriggeredEventId = event.id
  applyEffects(state, event.effects)

  if (event.type === 'decision' && event.choices?.length) {
    gameplay.activeDecision = event
  } else {
    gameplay.activeDecision = null
  }
}

function endNight(state) {
  const { gameplay, progress, meta } = state
  gameplay.ended = true
  gameplay.phase = 'summary'
  progress.highestCompletedNight = Math.max(progress.highestCompletedNight, gameplay.nightNumber)
  progress.unlockedNight = Math.min(meta.nightDefinition.number + 1, 2)

  Object.entries(gameplay.buildingState).forEach(([key, value]) => {
    if (value) progress.buildingFlags[key] = value
  })

  saveProgress(progress)
}

export function createEngine(state, render) {
  let timerId = null

  function sync() {
    render(state)
  }

  function processTick() {
    if (state.gameplay.ended || state.gameplay.paused) return
    if (state.gameplay.phase === 'intro') return

    state.gameplay.currentMinute += 1
    state.gameplay.justTriggeredEventId = null

    for (const event of state.meta.nightDefinition.events) {
      if (canTriggerEvent(event, state)) {
        triggerEvent(state, event)
      }
    }

    if (state.gameplay.currentMinute >= NIGHT_END_MINUTE) {
      endNight(state)
    }

    sync()
  }

  return {
    start() {
      sync()
      timerId = window.setInterval(processTick, TICK_INTERVAL_MS)
    },
    advanceIntro() {
      state.gameplay.phase = 'monitoring'
      addLogs(state.gameplay, [
        `00:00  ${state.meta.nightDefinition.title} gestartet`,
        '00:00  Überwachungssystem online',
      ])
      sync()
    },
    choose(choiceId) {
      const event = state.gameplay.activeDecision
      if (!event) return
      const choice = event.choices.find((entry) => entry.id === choiceId)
      if (!choice) return
      applyChoice(state, event, choice)
      sync()
    },
    selectCamera(cameraId) {
      state.ui.selectedCameraId = cameraId
      sync()
    },
    selectPanel(panel) {
      state.ui.activePanel = panel
      sync()
    },
    continueToNextNight() {
      const nextNightNumber = Math.min(state.gameplay.nightNumber + 1, 2)
      const nextState = resetForNight(state, nextNightNumber)
      Object.assign(state, nextState)
      sync()
    },
    restartCurrentNight() {
      const nextState = resetForNight(state, state.gameplay.nightNumber)
      Object.assign(state, nextState)
      sync()
    },
    destroy() {
      if (timerId) window.clearInterval(timerId)
    },
  }
}
