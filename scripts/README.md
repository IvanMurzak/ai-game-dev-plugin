# scripts/

Maintenance utilities for the `ai-game-dev-plugin` marketplace. Dependency-free, Node 18+.

## `sync-skills.mjs`: keep every copy in sync

- The canonical runbook `plugins/<engine>-mcp/skills/<engine>-game-dev/SKILL.md` is copied to
  `.agents/skills/` (Codex repo-native skills, also read by Cursor and Gemini CLI) and to `skills/`
  (the Gemini CLI extension, whose `gemini-extension.json` sits at the repo root).
- `assets/logo.png` is copied into each `plugins/<engine>-mcp/assets/` (Cursor needs the logo
  inside the plugin).
- Every `version` (catalog entries, plugin manifests, `gemini-extension.json`) must match.

```bash
node scripts/sync-skills.mjs          # write the copies
node scripts/sync-skills.mjs --check  # verify only; exits 1 on drift or a version mismatch
```

Run it after editing a runbook or the logo, and run `--check` before you commit. Never hand-edit
the generated copies.
