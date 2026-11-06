# AGENTS.md

Instructions for AI coding agents working **inside this repository** (read natively by Codex CLI
and Claude Code).

## What this repo is

`ai-game-dev-plugin` is a **marketplace of game-dev plugins/skills** for AI coding agents —
**Unreal, Unity & Godot**, one plugin each. Every plugin ships a single **skill** (a runbook) that
teaches the agent to drive that engine's official npm CLI (`unreal-mcp-cli`, `unity-mcp-cli`,
`godot-cli`) so the agent can take a user from _nothing_ to a running editor **connected to
[ai-game.dev](https://ai-game.dev)** — creating the project, installing the engine plugin, logging
in, and opening the editor, automatically.

It targets **Claude Code, Codex, Cursor and Gemini CLI** from one source tree. A separate package,
`plugins/ai-game-dev/`, is the **OpenAI plugin directory** submission (ChatGPT and Codex): one remote
MCP connection to `https://ai-game.dev/mcp` (OAuth) plus the three runbooks.

## Layout

```
.claude-plugin/marketplace.json            # Claude Code marketplace catalog
.agents/plugins/marketplace.json           # Codex marketplace catalog
.cursor-plugin/marketplace.json            # Cursor marketplace catalog
gemini-extension.json                      # Gemini CLI extension (the whole repo is one extension)
.agents/skills/<engine>-game-dev/SKILL.md  # Codex repo-native skills (GENERATED, do not hand-edit)
skills/<engine>-game-dev/SKILL.md          # Gemini extension skills (GENERATED, do not hand-edit)
plugins/<engine>-mcp/
  .claude-plugin/plugin.json               # Claude Code plugin manifest
  .codex-plugin/plugin.json                # Codex plugin manifest
  .cursor-plugin/plugin.json               # Cursor plugin manifest (logo: assets/logo.png)
  plugin.json                              # Agent Plugins open-standard manifest (GitHub Copilot)
  skills/<engine>-game-dev/SKILL.md        # CANONICAL runbook, shared by every agent
  assets/logo.png                          # plugin logo (copy of the root assets/logo.png)
  README.md                                # per-plugin readme (agent-neutral)
plugins/ai-game-dev/                       # OpenAI plugin-directory package (not in the catalogs)
  plugin.json                              # Agent Plugins manifest + extensions.com.openai (listing, review)
  mcp.json                                 # the one remote MCP server, OAuth via Dynamic Client Registration
  skills/<engine>-game-dev/SKILL.md        # GENERATED copies of the three runbooks
  assets/logo.png                          # GENERATED copy of the root assets/logo.png
scripts/sync-skills.mjs                    # regenerates the skill copies, checks versions
scripts/build-openai-zip.mjs               # validates plugins/ai-game-dev, builds dist/*.zip for upload
assets/                                    # README images (banner, demo, logo)
```

`<engine>` is one of `unreal`, `unity`, `godot`; plugin names are `<engine>-mcp`.

Where new files go:
- Runbook changes: only the canonical `plugins/<engine>-mcp/skills/<engine>-game-dev/SKILL.md`, then sync.
- A new engine plugin: `plugins/<engine>-mcp/` with the same shape, registered in **all three**
  marketplace catalogs and in the `ENGINES` list of `scripts/sync-skills.mjs`.
- Everything under `plugins/<engine>-mcp/` ships to users; keep repo-only notes out of it.
- A release bumps every `version` (catalog entries, plugin manifests, `gemini-extension.json`,
  `plugins/ai-game-dev/plugin.json`); `sync-skills.mjs --check` fails if one is missed.
- OpenAI listing text, review test cases and release notes: `plugins/ai-game-dev/plugin.json`, then
  `node scripts/build-openai-zip.mjs --check`. Never put reviewer credentials or instructions there
  (they go in the OpenAI dashboard); the ZIP is built only with a real `--demo-url`.
- Maintenance scripts: `scripts/` (dependency-free, Node 18+).

## Single source of truth for the skill bodies

- The **canonical** runbook for each engine is `plugins/<engine>-mcp/skills/<engine>-game-dev/SKILL.md`.
  The Claude Code, Codex and Cursor plugins all load the plugin's own `skills/` directory, so they
  share that one file.
- The copies under `.agents/skills/` (Codex), `skills/` (Gemini CLI) and
  `plugins/ai-game-dev/skills/` (OpenAI directory) are **generated** by `scripts/sync-skills.mjs`.
  **Never hand-edit them.**
- After editing any canonical `SKILL.md`, run:

  ```bash
  node scripts/sync-skills.mjs          # regenerate the generated copies
  node scripts/sync-skills.mjs --check  # verify no drift (exits non-zero on drift)
  ```

## The one thing that differs per agent

The runbooks are agent-neutral except the agent id in the **wire-MCP** and **skills** steps
(`claude-code`, `codex`, `cursor`, `gemini`); see those steps in each runbook.

## Flow rules

The order is create → install → login → close → open → wait-for-ready → wire-MCP. Each runbook's
**Golden rules** section is the one place that explains why; change the flow there, not here.

## Contributing

Keep changes focused on the create → install → login → open → connect story, keep every JSON file
valid, run `node scripts/sync-skills.mjs --check` before committing, and match the existing skill
structure. Engine-CLI behavior itself lives in other repos — don't reinvent it here.
