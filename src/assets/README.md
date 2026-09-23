# Asset Taxonomy

`src/assets` is organized by asset type, not by implementation accident.

## Current top-level buckets

- `branding/` for logos, favicon, and other static brand assets
- `visual/` for camera images and their pipeline
- `ui/` for interface icons, HUD pieces, and screen chrome
- `audio/` for music, ambience, and sound effects
- `fonts/` for bundled font files

## `visual/` substructure

- `source/masters/` for canonical master images
- `source/working/` for in-progress variants, masks, and editor inputs
- `generated/` for runtime image assets
- `manifests/` for machine-readable asset metadata

## `fonts/`

Bundled typefaces for the game UI (SIL Open Font License):

- `IBM_Plex_Sans/` — UI and body text
- `IBM_Plex_Mono/` — CCTV overlays, logs, timestamps, and status labels
- `Share_Tech_Mono/` — optional alternative; not wired into the runtime CSS

Only font files referenced via `@font-face` in `src/style.css` are included in
the Vite build. Extra cuts may live in the folder without being shipped.

## Naming rules

- Use lowercase, kebab-case, or snake_case consistently within a bucket.
- Keep stable IDs separate from file naming conventions.
- Avoid hardcoding file paths outside the asset-specific registry or branding
  imports.
- Reserve new buckets only when they have a distinct asset class or pipeline.

## Notes

- `branding/` is the only place for app logo files.
- `visual/` is the only place for camera-image assets used by the game.
- `ui/` and `audio/` are reserved for future additions and should stay empty
  until they are actually needed.
