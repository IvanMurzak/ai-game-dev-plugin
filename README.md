<p align="center">
  <img alt="AI Game Developer, plugins and skills: your AI coding agent creates a Unity, Unreal Engine or Godot project and connects the editor to ai-game.dev" src="assets/hero.svg" width="100%">
</p>

<p align="center">
  <a href="https://code.claude.com/docs/en/plugins"><img alt="Claude Code plugin" src="https://img.shields.io/badge/Claude_Code-plugin-2F6F9F?style=for-the-badge&amp;labelColor=0F172A&amp;logoColor=white&amp;logo=claude"></a>
  <a href="https://developers.openai.com/codex/"><img alt="Codex plugin" src="https://img.shields.io/badge/Codex-plugin-2F6F9F?style=for-the-badge&amp;labelColor=0F172A&amp;logoColor=white"></a>
  <a href="https://cursor.com/docs/plugins"><img alt="Cursor plugin" src="https://img.shields.io/badge/Cursor-plugin-2F6F9F?style=for-the-badge&amp;labelColor=0F172A&amp;logoColor=white&amp;logo=cursor"></a>
  <a href="https://geminicli.com/docs/extensions/"><img alt="Gemini CLI extension" src="https://img.shields.io/badge/Gemini_CLI-extension-2F6F9F?style=for-the-badge&amp;labelColor=0F172A&amp;logoColor=white&amp;logo=googlegemini"></a>
  <a href="https://modelcontextprotocol.io/introduction"><img alt="MCP" src="https://img.shields.io/badge/MCP-tools-2F6F9F?style=for-the-badge&amp;labelColor=0F172A&amp;logoColor=white&amp;logo=modelcontextprotocol"></a>
  <a href="https://github.com/IvanMurzak/Unity-MCP"><img alt="Unity 2022.3+" src="https://img.shields.io/badge/Unity-2022.3%2B-0E7490?style=for-the-badge&amp;labelColor=0F172A&amp;logoColor=white&amp;logo=unity"></a>
  <a href="https://github.com/IvanMurzak/Unreal-MCP"><img alt="Unreal Engine 5.5+" src="https://img.shields.io/badge/Unreal_Engine-5.5%2B-0E7490?style=for-the-badge&amp;labelColor=0F172A&amp;logoColor=white&amp;logo=unrealengine"></a>
  <a href="https://github.com/IvanMurzak/Godot-MCP"><img alt="Godot 4.3+ .NET" src="https://img.shields.io/badge/Godot-4.3%2B_.NET-0E7490?style=for-the-badge&amp;labelColor=0F172A&amp;logoColor=white&amp;logo=godotengine"></a>
  <a href="https://nodejs.org/"><img alt="Node.js 20.19+" src="https://img.shields.io/badge/Node.js-20.19%2B-0E7490?style=for-the-badge&amp;labelColor=0F172A&amp;logoColor=white&amp;logo=nodedotjs"></a>
  <a href="./LICENSE"><img alt="License: Apache-2.0" src="https://img.shields.io/github/license/IvanMurzak/ai-game-dev-plugin?label=License&amp;color=047857&amp;style=for-the-badge&amp;labelColor=0F172A&amp;logoColor=white"></a>
  <a href="https://discord.gg/cfbdMZX99G"><img alt="Discord" src="https://img.shields.io/badge/Discord-Join-5865F2?style=for-the-badge&amp;labelColor=0F172A&amp;logoColor=white&amp;logo=discord"></a>
  <a href="https://stand-with-ukraine.pp.ua"><img src="https://raw.githubusercontent.com/IvanMurzak/IvanMurzak/main/images/ukraine/flag-square.svg" height="28" alt="Stand with Ukraine" title="Stand with Ukraine"></a>
</p>

Ask your coding agent for a game and it sets everything up: it creates the engine project, installs
the AI Game Developer plugin, signs you in to [ai-game.dev](https://ai-game.dev), opens the editor
and connects its MCP tools. From there the agent builds the game inside your real editor.

✅ **One prompt to a connected editor** — project, plugin, sign-in, editor and MCP tools<br>
✅ **Unity, Unreal Engine, Godot** — one plugin and one skill per engine<br>
✅ **Four agents, one source** — Claude Code, Codex, Cursor and Gemini CLI<br>
✅ **Nothing installed globally** — every engine CLI runs through `npx`<br>
✅ **Verified before success** — the agent waits until the editor is ready and connected

## 🚀 Quick start

**Claude Code**

```text
/plugin marketplace add IvanMurzak/ai-game-dev-plugin
/plugin install unity-mcp@ai-game-dev-plugin
```

Swap `unity-mcp` for `unreal-mcp` or `godot-mcp`, or install all three. Then just ask:

> _"Make a new Unity game and connect it to ai-game.dev."_

<div align="center">
  <img src="./assets/demo.svg" alt="Demo: the agent creates a Unity project, installs the plugin, signs in to ai-game.dev, opens the editor and wires MCP tools." width="100%" />
</div>

**Other agents**

| Agent | Install |
| ----- | ------- |
| OpenAI Codex | `codex plugin marketplace add IvanMurzak/ai-game-dev-plugin`<br>`codex plugin add unity-mcp@ai-game-dev-plugin` |
| Cursor | **Customize** → **From GitHub Repository** → `https://github.com/IvanMurzak/ai-game-dev-plugin`, then install `unity-mcp` |
| Gemini CLI | `gemini extensions install https://github.com/IvanMurzak/ai-game-dev-plugin`<br>one extension, all three engines |
| Any agent with skills | `npx skills add IvanMurzak/ai-game-dev-plugin` |

Copying the skills by hand and the ChatGPT / OpenAI plugin-directory package:
[docs/install.md](./docs/install.md).

## 🎮 The plugins

| Engine | Plugin | Drives the CLI | Engine plugin |
| ------ | ------ | -------------- | ------------- |
| **Unity** | `unity-mcp` | [`unity-mcp-cli`](https://www.npmjs.com/package/unity-mcp-cli) | [Unity-MCP](https://github.com/IvanMurzak/Unity-MCP) |
| **Unreal Engine** | `unreal-mcp` | [`unreal-mcp-cli`](https://www.npmjs.com/package/unreal-mcp-cli) | [Unreal-MCP](https://github.com/IvanMurzak/Unreal-MCP) |
| **Godot** | `godot-mcp` | [`godot-cli`](https://www.npmjs.com/package/godot-cli) | [Godot-MCP](https://github.com/IvanMurzak/Godot-MCP) |

Each plugin ships one skill (`unity-game-dev`, `unreal-game-dev`, `godot-game-dev`). It activates by
itself when you ask to create, set up or open a project for its engine.

## 🤖 What the agent does

<p align="center">
  <img alt="The setup flow: create the project, install the plugin, sign in, restart the editor, verify the connection, wire MCP tools into the agent" src="assets/flow.svg" width="100%">
</p>

Every step runs through `npx -y <engine-cli>@latest`, so nothing is installed globally.

1. **Create** a project (skipped when you already have one).
2. **Install** the AI Game Developer plugin into it.
3. **Sign in** to ai-game.dev: the agent shows you a link and a code to confirm in your browser,
   once per machine.
4. **Restart** the editor (close, then open) so it picks up the sign-in and connects.
5. **Verify** the editor is ready and connected. The agent does not report success before that.
6. **Wire MCP**: `setup-mcp <agent-id>` (`claude-code`, `codex`, `cursor` or `gemini`) registers the
   project's tools with your agent, so it can build the game: scenes, objects, scripts, tests and
   screenshots.

Exact commands, checks and fixes per engine are in the runbooks:
[Unity](./plugins/unity-mcp/skills/unity-game-dev/SKILL.md) ·
[Unreal](./plugins/unreal-mcp/skills/unreal-game-dev/SKILL.md) ·
[Godot](./plugins/godot-mcp/skills/godot-game-dev/SKILL.md).

## ✅ Requirements

- **Node.js 20.19+ or 22.12+** (the CLIs run through `npx`).
- **The engine**: Unity 2022.3+ (through Unity Hub), Unreal Engine 5.5+ with a C++ toolchain, or Godot 4.3+
  **.NET** with the .NET SDK.
- A free **[ai-game.dev](https://ai-game.dev)** account.
- A desktop session: the editor opens a real window.

## 🧩 Related projects

| Project | What it is |
| ------- | ---------- |
| [Unity-MCP](https://github.com/IvanMurzak/Unity-MCP) | AI Game Developer for Unity and `unity-mcp-cli` |
| [Unreal-MCP](https://github.com/IvanMurzak/Unreal-MCP) | AI Game Developer for Unreal Engine and `unreal-mcp-cli` |
| [Godot-MCP](https://github.com/IvanMurzak/Godot-MCP) | AI Game Developer for Godot and `godot-cli` |
| [GameDev-MCP-Server](https://github.com/IvanMurzak/GameDev-MCP-Server) | The one MCP server behind all three engine plugins |
| [ai-game.dev](https://ai-game.dev) | The cloud that connects your agent to the editor |

Questions and showcases: **[Discord](https://discord.gg/cfbdMZX99G)**.

## 🛠️ Contributing

Issues and pull requests are welcome. Edit the canonical runbook in
`plugins/<engine>-mcp/skills/<engine>-game-dev/SKILL.md`, then run `node scripts/sync-skills.mjs`
(and `--check` before you commit). Layout and rules: [`AGENTS.md`](./AGENTS.md); maintenance
scripts: [`scripts/README.md`](./scripts/README.md).

## 📄 License

[Apache-2.0](./LICENSE) © 2026 Ivan Murzak.
