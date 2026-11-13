"""Regenerate the README images in assets/: hero.svg, flow.svg and demo.svg.

Run from anywhere: `python assets/build-svgs.py` (Python 3.8+, no dependencies). The shared visual style lives in
svgkit.py next to this file. Commands shown mirror plugins/<engine>-mcp/skills/<engine>-game-dev/SKILL.md.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import svgkit as K  # noqa: E402


def hero():
    # The brand logo (ai-game.dev) on the left, wired to the three engine editors.
    right = (f'<circle cx="850" cy="176" r="96" fill="url(#logoGlow)"/>' + K.logo(850, 176, 120)
             + f'<text x="850" y="290" text-anchor="middle" class="m" font-size="16" fill="{K.SECOND}">ai-game.dev</text>'
             + "".join(K.card(1000, y, 180, 64, name, accent="blue")
                       for name, y in (("Unity", 64), ("Unreal Engine", 160), ("Godot", 256)))
             + "".join(K.wire(f"M915,176 C960,176 960,{y + 32} 1000,{y + 32}", begin=i * 0.8)
                       for i, y in enumerate((64, 160, 256))))
    return K.hero(title="AI Game ", accent="Developer", eyebrow_text="Plugins & skills",
                  subtitle=["Ask your coding agent for a game:", "it sets up the engine and connects the editor."],
                  chip_items=["Claude Code", "Codex", "Cursor", "Gemini CLI"], right=right,
                  label="AI Game Developer plugins and skills: your coding agent creates a Unity, Unreal Engine or "
                        "Godot project and connects the editor")


STEPS = (
    ("1  Create", "create-project", "new project, if you have none", "red"),
    ("2  Install", "install-plugin", "AI Game Developer plugin", "red"),
    ("3  Sign in", "login", "browser code, once per machine", "yellow"),
    ("4  Restart", "close + open", "editor picks up the sign-in", "yellow"),
    ("5  Verify", "wait-for-ready", "editor ready and connected", "green"),
    ("6  Wire MCP", "setup-mcp <agent-id>", "engine tools in your agent", "blue"),
)


def flow():
    W, H, X0, GAP, CW, CH = 1200, 450, 40, 24, 357, 120
    rows = (90, 250)
    body = [K.eyebrow(X0, 58, "What the skill runs")]
    centers = []
    for i, (title, cmd, sub, acc) in enumerate(STEPS):
        x, y = X0 + (i % 3) * (CW + GAP), rows[i // 3]
        body.append(K.card(x, y, CW, CH, title, accent=acc))
        body[-1] = body[-1].replace(f'y="{y + CH / 2 + 6}"', f'y="{y + 40}"')  # title to the top of the card
        body.append(f'<text x="{x + 22}" y="{y + 74}" class="m" font-size="18" fill="{K.BLUE}">{K.esc(cmd)}</text>')
        body.append(f'<text x="{x + 22}" y="{y + 102}" class="s" font-size="16" fill="{K.MUTED}">{K.esc(sub)}</text>')
        centers.append((x, y))
    wires = []
    for i in (0, 1, 3, 4):
        (x, y), (nx, _) = centers[i], centers[i + 1]
        wires.append(K.wire(f"M{x + CW},{y + CH / 2} H{nx}", begin=i * 0.5, dur=1.6))
    (x3, y3), (x4, y4) = centers[2], centers[3]
    wires.append(K.wire(f"M{x3 + CW / 2},{y3 + CH} V{y3 + CH + 20} H{x4 + CW / 2} V{y4}", dur=2.4))
    body = wires + body
    body.append(f'<text x="{X0}" y="{H - 28}" class="s" font-size="17" fill="{K.SECOND}">Every step is '
                f'<tspan class="m" fill="{K.TEXT}">npx -y &lt;engine-cli&gt;@latest &lt;command&gt;</tspan>; '
                'then the agent builds the game in your editor.</text>')
    return K.panel(W, H, "".join(body), label="The setup flow the skill runs: create, install, sign in, restart, "
                                               "verify, wire MCP")


def demo():
    c = "npx -y unity-mcp-cli@latest "
    lines = [
        {"out": [("red", "You: "), ("text", "Make a new Unity game and connect it to ai-game.dev")]},
        {"out": [("muted", "Agent uses the unity-game-dev skill")]},
        {"cmd": c + "create-project ./MyGame"},
        {"cmd": c + "install-plugin ./MyGame"},
        {"cmd": c + "login"},
        {"out": [("muted", "Open the link in your browser and enter the code shown")]},
        {"cmd": c + "open ./MyGame"},
        {"cmd": c + "wait-for-ready ./MyGame"},
        {"cmd": c + "setup-mcp claude-code ./MyGame"},
        {"out": [("ok", "✓ "), ("text", "Unity is open and connected. What should we build first?")]},
    ]
    svg = K.terminal(lines, title="Claude Code  ·  ~/Games", hold=10.0,
                      label="Demo: the agent creates a Unity project, installs the plugin, signs in to ai-game.dev, "
                            "opens the editor and wires MCP tools")
    return svg


if __name__ == "__main__":
    K.write(os.path.join(HERE, "hero.svg"), hero())
    K.write(os.path.join(HERE, "flow.svg"), flow())
    K.write(os.path.join(HERE, "demo.svg"), demo())
