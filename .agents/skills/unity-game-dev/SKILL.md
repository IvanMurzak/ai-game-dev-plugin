---
name: unity-game-dev
description: Use when the user wants to create, set up, or open a Unity project with AI assistance, install the Unity-MCP plugin, or connect Unity to ai-game.dev. Covers project creation, plugin install, login, and opening the editor via unity-mcp-cli.
---

# Unity — AI Game Dev runbook

This skill teaches your AI coding assistant (Claude Code or Codex CLI) to drive **Unity** fully
automatically through the `unity-mcp-cli` npm package. The goal: take the user from nothing to a
running Unity Editor that is **connected to [ai-game.dev](https://ai-game.dev)** so the AI can
build the game for them.

Every command runs via `npx` so nothing needs to be installed globally:

```bash
npx -y unity-mcp-cli@latest <command> [args]
```

## Prerequisites (check first)

- **Node.js 18+** — `node --version`.
- **Unity Hub + a Unity Editor** installed (e.g. Unity 6). `create-project` uses **Unity Hub**
  to scaffold and to resolve the editor version; the requested version must be installed.
- **A free ai-game.dev account** — the `login` step authorizes the project against the cloud.
- **Windows / macOS / Linux** with a real desktop session (the editor opens a window).

## The automatic end-to-end sequence

Run these **in order**. Do not skip the ordering rule around `close → login → open`.

### 1. Create the project (fresh start only)

Skip this step if the user already has a project — go straight to step 2 pointing at it.

```bash
npx -y unity-mcp-cli@latest create-project "C:/Games/MyGame" --unity 6000.0.0f1
```

- `create-project <path>` scaffolds a new Unity project at `<path>` via Unity Hub.
- `--unity <version>` selects the installed editor version (must be installed in the Hub).

**Verify:** the `<path>` now contains `Assets/`, `Packages/`, and `ProjectSettings/`.

### 2. Install the Unity-MCP plugin

```bash
npx -y unity-mcp-cli@latest install-plugin "C:/Games/MyGame"
```

Patches `Packages/manifest.json` to add the Unity-MCP package so the editor can expose its
tools to the cloud AI. **Verify:** `Packages/manifest.json` now references the AI Game Developer
package.

### 3. Close the editor before logging in

```bash
npx -y unity-mcp-cli@latest close "C:/Games/MyGame"
# add --force if the editor won't exit cleanly
```

**This ordering is critical.** The editor must **not** be running when you log in, because it
reads the auth token from the project's `UserSettings` only at startup. If it is already open it
would run with a stale (or missing) token. Always `close` before `login`. Use `--force` only if
a normal close fails.

### 4. Log in (interactive — device-code OAuth)

```bash
npx -y unity-mcp-cli@latest login "C:/Games/MyGame"
```

- Starts a **device-code OAuth flow** against ai-game.dev. The command prints a **verification
  URL** and a **user code**.
- **Tell the user** to open the printed URL in a browser and enter the code to authorize.
- On success the CLI writes into `<path>/UserSettings/AI-Game-Developer-Config.json`:
  - `cloudToken: <token>`
  - `connectionMode: "Cloud"`
- **Wait for the command to report success** before continuing.

### 5. Open the editor (auto-connects)

```bash
npx -y unity-mcp-cli@latest open "C:/Games/MyGame"
```

Launches the Unity Editor. Because the project config is now in **Cloud** mode with a token, the
plugin **auto-connects** to ai-game.dev on startup — no extra flag needed. Run `open` **only
after a successful `login`.**

### 6. Confirm the connection

```bash
npx -y unity-mcp-cli@latest wait-for-ready "C:/Games/MyGame"
```

Blocks until the editor has actually booted **and connected** to the cloud. **Do not tell the
user the setup succeeded until this passes.** If it times out, see Troubleshooting.

### 7. Wire your AI assistant to the project's MCP tools

Register the project's MCP server with the coding assistant you are running as, so it can call
the engine's tools directly (create GameObjects, edit scenes, attach components, etc.). Pass the
target that matches your assistant — **`claude-code`** for Claude Code, **`codex`** for Codex CLI.
Run **only** the line that matches you:

```bash
# If you are Claude Code:
npx -y unity-mcp-cli@latest setup-mcp claude-code "C:/Games/MyGame"
# If you are Codex CLI:
npx -y unity-mcp-cli@latest setup-mcp codex        "C:/Games/MyGame"
```

The same CLI also exposes `setup-skills <claude-code|codex>` if you want to (re)install this
runbook into the assistant's own skills directory. After wiring MCP, drive the game build through
those tools.

### Anytime: check status

```bash
npx -y unity-mcp-cli@latest status "C:/Games/MyGame"
```

Reports whether the editor is running, logged in, and connected.

## One-shot summary

```bash
# 1. create (fresh only)   2. install   3. close   4. login   5. open   6. verify   7. wire MCP
npx -y unity-mcp-cli@latest create-project "C:/Games/MyGame" --unity 6000.0.0f1
npx -y unity-mcp-cli@latest install-plugin  "C:/Games/MyGame"
npx -y unity-mcp-cli@latest close           "C:/Games/MyGame"
npx -y unity-mcp-cli@latest login           "C:/Games/MyGame"   # interactive: open URL + code
npx -y unity-mcp-cli@latest open            "C:/Games/MyGame"
npx -y unity-mcp-cli@latest wait-for-ready  "C:/Games/MyGame"
npx -y unity-mcp-cli@latest setup-mcp <your-agent> "C:/Games/MyGame"   # <your-agent> = claude-code OR codex
```

## Troubleshooting

- **`create-project` fails / version not found** — the requested Unity version isn't installed
  in Unity Hub. Install it in the Hub (or pass a version that is) and retry.
- **`login` never completes** — the user has not finished the browser step. Re-print the
  verification URL and user code and wait. Ensure the ai-game.dev account is verified.
- **`open` doesn't connect** — login didn't persist. `close`, re-run `login`, confirm
  `UserSettings/AI-Game-Developer-Config.json` has `cloudToken` and `connectionMode: "Cloud"`,
  then `open` again.
- **`wait-for-ready` times out** — Unity may still be importing packages/compiling on first
  launch (can take minutes). Wait and re-run. Check `status`.
- **Editor won't close** — add `--force` to `close`.
- **Editor opened before login** — `close` it, run `login`, then `open` again so the fresh token
  is picked up at startup.

## Golden rules

1. Always **`close` before `login`**, and **`open` only after a successful `login`**.
2. Never declare success until **`wait-for-ready`** passes.
3. `login` is **interactive** — always relay the verification URL + code to the user and wait.
4. Unity **auto-connects** on `open` when the config is in Cloud mode with a token — no URL flag.

Learn more at **[ai-game.dev](https://ai-game.dev)**.
