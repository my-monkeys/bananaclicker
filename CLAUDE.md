# CLAUDE.md — `bananaclicker`

Mini-jeu clicker minimaliste, Vite + React.

## Stack

- React 18 + Vite 5
- ESM (`"type": "module"`)
- Pas de framework UI, pas de backend
- TypeScript : non (JS pur via `@types/react` pour l'autocomplétion)

## Structure

```
src/             # Code source React
public/          # Assets statiques
scripts/         # Scripts utilitaires (s'il y en a)
index.html       # Entry HTML Vite
vite.config.js
```

## Commandes

```bash
npm install
npm run dev        # Dev server Vite
npm run build      # Build production → dist/
npm run preview    # Preview du build
```

## Notes

- Pas de tests configurés.
- Pas de linter configuré (à ajouter si la complexité grandit).
- `firebase-debug.log` à la racine est un résidu — ignorer ou supprimer, pas de Firebase actif.
- Déployé via le pipeline **monkey** (voir ci-dessous) — fichier `.monkey` présent à la racine.

---

## Déploiement

Via le pipeline **monkey** (GitHub Release → webhook `git.my-monkey.fr` → cookie-server → rsync O2switch). Workflow complet et schéma `.monkey` : voir [`../CLAUDE.md`](../CLAUDE.md) section "Déploiement (.monkey + GitHub Release)".

```bash
# 1. build local (le worker ne build pas server-side)
npm run build              # tarball uploadé doit être déjà bâti

# 2. tarball avec un top-level dir (sinon le worker ne trouve pas .monkey)
PROJECT_NAME=$(basename "$PWD")
cd .. && tar czf /tmp/app.tgz \
  --exclude='.git' --exclude='node_modules' \
  "$PROJECT_NAME"/

# 3. release (target prod = .monkey.target)
gh release create v0.X.Y --repo my-monkeys/<repo> /tmp/app.tgz --title "..."
```

Suivi temps réel : `http://monkey.cookie/` (Tailscale). Détail d'un deploy : `http://monkey.cookie/deploys/<id>`.

## Bonnes pratiques de code

- **Clean code** : noms explicites, fonctions courtes, une responsabilité par composant.
- **Pas d'abstraction prématurée** — on n'extrait qu'au 3ᵉ usage.
- **Pas de commentaires "quoi"** — commenter le **pourquoi** non évident uniquement.
- **Pas de défensive coding inutile** : valider aux frontières utilisateur (clics, inputs).
- **Pas de feature flags/dead code "au cas où"**.

## Architecture

- Garder les fichiers sous **~500 lignes**.
- Séparer composants présentation / état / utilitaires.
- Constantes nommées plutôt que magic numbers (taux de prod, prix d'upgrade, etc.).

## Git workflow

- **Une feature = une branche** : `feat/...`, `fix/...`, `chore/...`.
- **Commits réguliers** à chaque palier fonctionnel.
- **Conventional Commits** : `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.
- Jamais de commit "WIP" sur `main`.
- `git pull --rebase` pour les branches courtes.
- **Pas de secrets** dans les commits.
