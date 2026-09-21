import './style.css'
import { createGameController } from './game/controller.js'
import { createGameView } from './game/view.js'

const root = document.querySelector('#app')
const view = createGameView(root)
const controller = createGameController(view)

controller.start()
