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
aktualisieren die Branches `gh-pages` und `gh-preview`. Jeder Push oder Merge
nach `gh-preview` löst das Deployment aus. Bei einem Push auf `gh-pages` oder
`gh-preview` baut der Workflow beide Branches und veröffentlicht die statische
Startseite aus `gh-pages` unter
[`/`](https://clavicarius.github.io/another-night/) sowie das Spiel aus
`gh-preview` unter
[`/preview`](https://clavicarius.github.io/another-night/preview/). Dadurch
enthält jedes Pages-Artefakt beide Inhalte. Der Workflow liest die Branches
nur und erstellt keine Commits oder Pushes ins Repository. Die Läufe sind
serialisiert, damit gleichzeitige Aktualisierungen nicht verloren gehen.
Die Preview wird absichtlich nicht auf der Hauptseite angezeigt oder verlinkt.

Änderungen an `main` deployen nicht automatisch; erst ein Push oder Merge in
`gh-preview` veröffentlicht eine neue Preview. Das Erstellen eines Versions-
Tags aktualisiert die veröffentlichte Version ebenfalls nicht. Die Workflow-
Konfiguration muss in beiden Deployment-Branches vorhanden sein. In den
Repository-Einstellungen muss als Pages-Quelle „GitHub Actions“ ausgewählt sein.

## Visuelle Referenz

Die kanonische Visual Bible liegt unter:

- [Visual Bible](./visual/README.md)

Sie beschreibt globale Bildsprache, Gebäudekontinuität, Kamerarollen und die
standardisierten Zustände für Bild- und Eventvarianten.

## Asset-Taxonomie

Die strukturierte Ablage für `src/assets` ist dokumentiert in:

- [Asset Taxonomy](../src/assets/README.md)
