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

GitHub Pages wird über GitHub Actions veröffentlicht. Jeder Push oder Merge
nach `gh-pages` oder `main` löst das Deployment aus. Der Workflow baut beide
Branches und veröffentlicht die offizielle App aus `gh-pages` unter
[`/`](https://clavicarius.github.io/another-night/) sowie die Preview aus
`main` unter
[`/preview`](https://clavicarius.github.io/another-night/preview/). Dadurch
enthält jedes Pages-Artefakt beide Inhalte. Die offizielle Version wird
ausschließlich aus `gh-pages` erzeugt; Änderungen an `main` verändern sie
nicht. Der Workflow liest die Branches nur und erstellt keine Commits oder
Pushes ins Repository. Die Läufe sind serialisiert, damit gleichzeitige
Aktualisierungen nicht verloren gehen.
Die Preview wird absichtlich nicht auf der Hauptseite angezeigt oder verlinkt.

Das Erstellen eines Versions-Tags aktualisiert die veröffentlichte Version
nicht. Die Workflow-Konfiguration muss in beiden Deployment-Branches
vorhanden sein. In den Repository-Einstellungen muss als Pages-Quelle
„GitHub Actions“ ausgewählt sein.

### Änderungen nach `gh-pages` bringen

Pushes nach `gh-pages` müssen Fast-Forward sein. Das Ruleset
[`.github/rulesets/gh-pages.json`](../.github/rulesets/gh-pages.json) blockiert
Force-Pushes und das Löschen des Branches. Es muss unter Settings → Rules →
Rulesets → Import a ruleset einmalig importiert werden.

Veröffentlichen einer Version:

```
git checkout gh-pages
git pull
git merge --ff-only main   # oder: git cherry-pick <commit>
git push origin gh-pages
```

Alternativ per Pull Request nach `gh-pages`. Bricht `--ff-only` ab, muss
`gh-pages` zuerst in `main` gemergt oder `main` auf `gh-pages` rebased werden.
Ein Rollback erfolgt per `git revert <commit>` und normalem Push.

## Visuelle Referenz

Die kanonische Visual Bible liegt unter:

- [Visual Bible](./visual/README.md)

Sie beschreibt globale Bildsprache, Gebäudekontinuität, Kamerarollen und die
standardisierten Zustände für Bild- und Eventvarianten.

## Asset-Taxonomie

Die strukturierte Ablage für `src/assets` ist dokumentiert in:

- [Asset Taxonomy](../src/assets/README.md)
