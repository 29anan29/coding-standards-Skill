#!/usr/bin/env node
"use strict";

// coding-standards-cli
// Installs the bundled "coding-standards" AI skill into a supported AI coding
// tool's skill directory (Claude Code, OpenCode, Codex CLI, Cursor, Windsurf,
// Trae, Continue, Gemini CLI, and the generic .agents standard).

const fs = require("fs");
const path = require("path");

const PKG = require("./package.json");
const SKILL_NAME = "coding-standards";
const SKILL_DIR = path.join(__dirname, "skill", SKILL_NAME);

if (!fs.existsSync(path.join(SKILL_DIR, "SKILL.md"))) {
  console.error("error: bundled skill not found at " + SKILL_DIR);
  process.exit(1);
}

// home relative -> default global dir (used when a tool has no specific one)
const HOME = (process.env.HOME || process.env.USERPROFILE || "");

// tool -> { local, global } target directory (relative paths, appended under cwd/home)
const TOOLS = {
  claude:     { local: path.join(".claude", "skills"),       global: ".claude/skills" },
  claudecode: { local: path.join(".claude", "skills"),       global: ".claude/skills" },
  opencode:   { local: path.join(".opencode", "skill"),      global: ".config/opencode/skill" },
  codex:      { local: path.join(".codex", "skills"),        global: ".codex/skills" },
  cursor:     { local: path.join(".cursor", "skills"),       global: ".cursor/skills" },
  windsurf:   { local: path.join(".windsurf", "skills"),     global: ".windsurf/skills" },
  trae:       { local: path.join(".trae", "skills"),         global: ".trae/skills" },
  continue:   { local: path.join(".continue", "skills"),     global: ".continue/skills" },
  gemini:     { local: path.join(".gemini", "skills"),       global: ".gemini/skills" },
  agents:     { local: path.join(".agents", "skills"),       global: ".agents/skills" },
  universal:  { local: path.join(".agents", "skills"),       global: ".agents/skills" },
};

// --ai all expands to every distinct tool (local targets, unless --global)
function expand(tool) {
  if (tool === "all") {
    const seen = new Set();
    return Object.keys(TOOLS).filter((t) => !seen.has(TOOLS[t].local) && seen.add(TOOLS[t].local));
  }
  if (!TOOLS[tool]) {
    console.error("error: unknown tool '" + tool + "'. Run 'coding-standards list'.");
    process.exit(2);
  }
  return [tool];
}

function targetDir(tool, isGlobal) {
  const cfg = TOOLS[tool];
  const rel = isGlobal ? cfg.global : cfg.local;
  if (isGlobal && !cfg.global) {
    // fall back to a generic global location under home config
    return path.join(HOME, ".config", cfg.local);
  }
  return isGlobal ? path.join(HOME, rel) : path.resolve(rel);
}

function usage() {
  console.log(`coding-standards v${PKG.version} — install the coding-standards AI skill

  Usage:
    coding-standards init <tool>         Install into a project-local skill dir
                [--ai <tool> | <tool>]   (readable alias; both forms accepted)
                [--global]               Install into the user-global skill dir
                [--force]                Overwrite an existing install
    coding-standards uninstall <tool>    Remove an install
                [--global]
    coding-standards list                List supported tools
    coding-standards --version           Print version
    coding-standards --help              Show this help

  tool: classical-compatible among: ${Object.keys(TOOLS).filter(t => !["claudecode","universal"].includes(t)).join(", ")}, all
`);
}

function parseArgs(argv, expertName) {
  const args = argv.slice(2);
  const opts = { tool: null, global: false, force: false, command: "init" };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--help" || a === "-h") { opts.command = "help"; continue; }
    if (a === "--version" || a === "-v") { opts.command = "version"; continue; }
    if (a === "--global" || a === "-g") { opts.global = true; continue; }
    if (a === "--force" || a === "-f") { opts.force = true; continue; }
    if (a === "--ai") { opts.tool = args[++i]; continue; }
    if (a === "uninstall" || a === "list" || a === "init" || a === "help" || a === "version") { opts.command = a; continue; }
    if (!opts.tool && !a.startsWith("-")) opts.tool = a; // positional tool
  }
  return opts;
}

function copyTree(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

function remove(dest) {
  fs.rmSync(dest, { recursive: true, force: true });
}

function normalizeTool(t) { return (t === "claudecode") ? "claude" : (t === "universal") ? "agents" : t; }

function run() {
  const opts = parseArgs(process.argv);

  if (opts.command === "help") { usage(); return; }
  if (opts.command === "version") { console.log(PKG.version); return; }
  if (opts.command === "list") {
    console.log("Supported tools: " + Object.keys(TOOLS).filter(t => !["claudecode", "universal"].includes(t)).join(", ") + ", all");
    return;
  }
  if (opts.command === "uninstall") {
    if (!opts.tool) { console.error("error: missing tool. 'coding-standards uninstall <tool>'."); process.exit(2); }
    for (const t of expand(opts.tool)) {
      const dest = path.join(targetDir(normalizeTool(t), opts.global), SKILL_NAME);
      remove(dest);
      console.log("uninstalled " + t + " -> " + dest);
    }
    return;
  }

  // init (default command)
  if (!opts.tool) { usage(); process.exit(2); }
  const targets = expand(opts.tool).map((t) => [t, path.join(targetDir(normalizeTool(t), opts.global), SKILL_NAME)]);
  for (const [name, dest] of targets) {
    if (fs.existsSync(dest) && !opts.force) {
      console.log("skip (exists, use --force): " + name + " -> " + dest);
      continue;
    }
    copyTree(SKILL_DIR, dest);
    console.log("installed " + name + " -> " + dest);
  }
  const count = targets.filter(([, d]) => fs.existsSync(d)).length;
  if (count) {
    console.log(`\ndone. The "${SKILL_NAME}" skill is now available to your AI assistant.`);
  }
}

run();