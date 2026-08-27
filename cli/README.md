# coding-standards-cli

Installs the **coding-standards** AI skill into your AI coding assistant’s skill
directory. The skill encodes a cross-language engineering coding standard
covering C, C++, Rust, Go, Java, Kotlin, JavaScript, TypeScript, TSX/React,
Python, C#/.NET, Swift, PHP, Ruby, Dart, Scala, and Zig.

## Install

```bash
npm install -g coding-standards-cli
```

## Usage

```bash
# Project-local install (recommended): run inside your project
cd /path/to/project
coding-standards init claude      # Claude Code
coding-standards init opencode    # OpenCode
coding-standards init codex       # Codex CLI
coding-standards init cursor      # Cursor
coding-standards init windsurf    # Windsurf
coding-standards init trae        # Trae
coding-standards init continue    # Continue
coding-standards init gemini      # Gemini CLI
coding-standards init agents      # Generic .agents/skills/ standard
coding-standards init all         # Install into every supported tool

# Without global install, via npx
npx coding-standards-cli init claude
```

`--ai <tool>` is accepted as a readable alias (`init --ai claude`).

Global install (available to all of that tool’s projects):

```bash
coding-standards init claude --global
```

Other commands:

```bash
coding-standards list                      # List supported tools
coding-standards --version
coding-standards --help
coding-standards uninstall claude          # Remove (add --global for global)
```

`--force` overwrites an existing install of the same skill.

## What gets installed

Copied under the tool’s skill directory as `coding-standards/`:

```
coding-standards/
├── SKILL.md    # the skill instructions (trigger conditions + standard)
├── data/       # .editorconfig, clang-format, rustfmt.toml
└── scripts/    # apply-format.sh (per-language formatter wrapper)
```

No dependencies, no network calls during installation.

## Supported locations

| Tool | Project-local | Global |
|------|---------------|--------|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| OpenCode | `.opencode/skill/` | `~/.config/opencode/skill/` |
| Codex CLI | `.codex/skills/` | `~/.codex/skills/` |
| Cursor | `.cursor/skills/` | `~/.cursor/skills/` |
| Windsurf | `.windsurf/skills/` | `~/.windsurf/skills/` |
| Trae | `.trae/skills/` | `~/.trae/skills/` |
| Continue | `.continue/skills/` | `~/.continue/skills/` |
| Gemini CLI | `.gemini/skills/` | `~/.gemini/skills/` |
| .agents standard | `.agents/skills/` | `~/.agents/skills/` |

## License

MIT