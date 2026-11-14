# Unreal Engine — AI Game Dev (Claude Code, Codex, Cursor and Gemini CLI)

Teach your AI coding agent — **Claude Code**, **OpenAI Codex**, **Cursor** or **Gemini CLI** — to drive **Unreal Engine**
end to end through the [`unreal-mcp-cli`](https://www.npmjs.com/package/unreal-mcp-cli) npm package,
so you can build a game in Unreal by just asking. Part of the
[`ai-game-dev-plugin`](https://github.com/IvanMurzak/ai-game-dev-plugin) marketplace and a front
door to [ai-game.dev](https://ai-game.dev).

## What it does

Ships one **skill** that fires when you ask the agent to create, set up or open an Unreal project with AI:

✅ **Create** — scaffolds a C++ project<br>
✅ **Install** — adds the Unreal-MCP plugin<br>
✅ **Sign in** — once per machine to ai-game.dev, with a browser code<br>
✅ **Open and verify** — the editor opens in Cloud mode; success only once it is connected<br>
✅ **Wire MCP** — registers the project's tools with your agent

## Prerequisites

- **Node.js 20.19+ or 22.12+**
- **Unreal Engine 5.5+** installed (e.g. UE 5.7 via the Epic Games Launcher)
- A **C++ toolchain** (Visual Studio on Windows, Xcode on macOS)
- A **free [ai-game.dev](https://ai-game.dev) account**

## Install

**Claude Code:**

```text
/plugin marketplace add IvanMurzak/ai-game-dev-plugin
/plugin install unreal-mcp@ai-game-dev-plugin
```

**Codex CLI:**

```bash
codex plugin marketplace add IvanMurzak/ai-game-dev-plugin
codex plugin add unreal-mcp@ai-game-dev-plugin
```

**Cursor:** open **Customize**, choose **From GitHub Repository**, enter
`https://github.com/IvanMurzak/ai-game-dev-plugin` and install `unreal-mcp`.

**Gemini CLI** (one extension with all three engines):

```bash
gemini extensions install https://github.com/IvanMurzak/ai-game-dev-plugin
```

## Try it

Ask something like *"Set up a new Unreal game with AI."* The full flow, with every command and check, is the
skill's runbook: [`skills/unreal-game-dev/SKILL.md`](skills/unreal-game-dev/SKILL.md).

Learn more at **[ai-game.dev](https://ai-game.dev)**. Licensed Apache-2.0.

[![Stand with Ukraine](https://raw.githubusercontent.com/IvanMurzak/IvanMurzak/main/images/ukraine/flag-badge.svg)](https://stand-with-ukraine.pp.ua)
