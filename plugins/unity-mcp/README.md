# Unity — AI Game Dev (Claude Code, Codex, Cursor and Gemini CLI)

Teach your AI coding agent — **Claude Code**, **OpenAI Codex**, **Cursor** or **Gemini CLI** — to drive **Unity** end to end
through the [`unity-mcp-cli`](https://www.npmjs.com/package/unity-mcp-cli) npm package, so you can
build a game in Unity by just asking. Part of the
[`ai-game-dev-plugin`](https://github.com/IvanMurzak/ai-game-dev-plugin) marketplace and a front
door to [ai-game.dev](https://ai-game.dev).

## What it does

Ships one **skill** that fires when you ask the agent to create, set up or open a Unity project with AI:

✅ **Create** — scaffolds the project through Unity Hub<br>
✅ **Install** — adds the Unity-MCP package<br>
✅ **Sign in** — once per machine to ai-game.dev, with a browser code<br>
✅ **Open and verify** — the editor auto-connects in Cloud mode; success only once it is connected<br>
✅ **Wire MCP** — registers the project's tools with your agent

## Prerequisites

- **Node.js 20.19+ or 22.12+**
- **Unity Hub + Unity 2022.3+** installed (e.g. Unity 6)
- A **free [ai-game.dev](https://ai-game.dev) account**

## Install

**Claude Code:**

```text
/plugin marketplace add IvanMurzak/ai-game-dev-plugin
/plugin install unity-mcp@ai-game-dev-plugin
```

**Codex CLI:**

```bash
codex plugin marketplace add IvanMurzak/ai-game-dev-plugin
codex plugin add unity-mcp@ai-game-dev-plugin
```

**Cursor:** open **Customize**, choose **From GitHub Repository**, enter
`https://github.com/IvanMurzak/ai-game-dev-plugin` and install `unity-mcp`.

**Gemini CLI** (one extension with all three engines):

```bash
gemini extensions install https://github.com/IvanMurzak/ai-game-dev-plugin
```

## Try it

Ask something like *"Set up a new Unity game with AI."* The full flow, with every command and check, is the
skill's runbook: [`skills/unity-game-dev/SKILL.md`](skills/unity-game-dev/SKILL.md).

Learn more at **[ai-game.dev](https://ai-game.dev)**. Licensed Apache-2.0.

[![Stand with Ukraine](https://raw.githubusercontent.com/IvanMurzak/IvanMurzak/main/images/ukraine/flag-badge.svg)](https://stand-with-ukraine.pp.ua)
