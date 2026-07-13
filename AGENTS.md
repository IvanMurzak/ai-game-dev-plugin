# AGENTS.md

Custom instructions for AI coding agents (Codex CLI reads this natively; other agents read it as
extra context) working **inside this repository**.

## What this repo is

`ai-game-dev-plugin` is a **marketplace of game-dev plugins/skills** for AI coding agents —
**Unreal, Unity & Godot**, one plugin each. Every plugin ships a single **skill** (a runbook) that
teaches the agent to drive that engine's official npm CLI (`unreal-mcp-cli`, `unity-mcp-cli`,
`godot-cli`) so the agent can take a user from _nothing_ to a running editor **connected to
[ai-game.dev](https://ai-game.dev)** — creating the project, installing the engine plugin, logging
in, and opening the editor, automatically.

It targets **both Claude Code and Codex CLI** from one source tree.

## Layout

```
.claude-plugin/marketplace.json          # Claude Code marketplace catalog
.agents/plugins/marketplace.json         # Codex marketplace catalog
.agents/skills/<engine>-game-dev/SKILL.md# Codex repo-native skills (GENERATED — do not hand-edit)
plugins/<engine>/
  .claude-plugin/plugin.json             # Claude Code plugin manifest
  .codex-plugin/plugin.json              # Codex plugin manifest
  skills/<engine>-game-dev/SKILL.md      # CANONICAL runbook (shared by both agents' plugins)
  README.md                              # per-plugin readme (agent-neutral)
scripts/sync-skills.mjs                  # regenerates .agents/skills/ from the canonical skills
```

`<engine>` is one of `unreal`, `unity`, `godot`.

## Single source of truth for the skill bodies

- The **canonical** runbook for each engine is `plugins/<engine>/skills/<engine>-game-dev/SKILL.md`.
  Both plugin manifests (`.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`) reference the
  plugin's own `./skills/` directory, so the two agent bundles share that one file — no second copy.
- The repo-native Codex discovery copies under `.agents/skills/` are **generated** from the
  canonical files by `scripts/sync-skills.mjs`. **Never hand-edit `.agents/skills/`.**
- After editing any canonical `SKILL.md`, run:

  ```bash
  node scripts/sync-skills.mjs          # regenerate the .agents/skills/ copies
  node scripts/sync-skills.mjs --check  # verify no drift (exits non-zero on drift)
  ```

## The one thing that differs per agent

The runbooks are agent-neutral except the **wire-MCP** step, which selects the target by the
assistant you are running as:

- **Claude Code** → `npx -y <engine>-cli@latest setup-mcp claude-code "<path>"`
- **Codex CLI** → `npx -y <engine>-cli@latest setup-mcp codex "<path>"`

## Golden rules (do not reorder the flow)

1. Always **`close` before `login`**, and **`open` only after a successful `login`** (the editor
   loads the auth token at startup).
2. Never declare success until **`wait-for-ready`** passes.
3. `login` is **interactive** (device-code OAuth) — relay the verification URL + code to the user
   and wait.
4. Keep all JSON valid and keep the create → install → close → login → open → wait-for-ready →
   wire-MCP ordering intact.

## Contributing

Keep changes focused on the create → install → login → open → connect story, keep every JSON file
valid, run `node scripts/sync-skills.mjs --check` before committing, and match the existing skill
structure. Engine-CLI behavior itself lives in other repos — don't reinvent it here.
