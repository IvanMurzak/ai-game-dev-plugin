# scripts/

Maintenance utilities for the `ai-game-dev-plugin` marketplace. Dependency-free — Node 18+ only.

## `sync-skills.mjs` — keep the two agents' skills in sync

The canonical runbook for each engine lives at
`plugins/<engine>/skills/<engine>-game-dev/SKILL.md`. Both agent plugins ship that same file: the
Claude Code plugin (`.claude-plugin/plugin.json`) and the Codex plugin (`.codex-plugin/plugin.json`)
each reference the plugin's own `./skills/` directory, so the bundles never hold a second copy.

For **repo-native Codex discovery** (a Codex user working inside a clone of this repo, or anyone who
prefers the skills-only install over the marketplace), Codex scans `.agents/skills/` from the
current directory up to the repo root. This script materializes the canonical bodies into
`.agents/skills/<engine>-game-dev/SKILL.md` so those copies stay byte-identical to the source.

### Usage

```bash
# Regenerate the .agents/skills/ copies from the canonical plugin skills:
node scripts/sync-skills.mjs

# Verify the copies are in sync (exits non-zero on drift — use as a manual/CI drift guard):
node scripts/sync-skills.mjs --check
```

### When to run it

Run `node scripts/sync-skills.mjs` any time you edit a canonical
`plugins/<engine>/skills/<engine>-game-dev/SKILL.md`, then commit the regenerated `.agents/skills/`
copies alongside it. Run `node scripts/sync-skills.mjs --check` before opening a PR — it fails if the
canonical source and the generated `.agents/skills/` copies have drifted apart.

**Never hand-edit files under `.agents/skills/`** — they are generated output.
