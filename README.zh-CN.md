# coding-standards

> [English](README.md) · **简体中文**

一种以 **AI 技能（Skill）** 形式封装、跨语言的工程编码规范。它指导 AI 编码智能体在编写、审查或重构代码时产出简洁、一致、可维护、地道的代码，覆盖 C、C++、Rust、Go、Java、Kotlin、JavaScript、TypeScript、TSX/React、Python、C#/.NET、Swift、PHP、Ruby、Dart、Scala 与 Zig 共 17 种语言。

## 亮点

- **语言无关规则 + 各语言习惯**映射（17 种语言），并提供快速参考索引。
- **审查友好**：严格、一致、可操作的指导。
- **硬性 / 软性**规则分级，让智能体明确哪些必须遵守。
- **交付自查清单（Deliverable Checklist）**，提交前逐项核对。
- **提供给 AI 的工具脚本**，用于格式化和自我检查（见下文）。

技能源码位于 [`cli/skill/coding-standards/`](cli/skill/coding-standards/)，包含 `SKILL.md`、打包的 `data/` 资源与 `scripts/`。

## 使用 CLI 安装（推荐）

配套 npm 包 `@29anan29/coding-standards-cli`（同时发布到 **npm 与 GitHub Packages**）
会把技能复制到你的 AI 助手的技能目录：

```bash
npm install -g @29anan29/coding-standards-cli
cd /path/to/your/project
standards init claude      # Claude Code
standards init opencode    # OpenCode
standards init codex       # Codex CLI
standards init all         # 安装到所有支持的工具
standards global claude    # 或：全局安装到 ~/.claude/skills
standards update           # 从 npm 更新本 CLI
standards help             # 显示帮助
```

`standards` 与 `coding-standards` 两个命令名等价。
每种工具、`--global` 选项及 `list`/`uninstall`/`update` 命令详见
[`cli/README.md`](cli/README.md)。

> 提示：OpenCode、Codex、Cursor、Windsurf、Trae 也支持
> `.agents/skills/` —— `standards init agents` 可覆盖这套可移植标准。

## 手动安装

把 `coding-standards/` 目录放进取对应助手的技能目录即可：

| 工具 | 技能目录 |
|------|----------|
| Claude Code | `.claude/skills/coding-standards/` |
| OpenCode | `.opencode/skill/coding-standards/` |
| Codex CLI | `.codex/skills/coding-standards/` |
| Cursor | `.cursor/skills/coding-standards/` |
| Windsurf | `.windsurf/skills/coding-standards/` |
| Trae | `.trae/skills/coding-standards/` |
| 通用智能体 | `.agents/skills/coding-standards/` |

```bash
cp -r cli/skill/coding-standards .claude/skills/
```

## 技能覆盖内容

1. 缩进（默认 Tab、8 格）· 2. 行宽与字符串 · 3. 花括号与空格 · 4. 命名（含明确的**变量命名规范**：局部/全局/常量）· 5. 类型抽象 · 6. 函数与作用域 · 7. 集中化控制流与清理 · 8. 注释（第 1-2 行文件头注释、**成块注释**解释一段代码如函数/结构体，而非一行行零散注释）· 9. 自动格式化 · 10. 内存、所有权与资源管理 · 11. 数据结构与并发 · 12. 常量、枚举与惯用抽象 · 13. 日志 · 14. 性能 · 15. 返回值与错误处理 · 16. 布尔值 · 17. 复用标准库 · 18. 编辑器/元数据卫生 · 19. 底层/不安全构造（含 C/C++/Zig 中的 **`NULL` 空指针检查**）· 20. 特性开关 · 21. 安全失败

结尾是**交付自查清单**与覆盖 17 种语言的 **Language Conventions 索引**。各语言的详细约定存放在 [`data/languages/`](cli/skill/coding-standards/data/languages/)。

## 提供给 AI 的工具

技能打包了可供智能体运行、用于落实规范的辅助脚本：

| 工具 | 用途 |
|------|------|
| `scripts/apply-format.sh` | 对文件/目录运行对应语言的标准格式化工具（`gofmt`、`rustfmt`、`clang-format`、`prettier`、`black` 等）。 |
| `scripts/check-style.sh` | 免依赖的风格检查：行尾空格、超长行、混用缩进、编辑器 modeline、缺失文件头等。 |

```bash
sh scripts/apply-format.sh src/
sh scripts/check-style.sh src/
```

## 仓库结构

```
├── cli/
│   ├── index.js                 # 安装 CLI
│   ├── package.json             # npm 包：coding-standards-cli
│   └── skill/
│       └── coding-standards/    # 真正的技能
│           ├── SKILL.md
│           ├── data/            # .editorconfig、clang-format、languages/
│           └── scripts/         # apply-format.sh、check-style.sh
├── LICENSE
├── README.md                    # English（英文默认）
└── README.zh-CN.md              # 本文件（简体中文）
```

## 协议

[MIT](LICENSE)