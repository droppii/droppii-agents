---
name: ck:fix
description: "ALWAYS activate this skill before fixing ANY bug, error, test failure, CI/CD issue, type error, lint, log error, UI issue, code problem."
version: 1.2.0
argument-hint: "[issue] --auto|--review|--quick|--parallel"
---

# Fixing

Unified skill for fixing issues of any complexity with intelligent routing.

## Arguments

- `--auto` - Activate autonomous mode (**default**)
- `--review` - Activate human-in-the-loop review mode
- `--quick` - Activate quick mode
- `--parallel` - Activate parallel mode: route to parallel `fullstack-developer` agents per issue

## Workflow

### Step 1: Mode Selection

**First action:** If there is no "auto" keyword in the request, use `AskUserQuestion` to determine workflow mode:

| Option | Recommend When | Behavior |
|--------|----------------|----------|
| **Autonomous** (default) | Simple/moderate issues | Auto-approve if score >= 9.5 & 0 critical |
| **Human-in-the-loop Review** | Critical/production code | Pause for approval at each step |
| **Quick** | Type errors, lint, trivial bugs | Fast debug → fix → review cycle |

See `references/mode-selection.md` for AskUserQuestion format.

### Step 2: Debug

- Follow `@.cursor/skills/debug/SKILL.md`.
- Guess all possible root causes.
- Spawn multiple `Explore` subagents in parallel to verify each hypothesis.
- Create report with all findings for the next step.

### Step 3: Complexity Assessment & Task Orchestration

Classify before routing. See `references/complexity-assessment.md`.

| Level | Indicators | Workflow |
|-------|------------|----------|
| **Simple** | Single file, clear error, type/lint | `references/workflow-quick.md` |
| **Moderate** | Multi-file, root cause unclear | `references/workflow-standard.md` |
| **Complex** | System-wide, architecture impact | `references/workflow-deep.md` |
| **Parallel** | 2+ independent issues OR `--parallel` flag | Parallel `fullstack-developer` agents |

**Task Orchestration (Moderate+ only):** After classifying, create native Claude Tasks for all phases upfront with dependencies. See `references/task-orchestration.md`.
- Skip for Quick workflow (< 3 steps, overhead exceeds benefit)
- Use `TaskCreate` with `addBlockedBy` for dependency chains
- Update via `TaskUpdate` as each phase completes
- For Parallel: create separate task trees per independent issue

### Step 4: Fix Implementation & Verification

- Implement fix per selected workflow, updating Tasks as phases complete.
- Spawn multiple `Explore` subagents to verify no regressions.
- Prevent future issues by adding comprehensive validation.

### Step 5: Finalize (MANDATORY - never skip)

1. Report summary: confidence score, changes, files
2. `docs-manager` subagent → update `./docs` if changes warrant (NON-OPTIONAL)
3. `TaskUpdate` → mark ALL Claude Tasks `completed`
4. Ask user if they want to commit via `git-manager` subagent

---

## IMPORTANT: Skill/Subagent Activation Matrix

See `references/skill-activation-matrix.md` for complete matrix.

**Always activate:** `ck:debug` (all workflows)
**Conditional:** `ck:problem-solving`, `ck:sequential-thinking`, `ck:brainstorm`, `ck:context-engineering`
**Subagents:** `debugger`, `researcher`, `planner`, `code-reviewer`, `tester`, `Bash`
**Parallel:** Multiple `Explore` agents for scouting, `Bash` agents for verification

## Output Format

Unified step markers:
```
✓ Step 0: [Mode] selected - [Complexity] detected
✓ Step 1: Root cause identified - [summary]
✓ Step 2: Fix implemented - [N] files changed
✓ Step 3: Tests [X/X passed]
✓ Step 4: Review [score]/10 - [status]
✓ Step 5: Complete - [action taken]
```

## References

Load as needed:
- `references/mode-selection.md` - AskUserQuestion format for mode
- `references/complexity-assessment.md` - Classification criteria
- `references/task-orchestration.md` - Native Claude Task patterns for moderate+ workflows
- `references/workflow-quick.md` - Quick: debug → fix → review
- `references/workflow-standard.md` - Standard: full pipeline with Tasks
- `references/workflow-deep.md` - Deep: research + brainstorm + plan with Tasks
- `references/review-cycle.md` - Review logic (autonomous vs HITL)
- `references/skill-activation-matrix.md` - When to activate each skill
- `references/parallel-exploration.md` - Parallel Explore/Bash/Task coordination patterns

**Specialized Workflows:**
- `references/workflow-ci.md` - GitHub Actions/CI failures
- `references/workflow-logs.md` - Application log analysis
- `references/workflow-test.md` - Test suite failures
- `references/workflow-types.md` - TypeScript type errors
- `references/workflow-ui.md` - Visual/UI issues (requires design skills)


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### complexity assessment

# Complexity Assessment

Classify issue complexity before routing to workflow.

## Classification Criteria

### Simple (→ workflow-quick.md) — No Tasks

**Indicators:**
- Single file affected
- Clear error message (type error, syntax, lint)
- Keywords: `type`, `typescript`, `tsc`, `lint`, `eslint`, `syntax`
- Obvious fix location
- No investigation needed

**Task usage:** Skip. < 3 steps, overhead exceeds benefit.

**Examples:**
- "Fix type error in auth.ts"
- "ESLint errors after upgrade"
- "Syntax error in config file"

### Moderate (→ workflow-standard.md) — Use Tasks

**Indicators:**
- 2-5 files affected
- Root cause unclear but localized
- Needs debugging investigation
- Keywords: `bug`, `broken`, `not working`, `fails sometimes`
- Test failures with unclear cause

**Task usage:** Create 6 phase tasks with dependencies. See `references/task-orchestration.md`.

**Examples:**
- "Login sometimes fails"
- "API returns wrong data"
- "Component not rendering correctly"

### Complex (→ workflow-deep.md) — Use Tasks with Dependency Chains

**Indicators:**
- System-wide impact (5+ files)
- Architecture decision needed
- Research required for solution
- Keywords: `architecture`, `refactor`, `system-wide`, `design issue`
- Performance/security vulnerabilities
- Multiple interacting components

**Task usage:** Create 8 phase tasks. Steps 1+2 run parallel (debug+research). Full dependency chains. See `references/task-orchestration.md`.

**Examples:**
- "Memory leak in production"
- "Database deadlocks under load"
- "Security vulnerability in auth flow"

### Parallel (→ multiple fullstack-developer agents) — Use Task Trees

**Triggers:**
- `--parallel` flag explicitly passed (activate parallel routing regardless of auto-classification)

**Indicators:**
- 2+ independent issues mentioned
- Issues in different areas (frontend + backend, auth + payments)
- No dependencies between issues
- Keywords: list of issues, "and", "also", multiple error types

**Task usage:** Create separate task trees per independent issue. Spawn `fullstack-developer` agent per tree. Agents coordinate via `TaskUpdate`/`TaskList`. See `references/task-orchestration.md`.

**Examples:**
- "Fix type errors AND update UI styling"
- "Auth bug + payment integration issue"
- "3 different test failures in unrelated modules"


### mode selection

# Mode Selection

Use `AskUserQuestion` at start of fixing workflow.

## AskUserQuestion Format

```json
{
  "questions": [{
    "question": "How should I handle the fix workflow?",
    "header": "Fix Mode",
    "options": [
      {
        "label": "Autonomous (Recommended)",
        "description": "Auto-approve if quality high, only ask when stuck"
      },
      {
        "label": "Human-in-the-loop",
        "description": "Pause for approval at each major step"
      },
      {
        "label": "Quick fix",
        "description": "Fast debug-fix-review cycle for simple issues"
      }
    ],
    "multiSelect": false
  }]
}
```

## Mode Recommendations

| Issue Type | Recommended Mode |
|------------|------------------|
| Type errors, lint errors | Quick |
| Single file bugs | Quick or Autonomous |
| Multi-file, unclear root cause | Autonomous |
| Production/critical code | Human-in-the-loop |
| System-wide/architecture | Human-in-the-loop |
| Security vulnerabilities | Human-in-the-loop |

## Skip Mode Selection When

- Issue is clearly trivial (type error keyword detected) → default Quick
- User explicitly specified mode in prompt
- Previous context already established mode


### parallel exploration

# Parallel Exploration

Patterns for launching multiple subagents in parallel to scout codebase, verify implementation, and coordinate via native Tasks.

## Parallel Exploration (Scouting)

Launch multiple `Explore` subagents simultaneously when needing to find:
- Related files across different areas
- Similar implementations/patterns
- Dependencies and usage

**Pattern:**
```
Task(subagent_type="Explore", prompt="Find [X] in [area1]", description="Scout area1")
Task(subagent_type="Explore", prompt="Find [Y] in [area2]", description="Scout area2")
Task(subagent_type="Explore", prompt="Find [Z] in [area3]", description="Scout area3")
```

**Example - Multi-area scouting:**
```
// Launch in SINGLE message with multiple Task calls:
Task("Explore", "Find auth-related files in src/", "Scout auth")
Task("Explore", "Find API routes handling users", "Scout API")
Task("Explore", "Find test files for auth module", "Scout tests")
```

## Parallel Verification (Bash)

Launch multiple `Bash` subagents to verify implementation from different angles.

**Pattern:**
```
Task(subagent_type="Bash", prompt="Run [command1]", description="Verify X")
Task(subagent_type="Bash", prompt="Run [command2]", description="Verify Y")
```

**Example - Multi-verification:**
```
// Launch in SINGLE message:
Task("Bash", "Run typecheck: bun run typecheck", "Verify types")
Task("Bash", "Run lint: bun run lint", "Verify lint")
Task("Bash", "Run build: bun run build", "Verify build")
```

## Task-Coordinated Parallel (Moderate+)

For multi-phase fixes, use native Tasks to coordinate parallel agents.
See `references/task-orchestration.md` for full patterns.

**Pattern - Parallel issue trees:**
```
// Create separate task trees per independent issue
T_A1 = TaskCreate(subject="[Issue A] Debug", activeForm="Debugging A")
T_A2 = TaskCreate(subject="[Issue A] Fix",   activeForm="Fixing A",   addBlockedBy=[T_A1])
T_B1 = TaskCreate(subject="[Issue B] Debug", activeForm="Debugging B")
T_B2 = TaskCreate(subject="[Issue B] Fix",   activeForm="Fixing B",   addBlockedBy=[T_B1])
T_final = TaskCreate(subject="Integration verify", addBlockedBy=[T_A2, T_B2])

// Spawn agents per issue tree
Task("fullstack-developer", "Fix Issue A. Claim tasks via TaskUpdate.", "Fix A")
Task("fullstack-developer", "Fix Issue B. Claim tasks via TaskUpdate.", "Fix B")
```

Agents claim work via `TaskUpdate(status="in_progress")` and complete via `TaskUpdate(status="completed")`. Blocked tasks auto-unblock when dependencies resolve.

## When to Use Parallel

| Scenario | Parallel Strategy |
|----------|-------------------|
| Root cause unclear, multiple suspects | 2-3 Explore agents on different areas |
| Multi-module fix | Explore each module in parallel |
| After implementation | Bash agents for typecheck + lint + build |
| Before commit | Bash agents for test + build + lint |
| 2+ independent issues | Task trees per issue + fullstack-developer agents |

## Combining Explore + Tasks + Bash

**Step 1:** Parallel Explore to scout
**Step 2:** Sequential implementation (update Tasks as phases complete)
**Step 3:** Parallel Bash to verify

```
// Scout phase - parallel
Task("Explore", "Find payment handlers", "Scout payments")
Task("Explore", "Find order processors", "Scout orders")

// Wait for results, implement fix, TaskUpdate each phase

// Verify phase - parallel
Task("Bash", "Run tests: bun test", "Run tests")
Task("Bash", "Run typecheck", "Check types")
Task("Bash", "Run build", "Verify build")
```

## Resource Limits

- Max 3 parallel agents recommended (system resources)
- Each subagent has 200K token context limit
- Keep prompts concise to avoid context bloat
- Use `TaskList()` to check for available unblocked work


### review cycle

# Review Cycle

Mode-aware review handling for code-reviewer results.

## Autonomous Mode

```
cycle = 0
LOOP:
  1. Run code-reviewer → score, critical_count, warnings, suggestions

  2. IF score >= 9.5 AND critical_count == 0:
     → Output: "✓ Review [score]/10 - Auto-approved"
     → PROCEED to next step

  3. ELSE IF critical_count > 0 AND cycle < 3:
     → Output: "⚙ Auto-fixing [N] critical issues (cycle [cycle+1]/3)"
     → Fix critical issues
     → Re-run tests
     → cycle++, GOTO LOOP

  4. ELSE IF cycle >= 3:
     → ESCALATE to user via AskUserQuestion
     → Display findings
     → Options: "Fix manually" / "Approve anyway" / "Abort"

  5. ELSE (score < 9.5, no critical):
     → Output: "✓ Review [score]/10 - Approved with [N] warnings"
     → PROCEED (warnings logged, not blocking)
```

## Human-in-the-Loop Mode

```
ALWAYS:
  1. Run code-reviewer → score, critical_count, warnings, suggestions

  2. Display findings:
     ┌─────────────────────────────────────┐
     │ Review: [score]/10                  │
     ├─────────────────────────────────────┤
     │ Critical ([N]): [list]              │
     │ Warnings ([N]): [list]              │
     │ Suggestions ([N]): [list]           │
     └─────────────────────────────────────┘

  3. Use AskUserQuestion:
     IF critical_count > 0:
       - "Fix critical issues"
       - "Fix all issues"
       - "Approve anyway"
       - "Abort"
     ELSE:
       - "Approve"
       - "Fix warnings/suggestions"
       - "Abort"

  4. Handle response:
     - Fix → implement, re-test, re-review (max 3 cycles)
     - Approve → proceed
     - Abort → stop workflow
```

## Quick Mode Review

Uses same logic as Autonomous but:
- Lower threshold: score >= 8.5 acceptable
- Only 1 auto-fix cycle before escalate
- Focus on: correctness, security, no regressions

## Critical Issues (Always Block)

- Security vulnerabilities (XSS, SQL injection, OWASP)
- Performance bottlenecks (O(n²) when O(n) possible)
- Architectural violations
- Data loss risks
- Breaking changes without migration


### skill activation matrix

# Skill Activation Matrix

When to activate each skill and tool during fixing workflows.

## Always Activate

| Skill/Tool | Reason |
|------------|--------|
| `ck:debug` | Core to all fix workflows - find root cause first |

## Task Orchestration (Moderate+ Only)

| Tool | Activate When |
|------|---------------|
| `TaskCreate` | After complexity assessment, create all phase tasks upfront |
| `TaskUpdate` | At start/completion of each phase |
| `TaskList` | Check available unblocked work, coordinate parallel agents |
| `TaskGet` | Retrieve full task details before starting work |

Skip Tasks for Quick workflow (< 3 steps). See `references/task-orchestration.md`.

## Conditional Activation

| Skill | Activate When |
|-------|---------------|
| `ck:problem-solving` | Stuck on approach, multiple failed attempts |
| `ck:sequential-thinking` | Complex logic chain, multi-step reasoning needed |
| `ck:brainstorm` | Multiple valid approaches, architecture decision |
| `ck:context-engineering` | Fixing AI/LLM/agent code, context window issues |
| `ck:ai-multimodal` | UI issues, screenshots provided, visual bugs |

## Subagent Usage

| Subagent | Activate When |
|----------|---------------|
| `debugger` | Root cause unclear, need deep investigation |
| `Explore` (parallel) | Scout multiple areas simultaneously |
| `Bash` (parallel) | Verify implementation (typecheck, lint, build) |
| `researcher` | External docs needed, latest best practices |
| `planner` | Complex fix needs breakdown, multiple phases |
| `tester` | After implementation, verify fix works |
| `ck:code-review` | After fix, verify quality and security |
| `git-manager` | After approval, commit changes |
| `docs-manager` | API/behavior changes need doc updates |
| `project-manager` | Major fix impacts roadmap/plan status |
| `fullstack-developer` | Parallel independent issues (each gets own agent) |

## Parallel Patterns

See `references/parallel-exploration.md` for detailed patterns.

| When | Parallel Strategy |
|------|-------------------|
| Root cause unclear | 2-3 `Explore` agents on different areas |
| Multi-module fix | `Explore` each module in parallel |
| After implementation | `Bash` agents: typecheck + lint + build |
| Before commit | `Bash` agents: test + build + lint |
| 2+ independent issues | Task trees + `fullstack-developer` agents per issue |

## Workflow → Skills Map

| Workflow | Skills Activated |
|----------|------------------|
| Quick | `debug`, `ck:code-review`, parallel `Bash` verification |
| Standard | Above + Tasks, `ck:problem-solving`, `ck:sequential-thinking`, `tester`, parallel `Explore` |
| Deep | All above + `ck:brainstorm`, `ck:context-engineering`, `researcher`, `planner` |
| Parallel | Per-issue Task trees + `fullstack-developer` agents + coordination via `TaskList` |

## Detection Triggers

| Keyword/Pattern | Skill to Consider |
|-----------------|-------------------|
| "AI", "LLM", "agent", "context" | `ck:context-engineering` |
| "stuck", "tried everything" | `ck:problem-solving` |
| "complex", "multi-step" | `ck:sequential-thinking` |
| "which approach", "options" | `ck:brainstorm` |
| "latest docs", "best practice" | `researcher` subagent |
| Screenshot attached | `ck:ai-multimodal` |


### task orchestration

# Task Orchestration

Native Claude Task tools for tracking and coordinating fix workflows.

## When to Use Tasks

| Complexity | Use Tasks? | Reason |
|-----------|-----------|--------|
| Simple/Quick | No | < 3 steps, overhead exceeds benefit |
| Moderate (Standard) | Yes | 6 steps, multi-subagent coordination |
| Complex (Deep) | Yes | 8 steps, dependency chains, parallel agents |
| Parallel | Yes | Multiple independent issue trees |

## Task Tools

- `TaskCreate(subject, description, activeForm, metadata)` - Create task
- `TaskUpdate(taskId, status, addBlockedBy, addBlocks)` - Update status/deps
- `TaskGet(taskId)` - Get full task details
- `TaskList()` - List all tasks with status

**Lifecycle:** `pending` → `in_progress` → `completed`

## Standard Workflow Tasks

Create all tasks upfront, then work through them:

```
TaskCreate(subject="Debug & investigate", activeForm="Debugging issue", metadata={step: 1})
TaskCreate(subject="Scout related code", activeForm="Scouting codebase", metadata={step: 2})
TaskCreate(subject="Implement fix", activeForm="Implementing fix", metadata={step: 3}, addBlockedBy=[step1, step2])
TaskCreate(subject="Run tests", activeForm="Running tests", metadata={step: 4}, addBlockedBy=[step3])
TaskCreate(subject="Code review", activeForm="Reviewing code", metadata={step: 5}, addBlockedBy=[step4])
TaskCreate(subject="Finalize", activeForm="Finalizing", metadata={step: 6}, addBlockedBy=[step5])
```

Update as work progresses:
```
TaskUpdate(taskId=step1, status="in_progress")
// ... do work ...
TaskUpdate(taskId=step1, status="completed")
// step3 auto-unblocks when step1 + step2 complete
```

## Deep Workflow Tasks

Same pattern but with research/brainstorm/plan phases:

```
TaskCreate(subject="Debug & investigate",    metadata={step: 1, phase: "diagnose"})
TaskCreate(subject="Research solutions",      metadata={step: 2, phase: "research"})
TaskCreate(subject="Brainstorm approaches",   metadata={step: 3, phase: "design"}, addBlockedBy=[step2])
TaskCreate(subject="Create implementation plan", metadata={step: 4, phase: "design"}, addBlockedBy=[step3])
TaskCreate(subject="Implement fix",           metadata={step: 5, phase: "implement"}, addBlockedBy=[step1, step4])
TaskCreate(subject="Run tests",               metadata={step: 6, phase: "verify"}, addBlockedBy=[step5])
TaskCreate(subject="Code review",             metadata={step: 7, phase: "verify"}, addBlockedBy=[step6])
TaskCreate(subject="Finalize & docs",         metadata={step: 8, phase: "finalize"}, addBlockedBy=[step7])
```

**Note:** Steps 1 and 2 run in parallel (debug + research simultaneously).

## Parallel Issue Coordination

For 2+ independent issues, create separate task trees per issue:

```
// Issue A tree
TaskCreate(subject="[Issue A] Debug",     metadata={issue: "A", step: 1})
TaskCreate(subject="[Issue A] Fix",       metadata={issue: "A", step: 2}, addBlockedBy=[A-step1])
TaskCreate(subject="[Issue A] Verify",    metadata={issue: "A", step: 3}, addBlockedBy=[A-step2])

// Issue B tree
TaskCreate(subject="[Issue B] Debug",     metadata={issue: "B", step: 1})
TaskCreate(subject="[Issue B] Fix",       metadata={issue: "B", step: 2}, addBlockedBy=[B-step1])
TaskCreate(subject="[Issue B] Verify",    metadata={issue: "B", step: 3}, addBlockedBy=[B-step2])

// Final shared task
TaskCreate(subject="Integration verify",  addBlockedBy=[A-step3, B-step3])
```

Spawn `fullstack-developer` subagents per issue tree. Each agent:
1. Claims tasks via `TaskUpdate(status="in_progress")`
2. Completes tasks via `TaskUpdate(status="completed")`
3. Blocked tasks auto-unblock when dependencies resolve

## Subagent Task Assignment

Assign tasks to subagents via `owner` field:

```
TaskUpdate(taskId=taskA, owner="agent-debug")
TaskUpdate(taskId=taskB, owner="agent-fix")
```

Check available work: `TaskList()` → filter by `status=pending`, `blockedBy=[]`, `owner=null`

## Rules

- Create tasks BEFORE starting work (upfront planning)
- Only 1 task `in_progress` per agent at a time
- Mark complete IMMEDIATELY after finishing (don't batch)
- Use `metadata` for filtering: `{step, phase, issue, severity}`
- If task fails → keep `in_progress`, create subtask for blocker
- Skip Tasks entirely for Quick workflow (< 3 steps)


### workflow ci

# CI/CD Fix Workflow

For GitHub Actions failures and CI/CD pipeline issues.

## Prerequisites
- `gh` CLI installed and authorized
- GitHub Actions URL or run ID

## Workflow

1. **Fetch logs** with `debugger` agent:
   ```bash
   gh run view <run-id> --log-failed
   gh run view <run-id> --log
   ```

2. **Analyze** root cause from logs

3. **Implement fix** based on analysis

4. **Test locally** with `tester` agent before pushing

5. **Iterate** if tests fail, repeat from step 3

## Notes
- If `gh` unavailable, instruct user to install: `gh auth login`
- Check both failed step and preceding steps for context
- Common issues: env vars, dependencies, permissions, timeouts


### workflow deep

# Deep Workflow

Full pipeline with research, brainstorming, and planning for complex issues. Uses native Claude Tasks with dependency chains.

## Task Setup (Before Starting)

Create all phase tasks upfront. Steps 1+2 run in parallel (no mutual dependency).

```
T1 = TaskCreate(subject="Debug & investigate",       activeForm="Debugging issue",       metadata={phase: "diagnose"})
T2 = TaskCreate(subject="Research solutions",         activeForm="Researching solutions",  metadata={phase: "research"})
T3 = TaskCreate(subject="Brainstorm approaches",      activeForm="Brainstorming",          metadata={phase: "design"},    addBlockedBy=[T1, T2])
T4 = TaskCreate(subject="Create implementation plan", activeForm="Planning implementation", metadata={phase: "design"},    addBlockedBy=[T3])
T5 = TaskCreate(subject="Implement fix",              activeForm="Implementing fix",        metadata={phase: "implement"}, addBlockedBy=[T4])
T6 = TaskCreate(subject="Run tests",                  activeForm="Running tests",           metadata={phase: "verify"},    addBlockedBy=[T5])
T7 = TaskCreate(subject="Code review",                activeForm="Reviewing code",          metadata={phase: "verify"},    addBlockedBy=[T6])
T8 = TaskCreate(subject="Finalize & docs",            activeForm="Finalizing",              metadata={phase: "finalize"},  addBlockedBy=[T7])
```

## Steps

### Step 1: Debug & Parallel Investigation
`TaskUpdate(T1, status="in_progress")`
Follow `@.cursor/skills/debug/SKILL.md`. Launch 2-3 `Explore` subagents in parallel:
```
Task("Explore", "Find error origin", "Trace error")
Task("Explore", "Find affected components", "Map deps")
Task("Explore", "Find similar patterns", "Find patterns")
```
See `references/parallel-exploration.md` for patterns.

`TaskUpdate(T1, status="completed")`
**Output:** `✓ Step 1: Root cause - [summary], system impact: [scope]`

### Step 2: Research (parallel with Step 1)
`TaskUpdate(T2, status="in_progress")`
Use `researcher` subagent for external knowledge.

- Search latest docs, best practices
- Find similar issues/solutions
- Gather security advisories if relevant

`TaskUpdate(T2, status="completed")`
**Output:** `✓ Step 2: Research complete - [key findings]`

### Step 3: Brainstorm
`TaskUpdate(T3, status="in_progress")` — auto-unblocks when T1 + T2 complete.
Follow `@.cursor/skills/brainstorm/SKILL.md`.

- Evaluate multiple approaches
- Consider trade-offs
- Get user input on preferred direction

`TaskUpdate(T3, status="completed")`
**Output:** `✓ Step 3: Approach selected - [chosen approach]`

### Step 4: Plan
`TaskUpdate(T4, status="in_progress")`
Use `planner` subagent to create implementation plan.

- Break down into phases
- Identify dependencies
- Define success criteria

`TaskUpdate(T4, status="completed")`
**Output:** `✓ Step 4: Plan created - [N] phases`

### Step 5: Implement
`TaskUpdate(T5, status="in_progress")`
Implement per plan. Use `ck:context-engineering`, `ck:sequential-thinking`, `ck:problem-solving`.

**Parallel Verification:** Launch `Bash` agents: typecheck + lint + build
See `references/parallel-exploration.md`

`TaskUpdate(T5, status="completed")`
**Output:** `✓ Step 5: Implemented - [N] files, [M] phases, verified`

### Step 6: Test
`TaskUpdate(T6, status="in_progress")`
Use `tester` subagent.

- Comprehensive testing
- Edge cases, security, performance
- If fail → debug, fix, repeat

`TaskUpdate(T6, status="completed")`
**Output:** `✓ Step 6: Tests [X/X passed]`

### Step 7: Review
`TaskUpdate(T7, status="in_progress")`
Use `code-reviewer` subagent.

See `references/review-cycle.md` for mode-specific handling.

`TaskUpdate(T7, status="completed")`
**Output:** `✓ Step 7: Review [score]/10 - [status]`

### Step 8: Finalize
`TaskUpdate(T8, status="in_progress")`
- Use `project-manager` subagent to update roadmap
- Use `docs-manager` subagent for documentation
- Use `git-manager` subagent for commit

`TaskUpdate(T8, status="completed")`
**Output:** `✓ Step 8: Complete - [actions taken]`

## Skills/Subagents Activated

| Step | Skills/Subagents |
|------|------------------|
| 1 | `ck:debug`, parallel `Explore` subagents for investigation |
| 2 | `researcher` (runs parallel with step 1) |
| 3 | `ck:brainstorm` |
| 4 | `planner` |
| 5 | `ck:problem-solving`, `ck:sequential-thinking`, `ck:context-engineering`, parallel `Bash` |
| 6 | `tester` |
| 7 | `code-reviewer` |
| 8 | `project-manager`, `docs-manager`, `Bash` |

**Rules:** Don't skip steps. Validate before proceeding. One phase at a time.
**Frontend:** Use `chrome`, `ck:chrome-devtools` or any relevant skills/tools to verify.
**Visual Assets:** Use `ck:ai-multimodal` for visual assets generation, analysis and verification.


### workflow logs

# Log Analysis Fix Workflow

For fixing issues from application logs. Uses native Claude Tasks for phase tracking.

## Prerequisites
- Log file at `./logs.txt` or similar

## Setup (if logs missing)

Add permanent log piping to project config:
- **Bash/Unix**: `command 2>&1 | tee logs.txt`
- **PowerShell**: `command *>&1 | Tee-Object logs.txt`

## Task Setup (Before Starting)

```
T1 = TaskCreate(subject="Read & analyze logs",  activeForm="Analyzing logs")
T2 = TaskCreate(subject="Scout codebase",        activeForm="Scouting codebase",    addBlockedBy=[T1])
T3 = TaskCreate(subject="Plan fix",              activeForm="Planning fix",          addBlockedBy=[T1, T2])
T4 = TaskCreate(subject="Implement fix",         activeForm="Implementing fix",      addBlockedBy=[T3])
T5 = TaskCreate(subject="Test fix",              activeForm="Testing fix",           addBlockedBy=[T4])
T6 = TaskCreate(subject="Code review",           activeForm="Reviewing code",        addBlockedBy=[T5])
```

## Workflow

### Step 1: Read & Analyze Logs
`TaskUpdate(T1, status="in_progress")`

- Read logs with `Grep` (use `head_limit: 30` initially, increase if needed)
- Use `debugger` agent for root cause analysis
- Focus on last N lines first (most recent errors)
- Look for stack traces, error codes, timestamps, repeated patterns

`TaskUpdate(T1, status="completed")`

### Step 2: Scout Codebase
`TaskUpdate(T2, status="in_progress")`
Use `ck:scout` agent or parallel `Explore` subagents to find issue locations.

See `references/parallel-exploration.md` for patterns.

`TaskUpdate(T2, status="completed")`

### Step 3: Plan Fix
`TaskUpdate(T3, status="in_progress")` — auto-unblocks when T1 + T2 complete.
Use `planner` agent.

`TaskUpdate(T3, status="completed")`

### Step 4: Implement
`TaskUpdate(T4, status="in_progress")`
Implement the fix.

`TaskUpdate(T4, status="completed")`

### Step 5: Test
`TaskUpdate(T5, status="in_progress")`
Use `tester` agent. If issues remain → keep T5 `in_progress`, loop back to Step 2.

`TaskUpdate(T5, status="completed")`

### Step 6: Review
`TaskUpdate(T6, status="in_progress")`
Use `code-reviewer` agent.

`TaskUpdate(T6, status="completed")`

## Tips
- Focus on last N lines first (most recent errors)
- Look for stack traces, error codes, timestamps
- Check for patterns/repeated errors


### workflow quick

# Quick Workflow

Fast debug-fix-review cycle for simple issues.

## Steps

### Step 1: Debug
Follow `@.cursor/skills/debug/SKILL.md`. Find root cause quickly. Verify the root cause with multiple `Explore` subagents in parallel.
- Read error message/logs
- Locate affected file(s)
- Identify exact fix needed

**Output:** `✓ Step 1: Root cause - [brief description]`

### Step 2: Fix & Verify
Implement the fix directly.
- Make minimal changes
- Follow existing patterns

**Parallel Verification:**
Launch `Bash` agents in parallel:
```
Task("Bash", "Run typecheck", "Verify types")
Task("Bash", "Run lint", "Verify lint")
```

See `references/parallel-exploration.md` for patterns.

**Output:** `✓ Step 2: Fixed - [N] files, verified (types/lint passed)`

### Step 3: Verify
Use `code-reviewer` subagent for quick review.

Prompt: "Quick review of fix for [issue]. Check: correctness, security, no regressions. Score X/10."

**Review handling:** See `references/review-cycle.md`

**Output:** `✓ Step 3: Review [score]/10 - [status]`

### Step 4: Complete
Report summary to user.

**If autonomous mode:** Ask to commit via `git-manager` subagent if score >= 9.0
**If HITL mode:** Ask user next action

**Output:** `✓ Step 4: Complete - [action]`

## Skills/Subagents Activated

- `ck:debug` - Always (Step 1)
- Parallel `git-manager` - Verification (Step 2)
- `code-reviewer` subagent - Always (Step 3)
- `ck:context-engineering` - If dealing with AI/LLM code

## Notes

- Skip if review fails → escalate to Standard workflow
- Total steps: 4 (vs 5-6 in Standard/Deep)
- No planning phase needed


### workflow standard

# Standard Workflow

Full pipeline for moderate complexity issues. Uses native Claude Tasks for phase tracking.

## Task Setup (Before Starting)

Create all phase tasks upfront with dependencies. See `references/task-orchestration.md`.

```
T1 = TaskCreate(subject="Debug & investigate",  activeForm="Debugging issue")
T2 = TaskCreate(subject="Scout related code",   activeForm="Scouting codebase")
T3 = TaskCreate(subject="Implement fix",        activeForm="Implementing fix",    addBlockedBy=[T1, T2])
T4 = TaskCreate(subject="Run tests",            activeForm="Running tests",       addBlockedBy=[T3])
T5 = TaskCreate(subject="Code review",          activeForm="Reviewing code",      addBlockedBy=[T4])
T6 = TaskCreate(subject="Finalize",             activeForm="Finalizing",          addBlockedBy=[T5])
```

## Steps

### Step 1: Debug & Investigate
`TaskUpdate(T1, status="in_progress")`
Follow `@.cursor/skills/debug/SKILL.md`. Use `debugger` subagent if needed.

- Read error messages, logs, stack traces
- Reproduce the issue
- Trace backward to root cause
- Identify all affected files

`TaskUpdate(T1, status="completed")`
**Output:** `✓ Step 1: Root cause - [summary], [N] files affected`

### Step 2: Parallel Scout
`TaskUpdate(T2, status="in_progress")`
Launch multiple `Explore` subagents in parallel to scout and verify the root cause.

**Pattern:** In SINGLE message, launch 2-3 Explore agents:
```
Task("Explore", "Find [area1] files related to issue", "Scout area1")
Task("Explore", "Find [area2] patterns/usage", "Scout area2")
Task("Explore", "Find [area3] tests/dependencies", "Scout area3")
```

- Only if unclear which files need changes
- Find patterns, similar implementations, dependencies

See `references/parallel-exploration.md` for patterns.

`TaskUpdate(T2, status="completed")`
**Output:** `✓ Step 2: Scouted [N] areas - Found [M] related files`

### Step 3: Implement Fix
`TaskUpdate(T3, status="in_progress")` — auto-unblocked when T1 + T2 complete.
Fix the issue following debugging findings.

- Apply `ck:problem-solving` skill if stuck
- Use `ck:sequential-thinking` for complex logic

**After implementation - Parallel Verification:**
Launch `Bash` agents in parallel to verify:
```
Task("Bash", "Run typecheck", "Verify types")
Task("Bash", "Run lint", "Verify lint")
Task("Bash", "Run build", "Verify build")
```

`TaskUpdate(T3, status="completed")`
**Output:** `✓ Step 3: Implemented - [N] files, verified (types/lint/build passed)`

### Step 4: Test
`TaskUpdate(T4, status="in_progress")`
Use `tester` subagent to run tests.

- Write new tests if needed
- Run existing test suite
- If fail → use `debugger`, fix, repeat

`TaskUpdate(T4, status="completed")`
**Output:** `✓ Step 4: Tests [X/X passed]`

### Step 5: Review
`TaskUpdate(T5, status="in_progress")`
Use `code-reviewer` subagent.

See `references/review-cycle.md` for mode-specific handling.

`TaskUpdate(T5, status="completed")`
**Output:** `✓ Step 5: Review [score]/10 - [status]`

### Step 6: Finalize
`TaskUpdate(T6, status="in_progress")`
- Report summary to user
- Ask to commit via `git-manager` subagent
- Update docs if needed via `docs-manager`

`TaskUpdate(T6, status="completed")`
**Output:** `✓ Step 6: Complete - [action]`

## Skills/Subagents Activated

| Step | Skills/Subagents |
|------|------------------|
| 1 | `ck:debug`, `debugger` subagent |
| 2 | Multiple `Explore` subagents in parallel (optional) |
| 3 | `ck:problem-solving`, `ck:sequential-thinking`, parallel `Bash` for verification |
| 4 | `tester` subagent |
| 5 | `code-reviewer` subagent |
| 6 | `git-manager`, `docs-manager` subagents |

**Rules:** Don't skip steps. Validate before proceeding. One phase at a time.
**Frontend:** Use `chrome`, `ck:chrome-devtools` or any relevant skills/tools to verify.
**Visual Assets:** Use `ck:ai-multimodal` for visual assets generation, analysis and verification.


### workflow test

# Test Failure Fix Workflow

For fixing failing tests and test suite issues. Uses native Claude Tasks for phase tracking.

## Task Setup (Before Starting)

```
T1 = TaskCreate(subject="Compile & collect failures", activeForm="Compiling and collecting failures")
T2 = TaskCreate(subject="Debug root causes",          activeForm="Debugging test failures",       addBlockedBy=[T1])
T3 = TaskCreate(subject="Plan fixes",                 activeForm="Planning fixes",                addBlockedBy=[T2])
T4 = TaskCreate(subject="Implement fixes",             activeForm="Implementing fixes",            addBlockedBy=[T3])
T5 = TaskCreate(subject="Re-test",                     activeForm="Re-running tests",              addBlockedBy=[T4])
T6 = TaskCreate(subject="Code review",                 activeForm="Reviewing code",                addBlockedBy=[T5])
```

## Workflow

### Step 1: Compile & Collect Failures
`TaskUpdate(T1, status="in_progress")`
Use `tester` agent. Fix all syntax errors before running tests.

- Run full test suite, collect all failures
- Group failures by module/area

`TaskUpdate(T1, status="completed")`

### Step 2: Debug
`TaskUpdate(T2, status="in_progress")`
Use `debugger` agent for root cause analysis.

- Analyze each failure group
- Identify shared root causes across failures

`TaskUpdate(T2, status="completed")`

### Step 3: Plan
`TaskUpdate(T3, status="in_progress")`
Use `planner` agent for fix strategy.

- Prioritize fixes (shared root causes first)
- Identify dependencies between fixes

`TaskUpdate(T3, status="completed")`

### Step 4: Implement
`TaskUpdate(T4, status="in_progress")`
Implement fixes step by step per plan.

`TaskUpdate(T4, status="completed")`

### Step 5: Re-test
`TaskUpdate(T5, status="in_progress")`
Use `tester` agent. If tests still fail → keep T5 `in_progress`, loop back to Step 2.

`TaskUpdate(T5, status="completed")`

### Step 6: Review
`TaskUpdate(T6, status="in_progress")`
Use `code-reviewer` agent.

`TaskUpdate(T6, status="completed")`

## Common Commands
```bash
npm test
bun test
pytest
go test ./...
```

## Tips
- Run single failing test first for faster iteration
- Check test assertions vs actual behavior
- Verify test fixtures/mocks are correct
- Don't modify tests to pass unless test is wrong


### workflow types

# Type Error Fix Workflow

Quick workflow for TypeScript/type errors.

## Commands
```bash
bun run typecheck
tsc --noEmit
npx tsc --noEmit
```

## Rules
- Fix ALL type errors, don't stop at first
- **NEVER use `any` just to pass** - find proper types
- Repeat until zero errors

## Common Fixes
- Missing type imports
- Incorrect property access
- Null/undefined handling
- Generic type parameters
- Union type narrowing

## Workflow
1. Run typecheck command
2. Fix errors one by one
3. Re-run typecheck
4. Repeat until clean

## Tips
- Group related errors (same root cause)
- Check `@types/*` packages for library types
- Use `unknown` + type guards instead of `any`


### workflow ui

# UI Fix Workflow

For fixing visual/UI issues. Requires design skills. Uses native Claude Tasks for phase tracking.

## Required Skills (activate in order)
1. `ck:ui-ux-pro-max` - Design database (ALWAYS FIRST)
2. `ck:ui-ux-pro-max` - Design principles
3. `ck:frontend-design` - Implementation patterns

## Pre-fix Research
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<product-type>" --domain product
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<style>" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "accessibility" --domain ux
```

## Task Setup (Before Starting)

```
T1 = TaskCreate(subject="Analyze visual issue",    activeForm="Analyzing visual issue")
T2 = TaskCreate(subject="Implement UI fix",         activeForm="Implementing UI fix",       addBlockedBy=[T1])
T3 = TaskCreate(subject="Verify visually",          activeForm="Verifying visually",         addBlockedBy=[T2])
T4 = TaskCreate(subject="DevTools check",           activeForm="Checking with DevTools",     addBlockedBy=[T3])
T5 = TaskCreate(subject="Test compilation",         activeForm="Testing compilation",        addBlockedBy=[T4])
T6 = TaskCreate(subject="Update design docs",       activeForm="Updating design docs",       addBlockedBy=[T5])
```

## Workflow

### Step 1: Analyze
`TaskUpdate(T1, status="in_progress")`
Analyze screenshots/videos with `ck:ai-multimodal` skill.

- Read `./docs/design-guidelines.md` first
- Identify exact visual discrepancy

`TaskUpdate(T1, status="completed")`

### Step 2: Implement
`TaskUpdate(T2, status="in_progress")`
Use `ui-ux-designer` agent.

`TaskUpdate(T2, status="completed")`

### Step 3: Verify Visually
`TaskUpdate(T3, status="in_progress")`
Screenshot + `ck:ai-multimodal` analysis.

- Capture parent container, not whole page
- Compare to design guidelines
- If incorrect → keep T3 `in_progress`, loop back to Step 2

`TaskUpdate(T3, status="completed")`

### Step 4: DevTools Check
`TaskUpdate(T4, status="in_progress")`
Use `ck:chrome-devtools` skill.

`TaskUpdate(T4, status="completed")`

### Step 5: Test
`TaskUpdate(T5, status="in_progress")`
Use `tester` agent for compilation check.

`TaskUpdate(T5, status="completed")`

### Step 6: Document
`TaskUpdate(T6, status="in_progress")`
Update `./docs/design-guidelines.md` if needed.

`TaskUpdate(T6, status="completed")`

## Tips
- Use `ck:ai-multimodal` for generating visual assets
- Use `ImageMagick` for image editing




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
