import { branding } from '../branding.js'
import { formatMinute } from './engine.js'

const appVersion = import.meta.env.VITE_VERSION_TAG || 'development'

function createMeter(value) {
  return `
    <div class="meter" aria-hidden="true">
      <div class="meter__fill" style="width: ${value}%"></div>
    </div>
  `
}

function renderCameraTabs(cameras, selectedCameraId) {
  return cameras
    .map(
      (camera) => `
        <button
          class="camera-tab ${camera.id === selectedCameraId ? 'is-active' : ''}"
          data-action="camera"
          data-camera-id="${camera.id}"
        >
          <span>${camera.name}</span>
          <small>${camera.location}</small>
        </button>
      `,
    )
    .join('')
}

function renderCameraFeed(camera) {
  return `
    <div class="camera-feed camera-feed--${camera.status.toLowerCase().replaceAll(' ', '-')}">
      <img class="camera-feed__image" alt="" />
      <div class="camera-feed__overlay" aria-hidden="true"></div>
      <div class="camera-feed__noise" aria-hidden="true"></div>
      <div class="camera-feed__meta">
        <span>${camera.name}</span>
        <span>${camera.location}</span>
      </div>
      <div class="camera-feed__body">
        <strong>${camera.status}</strong>
        <p>${camera.detail}</p>
      </div>
    </div>
  `
}

function renderSensors(sensors) {
  return sensors
    .map(
      (sensor) => `
        <li class="sensor sensor--${sensor.severity}">
          <span>${sensor.label}</span>
          <small>${sensor.location}</small>
          <strong>${sensor.value}${sensor.unit}</strong>
        </li>
      `,
    )
    .join('')
}

function renderLogs(logs) {
  return logs
    .map((entry) => `<li>${entry}</li>`)
    .join('')
}

function renderDocuments(state) {
  const documents = state.meta.nightDefinition.documents.filter((document) =>
    state.progress.discoveredDocuments.includes(document.id) ||
    state.gameplay.availableDocuments.includes(document.id),
  )

  if (!documents.length) {
    return '<p class="panel-empty">Noch keine Dokumente gesichert.</p>'
  }

  return documents
    .map(
      (document) => `
        <article class="document-card">
          <h4>${document.title}</h4>
          <p>${document.body}</p>
        </article>
      `,
    )
    .join('')
}

function renderFacts(facts) {
  if (!facts.length) {
    return '<p class="panel-empty">Bisher nur Routine. Oder etwas, das so aussieht.</p>'
  }

  return `
    <ul class="fact-list">
      ${facts.map((fact) => `<li>${fact}</li>`).join('')}
    </ul>
  `
}

function renderDecision(decision) {
  if (!decision) {
    return `
      <section class="decision-card decision-card--idle">
        <h3>Entscheidungen</h3>
        <p>Warte auf ein Ereignis, das eine Reaktion erfordert.</p>
      </section>
    `
  }

  return `
    <section class="decision-card">
      <p class="eyebrow">Reaktion erforderlich</p>
      <h3>${decision.message}</h3>
      <div class="decision-options">
        ${decision.choices
          .map(
            (choice) => `
              <button data-action="choice" data-choice-id="${choice.id}">
                ${choice.label}
              </button>
            `,
          )
          .join('')}
      </div>
    </section>
  `
}

function renderSummary(state) {
  const nextUnlocked = state.progress.highestCompletedNight < 2
  return `
    <section class="summary-card">
      <p class="eyebrow">Schicht abgeschlossen</p>
      <h2>${state.meta.nightDefinition.title}</h2>
      <p>${state.meta.nightDefinition.outro}</p>
      <div class="summary-actions">
        ${
          nextUnlocked
            ? '<button data-action="next-night">Nächste Nacht starten</button>'
            : ''
        }
        <button data-action="restart-night">Aktuelle Nacht neu starten</button>
      </div>
    </section>
  `
}

export function createGameView(root) {
  const handlers = {
    onStartNight: () => {},
    onChooseAction: () => {},
    onSelectCamera: () => {},
    onSelectPanel: () => {},
    onNextNight: () => {},
    onRestartNight: () => {},
    onResetProgress: () => {},
  }

  root.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]')
    if (!target) return

    const action = target.dataset.action

    if (action === 'start-night') handlers.onStartNight()
    if (action === 'choice') handlers.onChooseAction(target.dataset.choiceId)
    if (action === 'camera') handlers.onSelectCamera(target.dataset.cameraId)
    if (action === 'panel') handlers.onSelectPanel(target.dataset.panelId)
    if (action === 'next-night') handlers.onNextNight()
    if (action === 'restart-night') handlers.onRestartNight()
    if (action === 'reset-progress') handlers.onResetProgress()
  })

  return {
    bind(nextHandlers) {
      Object.assign(handlers, nextHandlers)
    },
    render(state) {
      const selectedCamera =
        state.gameplay.cameras.find((camera) => camera.id === state.ui.selectedCameraId) ??
        state.gameplay.cameras[0]

      root.innerHTML = `
        <div class="shell" style="--brand-watermark: url('${branding.emblem}')">
          <div class="shell-watermark" aria-hidden="true"></div>
          <header class="topbar">
            <div class="topbar__brand">
              <img class="topbar__logo" src="${branding.favicon}" alt="Another Night" />
              <div>
                <p class="eyebrow">Another Night</p>
                <h1>${state.meta.nightDefinition.title}</h1>
              </div>
            </div>
            <div class="topbar__status">
              <div class="status-box">
                <span>Zeit</span>
                <strong>${formatMinute(state.gameplay.currentMinute)}</strong>
              </div>
              <div class="status-box">
                <span>Phase</span>
                <strong>${state.gameplay.phase === 'intro' ? 'Briefing' : state.gameplay.ended ? 'Abschluss' : 'Überwachung'}</strong>
              </div>
            </div>
          </header>

          <section class="overview">
            <article class="resource-card">
              <div class="resource-card__row">
                <span>Energie</span>
                <strong>${state.gameplay.resources.energy}%</strong>
              </div>
              ${createMeter(state.gameplay.resources.energy)}
            </article>
            <article class="resource-card">
              <div class="resource-card__row">
                <span>Aufmerksamkeit</span>
                <strong>${state.gameplay.resources.attention}%</strong>
              </div>
              ${createMeter(state.gameplay.resources.attention)}
            </article>
            <article class="resource-card resource-card--briefing">
              <span>Ziel</span>
              <strong>Bis 06:00 Uhr durchhalten</strong>
              <small>Das Spiel pausiert nicht. Reagiere nur, wenn du es verantworten kannst.</small>
            </article>
          </section>

          ${
            state.gameplay.phase === 'intro'
              ? `
                <section class="intro-card">
                  <img class="intro-card__logo" src="${branding.appLogo}" alt="Another Night" />
                  ${
                    state.meta.nightDefinition.teaser
                      ? `
                        <article class="teaser-card">
                          <p class="eyebrow">${state.meta.nightDefinition.teaser.title}</p>
                          ${state.meta.nightDefinition.teaser.lines.map((line) => `<p>${line}</p>`).join('')}
                        </article>
                      `
                      : ''
                  }
                  <p>${state.meta.nightDefinition.intro}</p>
                  <ul>
                    ${state.meta.nightDefinition.briefing.map((item) => `<li>${item}</li>`).join('')}
                  </ul>
                  <div class="intro-card__actions">
                    <button data-action="start-night">Schicht beginnen</button>
                    <button class="button-secondary" data-action="reset-progress">Fortschritt zurücksetzen</button>
                  </div>
                </section>
              `
              : ''
          }

          ${
            state.gameplay.phase !== 'intro'
              ? `
                <main class="grid">
                  <section class="monitor">
                    <div class="camera-tabs">
                      ${renderCameraTabs(state.gameplay.cameras, selectedCamera.id)}
                    </div>
                    ${renderCameraFeed(selectedCamera)}
                    ${renderDecision(state.gameplay.activeDecision)}
                  </section>

                  <aside class="sidebar">
                    <section class="panel">
                      <div class="panel__tabs">
                        <button class="${state.ui.activePanel === 'log' ? 'is-active' : ''}" data-action="panel" data-panel-id="log">Log</button>
                        <button class="${state.ui.activePanel === 'documents' ? 'is-active' : ''}" data-action="panel" data-panel-id="documents">Dokumente</button>
                        <button class="${state.ui.activePanel === 'facts' ? 'is-active' : ''}" data-action="panel" data-panel-id="facts">Hinweise</button>
                      </div>
                      <div class="panel__body">
                        ${
                          state.ui.activePanel === 'log'
                            ? `<ul class="log-list">${renderLogs(state.gameplay.logs)}</ul>`
                            : state.ui.activePanel === 'documents'
                              ? renderDocuments(state)
                              : renderFacts(state.progress.knownFacts)
                        }
                      </div>
                    </section>

                    <section class="panel">
                      <h3>Sensoren</h3>
                      <ul class="sensor-list">
                        ${renderSensors(state.gameplay.sensors)}
                      </ul>
                    </section>

                    <section class="panel">
                      <h3>Letzte Entscheidungen</h3>
                      ${
                        state.gameplay.decisionHistory.length
                          ? `
                            <ul class="decision-history">
                              ${state.gameplay.decisionHistory
                                .map(
                                  (entry) => `
                                    <li>
                                      <strong>${entry.timestamp}</strong>
                                      <span>${entry.label}</span>
                                      <small>${entry.outcome}</small>
                                    </li>
                                  `,
                                )
                                .join('')}
                            </ul>
                          `
                          : '<p class="panel-empty">Noch keine protokollierten Entscheidungen.</p>'
                      }
                    </section>
                  </aside>
                </main>
              `
              : ''
          }

          ${state.gameplay.ended ? renderSummary(state) : ''}

          <footer class="app-footer">
            <small>Version ${appVersion}</small>
          </footer>
        </div>
      `

      const feedImage = root.querySelector('.camera-feed__image')
      if (feedImage && selectedCamera) {
        feedImage.src = selectedCamera.image
        feedImage.alt = `${selectedCamera.name} ${selectedCamera.location}: ${selectedCamera.description}`
      }
    },
  }
}
