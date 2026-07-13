---
name: unreal-game-dev
description: Use when the user wants to create, set up, or open an Unreal Engine project with AI assistance, install the Unreal-MCP plugin, or connect Unreal to ai-game.dev. Covers project creation, plugin install, login, and opening the editor via unreal-mcp-cli.
---

# Unreal Engine — AI Game Dev runbook

This skill teaches your AI coding assistant (Claude Code or Codex CLI) to drive **Unreal
Engine** fully automatically through the `unreal-mcp-cli` npm package. The goal: take the user
from nothing to a running Unreal Editor that is **connected to [ai-game.dev](https://ai-game.dev)**
so the AI can build the game for them.

Every command runs via `npx` so nothing needs to be installed globally:

```bash
npx -y unreal-mcp-cli@latest <command> [args]
```

## Prerequisites (check first)

- **Node.js 18+** — `node --version`.
- **Unreal Engine installed** (e.g. UE 5.7 via the Epic Games Launcher). The CLI drives the
  installed editor; it does not download the engine.
- **A free ai-game.dev account** — the `login` step authorizes the project against the cloud.
- **Windows / macOS / Linux** with a real desktop session (the editor opens a window).

> **Naming rule:** an Unreal **project/module name cannot contain hyphens** (`-`). The folder
> path may contain hyphens, but pass a hyphen-free `--name` (e.g. `MyGame`, not `My-Game`).

## The automatic end-to-end sequence

Run these **in order**. Do not skip the ordering rule around `close → login → open`.

### 1. Create the project (fresh start only)

Skip this step if the user already has a project — go straight to step 2 pointing at it.

```bash
npx -y unreal-mcp-cli@latest create-project "C:/Games/MyGame" --name MyGame --engine 5.7
```

- `create-project <path>` scaffolds a new Unreal project at `<path>`.
- `--name <Name>` sets the project/module name (**no hyphens**).
- `--engine <ver>` picks the installed engine version (e.g. `5.7`).

**Verify:** the `<path>` now contains a `<Name>.uproject` file.

### 2. Install the Unreal-MCP plugin

```bash
npx -y unreal-mcp-cli@latest install-plugin "C:/Games/MyGame"
```

Installs the Unreal-MCP editor plugin into the project so the editor can expose its tools to
the cloud AI. **Verify:** a `Plugins/UnrealMCP` folder now exists in the project.

### 3. Close the editor before logging in

```bash
npx -y unreal-mcp-cli@latest close "C:/Games/MyGame"
```

**This ordering is critical.** The editor must **not** be running when you log in, because the
editor reads the auth token from the project's `.env` only at startup. If it is already open it
would run with a stale (or missing) token. Always `close` before `login`.

### 4. Log in (interactive — device-code OAuth)

```bash
npx -y unreal-mcp-cli@latest login -p "C:/Games/MyGame"
```

- Starts a **device-code OAuth flow** against ai-game.dev. The command prints a **verification
  URL** and a **user code**.
- **Tell the user** to open the printed URL in a browser and enter the code to authorize.
- On success the CLI writes into `<path>/.env`:
  - `UNREAL_MCP_TOKEN=<token>`
  - `UNREAL_MCP_CONNECTION_MODE=Cloud`
- **Wait for the command to report success** before continuing. Do not claim you are logged in
  until it does.

### 5. Open the editor in Cloud mode

```bash
npx -y unreal-mcp-cli@latest open "C:/Games/MyGame" --connection-mode Cloud
```

Launches the Unreal Editor. Because the project's `.env` now has a token and Cloud mode, the
plugin connects to ai-game.dev on startup. Run `open` **only after a successful `login`.**

### 6. Confirm the connection

```bash
npx -y unreal-mcp-cli@latest wait-for-ready -p "C:/Games/MyGame"
```

Blocks until the editor has actually booted **and connected** to the cloud. **Do not tell the
user the setup succeeded until this passes.** If it times out, see Troubleshooting.

### 7. Wire your AI assistant to the project's MCP tools

Register the project's MCP server with the coding assistant you are running as, so it can call
the engine's tools directly (spawn actors, edit the level, run Blueprints, etc.). Pass the target
that matches your assistant — **`claude-code`** for Claude Code, **`codex`** for Codex CLI. Run
**only** the line that matches you:

```bash
# If you are Claude Code:
npx -y unreal-mcp-cli@latest setup-mcp claude-code -p "C:/Games/MyGame"
# If you are Codex CLI:
npx -y unreal-mcp-cli@latest setup-mcp codex        -p "C:/Games/MyGame"
```

The same CLI also exposes `setup-skills <claude-code|codex>` if you want to (re)install this
runbook into the assistant's own skills directory. After wiring MCP, drive the game build through
those tools.

### Anytime: check status

```bash
npx -y unreal-mcp-cli@latest status -p "C:/Games/MyGame"
```

Reports whether the editor is running, logged in, and connected.

## One-shot summary

```bash
# 1. create (fresh only)   2. install   3. close   4. login   5. open   6. verify   7. wire MCP
npx -y unreal-mcp-cli@latest create-project "C:/Games/MyGame" --name MyGame --engine 5.7
npx -y unreal-mcp-cli@latest install-plugin  "C:/Games/MyGame"
npx -y unreal-mcp-cli@latest close           "C:/Games/MyGame"
npx -y unreal-mcp-cli@latest login -p        "C:/Games/MyGame"   # interactive: open URL + code
npx -y unreal-mcp-cli@latest open            "C:/Games/MyGame" --connection-mode Cloud
npx -y unreal-mcp-cli@latest wait-for-ready -p "C:/Games/MyGame"
npx -y unreal-mcp-cli@latest setup-mcp <your-agent> -p "C:/Games/MyGame"   # <your-agent> = claude-code OR codex
```

## Troubleshooting

- **Project name rejected / build fails on module name** — the name contains a hyphen. Use a
  hyphen-free `--name`. The folder path may have hyphens; the module name may not.
- **`login` never completes** — the user has not finished the browser step. Re-print the
  verification URL and user code and wait. Ensure the ai-game.dev account is verified.
- **`open` connects locally / not to Cloud** — you skipped or lost the login. `close`, re-run
  `login`, confirm `.env` has `UNREAL_MCP_TOKEN` and `UNREAL_MCP_CONNECTION_MODE=Cloud`, then
  `open --connection-mode Cloud` again.
- **`wait-for-ready` times out** — the editor may still be compiling the plugin on first launch
  (this can take minutes). Wait and re-run. Check `status` for details.
- **Editor opened before login** — `close` it, run `login`, then `open` again so the fresh token
  is picked up at startup.
- **`npx` cannot find the CLI** — confirm Node 18+ and internet access; `@latest` pulls the
  current published version.

## Golden rules

1. Always **`close` before `login`**, and **`open` only after a successful `login`**.
2. Never declare success until **`wait-for-ready`** passes.
3. Unreal **module/project names have no hyphens**.
4. `login` is **interactive** — always relay the verification URL + code to the user and wait.

Learn more at **[ai-game.dev](https://ai-game.dev)**.
