# Agent-Anweisungen

## Branch-Namenskonvention

- Branches müssen `^(feature|enhancement|bugfix|hotfix|release|chore)\/[a-z0-9._-]+$` entsprechen (z. B. `feature/add-login-page`).
- Keine Großbuchstaben, Backslashes oder leeren Namensteile.
- Der Workflow `validate-branch-name.yml` prüft dies bei Pull Requests; Details in `docs/branch-naming.md`.
