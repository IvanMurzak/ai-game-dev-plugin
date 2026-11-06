# scripts/

Maintenance utilities for the `ai-game-dev-plugin` marketplace. Dependency-free, Node 18+.

## `sync-skills.mjs`: keep every copy in sync

- The canonical runbook `plugins/<engine>-mcp/skills/<engine>-game-dev/SKILL.md` is copied to
  `.agents/skills/` (Codex repo-native skills, also read by Cursor and Gemini CLI) and to `skills/`
  (the Gemini CLI extension, whose `gemini-extension.json` sits at the repo root).
  It is also copied into `plugins/ai-game-dev/skills/` (the OpenAI plugin-directory package).
- `assets/logo.png` is copied into each `plugins/<engine>-mcp/assets/` and into
  `plugins/ai-game-dev/assets/` (Cursor and OpenAI need the logo inside the plugin).
- Every `version` (catalog entries, plugin manifests, `gemini-extension.json`,
  `plugins/ai-game-dev/plugin.json`) must match.

```bash
node scripts/sync-skills.mjs          # write the copies
node scripts/sync-skills.mjs --check  # verify only; exits 1 on drift or a version mismatch
```

Run it after editing a runbook or the logo, and run `--check` before you commit. Never hand-edit
the generated copies.

## `build-openai-zip.mjs`: the OpenAI plugin-directory ZIP

Validates `plugins/ai-game-dev/` against the OpenAI submission rules and packs it into
`dist/ai-game-dev-openai-<version>.zip` (`dist/` is gitignored), with `plugin.json` at the ZIP root.
Upload that file in the OpenAI Plugins dashboard.

It checks the listing limits, review test cases, icons, the single OAuth MCP server, forbidden keys
(credentials, reviewer instructions, hooks) and secrets, and runs `sync-skills.mjs --check`; each
problem is reported by field. Only git-tracked and untracked-but-not-ignored files are packed.

```bash
node scripts/build-openai-zip.mjs --check                                 # validate only
node scripts/build-openai-zip.mjs --demo-url https://youtu.be/<recording>  # validate and build
```

`review.demo_recording_url` in the repo stays a placeholder until the demo is recorded, and the build
refuses to run until it gets a real HTTPS URL. `--demo-url` writes the URL into the packaged
`plugin.json` only. Reviewer credentials never go into the package: enter them in the dashboard's
**Review details** form.
