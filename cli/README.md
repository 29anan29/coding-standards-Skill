# coding-standards-cli

Installs the **coding-standards** AI skill into your AI coding assistant’s skill
directory. The skill encodes a cross-language engineering coding standard
covering C, C++, Rust, Go, Java, Kotlin, JavaScript, TypeScript, TSX/React,
Python, C#/.NET, Swift, PHP, Ruby, Dart, Scala, and Zig.

## Install

The package `coding-standards-cli` is published to **`registry.npmjs.org`** (no
token needed) and, under the scoped name `@29anan29/coding-standards-cli`, to
GitHub Packages.

```bash
npm install -g coding-standards-cli
```

## Usage

The binary is available under two names — `standards` (shorthand) and
`coding-standards` (alias); both are equivalent.

```bash
# Project-local install (recommended): run inside your project
cd /path/to/project
standards init claude      # Claude Code
standards init opencode    # OpenCode
standards init codex       # Codex CLI
standards init cursor      # Cursor
standards init windsurf    # Windsurf
standards init trae        # Trae
standards init continue    # Continue
standards init gemini      # Gemini CLI
standards init agents      # Generic .agents/skills/ standard
standards init all         # Install into every supported tool

# Global install (ambiguous-free): available to all of that tool's projects
standards global claude
standards global opencode codex   # multiple tools at once

# Or use the --global flag
standards init claude --global

# Manage
standards list                     # list supported tools
standards uninstall claude --global
standards update                   # update this CLI from npm
standards help                     # show help

# Without global install, via npx
npx coding-standards-cli init claude
```

`--ai <tool>` is accepted as a readable alias (`standards init --ai claude`).
`--force` overwrites an existing install.

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
├── data/       # .editorconfig, clang-format, rustfmt.toml, languages/
└── scripts/    # apply-format.sh (per-language formatter wrapper)
```

No dependencies, no network calls during installation.

## Install from GitHub Packages

The same CLI is also published to GitHub Packages (package registry > npm) for
the `coding-standards-Skill` repository as `@29anan29/coding-standards-cli`.
Requires a GitHub token with `read:packages` (or a `.npmrc` scoping the registry):

```bash
# ~/.npmrc
# @29anan29:registry=https://npm.pkg.github.com
# //npm.pkg.github.com/:_authToken=GH_TOKEN_WITH_READ_PACKAGES

npm install -g "@29anan29/coding-standards-cli"
```

## Supported locations

`~` always means your home directory, resolved per platform: Linux
`/home/<you>`, macOS `/Users/<you>`, Windows `C:\Users\<you>`.

| Tool | Project-local | Global |
|------|---------------|--------|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| OpenCode | `.opencode/skills/` | `~/.opencode/skills/` |
| Codex CLI | `.codex/skills/` | `~/.codex/skills/` |
| Cursor | `.cursor/skills/` | `~/.cursor/skills/` |
| Windsurf | `.windsurf/skills/` | `~/.windsurf/skills/` |
| Trae | `.trae/skills/` | `~/.trae/skills/` |
| Continue | `.continue/skills/` | `~/.continue/skills/` |
| Gemini CLI | `.gemini/skills/` | `~/.gemini/skills/` |
| .agents standard | `.agents/skills/` | `~/.agents/skills/` |

## License

MIT