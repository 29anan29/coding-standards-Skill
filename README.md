# coding-standards

> **English** · [中文](README.zh-CN.md)

A cross-language engineering coding standard packaged as an **AI skill**. It
guides AI coding agents to produce clean, consistent, maintainable, idiomatic
code when writing, reviewing, or refactoring C, C++, Rust, Go, Java, Kotlin,
JavaScript, TypeScript, TSX/React, Python, C#/.NET, Swift, PHP, Ruby, Dart,
Scala, and Zig.

## Highlights

- **Language-agnostic** rules mapped to per-language idioms
  (17 languages), plus a quick-reference table.
- **Reviewer-friendly**: strict, consistent, actionable guidance.
- **Hard vs. soft** rule prioritization so agents know what is mandatory.
- **Deliverable checklist** to verify output before submission.
- **Tools for AI agents** to format and self-check code (see below).

The skill source lives at
[`cli/skill/coding-standards/`](cli/skill/coding-standards/), containing
`SKILL.md`, bundled `data/` assets, and `scripts/`.

## Install with the CLI (recommended)

The companion npm package `@29anan29/coding-standards-cli` (published to **both**
npm and GitHub Packages) copies the skill into your AI assistant’s skill
directory:

```bash
npm install -g @29anan29/coding-standards-cli
cd /path/to/your/project
standards init claude      # Claude Code
standards init opencode    # OpenCode
standards init codex       # Codex CLI
standards init all         # All supported tools
standards global claude    # or: install globally into ~/.claude/skills
standards update           # update this CLI from npm
standards help             # show help
```

Two binary names are equivalent: `standards` and `coding-standards`.
See [`cli/README.md`](cli/README.md) for every supported tool, the `--global`
option, and the `list`/`uninstall`/`update` commands.

> Tip: OpenCode, Codex, Cursor, Windsurf, Trae also read
> `.agents/skills/` — `standards init agents` covers the portable
> standard shared by many tools.

**Where it’s published**:
- **npm** (registry.npmjs.org): `@29anan29/coding-standards-cli` — installs with no
  extra config or token.
- **GitHub Packages**: same package at this repository’s
  [Package registry](https://github.com/users/29anan29/packages?repo_name=coding-standards-Skill);
  installing from it requires a GitHub token with `read:packages`.

Cross-platform note: `standards global <tool>` (or `standards init <tool>
--global`) installs into your user skill directory, resolved per platform
(Linux `/home/<you>`, macOS `/Users/<you>`, Windows `C:\Users\<you>`). Skills
live under `~/.<tool>/skills` and are **never** installed under `~/.config` —
for **every** supported tool, not just OpenCode.

## Manual install

Drop the `coding-standards/` folder into your assistant’s skill directory:

| Tool | Skill directory |
|------|-----------------|
| Claude Code | `.claude/skills/coding-standards/` |
| OpenCode | `.opencode/skills/coding-standards/` |
| Codex CLI | `.codex/skills/coding-standards/` |
| Cursor | `.cursor/skills/coding-standards/` |
| Windsurf | `.windsurf/skills/coding-standards/` |
| Trae | `.trae/skills/coding-standards/` |
| Generic agent | `.agents/skills/coding-standards/` |

```bash
cp -r cli/skill/coding-standards .claude/skills/
```

## What the skill covers

1. Indentation (tabs, 8 columns by default) · 2. Line length & strings ·
3. Braces & spacing · 4. Naming (incl. explicit **variable naming rules** for
locals/globals/constants) · 5. Type abstractions · 6. Functions & scope ·
7. Centralized control flow / cleanup · 8. Comments (file header on lines 1-2,
**block comments** over cohesive fragments, not line-by-line) ·
9. Automated formatting · 10. Memory, ownership & resources ·
11. Data structures & concurrency · 12. Constants, enums & macros ·
13. Logging · 14. Performance · 15. Return values & error handling ·
16. Booleans · 17. Reuse standard library · 18. Editor/metadata hygiene ·
19. Low-level/unsafe constructs (incl. `NULL`-pointer checks in C/C++/Zig) ·
20. Feature gating · 21. Fail safely

Ends with a **Deliverable Checklist** and a **Language Conventions** index
covering all 17 languages. Per-language details live in
[`data/languages/`](cli/skill/coding-standards/data/languages/).

## Tools for AI agents

Bundled helper scripts the agent can run to enforce the standard:

| Tool | Purpose |
|------|---------|
| `scripts/apply-format.sh` | Run the canonical formatter (`gofmt`, `rustfmt`, `clang-format`, `prettier`, `black`, …) on files/dirs. |
| `scripts/check-style.sh` | Dependency-free style lint: trailing whitespace, over-long lines, mixed indentation, editor modelines, and missing file headers. |

```bash
sh scripts/apply-format.sh src/
sh scripts/check-style.sh src/
```

## Repository layout

```
├── cli/
│   ├── index.js                 # installer CLI
│   ├── package.json             # npm package: coding-standards-cli
│   └── skill/
│       └── coding-standards/    # the actual skill
│           ├── SKILL.md
│           ├── data/            # .editorconfig, clang-format, languages/
│           └── scripts/         # apply-format.sh, check-style.sh
├── LICENSE
├── README.md                    # this file (English)
└── README.zh-CN.md              # 简体中文
```

## License

[MIT](LICENSE)