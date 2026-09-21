import { createEngine } from './engine.js'
import { STORAGE_KEY, nightDefinitions } from './content.js'
import { createSessionState, loadProgress, saveProgress } from './state.js'

export function createGameController(view) {
  const progress = loadProgress()
  const state = createSessionState(progress)
  const engine = createEngine(state, view.render)

  view.bind({
    onStartNight: () => engine.advanceIntro(),
    onChooseAction: (choiceId) => engine.choose(choiceId),
    onSelectCamera: (cameraId) => engine.selectCamera(cameraId),
    onSelectPanel: (panelId) => engine.selectPanel(panelId),
    onNextNight: () => engine.continueToNextNight(),
    onRestartNight: () => engine.restartCurrentNight(),
    onResetProgress: () => {
      window.localStorage.removeItem(STORAGE_KEY)
      Object.assign(state.progress, loadProgress())
      Object.assign(state, createSessionState(state.progress))
      view.render(state)
    },
  })

  return {
    start() {
      saveProgress(progress)
      engine.start()
    },
    getState() {
      return state
    },
    getNightCount() {
      return nightDefinitions.length
    },
  }
}
