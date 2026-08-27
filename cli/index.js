#!/usr/bin/env node
"use strict";

// coding-standards-cli (commands: "coding-standards" / "standards")
// Installs the bundled "coding-standards" AI skill into a supported AI coding
// tool's skill directory (Claude Code, OpenCode, Codex CLI, Cursor, Windsurf,
// Trae, Continue, Gemini CLI, and the generic .agents standard).

const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const PKG = require("./package.json");
const SKILL_NAME = "coding-standards";
const SKILL_DIR = path.join(__dirname, "skill", SKILL_NAME);

// Name used in help/errors — matches however the binary was invoked
// (e.g. "standards", "coding-standards", or "index.js").
const prog = path.basename(process.argv[1] || "standards").replace(/\.(js|cmd|exe)$/i, "");

if (!fs.existsSync(path.join(SKILL_DIR, "SKILL.md"))) {
  console.error("error: bundled skill not found at " + SKILL_DIR);
  process.exit(1);
}

// Cross-platform home directory:
//   Windows    C:\Users\<name>
//   macOS      /Users/<name>
//   Linux      /home/<name>
const home = os.homedir();

// tool -> { local, global } target directory (relative paths, appended under cwd/home)
const TOOLS = {
  claude:     { local: path.join(".claude", "skills"),   global: ".claude/skills" },
  claudecode: { local: path.join(".claude", "skills"),   global: ".claude/skills" },
  opencode:   { local: path.join(".opencode", "skills"), global: ".opencode/skills" },
  codex:      { local: path.join(".codex", "skills"),    global: ".codex/skills" },
  cursor:     { local: path.join(".cursor", "skills"),   global: ".cursor/skills" },
  windsurf:   { local: path.join(".windsurf", "skills"), global: ".windsurf/skills" },
  trae:       { local: path.join(".trae", "skills"),     global: ".trae/skills" },
  continue:   { local: path.join(".continue", "skills"), global: ".continue/skills" },
  gemini:     { local: path.join(".gemini", "skills"),   global: ".gemini/skills" },
  agents:     { local: path.join(".agents", "skills"),   global: ".agents/skills" },
  universal:  { local: path.join(".agents", "skills"),   global: ".agents/skills" },
};

function normalizeTool(t) { return (t === "claudecode") ? "claude" : (t === "universal") ? "agents" : t; }

// Expand zero-or-more tool args into a de-duplicated list of base tool names.
// "all" expands to every distinct tool (aliases collapse to their base).
function expandTools(tools) {
  const out = [];
  const seen = new Set();
  const push = (t) => { if (!seen.has(t)) { seen.add(t); out.push(t); } };
  for (const t of tools) {
    if (!t) continue;
    if (t === "all") {
      for (const k of Object.keys(TOOLS)) push(normalizeTool(k));
      continue;
    }
    if (!TOOLS[t]) {
      console.error("error: unknown tool '" + t + "'. Run '" + prog + " list'.");
      process.exit(2);
    }
    push(normalizeTool(t));
  }
  return out;
}

function targetDir(tool, isGlobal) {
  const cfg = TOOLS[tool];
  const rel = isGlobal ? cfg.global : cfg.local;
  if (isGlobal && !cfg.global) {
    // Fall back to a generic global location under the home directory.
    // Never use ~/.config — tools store skills under their own ~/.<tool> dirs.
    return path.join(home, rel);
  }
  return isGlobal ? path.join(home, rel) : path.resolve(rel);
}

function usage() {
  console.log(`${prog} v${PKG.version} — install, list, and update the coding-standards AI skill

  Commands:
    ${prog} init <tool...> [options]     Install into project-local skill dirs
    ${prog} global <tool...> [options]   Install into user-global skill dirs
    ${prog} uninstall <tool...> [--global]
                                         Remove an install
    ${prog} list                         List supported tools
    ${prog} update                       Update this CLI from npm
    ${prog} help                         Show this help
    ${prog} --version                    Print version

  options:
    --global, -g   Install into the user-global skill dir (~/.<tool>/skills)
    --force, -f    Overwrite an existing install
    --ai <tool>    Legacy alias: project-local install of <tool>

  tool: ${Object.keys(TOOLS).filter((t) => !["claudecode", "universal"].includes(t)).join(", ")}, all

  Note: skills are installed under ~/.<tool>/skills, never under ~/.config,
  and ~ always resolves per platform (Linux /home/<you>, macOS /Users/<you>,
  Windows C:\\Users\\<you>).
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { command: "init", tools: [], global: false, force: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--help" || a === "-h") { opts.command = "help"; continue; }
    if (a === "--version" || a === "-v") { opts.command = "version"; continue; }
    if (a === "--global" || a === "-g") { opts.global = true; continue; }
    if (a === "--force" || a === "-f") { opts.force = true; continue; }
    if (a === "--ai") { if (args[i + 1]) opts.tools.push(args[++i]); continue; }
    if (a === "uninstall" || a === "list" || a === "init" || a === "help" ||
        a === "version" || a === "update" || a === "global") { opts.command = a; continue; }
    if (!a.startsWith("-")) opts.tools.push(a);
  }
  // "global" is an alias for init --global
  if (opts.command === "global") { opts.command = "init"; opts.global = true; }
  return opts;
}

function copyTree(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

function remove(dest) {
  fs.rmSync(dest, { recursive: true, force: true });
}

function cmdUpdate() {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const where = "coding-standards-cli@latest";
  console.log(`Updating ${prog} from npm (${where}) ...`);
  const r = spawnSync(npm, ["install", "-g", where], { stdio: "inherit", shell: process.platform === "win32" });
  if (r.status === 0) {
    console.log(`Update finished. New version: ${PKG.version}. Restart your terminal (or re-run '${prog} --version').`);
  } else {
    console.error("error: update failed (npm exit " + (r.status === null ? "non-zero" : r.status) + ").");
    process.exit(r.status || 1);
  }
}

function run() {
  const opts = parseArgs(process.argv);

  if (opts.command === "help") { usage(); return; }
  if (opts.command === "version") { console.log(PKG.version); return; }
  if (opts.command === "update") { cmdUpdate(); return; }
  if (opts.command === "list") {
    console.log("Supported tools: " + Object.keys(TOOLS).filter((t) => !["claudecode", "universal"].includes(t)).join(", ") + ", all");
    return;
  }

  if (opts.command === "uninstall") {
    const tools = expandTools(opts.tools);
    if (!tools.length) { console.error("error: missing tool. '" + prog + " uninstall <tool...>'."); process.exit(2); }
    for (const t of tools) {
      const dest = path.join(targetDir(t, opts.global), SKILL_NAME);
      remove(dest);
      console.log("uninstalled " + t + " -> " + dest);
    }
    return;
  }

  // init (default command; "global" becomes init --global in parseArgs)
  const tools = expandTools(opts.tools);
  if (!tools.length) { usage(); process.exit(2); }
  const targets = tools.map((t) => [t, path.join(targetDir(t, opts.global), SKILL_NAME)]);

  // Guard: a project-local install from inside a skill folder would nest the
  // skill into its own subtree. Detect and warn with the correct alternative.
  if (!opts.global) {
    const cwd = process.cwd();
    const insideSkillDir =
      path.basename(cwd) === SKILL_NAME || fs.existsSync(path.join(cwd, "SKILL.md"));
    const nestsIntoSource = targets.some(([, d]) => {
      const abs = path.resolve(d);
      return abs === SKILL_DIR || abs.startsWith(SKILL_DIR + path.sep);
    });
    if (insideSkillDir || nestsIntoSource) {
      console.warn(
        "note: you are inside a skill directory; project-local init would nest " +
          SKILL_NAME + " into itself.\n      Run from your project root, or use '" +
          prog + " global <tool>' to install into your user-level skill directory."
      );
    }
  }

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