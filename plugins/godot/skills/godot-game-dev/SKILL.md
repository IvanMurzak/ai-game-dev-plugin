---
name: godot-game-dev
description: Use when the user wants to create, set up, or open a Godot project with AI assistance, install the Godot-MCP addon, or connect Godot to ai-game.dev. Covers project creation, plugin install, login, and opening the editor via godot-cli.
---

# Godot — AI Game Dev runbook

This skill teaches Claude to drive **Godot** fully automatically through the `godot-cli`
npm package. The goal: take the user from nothing to a running Godot Editor that is
**connected to [ai-game.dev](https://ai-game.dev)** so the AI can build the game for them.

Every command runs via `npx` so nothing needs to be installed globally:

```bash
npx -y godot-cli@latest <command> [args]
```

## Prerequisites (check first)

- **Node.js 18+** — `node --version`.
- **Godot 4.x (.NET / Mono build)** installed — the Godot-MCP addon is C#, so use the **Mono**
  editor, not the plain build.
- **.NET SDK** installed — Godot C# projects require it to build (`dotnet --version`).
- **A free ai-game.dev account** — the `login` step authorizes the project against the cloud.
- **Windows / macOS / Linux** with a real desktop session (the editor opens a window).

## The automatic end-to-end sequence

Run these **in order**. Do not skip the ordering rule around `close → login → open`.

### 1. Create the project (fresh start only)

Skip this step if the user already has a project — go straight to step 2 pointing at it.

```bash
npx -y godot-cli@latest create-project "C:/Games/MyGame" --dotnet --name MyGame
```

- `create-project <path>` scaffolds a new Godot 4.x project at `<path>`.
- `--dotnet` makes it a **C# (.NET) project** (required for the Godot-MCP addon).
- `--name <Name>` sets the project name.

**Verify:** the `<path>` now contains `project.godot` and a `.csproj`.

### 2. Install the Godot-MCP addon

```bash
npx -y godot-cli@latest install-plugin "C:/Games/MyGame"
```

Installs the `godot_mcp` addon, adds the required **NuGet pins** to the project's `.csproj`, and
enables the plugin. **Verify:** an `addons/godot_mcp/` folder exists and the plugin is listed as
enabled in `project.godot`.

### 3. Close the editor before logging in

```bash
npx -y godot-cli@latest close "C:/Games/MyGame"
# add --force if the editor won't exit cleanly
```

**This ordering is critical.** The editor must **not** be running when you log in, because it
reads the auth token only at startup. If it is already open it would run with a stale (or
missing) token. Always `close` before `login`. Use `--force` only if a normal close fails.

### 4. Log in (interactive — device-code OAuth)

```bash
npx -y godot-cli@latest login "C:/Games/MyGame"
```

- Starts a **device-code OAuth flow** against ai-game.dev. The command prints a **verification
  URL** and a **user code**.
- **Tell the user** to open the printed URL in a browser and enter the code to authorize.
- On success the CLI persists a **cloud token** into the project so that `open --mode Cloud`
  auto-connects.
- **Wait for the command to report success** before continuing.

### 5. Open the editor in Cloud mode

```bash
npx -y godot-cli@latest open "C:/Games/MyGame" --mode Cloud
```

Launches the Godot Editor. Because the project now holds a cloud token, `--mode Cloud` makes the
addon connect to ai-game.dev on startup. Use **`--mode Cloud`** (not `--url`) to select the cloud
connection. Run `open` **only after a successful `login`.**

### 6. Confirm the connection

```bash
npx -y godot-cli@latest wait-for-ready "C:/Games/MyGame"
```

Blocks until the editor has actually booted **and connected** to the cloud. **Do not tell the
user the setup succeeded until this passes.** If it times out, see Troubleshooting.

### 7. Wire Claude Code to the project's MCP tools

```bash
npx -y godot-cli@latest setup-mcp claude-code "C:/Games/MyGame"
```

Registers the project's MCP server with Claude Code so Claude can call the engine's tools
directly (create nodes, edit scenes, wire signals, etc.). After this, drive the game build
through those tools.

### Anytime: check status

```bash
npx -y godot-cli@latest status "C:/Games/MyGame"
```

Reports whether the editor is running, logged in, and connected.

## One-shot summary

```bash
# 1. create (fresh only)   2. install   3. close   4. login   5. open   6. verify   7. wire MCP
npx -y godot-cli@latest create-project "C:/Games/MyGame" --dotnet --name MyGame
npx -y godot-cli@latest install-plugin  "C:/Games/MyGame"
npx -y godot-cli@latest close           "C:/Games/MyGame"
npx -y godot-cli@latest login           "C:/Games/MyGame"   # interactive: open URL + code
npx -y godot-cli@latest open            "C:/Games/MyGame" --mode Cloud
npx -y godot-cli@latest wait-for-ready  "C:/Games/MyGame"
npx -y godot-cli@latest setup-mcp claude-code "C:/Games/MyGame"
```

## Troubleshooting

- **Build errors / addon won't load** — you're on the plain (non-Mono) Godot build or missing
  the .NET SDK. Use the **.NET/Mono** Godot editor and install the .NET SDK, then retry.
- **`login` never completes** — the user has not finished the browser step. Re-print the
  verification URL and user code and wait. Ensure the ai-game.dev account is verified.
- **`open` connects locally / not to Cloud** — login didn't persist, or you passed `--url`
  instead of `--mode Cloud`. `close`, re-run `login`, then `open --mode Cloud` again.
- **`wait-for-ready` times out** — Godot may still be restoring NuGet packages / building C# on
  first launch. Wait and re-run. Check `status`.
- **Editor won't close** — add `--force` to `close`.
- **Editor opened before login** — `close` it, run `login`, then `open --mode Cloud` again so the
  fresh token is picked up at startup.

## Golden rules

1. Always **`close` before `login`**, and **`open` only after a successful `login`**.
2. Never declare success until **`wait-for-ready`** passes.
3. Use the **.NET/Mono** Godot build; C# projects need the **.NET SDK**.
4. Select the cloud connection with **`--mode Cloud`** — not `--url`.

Learn more at **[ai-game.dev](https://ai-game.dev)**.
