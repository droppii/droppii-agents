---
name: ck:bootstrap
description: "Bootstrap new projects with research, tech stack, design, planning, and implementation. Modes: full (interactive), auto (default), fast (skip research), parallel (multi-agent)."
license: MIT
argument-hint: "[requirements] [--full|--auto|--fast|--parallel]"
---

# Bootstrap - New Project Scaffolding

End-to-end project bootstrapping from idea to running code.

**Principles:** YAGNI, KISS, DRY | Token efficiency | Concise reports

## Usage

```
/bootstrap <user-requirements>
```

**Flags** (optional, default `--auto`):

| Flag | Mode | Thinking | User Gates | Planning Skill | Cook Skill |
|------|------|----------|------------|----------------|------------|
| `--full` | Full interactive | Ultrathink | Every phase | `--hard` | (interactive) |
| `--auto` | Automatic | Ultrathink | Design only | `--auto` | `--auto` |
| `--fast` | Quick | Think hard | None | `--fast` | `--auto` |
| `--parallel` | Multi-agent | Ultrathink | Design only | `--parallel` | `--parallel` |

**Example:**
```
/bootstrap "Build a SaaS dashboard with auth" --fast
/bootstrap "E-commerce platform with Stripe" --parallel
```

## Workflow Overview

```
[Git Init] → [Research?] → [Tech Stack?] → [Design?] → [Planning] → [Implementation] → [Test] → [Review] → [Docs] → [Onboard] → [Final]
```

Each mode loads a specific workflow reference + shared phases.

## Mode Detection

If no flag provided, default to `--auto`.

Load the appropriate workflow reference:
- `--full`: Load `references/workflow-full.md`
- `--auto`: Load `references/workflow-auto.md`
- `--fast`: Load `references/workflow-fast.md`
- `--parallel`: Load `references/workflow-parallel.md`

All modes share: Load `references/shared-phases.md` for implementation through final report.

## Step 0: Git Init (ALL modes)

Check if Git initialized. If not:
- `--full`: Ask user if they want to init → `git-manager` subagent (`main` branch)
- Others: Auto-init via `git-manager` subagent (`main` branch)

## Skill Triggers (MANDATORY)

After early phases (research, tech stack, design), trigger downstream skills:

### Planning Phase
Activate **ck:plan** skill with mode-appropriate flag:
- `--full` → `/ck:plan --hard <requirements>` (thorough research + validation)
- `--auto` → `/ck:plan --auto <requirements>` (auto-detect complexity)
- `--fast` → `/ck:plan --fast <requirements>` (skip research)
- `--parallel` → `/ck:plan --parallel <requirements>` (file ownership + dependency graph)

Planning skill outputs a plan path. Pass this to cook.

### Implementation Phase
Activate **ck:cook** skill with the plan path and mode-appropriate flag:
- `--full` → `/ck:cook <plan-path>` (interactive review gates)
- `--auto` → `/ck:cook --auto <plan-path>` (skip review gates)
- `--fast` → `/ck:cook --auto <plan-path>` (skip review gates)
- `--parallel` → `/ck:cook --parallel <plan-path>` (multi-agent execution)

## Role

Elite software engineering expert specializing in system architecture and technical decisions. Brutally honest about feasibility and trade-offs.

## Critical Rules

- Activate relevant skills from catalog during the process
- Keep all research reports ≤150 lines
- All docs written to `./docs` directory
- Plans written to `./plans` directory using naming from `## Naming` section
- DO NOT implement code directly — delegate through planning + cook skills
- Sacrifice grammar for concision in reports
- List unresolved questions at end of reports

## References

- `references/workflow-full.md` - Full interactive workflow
- `references/workflow-auto.md` - Auto workflow (default)
- `references/workflow-fast.md` - Fast workflow
- `references/workflow-parallel.md` - Parallel workflow
- `references/shared-phases.md` - Common phases (implementation → final report)


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### shared phases

# Shared Phases (All Modes)

These phases apply after planning is complete and cook skill is activated.
Cook skill handles most of these — this reference documents bootstrap-specific guidance.

## Implementation

Handled by **ck:cook** skill. Bootstrap-specific notes:
- Use main agent to implement step by step per plan in `./plans`
- Use `ui-ux-designer` subagent for frontend per `./docs/design-guidelines.md`
- Asset pipeline: `ck:ai-multimodal` (generate/analyze) → `imagemagick` (crop/resize) → background removal if needed
- Run type checking and compile after each phase

## Testing

Handled by **ck:cook** skill. Bootstrap-specific notes:
- Write real tests — NO fake data, mocks, cheats, tricks, temporary solutions
- `tester` subagent runs tests → report to main agent
- If failures: `debugger` subagent → fix → repeat until all pass
- DO NOT ignore failed tests to pass build/CI

## Code Review

Handled by **ck:cook** skill. Bootstrap-specific notes:
- `code-reviewer` subagent reviews code
- If critical issues: fix → retest → repeat
- Report summary to user when all tests pass and code reviewed

## Documentation

After code review passes. Use `docs-manager` subagent to create/update:
- `./docs/README.md` (≤300 lines)
- `./docs/codebase-summary.md`
- `./docs/project-overview-pdr.md` (Product Development Requirements)
- `./docs/code-standards.md`
- `./docs/system-architecture.md`

Use `project-manager` subagent to create:
- `./docs/project-roadmap.md`
- Update plan/phase status to complete

## Onboarding

Guide user to get started with the project:
- Ask 1 question at a time, wait for answer before next
- Example: instruct user to obtain API key → ask for key → add to env vars
- If user requests config changes, repeat until approved

## Final Report

1. Summary of all changes, brief explanations
2. Guide user to get started + suggest next steps
3. Ask user if they want to commit/push:
   - If yes: `git-manager` subagent to commit (and push if requested)
   - `--fast` mode: auto-commit (no push) without asking

**Report rules:**
- Sacrifice grammar for concision
- List unresolved questions at end, if any


### workflow auto

# Auto Workflow (`--auto`) — Default

**Thinking level:** Ultrathink
**User gates:** Design approval only. All other phases proceed automatically.

## Step 1: Research

Spawn multiple `researcher` subagents in parallel:
- Explore request, idea validation, challenges, best solutions
- Keep every report ≤150 lines

No user gate — proceed automatically.

## Step 2: Tech Stack

1. Use `planner` + multiple `researcher` subagents in parallel for best-fit stack
2. Write tech stack to `./docs` directory

No user gate — auto-select best option.

## Step 3: Wireframe & Design

1. Use `ui-ux-designer` + `researcher` subagents in parallel:
   - Research style, trends, fonts (predict Google Fonts name, NOT just Inter/Poppins), colors, spacing, positions
   - Describe assets for `ck:ai-multimodal` skill generation
2. `ui-ux-designer` creates:
   - Design guidelines at `./docs/design-guidelines.md`
   - Wireframes in HTML at `./docs/wireframe/`
3. If no logo provided: generate with `ck:ai-multimodal` skill
4. Screenshot wireframes with `ck:chrome-devtools` → save to `./docs/wireframes/`

**Gate:** Ask user to approve design. Repeat if rejected.

**Image tools:** `ck:ai-multimodal` for generation/analysis, `imagemagick` for crop/resize, background removal tool as needed.

## Step 4: Planning

Activate **ck:plan** skill: `/ck:plan --auto <requirements>`
- Planning skill auto-detects complexity and picks appropriate mode
- Creates plan directory using `## Naming` pattern
- Overview at `plan.md` (<80 lines) + `phase-XX-*.md` files

No user gate — proceed to implementation.

## Step 5: Implementation → Final Report

Load `references/shared-phases.md` for remaining phases.

Activate **ck:cook** skill: `/ck:cook --auto <plan-path>`
- Skips all review gates
- Auto-approves if score≥9.5 and 0 critical issues
- Continues through all phases without stopping


### workflow fast

# Fast Workflow (`--fast`)

**Thinking level:** Think hard
**User gates:** None. Fully autonomous from start to finish.

## Step 1: Combined Research & Planning

All research happens in parallel, then feeds into planning:

**Parallel research batch** (spawn these simultaneously):
- 2 `researcher` subagents (max 5 sources each): explore request, validate idea, find solutions
- 2 `researcher` subagents (max 5 sources each): find best-fit tech stack
- 2 `researcher` subagents (max 5 sources each): research design style, trends, fonts, colors, spacing, positions
  - Predict Google Fonts name (NOT just Inter/Poppins)
  - Describe assets for `ck:ai-multimodal` generation

Keep all reports ≤150 lines.

## Step 2: Design

1. `ui-ux-designer` subagent analyzes research, creates:
   - Design guidelines at `./docs/design-guidelines.md`
   - Wireframes in HTML at `./docs/wireframe/`
2. If no logo provided: generate with `ck:ai-multimodal` skill
3. Screenshot wireframes with `ck:chrome-devtools` → save to `./docs/wireframes/`

**Image tools:** `ck:ai-multimodal` for generation/analysis, `imagemagick` for crop/resize, background removal tool as needed.

No user gate — proceed directly.

## Step 3: Planning

Activate **ck:plan** skill: `/ck:plan --fast <requirements>`
- Skip research (already done above)
- Read codebase docs → create plan directly
- Plan directory using `## Naming` pattern
- Overview at `plan.md` (<80 lines) + `phase-XX-*.md` files

No user gate — proceed to implementation.

## Step 4: Implementation → Final Report

Load `references/shared-phases.md` for remaining phases.

Activate **ck:cook** skill: `/ck:cook --auto <plan-path>`
- Skips all review gates (fast planning pairs with fast execution)
- Auto-approves if score≥9.5 and 0 critical issues
- Continues through all phases without stopping

**Note:** Fast mode uses `git-manager` to auto-commit (no push) at the end.


### workflow full

# Full Interactive Workflow (`--full`)

**Thinking level:** Ultrathink
**User gates:** Every major phase requires user approval before proceeding.

## Step 1: Clarify Requirements

Use `AskUserQuestion` to probe user's request, constraints, true objectives.
- Ask 1 question at a time, wait for answer before next
- Question everything — don't assume
- Challenge assumptions — best solution often differs from initial vision
- Continue until 100% certain about requirements

## Step 2: Research

Spawn multiple `researcher` subagents in parallel:
- Explore request validity, challenges, best solutions
- Keep every report ≤150 lines

**Gate:** Present findings to user. Proceed only with approval.

## Step 3: Tech Stack

1. Ask user for preferred tech stack. If provided, skip to step 4.
2. Use `planner` + multiple `researcher` subagents in parallel to find best-fit stack
3. Present 2-3 options with pros/cons via `AskUserQuestion`
4. Write approved tech stack to `./docs` directory

**Gate:** User approves tech stack before continuing.

## Step 4: Wireframe & Design

1. Ask user if they want wireframes/design. If no → skip to Step 5.
2. Use `ui-ux-designer` + `researcher` subagents in parallel:
   - Research style, trends, fonts (predict Google Fonts name, NOT just Inter/Poppins), colors, spacing, positions
   - Describe assets for `ck:ai-multimodal` skill generation
3. `ui-ux-designer` creates:
   - Design guidelines at `./docs/design-guidelines.md`
   - Wireframes in HTML at `./docs/wireframe/`
4. If no logo provided: generate with `ck:ai-multimodal` skill
5. Screenshot wireframes with `ck:chrome-devtools` → save to `./docs/wireframes/`

**Gate:** User approves design. Repeat if rejected.

**Image tools:** `ck:ai-multimodal` for generation/analysis, `imagemagick` for crop/resize, background removal tool as needed.

## Step 5: Planning

Activate **ck:plan** skill: `/ck:plan --hard <requirements>`
- Planner creates directory using `## Naming` pattern
- Overview at `plan.md` (<80 lines) + `phase-XX-*.md` files
- Present pros/cons of plan

**Gate:** User approves plan. DO NOT start implementing without approval.

## Step 6: Implementation → Final Report

Load `references/shared-phases.md` for remaining phases.

Activate **ck:cook** skill: `/ck:cook <plan-path>` (interactive mode — review gates at each step)


### workflow parallel

# Parallel Workflow (`--parallel`)

**Thinking level:** Ultrathink parallel
**User gates:** Design approval only. Implementation uses multi-agent parallel execution.

## Step 1: Research

Spawn max 2 `researcher` agents in parallel:
- Explore requirements, validation, challenges, solutions
- Keep reports ≤150 lines

No user gate — proceed automatically.

## Step 2: Tech Stack

Use `planner` + multiple `researcher` agents in parallel for best-fit stack.
Write to `./docs` directory (≤150 lines).

No user gate — proceed automatically.

## Step 3: Wireframe & Design

1. Use `ui-ux-designer` + `researcher` agents in parallel:
   - Research style, trends, fonts, colors, spacing, positions
   - Predict Google Fonts name (NOT just Inter/Poppins)
   - Describe assets for `ck:ai-multimodal` generation
2. `ui-ux-designer` creates:
   - Design guidelines at `./docs/design-guidelines.md`
   - Wireframes in HTML at `./docs/wireframe/`
3. If no logo: generate with `ck:ai-multimodal` skill
4. Screenshot with `ck:chrome-devtools` → save to `./docs/wireframes/`

**Gate:** Ask user to approve design. Repeat if rejected.

**Image tools:** `ck:ai-multimodal` for generation/analysis, `imagemagick` for crop/resize, background removal tool as needed.

## Step 4: Parallel Planning

Activate **ck:plan** skill: `/ck:plan --parallel <requirements>`
- Creates phases with **exclusive file ownership** per phase (no overlap)
- **Dependency matrix**: which phases run concurrently vs sequentially
- `plan.md` includes dependency graph, execution strategy, file ownership matrix
- Task hydration with `addBlockedBy` for sequential deps, no blockers for parallel groups

No user gate — proceed to implementation.

## Step 5: Parallel Implementation → Final Report

Load `references/shared-phases.md` for remaining phases.

Activate **ck:cook** skill: `/ck:cook --parallel <plan-path>`
- Read `plan.md` for dependency graph and execution strategy
- Launch multiple `fullstack-developer` agents in PARALLEL for concurrent phases
  - Pass: phase file path, environment info
- Use `ui-ux-designer` for frontend (generate/analyze assets with `ck:ai-multimodal`, edit with `imagemagick`)
- Respect file ownership boundaries
- Run type checking after implementation

Cook handles testing, review, docs, onboarding, final report per `shared-phases.md`.


