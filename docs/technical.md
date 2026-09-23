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

## Visuelle Referenz

Die kanonische Visual Bible liegt unter:

- [Visual Bible](./visual/README.md)

Sie beschreibt globale Bildsprache, Gebäudekontinuität, Kamerarollen und die
standardisierten Zustände für Bild- und Eventvarianten.

## Asset-Taxonomie

Die strukturierte Ablage für `src/assets` ist dokumentiert in:

- [Asset Taxonomy](../src/assets/README.md)
