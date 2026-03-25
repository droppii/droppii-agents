---
name: ck:project-management
description: "Track progress, update plan statuses, manage Claude Tasks, generate reports, coordinate docs updates. Use for project oversight, status checks, plan completion, task hydration, cross-session continuity."
argument-hint: "[task: status, hydrate, sync, report]"
---

# Project Management

Project oversight and coordination using Claude native Tasks with persistent plan files.

**Principles:** Token efficiency | Concise reports | Data-driven insights

## When to Use

- Checking project status or progress across plans
- Updating plan statuses after feature completion
- Hydrating/syncing Claude Tasks with plan files
- Generating status reports or summaries
- Coordinating documentation updates after milestones
- Verifying task completeness against acceptance criteria
- Cross-session resume of multi-phase work

## Core Capabilities

### 1. Task Operations
Load: `references/task-operations.md`

Use `TaskCreate`, `TaskUpdate`, `TaskGet`, `TaskList` to manage session-scoped tasks.
- Create tasks with metadata (phase, priority, effort, planDir, phaseFile)
- Track status: `pending` → `in_progress` → `completed`
- Manage dependencies with `addBlockedBy` / `addBlocks`
- Coordinate parallel agents with scoped ownership

### 2. Session Bridging (Hydration Pattern)
Load: `references/hydration-workflow.md`

Tasks are ephemeral. Plan files are persistent. The hydration pattern bridges them:
- **Hydrate:** Read plan `[ ]` items → `TaskCreate` per unchecked item
- **Work:** `TaskUpdate` tracks progress in real-time
- **Sync-back:** Reconcile all completed tasks against all phase files, update `[ ]` → `[x]`, update YAML frontmatter status
- **Resume:** Next session re-hydrates from remaining `[ ]` items

### 3. Progress Tracking
Load: `references/progress-tracking.md`

- Scan `./plans/*/plan.md` for active plans
- Parse YAML frontmatter for status, priority, effort
- Count `[x]` vs `[ ]` in phase files for completion %
- Cross-reference completed work against planned tasks
- Verify acceptance criteria met before marking complete

### 4. Documentation Coordination
Load: `references/documentation-triggers.md`

Trigger `./docs` updates when:
- Phase status changes, major features complete
- API contracts change, architecture decisions made
- Security patches applied, breaking changes occur

Delegate to `docs-manager` subagent for actual updates.

### 5. Status Reporting
Load: `references/reporting-patterns.md`

Generate reports: session summaries, plan completion, multi-plan overviews.
- Use naming: `{reports-path}/pm-{date}-{time}-{slug}.md`
- Sacrifice grammar for brevity; use tables over prose
- List unresolved questions at end

## Workflow

```
[Scan Plans] → [Hydrate Tasks] → [Track Progress] → [Update Status] → [Generate Report] → [Trigger Doc Updates]
```

1. `TaskList()` — check existing tasks first
2. If empty: hydrate from plan files (unchecked items)
3. During work: `TaskUpdate` as tasks progress
4. On completion: run full-plan sync-back (all phase files, including backfill for earlier phases), then update YAML frontmatter
5. Generate status report to reports directory
6. Delegate doc updates if changes warrant

## Mandatory Sync-Back Guard

When updating plan status, NEVER mark only the currently active phase.

1. Sweep all `phase-XX-*.md` files under the target plan directory.
2. Reconcile every `TaskUpdate(status: "completed")` item to phase metadata (`phase` / `phaseFile`).
3. Backfill stale checkboxes in earlier phases before marking later phases done.
4. Update `plan.md` status/progress from real checkbox counts.
5. If any completed task cannot be mapped to a phase file, report unresolved mappings and do not claim full completion.

## Plan YAML Frontmatter

All `plan.md` files MUST have:

```yaml
---
title: Feature name
status: in-progress  # pending | in-progress | completed
priority: P1
effort: medium
branch: feature-branch
tags: [auth, api]
created: 2026-02-05
---
```

Update `status` when plan state changes.

## Quality Standards

- All analysis data-driven, referencing specific plans and reports
- Focus on business value delivery and actionable insights
- Highlight critical issues requiring immediate attention
- Maintain traceability between requirements and implementation

## Related Skills

- `ck:plan` — Creates implementation plans (planning phase)
- `ck:cook` — Implements plans (execution phase, invokes project-manager at finalize)
- `plans-kanban` — Visual dashboard for plan viewing


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### documentation triggers

# Documentation Triggers

## When to Update Docs

MUST update project documentation in `./docs` when:

| Trigger | Which Docs | Action |
|---------|-----------|--------|
| Phase status changes | project-roadmap.md | Update progress %, milestone status |
| Major feature complete | project-roadmap.md, codebase-summary.md | Add feature, update architecture |
| Bug fix (significant) | project-roadmap.md | Document fix, severity, impact |
| Security patch | project-roadmap.md, system-architecture.md | Record improvement |
| API contract changes | system-architecture.md, code-standards.md | Update endpoints, schemas |
| Architecture decision | system-architecture.md | Document decision + rationale |
| Scope/timeline change | project-roadmap.md | Adjust phases, dates |
| Dependencies updated | system-architecture.md | Record version changes |
| Breaking changes | code-standards.md | Document migration path |

## Documentation Files

```
./docs/
├── project-overview-pdr.md     # Product requirements
├── code-standards.md           # Coding conventions
├── codebase-summary.md         # Architecture overview
├── design-guidelines.md        # UI/UX standards
├── deployment-guide.md         # Deploy procedures
├── system-architecture.md      # System design
└── project-roadmap.md          # Milestones & progress
```

## Update Protocol

1. **Read current state:** Always read target doc before editing
2. **Analyze reports:** Review agent reports in plan reports directory
3. **Update content:** Modify progress %, statuses, dates, descriptions
4. **Cross-reference:** Ensure consistency across docs
5. **Validate:** Verify dates, versions, references accurate

## Quality Standards

- **Consistency:** Same formatting, versioning across all docs
- **Accuracy:** Progress %, dates, statuses reflect reality
- **Completeness:** Sufficient detail for stakeholder communication
- **Timeliness:** Update within same session as significant changes
- **Traceability:** Clear links between roadmap items and implementation

## Delegation Pattern

Use `docs-manager` subagent for documentation updates:

```
Task(
  subagent_type: "docs-manager",
  prompt: "Update ./docs for [changes]. Work context: [path]",
  description: "Update docs"
)
```

Project manager coordinates WHEN to update; docs-manager handles HOW.


### hydration workflow

# Hydration Workflow

Tasks are **session-scoped** — they disappear when the session ends. Plan files are the **persistent** layer. The hydration pattern bridges sessions.

## Flow Diagram

```
┌──────────────────┐  Hydrate   ┌───────────────────┐
│ Plan Files       │ ─────────► │ Claude Tasks      │
│ (persistent)     │            │ (session-scoped)  │
│ [ ] Phase 1      │            │ ◼ pending         │
│ [ ] Phase 2      │            │ ◼ pending         │
└──────────────────┘            └───────────────────┘
                                        │ Work
                                        ▼
┌──────────────────┐  Sync-back ┌───────────────────┐
│ Plan Files       │ ◄───────── │ Task Updates      │
│ (updated)        │            │ (completed)       │
│ [x] Phase 1      │            │ ✓ completed       │
│ [ ] Phase 2      │            │ ◼ in_progress     │
└──────────────────┘            └───────────────────┘
```

## Session Start: Hydration

1. Read plan files: `plan.md` + `phase-XX-*.md`
2. Identify unchecked `[ ]` items = remaining work
3. `TaskCreate` per unchecked item with metadata (phase, priority, effort, planDir, phaseFile)
4. Set up `addBlockedBy` dependency chains between phases
5. Already-checked `[x]` items = done, skip

**Check first:** `TaskList()` — if tasks already exist (same session), skip re-creation.

## During Work

- `TaskUpdate(status: "in_progress")` when picking up a task
- `TaskUpdate(status: "completed")` immediately after finishing
- Parallel agents coordinate through shared task list
- Blocked tasks auto-unblock when dependencies complete

## Session End: Sync-Back

1. Collect completed tasks (`TaskUpdate(status: "completed")`) with metadata (`phase`, `phaseFile`, `planDir`).
2. Sweep all `phase-XX-*.md` files in the target plan directory.
3. Reconcile and backfill: update `[ ]` → `[x]` for all completed items across every phase file (including earlier phases).
4. Update `plan.md` frontmatter: status field (pending → in-progress → completed).
5. Update progress percentages in `plan.md` overview from real checkbox counts.
6. Report unresolved mappings when completed tasks cannot be matched to a phase file.
7. Git commit captures state transition for next session.

## Cross-Session Resume

When user runs `/ck:cook path/to/plan.md` in a new session:
1. `TaskList()` → empty (tasks died with old session)
2. Read plan files → re-hydrate from unchecked `[ ]` items
3. Already-checked `[x]` = done, creates tasks only for remaining work
4. Dependency chain reconstructed automatically

## Compound Interest Effect

Each hydration cycle makes specs smarter:
- **Session 1:** Execute first tasks, establish patterns
- **Session 2:** See completed work, build on established patterns
- **Session 3:** Full context of prior sessions, fewer clarifications needed

Git history shows progression. Completed checkboxes show the path that worked. Specs gain **institutional memory** across sessions.

## YAML Frontmatter Sync

Plan files MUST have frontmatter with these fields:

```yaml
---
title: Feature name
description: Brief description
status: in-progress  # pending | in-progress | completed
priority: P1
effort: medium
branch: feature-branch
tags: [auth, api]
created: 2026-02-05
---
```

Update `status` field during sync-back when plan state changes.


### progress tracking

# Progress Tracking

## Plan Analysis Workflow

1. **Read plans directory:** Glob `./plans/*/plan.md` to discover all plans
2. **Parse YAML frontmatter:** Extract status, priority, effort, branch, tags
3. **Scan phase files:** Count `[x]` (done) vs `[ ]` (remaining) in each phase
4. **Reconcile completed tasks:** Ensure all completed task metadata is reflected in phase files (backfill stale earlier phases first)
5. **Calculate progress:** `completed / total * 100` per plan
6. **Cross-reference:** Compare plan tasks against actual implementation

## Status Update Protocol

### Plan-Level Status

Update `plan.md` frontmatter `status` field:

| Condition | Status |
|-----------|--------|
| No phases started | `pending` |
| Any phase in progress | `in-progress` |
| All phases complete | `completed` |

### Phase-Level Status

Each `phase-XX-*.md` tracks with checkboxes:
- `[ ]` = pending
- `[x]` = completed
- Count ratio for progress percentage

### Task-Level Status

Claude Tasks (session-scoped): `pending` → `in_progress` → `completed`

### Reconciliation Rule

If a later phase is marked done while earlier phases still contain stale unchecked completed items, backfill earlier phases in the same sync pass before final status reporting.

## Verification Checklist

When verifying task completeness:

1. **Acceptance criteria met?** — Check against plan requirements
2. **Code quality validated?** — code-reviewer agent report available?
3. **Tests passing?** — tester agent report confirms 100% pass?
4. **Documentation updated?** — docs match implementation?
5. **No regressions?** — Existing functionality intact?

## Report Generation

### Status Summary Template

```markdown
## Project Status: [Date]

### Active Plans
| Plan | Progress | Priority | Status | Branch |
|------|----------|----------|--------|--------|
| [name] | [X]% | P[N] | [status] | [branch] |

### Completed This Session
- [x] [description]

### Blockers & Risks
- [ ] [description] — [mitigation]

### Next Steps
1. [Priority action]
2. [Follow-up]
```

### Detailed Report Template

```markdown
## [Plan Name] - Detailed Status

### Achievements
- Completed features, resolved issues, delivered value

### Testing Status
- Components needing validation, test scenarios, quality gates

### Risk Assessment
- Potential blockers, technical debt, mitigation strategies

### Recommendations
- Prioritized next steps, resource needs, timeline projections
```

## Metrics to Track

- **Phase completion %** — How much of each phase is done
- **Blocker count** — Open blockers preventing progress
- **Dependency chain health** — Any circular or stale dependencies
- **Time since last update** — Identify stale plans needing attention
- **Test coverage** — Per-feature test pass rates


### reporting patterns

# Reporting Patterns

## Report Types

### 1. Session Status Report

Quick summary of work done in current session.

```markdown
## Session Report: [Date]

### Work Completed
- [x] [Task/feature description]
- [x] [Task/feature description]

### In Progress
- [ ] [Task description] — [% complete, blocker if any]

### Tasks Created
- [N] tasks hydrated from [plan]
- [M] completed, [K] remaining

### Next Session
1. [Priority item]
2. [Follow-up item]
```

### 2. Plan Completion Report

Comprehensive summary when a plan reaches completion.

```markdown
## Plan Complete: [Plan Name]

### Summary
- **Duration:** [start] → [end]
- **Phases:** [N] completed
- **Files changed:** [count]
- **Tests:** [pass/total]

### Achievements
- [Feature/capability delivered]

### Known Limitations
- [Any caveats or future work needed]

### Documentation Updates
- [Which docs were updated]
```

### 3. Progress Report (Multi-Plan)

Overview across all active plans.

```markdown
## Project Progress: [Date]

| Plan | Status | Progress | Priority | Next Action |
|------|--------|----------|----------|-------------|
| [name] | [status] | [%] | P[N] | [action] |

### Highlights
- [Key achievement or milestone]

### Risks
- [Risk] — [Mitigation]

### Blockers
- [Blocker] — [Resolution path]
```

## Report Naming

Use pattern from `## Naming` section injected by hooks:
`{reports-path}/pm-{date}-{time}-{slug}.md`

Example: `plans/reports/pm-260205-2221-auth-progress.md`

## Report Generation Workflow

1. `TaskList()` → gather all task statuses
2. Glob `./plans/*/plan.md` → scan active plans
3. Read phase files → count checkboxes
4. Compile metrics into report template
5. Write to reports directory
6. Highlight: achievements, blockers, risks, next steps

## Concision Rules

- Sacrifice grammar for brevity
- Use tables over paragraphs where possible
- List unresolved questions at end
- Metrics > prose (use numbers, percentages)
- Skip obvious context; focus on actionable insights


### task operations

# Task Operations Reference

Claude Code provides 4 native tools for session-scoped task management.

## TaskCreate

Create structured tasks with metadata and dependencies.

```
TaskCreate(
  subject: "Implement JWT auth middleware",
  description: "Add JWT validation to API routes. Verify tokens, extract claims, attach to context.",
  activeForm: "Implementing JWT auth middleware",
  metadata: { feature: "auth", phase: 2, priority: "P1", effort: "2h",
              planDir: "plans/260205-auth/", phaseFile: "phase-02-api.md" }
)
```

**Parameters:**
- `subject` (required): Imperative title, <60 chars ("Implement X", "Add Y", "Fix Z")
- `description` (required): Detailed requirements + acceptance criteria
- `activeForm` (optional): Present-continuous shown in spinner ("Implementing X")
- `metadata` (optional): Arbitrary key-value pairs for tracking

**Required metadata fields:** `phase`, `priority` (P1/P2/P3), `effort`, `planDir`, `phaseFile`
**Optional metadata:** `step`, `critical`, `riskLevel`, `dependencies`, `feature`, `owner`

## TaskUpdate

Manage state transitions and dependency chains.

```
TaskUpdate(
  taskId: "task-123",
  status: "in_progress",
  addBlockedBy: ["task-122"]
)
```

**Status lifecycle:** `pending` → `in_progress` → `completed`

**Dependency fields:**
- `addBlockedBy`: "I cannot start until these tasks complete"
- `addBlocks`: "These tasks cannot start until I complete"
- `owner`: Assign to specific agent

When a blocking task completes, dependent tasks auto-unblock.

## TaskGet & TaskList

- `TaskGet(taskId)` → Full task details including dependencies
- `TaskList()` → All tasks with status, owner, blockedBy

**Task is "available" when:** status=`pending`, no owner, blockedBy list empty.

## Dependency Patterns

```
Phase 1 (no blockers)              ← start here
Phase 2 (addBlockedBy: [P1-id])    ← auto-unblocked when P1 completes
Phase 3 (addBlockedBy: [P2-id])
Step 3.4 (addBlockedBy: [P2-id])   ← critical steps share phase dependency
```

## When to Use Tasks

| Scenario | Tasks? | Why |
|----------|--------|-----|
| Multi-phase feature (3+) | Yes | Track progress, enable parallel |
| Complex dependencies | Yes | Automatic unblocking |
| Parallel agent work | Yes | Shared progress tracking |
| Single-phase quick fix | No | Overhead exceeds benefit |
| <3 related steps | No | Just do them directly |

**3-Task Rule:** <3 tasks → skip creation, overhead not worth it.

## Parallel Agent Coordination

1. Create tasks with scoped ownership per agent
2. Each agent works in designated directories only
3. When Agent A completes a task → `TaskUpdate(status: "completed")`
4. Tasks blocked by completed work auto-unblock
5. Agent B (or A) claims newly available work

**Key:** Assign `owner` field to prevent agents from claiming same task.


