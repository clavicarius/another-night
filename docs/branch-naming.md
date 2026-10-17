# Branch-Namenskonvention

Jeder Pull Request wird vom Workflow `.github/workflows/validate-branch-name.yml` geprüft (Check `Validate branch name`).

## Regel

```regex
^(feature|enhancement|bugfix|hotfix|release|chore)\/[a-z0-9._-]+$
```

Erlaubte Präfixe: `feature/`, `enhancement/`, `bugfix/`, `hotfix/`, `release/`, `chore/`.
Der Rest besteht nur aus Kleinbuchstaben, Ziffern, `.`, `_` und `-`. Ticket-IDs sind optional, z. B. `bugfix/proj-991-nullpointer-fix`.

## Beispiele

Gültig: `feature/add-login-page`, `enhancement/improve-cache-handling`, `bugfix/nullpointer-user-service`, `hotfix/security-header-fix`, `release/v2.4.0`, `chore/update-dependencies`

Ungültig: `Feature/AddLogin`, `fix/login`, `my-branch`, `test123`, `feature/`, `bugfix\windows`

## Required Check

`.github/rulesets/protected-branches.json` definiert einen Ruleset für `main` und `develop`, der den Check `Validate branch name` verlangt. Der Ruleset muss in GitHub unter Settings → Rules → Rulesets importiert werden.

Hinweis: Bestehende offene PRs mit nicht konformen Branch-Namen schlagen fehl; Branch umbenennen und neuen PR öffnen.
