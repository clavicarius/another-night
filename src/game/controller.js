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

  function onKeyDown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    if (state.gameplay.phase === 'intro' || !/^[1-7]$/.test(event.key)) return
    if (event.target?.isContentEditable || event.target?.closest?.('input, textarea, select')) return

    const camera = state.gameplay.cameras[Number(event.key) - 1]
    if (camera) engine.selectCamera(camera.id)
  }

  return {
    start() {
      saveProgress(progress)
      window.addEventListener('keydown', onKeyDown)
      engine.start()
    },
    destroy() {
      window.removeEventListener('keydown', onKeyDown)
      engine.destroy()
    },
    getState() {
      return state
    },
    getNightCount() {
      return nightDefinitions.length
    },
  }
}
