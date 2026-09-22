import './style.css'
import favicon from './assets/another-night-favicon.png'
import { createGameController } from './game/controller.js'
import { createGameView } from './game/view.js'

const faviconLink =
  document.querySelector('link[rel="icon"]') || document.createElement('link')
faviconLink.rel = 'icon'
faviconLink.type = 'image/png'
faviconLink.href = favicon
if (!faviconLink.parentNode) {
  document.head.append(faviconLink)
}

const root = document.querySelector('#app')
const view = createGameView(root)
const controller = createGameController(view)

controller.start()
