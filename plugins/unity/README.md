# Unity — AI Game Dev (Claude Code plugin)

Teach Claude Code to drive **Unity** end to end through the [`unity-mcp-cli`](https://www.npmjs.com/package/unity-mcp-cli)
npm package — so you can build a game in Unity by just asking. Part of the
[`claude-code-game-dev`](https://github.com/IvanMurzak/claude-code-game-dev) marketplace and a
front door to [ai-game.dev](https://ai-game.dev).

## What it does

Ships a single **skill** that fires whenever you ask Claude to create, set up, or open a Unity
project with AI. Claude then runs the full automated flow: scaffold the project via Unity Hub,
install the Unity-MCP package, log you in to ai-game.dev, open the editor (which auto-connects in
Cloud mode), and confirm the connection — no manual CLI juggling.

## Prerequisites

- **Node.js 18+**
- **Unity Hub + a Unity Editor** installed (e.g. Unity 6)
- A **free [ai-game.dev](https://ai-game.dev) account**

## Install

```text
/plugin marketplace add IvanMurzak/claude-code-game-dev
/plugin install unity@claude-code-game-dev
```

## What Claude will do automatically

Ask something like *"Set up a new Unity game with AI."* Claude will **create** the project,
**install** the Unity-MCP plugin, **close** the editor, walk you through **login** (it prints a
verification URL + code for you to open in a browser), **open** the editor (it auto-connects in
Cloud mode), and **wait for the connection** to ai-game.dev before it reports success — then wire
Claude Code to the project's MCP tools so it can build the game for you.

Learn more at **[ai-game.dev](https://ai-game.dev)**. Licensed Apache-2.0.
