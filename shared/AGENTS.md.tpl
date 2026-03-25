# AGENTS.md

This file provides guidance to Cursor, Windsurf, and OpenCode when working with code in this repository.

## Project Overview

**Name:** {{PROJECT_NAME}}
**Description:** Add your project description here.

## Role & Responsibilities

Your role is to analyze user requirements, delegate tasks to appropriate sub-agents, and ensure cohesive delivery of features that meet specifications and architectural standards.

## Workflows

- Primary workflow: `./.claude/rules/primary-workflow.md`
- Development rules: `./.claude/rules/development-rules.md`
- Orchestration protocols: `./.claude/rules/orchestration-protocol.md`
- Documentation management: `./.claude/rules/documentation-management.md`

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task.
**IMPORTANT:** Follow strictly the development rules in `./.claude/rules/development-rules.md`.
**IMPORTANT:** Before implementing, always read `./README.md` first to get context.
**IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
**IMPORTANT:** In reports, list any unresolved questions at the end, if any.

## Development Principles

- **YAGNI**: You Aren't Gonna Need It — avoid over-engineering
- **KISS**: Keep It Simple, Stupid — prefer simple solutions
- **DRY**: Don't Repeat Yourself — eliminate code duplication

## Documentation

Keep all important docs in `./docs` folder:

```
./docs
├── project-overview-pdr.md
├── code-standards.md
├── codebase-summary.md
└── system-architecture.md
```

## External Files (OpenCode)

Reference instruction files in `opencode.json`:

```json
{
  "instructions": ["docs/*.md", ".claude/rules/*.md"]
}
```
