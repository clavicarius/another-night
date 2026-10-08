# Another Night – Technische Informationen

## Entwicklung

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Vor dem Vite-Build wird automatisch `generate:visual-manifest` ausgeführt, damit
`src/assets/visual/manifests/visual_assets.json` dem aktuellen Asset-Stand
entspricht.

Das Projekt ist als vollständig clientseitige Vite-Anwendung aufgebaut und kann über statische Auslieferung (z. B. GitHub Pages) veröffentlicht werden.

## Veröffentlichung auf GitHub Pages

GitHub Pages wird über GitHub Actions veröffentlicht. Externe Prozesse
aktualisieren die Branches `gh-pages` (Hauptversion) und `gh-preview`
(Vorschauversion). Bei einem Push auf einen dieser Branches baut der Workflow
beide Branches und veröffentlicht `gh-pages` unter
[`/`](https://clavicarius.github.io/another-night/) sowie `gh-preview` unter
[`/preview`](https://clavicarius.github.io/another-night/preview/). Dadurch
enthält jedes Pages-Artefakt beide Versionen. Der Workflow liest die Branches
nur und erstellt keine Commits oder Pushes ins Repository. Die Läufe sind
serialisiert, damit gleichzeitige Aktualisierungen nicht verloren gehen.

Änderungen an `main` oder das Erstellen eines Versions-Tags aktualisieren die
veröffentlichte Version nicht. Die Workflow-Konfiguration muss in beiden
Deployment-Branches vorhanden sein. In den Repository-Einstellungen muss als
Pages-Quelle „GitHub Actions“ ausgewählt sein.

## Visuelle Referenz

Die kanonische Visual Bible liegt unter:

- [Visual Bible](./visual/README.md)

Sie beschreibt globale Bildsprache, Gebäudekontinuität, Kamerarollen und die
standardisierten Zustände für Bild- und Eventvarianten.

## Asset-Taxonomie

Die strukturierte Ablage für `src/assets` ist dokumentiert in:

- [Asset Taxonomy](../src/assets/README.md)
