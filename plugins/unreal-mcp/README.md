# Unreal Engine — AI Game Dev (Claude Code, Codex, Cursor and Gemini CLI)

Teach your AI coding agent — **Claude Code**, **OpenAI Codex**, **Cursor** or **Gemini CLI** — to drive **Unreal Engine**
end to end through the [`unreal-mcp-cli`](https://www.npmjs.com/package/unreal-mcp-cli) npm package,
so you can build a game in Unreal by just asking. Part of the
[`ai-game-dev-plugin`](https://github.com/IvanMurzak/ai-game-dev-plugin) marketplace and a front
door to [ai-game.dev](https://ai-game.dev).

## What it does

Ships a single **skill** that fires whenever you ask the agent to create, set up, or open an Unreal
project with AI. The agent then runs the full automated flow: scaffold the project, install the
Unreal-MCP plugin, sign this machine in to ai-game.dev once, open the editor in Cloud mode, and
confirm the connection — no manual CLI juggling.

## Prerequisites

- **Node.js 20.19+ or 22.12+**
- **Unreal Engine** installed (e.g. UE 5.7 via the Epic Games Launcher)
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

## What the AI will do automatically

Ask something like *"Set up a new Unreal game with AI."* The agent will **create** the project,
**install** the Unreal-MCP plugin, walk you through a one-time **login** for this machine (it prints
a verification URL + code for you to open in a browser), (re)**open** the editor in Cloud mode, and
**wait for the connection** to ai-game.dev before it reports success — then wire the agent to the
project's MCP tools so it can build the game for you.

Learn more at **[ai-game.dev](https://ai-game.dev)**. Licensed Apache-2.0.
