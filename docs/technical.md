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

GitHub Pages wird über GitHub Actions veröffentlicht. Pushes auf `gh-pages` oder
`release-preview` lösen ein Deployment aus. Der Workflow baut `gh-pages` als
Hauptversion und legt den Build aus `release-preview` zusätzlich unter
[`/preview`](https://clavicarius.github.io/another-night/preview/) ab. Beide
Versionen werden gemeinsam in einem Pages-Artefakt veröffentlicht; ein Fork ist
dafür nicht erforderlich.

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
