# droppii-agents

Multi-AI coding agent setup for **Claude Code**, **Cursor**, and **Windsurf**. One command bootstraps your project with 72 skills, 14 agents, hooks, and rules.

## Install

> **Requires:** Node.js ≥ 18

### Full setup (Claude Code + Cursor + Windsurf)

```bash
npx github:droppii/droppii-agents init
```

### Per-tool install

```bash
# Claude Code only
npx github:droppii/droppii-agents init --claude

# Cursor / Windsurf only
npx github:droppii/droppii-agents init --cursor

# Preview what will be installed (no writes)
npx github:droppii/droppii-agents init --dry-run
```

## AI Tool Setup

### Claude Code

After install, Claude Code automatically picks up `.claude/` — no extra config needed.

```bash
# Install skill dependencies (Python venv, Node, FFmpeg, etc.)
.claude/skills/install.sh        # macOS / Linux
.claude\skills\install.ps1       # Windows (PowerShell as Admin)
```

### Cursor

1. Run `npx github:droppii/droppii-agents init --cursor` (or `--all`)
2. Restart Cursor — rules and skills load automatically from `.cursor/`
3. Rules in `.cursor/rules/` are `.mdc` files with frontmatter (auto-applied by relevance)
4. Skills in `.cursor/skills/` are numbered folders (`1/`, `2/`, ...) each with a `SKILL.md`

### Windsurf

Windsurf reads `AGENTS.md` at project root for agent instructions.

1. Run `npx github:droppii/droppii-agents init` (installs `AGENTS.md` + `.claude/`)
2. Open Windsurf — it picks up `AGENTS.md` automatically
3. For rules: Windsurf also supports `.cursor/rules/` — same install covers both

## What Gets Installed

| Path | Tool | Contents |
|------|------|----------|
| `.claude/rules/` | Claude Code | Dev rules, workflows, orchestration |
| `.claude/agents/` | Claude Code | 14 agents: planner, tester, reviewer, debugger... |
| `.claude/hooks/` | Claude Code | Automation hooks (session-init, privacy-block...) |
| `.claude/skills/` | Claude Code | 72 skills: cook, plan, debug, fix, brainstorm... |
| `.cursor/rules/` | Cursor / Windsurf | Same rules as `.mdc` files with frontmatter |
| `.cursor/skills/` | Cursor | Skill instructions numbered 1, 2, 3... |
| `CLAUDE.md` | Claude Code | Entry point + project config |
| `AGENTS.md` | Cursor / Windsurf | Entry point for non-Claude AI tools |
| `plans/templates/` | All tools | Plan templates for feature, bug fix, refactor |

## Plan Templates

`plans/templates/` contains ready-to-use templates for structuring your work:

| Template | Use for |
|----------|---------|
| `feature-implementation-template.md` | New features, endpoints, modules |
| `bug-fix-template.md` | Fixing issues, errors, broken functionality |
| `refactor-template.md` | Code structure improvements, performance |
| `template-usage-guide.md` | Guide on which template to use and how |

**Usage:** Copy a template to `plans/YYYYMMDD-slug/plan.md` and fill in the placeholders.

## Update

```bash
npx github:droppii/droppii-agents sync
```

## Options

```
npx github:droppii/droppii-agents init [options]
npx github:droppii/droppii-agents sync [options]

  --claude     Claude Code setup only (.claude/)
  --cursor     Cursor/Windsurf setup only (.cursor/)
  --all        All tools — Claude + Cursor + Windsurf (default)
  --force      Skip overwrite prompts
  --dry-run    Show what would be installed without writing
```

## For Contributors: Rebuild Cursor Templates

`cursor/` is auto-generated from `claude/`. Never edit `cursor/` manually.

```bash
npm run build:cursor
```

## Structure

```
droppii-agents/
├── bin/claudekit.js      ← CLI entrypoint
├── src/
│   ├── init.js           ← install/sync logic
│   ├── convert.js        ← build:cursor converter
│   └── utils.js          ← shared helpers
├── claude/               ← Claude Code templates (source of truth)
├── cursor/               ← Cursor/Windsurf templates (auto-generated)
└── shared/               ← CLAUDE.md.tpl, AGENTS.md.tpl
```
