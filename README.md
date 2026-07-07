<div align="center">

# 🎮 claude-code-game-dev

### Build games in Unreal, Unity & Godot — with Claude, automatically.

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin marketplace that teaches Claude to spin up a real game project, install the engine plugin, log you in, and open the editor connected to the cloud — so you can build a game just by asking.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![Claude Code Plugins](https://img.shields.io/badge/Claude_Code-Plugins-8A63D2.svg)](https://docs.anthropic.com/en/docs/claude-code)
[![Unreal Engine](https://img.shields.io/badge/Unreal_Engine-0E1128.svg?logo=unrealengine&logoColor=white)](https://ai-game.dev)
[![Unity](https://img.shields.io/badge/Unity-000000.svg?logo=unity&logoColor=white)](https://ai-game.dev)
[![Godot](https://img.shields.io/badge/Godot-478CBF.svg?logo=godotengine&logoColor=white)](https://ai-game.dev)
[![Powered by ai-game.dev](https://img.shields.io/badge/Powered_by-ai--game.dev-4C8BF5.svg)](https://ai-game.dev)

</div>

---

## What is this?

**claude-code-game-dev** is a marketplace of three Claude Code plugins — one per game engine.
Each one teaches Claude Code to drive that engine's official npm CLI so Claude can take you from
_nothing_ to a running editor **connected to [ai-game.dev](https://ai-game.dev)** — creating the
project, installing the engine plugin, logging you in, and opening the editor **for you,
automatically.**

Once connected, the AI can build the game inside your real editor: create the project structure,
spawn objects, edit scenes, wire logic, and iterate — all through Claude Code.

| Engine | Plugin id | Wraps the CLI | It teaches Claude to… |
| ------ | --------- | ------------- | --------------------- |
| 🟦 **Unreal Engine** | `unreal` | [`unreal-mcp-cli`](https://www.npmjs.com/package/unreal-mcp-cli) | create a UE project, install Unreal-MCP, log in, open in Cloud mode |
| ⬛ **Unity** | `unity` | [`unity-mcp-cli`](https://www.npmjs.com/package/unity-mcp-cli) | create a Unity project via Hub, install Unity-MCP, log in, open |
| 🟦 **Godot** | `godot` | [`godot-cli`](https://www.npmjs.com/package/godot-cli) | create a C# Godot project, install Godot-MCP, log in, open in Cloud mode |

## 🚀 Quick start

Add the marketplace, then install the plugin(s) for the engine(s) you use:

```text
/plugin marketplace add IvanMurzak/claude-code-game-dev
```

```text
/plugin install unreal@claude-code-game-dev
/plugin install unity@claude-code-game-dev
/plugin install godot@claude-code-game-dev
```

Then just ask Claude:

> _"Set up a new Unreal game with AI and connect it to ai-game.dev."_

## The three plugins

| Engine | Install command |
| ------ | --------------- |
| Unreal Engine | `/plugin install unreal@claude-code-game-dev` |
| Unity | `/plugin install unity@claude-code-game-dev` |
| Godot | `/plugin install godot@claude-code-game-dev` |

Each plugin is a single, focused **skill** that auto-activates the moment you ask Claude to
create, set up, or open a project for that engine with AI.

## 🤖 What Claude does automatically

When you ask Claude to set up a game, the skill runs the full end-to-end flow via
`npx -y <engine-cli>@latest`:

1. **Create** — scaffold a fresh engine project (skipped if you already have one).
2. **Install** — add the engine's MCP plugin/addon to the project.
3. **Close** — ensure the editor is not running, so it picks up the new token on next launch.
4. **Login** — an interactive device-code sign-in to [ai-game.dev](https://ai-game.dev); Claude
   relays the verification URL + code for you to open in a browser.
5. **Open** — launch the editor in **Cloud** mode.
6. **Connect** — wait until the editor has actually connected to the cloud (Claude won't claim
   success until this passes).
7. **Wire MCP** — register the project's tools with Claude Code so the AI can build the game.

> **Ordering that matters:** the editor is always **closed before login**, and **opened only after
> a successful login**, so the fresh auth token is loaded at startup. Claude enforces this for you.

## ✅ Prerequisites

- **Node.js 18+** (the CLIs run through `npx`).
- The **engine installed** — Unreal Engine, Unity (via Unity Hub), or Godot 4.x **.NET/Mono**
  (Godot C# projects also need the **.NET SDK**).
- A **free [ai-game.dev](https://ai-game.dev) account** for the login step.
- A desktop session — the editors open a real window.

## 🌐 Powered by ai-game.dev

These plugins are the on-ramp to **[ai-game.dev](https://ai-game.dev)** — the cloud that lets AI
build games inside your real engine. The login step authorizes your project against the cloud,
and the editor connects to it so Claude can create and iterate on your game. Bring your own free
account; the plugins wire everything else up.

## 🤝 Contributing

Issues and pull requests are welcome at
**[github.com/IvanMurzak/claude-code-game-dev](https://github.com/IvanMurzak/claude-code-game-dev)**.
Keep changes focused on the create → install → login → open → connect story, keep all JSON valid,
and match the existing skill structure.

## 📄 License

[Apache-2.0](./LICENSE) © 2026 Ivan Murzak.

<div align="center">
<sub>Made for game developers who'd rather build than boilerplate. · <a href="https://ai-game.dev">ai-game.dev</a></sub>
</div>
