# Install

The plugins are `unity-mcp`, `unreal-mcp` and `godot-mcp` in the `ai-game-dev-plugin` marketplace.
Install one, two or all three. Requirements: [README](../README.md#-requirements).

## Claude Code

```text
/plugin marketplace add IvanMurzak/ai-game-dev-plugin
/plugin install unity-mcp@ai-game-dev-plugin
```

## OpenAI Codex

```bash
codex plugin marketplace add IvanMurzak/ai-game-dev-plugin
codex plugin add unity-mcp@ai-game-dev-plugin
```

Or open `/plugins` inside Codex and install from the plugin browser.

## Cursor

Open **Customize**, choose **From GitHub Repository** and enter
`https://github.com/IvanMurzak/ai-game-dev-plugin`, then install `unity-mcp`.

## Gemini CLI

```bash
gemini extensions install https://github.com/IvanMurzak/ai-game-dev-plugin
```

The whole repository is one extension that carries all three engine skills.

## Any agent with skills (`npx skills`)

```bash
npx skills add IvanMurzak/ai-game-dev-plugin
```

## Copy the skills by hand

Each runbook is a plain `SKILL.md` in [`skills/`](../skills). Copy a `<engine>-game-dev` folder into
your agent's skills directory:

| Agent | Project skills | Personal skills |
| ----- | -------------- | --------------- |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `.agents/skills/` | `~/.agents/skills/` |
| Cursor | `.cursor/skills/` | `~/.cursor/skills/` |
| Gemini CLI | `.gemini/skills/` | `~/.gemini/skills/` |

Cursor and Gemini CLI also read `.agents/skills/` and `~/.agents/skills/`.

## ChatGPT and the OpenAI plugin directory

[`plugins/ai-game-dev`](../plugins/ai-game-dev) is the **AI Game Developer** package for the OpenAI
plugin directory (ChatGPT and Codex): one connection to `https://ai-game.dev/mcp`, signed in with
your ai-game.dev account, plus the three engine runbooks. It reaches the editors you have open and
signed in to the same account. It is not listed in the directory yet; once it is, install it from
there. Building the upload ZIP: [`scripts/README.md`](../scripts/README.md).

## First prompt

> _"Make a new Unity game and connect it to ai-game.dev."_

The skill then runs the setup flow described in the [README](../README.md#-what-the-agent-does).
