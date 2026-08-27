# coding-standards

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

The skill source lives at
[`cli/skill/coding-standards/`](cli/skill/coding-standards/), containing
`SKILL.md`, bundled `data/` assets, and `scripts/`.

## Install with the CLI (recommended)

The companion npm package `coding-standards-cli` copies the skill into your AI
assistant’s skill directory:

```bash
npm install -g coding-standards-cli
cd /path/to/your/project
coding-standards init claude      # Claude Code
coding-standards init opencode    # OpenCode
coding-standards init codex       # Codex CLI
coding-standards init all         # All supported tools
```

See [`cli/README.md`](cli/README.md) for every supported tool and the `--global`
option.

> Tip: OpenCode, Codex, Cursor, Windsurf, Trae also read
> `.agents/skills/` — `coding-standards init agents` covers the portable
> standard shared by many tools.

## Manual install

Drop the `coding-standards/` folder into your assistant’s skill directory:

| Tool | Skill directory |
|------|-----------------|
| Claude Code | `.claude/skills/coding-standards/` |
| OpenCode | `.opencode/skill/coding-standards/` |
| Codex CLI | `.codex/skills/coding-standards/` |
| Cursor | `.cursor/skills/coding-standards/` |
| Windsurf | `.windsurf/skills/coding-standards/` |
| Trae | `.trae/skills/coding-standards/` |
| Generic agent | `.agents/skills/coding-standards/` |

```bash
cp -r cli/skill/coding-standards .claude/skills/
```

## What the skill covers

1. Indentation · 2. Line length & strings · 3. Braces & spacing · 4. Naming ·
5. Type abstractions · 6. Functions & scope · 7. Centralized control flow /
cleanup · 8. Comments · 9. Automated formatting · 10. Memory, ownership &
resources · 11. Data structures & concurrency · 12. Constants, enums &
macros · 13. Logging · 14. Performance · 15. Return values & error handling ·
16. Booleans · 17. Reuse standard library · 18. Editor/metadata hygiene ·
19. Low-level/unsafe constructs · 20. Feature gating · 21. Fail safely

Ends with a **Deliverable Checklist** and a **Language Conventions** table
covering all 17 languages.

## Repository layout

```
├── cli/
│   ├── index.js                 # installer CLI
│   ├── package.json             # npm package: coding-standards-cli
│   └── skill/
│       └── coding-standards/    # the actual skill
│           ├── SKILL.md
│           ├── data/            # .editorconfig, clang-format, rustfmt.toml, languages/
│           └── scripts/         # apply-format.sh
├── LICENSE
└── README.md
```

## License

[MIT](LICENSE)