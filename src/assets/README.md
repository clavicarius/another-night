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

## Naming rules

- Use lowercase, kebab-case, or snake_case consistently within a bucket.
- Keep stable IDs separate from file naming conventions.
- Avoid hardcoding file paths outside the asset-specific registry or branding
  imports.
- Reserve new buckets only when they have a distinct asset class or pipeline.

## Notes

- `branding/` is the only place for app logo files.
- `visual/` is the only place for camera-image assets used by the game.
- `ui/`, `audio/`, and `fonts/` are reserved for future additions and should
  stay empty until they are actually needed.
