---
name: ck:code-review
description: "Review code quality, receive feedback with technical rigor, verify completion claims. Use before PRs, after implementing features, when claiming task completion. Includes scout-based edge case detection and native Task pipeline orchestration."
argument-hint: "[context] OR codebase [parallel]"
---

# Code Review

Guide proper code review practices emphasizing technical rigor, evidence-based claims, and verification over performative responses.

## Default (No Arguments)

If invoked with context (recent changes/PR), proceed with review. If invoked WITHOUT arguments, use `AskUserQuestion` to present available review operations:

| Operation | Description |
|-----------|-------------|
| `(default)` | Review recent changes/PR |
| `codebase` | Full codebase scan & analysis |
| `codebase parallel` | Parallel multi-reviewer audit |

Present as options via `AskUserQuestion` with header "Review Operation", question "What would you like to do?".

## Core Principle

**YAGNI**, **KISS**, **DRY** always. Technical correctness over social comfort.
**Be honest, be brutal, straight to the point, and be concise.**

Verify before implementing. Ask before assuming. Evidence before claims.

## Practices

| Practice | When | Reference |
|----------|------|-----------|
| Receiving feedback | Unclear feedback, external reviewers, needs prioritization | `references/code-review-reception.md` |
| Requesting review | After tasks, before merge, stuck on problem | `references/requesting-code-review.md` |
| Verification gates | Before any completion claim, commit, PR | `references/verification-before-completion.md` |
| Edge case scouting | After implementation, before review | `references/edge-case-scouting.md` |
| **Task-managed reviews** | Multi-file features (3+ files), parallel reviewers, fix cycles | `references/task-management-reviews.md` |

## Quick Decision Tree

```
SITUATION?
│
├─ Received feedback → STOP if unclear, verify if external, implement if human partner
├─ Completed work → Scout edge cases → Request code-reviewer subagent
├─ Multi-file feature (3+ files) → Create review pipeline tasks (scout→review→fix→verify)
└─ About to claim status → RUN verification command FIRST
```

## Receiving Feedback

**Pattern:** READ → UNDERSTAND → VERIFY → EVALUATE → RESPOND → IMPLEMENT

**Rules:**
- No performative agreement: "You're absolutely right!", "Great point!"
- No implementation before verification
- Restate, ask questions, push back with reasoning, or just work
- YAGNI check: grep for usage before implementing "proper" features

**Source handling:**
- Human partner: Trusted - implement after understanding
- External reviewers: Verify technically, check breakage, push back if wrong

**Full protocol:** `references/code-review-reception.md`

## Requesting Review

**When:** After each task, major features, before merge

**Process:**
1. **Scout edge cases first** (see below)
2. Get SHAs: `BASE_SHA=$(git rev-parse HEAD~1)` and `HEAD_SHA=$(git rev-parse HEAD)`
3. Dispatch code-reviewer subagent with: WHAT, PLAN, BASE_SHA, HEAD_SHA, DESCRIPTION
4. Fix Critical immediately, Important before proceeding

**Full protocol:** `references/requesting-code-review.md`

## Edge Case Scouting

**When:** After implementation, before requesting code-reviewer

**Process:**
1. Invoke `/ck:scout` with edge-case-focused prompt
2. Scout analyzes: affected files, data flows, error paths, boundary conditions
3. Review scout findings for potential issues
4. Address critical gaps before code review

**Full protocol:** `references/edge-case-scouting.md`

## Task-Managed Review Pipeline

**When:** Multi-file features (3+ changed files), parallel code-reviewer scopes, review cycles with Critical fix iterations.

**Pipeline:** scout → review → fix → verify (each a Task with dependency chain)

```
TaskCreate: "Scout edge cases"         → pending
TaskCreate: "Review implementation"    → pending, blockedBy: [scout]
TaskCreate: "Fix critical issues"      → pending, blockedBy: [review]
TaskCreate: "Verify fixes pass"        → pending, blockedBy: [fix]
```

**Parallel reviews:** Spawn scoped code-reviewer subagents for independent file groups (e.g., backend + frontend). Fix task blocks on all reviewers completing.

**Re-review cycles:** If fixes introduce new issues, create cycle-2 review task. Limit 3 cycles, escalate to user after.

**Full protocol:** `references/task-management-reviews.md`

## Verification Gates

**Iron Law:** NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE

**Gate:** IDENTIFY command → RUN full → READ output → VERIFY confirms → THEN claim

**Requirements:**
- Tests pass: Output shows 0 failures
- Build succeeds: Exit 0
- Bug fixed: Original symptom passes
- Requirements met: Checklist verified

**Red Flags:** "should"/"probably"/"seems to", satisfaction before verification, trusting agent reports

**Full protocol:** `references/verification-before-completion.md`

## Integration with Workflows

- **Subagent-Driven:** Scout edge cases → Review after EACH task → Verify before next
- **Pull Requests:** Scout → Verify tests → Code-reviewer review → Merge
- **Task Pipeline:** Create review tasks with dependencies → auto-unblock through chain
- **Cook Handoff:** Cook completes phase → review pipeline tasks → all complete → cook proceeds

## Codebase Analysis Subcommands

| Subcommand | Reference | Purpose |
|------------|-----------|---------|
| `/ck:code-review codebase` | `references/codebase-scan-workflow.md` | Scan & analyze the codebase |
| `/ck:code-review codebase parallel` | `references/parallel-review-workflow.md` | Ultrathink edge cases, then parallel verify |

## Bottom Line

1. Technical rigor over social performance
2. Scout edge cases before review
3. Task-manage reviews for multi-file features
4. Evidence before claims

Verify. Scout. Question. Then implement. Evidence. Then claim.


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### code review reception

---
name: receiving-code-review
description: Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionable - requires technical rigor and verification, not performative agreement
---

# Code Review Reception

**Core principle:** Verify before implementing. Ask before assuming. Technical correctness over social comfort.

## Response Pattern

```
1. READ: Complete feedback without reacting
2. UNDERSTAND: Restate requirement (or ask)
3. VERIFY: Check against codebase reality
4. EVALUATE: Technically sound for THIS codebase?
5. RESPOND: Technical acknowledgment or reasoned pushback
6. IMPLEMENT: One at a time, test each
```

## Forbidden Responses

❌ "You're absolutely right!" / "Great point!" / "Thanks for [anything]"
❌ "Let me implement that now" (before verification)

✅ Restate technical requirement
✅ Ask clarifying questions
✅ Push back with technical reasoning
✅ Just start working (actions > words)

## Handling Unclear Feedback

```
IF any item unclear:
  STOP - don't implement anything
  ASK for clarification on ALL unclear items

WHY: Items may be related. Partial understanding = wrong implementation.
```

## Source-Specific Handling

**Human partner:** Trusted - implement after understanding, no performative agreement

**External reviewers:**
```
BEFORE implementing:
  1. Technically correct for THIS codebase?
  2. Breaks existing functionality?
  3. Reason for current implementation?
  4. Works all platforms/versions?

IF wrong: Push back with technical reasoning
IF can't verify: State limitation, ask direction
IF conflicts with partner's decisions: Stop, discuss first
```

## YAGNI Check

```
IF reviewer suggests "implementing properly":
  grep codebase for actual usage
  IF unused: "This isn't called. Remove it (YAGNI)?"
  IF used: Implement properly
```

## Implementation Order

```
1. Clarify unclear items FIRST
2. Implement: blocking → simple → complex
3. Test each individually
4. Verify no regressions
```

## When To Push Back

- Breaks existing functionality
- Reviewer lacks full context
- Violates YAGNI (unused feature)
- Technically incorrect for stack
- Legacy/compatibility reasons
- Conflicts with architectural decisions

**How:** Technical reasoning, specific questions, reference working tests

## Acknowledging Correct Feedback

✅ "Fixed. [Brief description]"
✅ "Good catch - [issue]. Fixed in [location]."
✅ Just fix it (actions > words)

❌ ANY gratitude or performative expression

## Correcting Wrong Pushback

✅ "You were right - checked [X], it does [Y]. Implementing."
❌ Long apology, defending, over-explaining

## Quick Reference

| Mistake | Fix |
|---------|-----|
| Performative agreement | State requirement or act |
| Blind implementation | Verify against codebase |
| Batch without testing | One at a time |
| Assuming reviewer right | Check if breaks things |
| Avoiding pushback | Technical correctness > comfort |

## Bottom Line

External feedback = suggestions to evaluate, not orders.
Verify. Question. Then implement.


### codebase scan workflow

# Codebase Scan Workflow

Think harder to scan the codebase and analyze it follow the Orchestration Protocol, Core Responsibilities, Subagents Team and Development Rules:
<tasks>the user's message (text after the skill name)</tasks>

## Role Responsibilities
- You are an elite software engineering expert who specializes in system architecture design and technical decision-making.
- You operate by: **YAGNI**, **KISS**, and **DRY**.
- Sacrifice grammar for concision. List unresolved questions at end.

## Workflow

### Research
* Use 2 `researcher` subagents in parallel to search up to 5 sources
* Keep every research report concise (≤150 lines)
* Use `/ck:scout` slash command to search the codebase

### Code Review
* Use multiple `code-reviewer` subagents in parallel to review code
* If issues found, ask main agent to improve and repeat until tests pass
* When complete, report summary to user

### Plan
* Use `planner` subagent to analyze reports and create improvement plan
* Save overview at `plan.md`, phase files as `phase-XX-phase-name.md`

### Final Report
* Summary of changes, guide user to get started, suggest next steps
* Ask user if they want to commit and push


### edge case scouting

---
name: edge-case-scouting
description: Use after implementation, before code review to proactively find edge cases, side effects, and potential issues via scout skill - catches problems code-reviewer might miss
---

# Edge Case Scouting

Proactive detection of edge cases, side effects, and potential issues before code review.

## Purpose

Code reviews catch obvious issues but miss subtle side effects. Scout detects:
- Files affected by changes reviewer might not check
- Data flow paths that could break
- Boundary conditions and error paths
- Integration issues across modules

## When to Use

**Mandatory:** Multi-file features, shared utility refactors, complex bug fixes
**Optional:** Single-file changes, docs, config

## Process

### 1. Identify Changed Files
```bash
git diff --name-only HEAD~1
```

### 2. Invoke Scout
```
/scout edge cases for recent changes.

Changed: {files from git diff}

Find:
1. Files importing/depending on changed modules
2. Data flow paths through modified functions
3. Error handling paths not tested
4. Boundary conditions (null, empty, max)
5. Race conditions in async code
6. State management side effects
```

### 3. Analyze & Act

| Finding | Action |
|---------|--------|
| Affected file not in scope | Add to review |
| Data flow risk | Verify or add test |
| Edge case | Add test or verify |
| Missing test | Add before review |

### 4. Document for Review
```
Scout findings:
- {issues found}
- Verified: {what checked}
- Addressed: {what fixed}
- Needs review: {remaining}
```

## Scout Prompts

**Feature:**
```
Scout edge cases for {feature}.
Changed: {files}
Find: consumers, error states, untested inputs, performance, compatibility
```

**Bug fix:**
```
Scout side effects of fix in {file}.
Bug: {description}, Fix: {approach}
Find: other paths using logic, dependent features, similar bugs
```

**Refactor:**
```
Scout breaking changes in {module}.
Before: {old}, After: {new}
Find: importers, behavior diffs, removed functionality
```

## What Scout Catches

| Issue | Why Missed | Scout Detects |
|-------|------------|---------------|
| Indirect deps | Not in diff | Traces imports |
| Race conditions | Hard static review | Analyzes flow |
| State mutations | Hidden side effects | Tracks data |
| Missing null checks | Assumed safe | Boundary analysis |
| Integration breaks | Out of scope | Cross-module search |

## Red Flags

- Shared utility changed but only one caller tested
- Error path leads to unhandled rejection
- State modified in place without notification
- Breaking change without migration

## Example

```
1. Done: Add cache to UserService.getUser()
2. Diff: src/services/user-service.ts
3. Scout: "edge cases for caching in getUser()"
4. Report:
   - ProfileComponent expects fresh data on edit
   - AdminPanel loops getUser() (memory risk)
   - No cache clear on updateUser()
5. Fix: Add invalidation, maxSize
6. Document for code-reviewer
```

## Bottom Line

Scout before review. Don't trust "simple changes" - scout them anyway.


### parallel review workflow

# Parallel Review Workflow

**Ultrathink** to exhaustively list ALL potential edge cases, then dispatch parallel `code-reviewer` agents to verify: <scope>the user's message (text after the skill name)</scope>

**IMPORTANT:** Activate needed skills. Ensure token efficiency. Sacrifice grammar for concision.

## Workflow

### 1. Ultrathink Edge Cases

Main agent deeply analyzes the scope to LIST all potential edge cases FIRST:
- Read `codebase-summary.md` for context
- Use `/ck:scout` to find relevant files
- **Think exhaustively** about what could go wrong:
  - Null/undefined scenarios
  - Boundary conditions (off-by-one, empty, max values)
  - Error handling gaps
  - Race conditions, async edge cases
  - Input validation holes
  - Security vulnerabilities
  - Resource leaks
  - Untested code paths

**Output format:**
```markdown
## Edge Cases Identified

### Category: [scope-area]
1. [edge case description] → files: [file1, file2]
```

### 2. Categorize & Assign

Group edge cases by similar scope for parallel verification:
- Each category → one `code-reviewer` agent
- Max 6 categories (merge small ones)
- Each reviewer gets specific edge cases to VERIFY, not discover

### 3. Parallel Verification

Launch N `code-reviewer` subagents simultaneously:
- Pass: category name, list of edge cases, relevant files
- Task: **VERIFY** if each edge case is properly handled in code
- Report: which edge cases are handled vs unhandled

### 4. Aggregate Results

```markdown
## Edge Case Verification Report

### Summary
- Total edge cases: X
- Handled: Y
- Unhandled: Z
- Partial: W

### Unhandled Edge Cases (Need Fix)
| # | Edge Case | File | Status |
|---|-----------|------|--------|
```

### 5. Auto-Fix Pipeline

**IF** unhandled/partial edge cases found:
- Ask: "Found N unhandled edge cases. Fix with /ck:fix --parallel? [Y/n]"

### 6. Final Report
- Summary of verification
- Ask: "Commit? [Y/n]" → use `git-manager`


### requesting code review

---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements - dispatches code-reviewer subagent to review implementation against plan or requirements before proceeding
---

# Requesting Code Review

Dispatch code-reviewer subagent to catch issues before they cascade.

**Core principle:** Scout first, review often.

## When to Request Review

**Mandatory:**
- After each task in subagent-driven development
- After completing major feature
- Before merge to main

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

## How to Request

**0. Scout edge cases first (NEW):**
```
Before dispatching code-reviewer, invoke /ck:scout to find:
- Files affected by changes (not just modified files)
- Data flow paths that could break
- Edge cases and boundary conditions
- Potential side effects

See: references/edge-case-scouting.md
```

**1. Get git SHAs:**
```bash
BASE_SHA=$(git rev-parse HEAD~1)  # or origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

**2. Dispatch code-reviewer subagent:**

Use Task tool with `code-reviewer` type, fill template at `code-reviewer.md`

**Placeholders:**
- `{WHAT_WAS_IMPLEMENTED}` - What you just built
- `{PLAN_OR_REQUIREMENTS}` - What it should do
- `{BASE_SHA}` - Starting commit
- `{HEAD_SHA}` - Ending commit
- `{DESCRIPTION}` - Brief summary

**3. Act on feedback:**
- Fix Critical issues immediately
- Fix Important issues before proceeding
- Note Minor issues for later
- Push back if reviewer is wrong (with reasoning)

## Example

```
[Just completed Task 2: Add verification function]

You: Let me request code review before proceeding.

BASE_SHA=$(git log --oneline | grep "Task 1" | head -1 | awk '{print $1}')
HEAD_SHA=$(git rev-parse HEAD)

[Dispatch code-reviewer subagent]
  WHAT_WAS_IMPLEMENTED: Verification and repair functions for conversation index
  PLAN_OR_REQUIREMENTS: Task 2 from docs/plans/deployment-plan.md
  BASE_SHA: a7981ec
  HEAD_SHA: 3df7661
  DESCRIPTION: Added verifyIndex() and repairIndex() with 4 issue types

[Subagent returns]:
  Strengths: Clean architecture, real tests
  Issues:
    Important: Missing progress indicators
    Minor: Magic number (100) for reporting interval
  Assessment: Ready to proceed

You: [Fix progress indicators]
[Continue to Task 3]
```

## Integration with Workflows

**Subagent-Driven Development:**
- Review after EACH task
- Catch issues before they compound
- Fix before moving to next task

**Executing Plans:**
- Review after each batch (3 tasks)
- Get feedback, apply, continue

**Ad-Hoc Development:**
- Review before merge
- Review when stuck

## Red Flags

**Never:**
- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Important issues
- Argue with valid technical feedback

**If reviewer wrong:**
- Push back with technical reasoning
- Show code/tests that prove it works
- Request clarification

See template at: requesting-code-review/code-reviewer.md

### task management reviews

# Review Task Management Patterns

Track review pipeline execution via Claude Native Tasks (TaskCreate, TaskUpdate, TaskList).

## When to Create Tasks

| Review Scope | Tasks? | Rationale |
|--------------|--------|-----------|
| Single-file fix | No | Scout + review + done, overhead not worth it |
| Multi-file feature (3+ files) | Yes | Track scout → review → fix → verify chain |
| Parallel reviewers (2+ scopes) | Yes | Coordinate independent reviews |
| Review cycle with Critical fixes | Yes | Dependencies between fix → re-verify |

**3-Task Rule:** Skip task creation when review pipeline has <3 meaningful steps.

## Review Pipeline as Tasks

```
TaskCreate: "Scout edge cases"         → pending
TaskCreate: "Review implementation"    → pending, blockedBy: [scout]
TaskCreate: "Fix critical issues"      → pending, blockedBy: [review]
TaskCreate: "Verify fixes pass"        → pending, blockedBy: [fix]
```

Dependency chain auto-unblocks: scout completes → review starts → issues found → fix starts → verify confirms.

## Task Schemas

### Scout Task

```
TaskCreate(
  subject: "Scout edge cases for {feature}",
  activeForm: "Scouting edge cases",
  description: "Identify affected files, data flows, boundary conditions. Changed: {files}",
  metadata: { reviewStage: "scout", feature: "{feature}",
              changedFiles: "src/auth.ts,src/middleware.ts",
              priority: "P2", effort: "3m" }
)
```

### Review Task

```
TaskCreate(
  subject: "Review {feature} implementation",
  activeForm: "Reviewing {feature}",
  description: "Code-reviewer subagent reviews {BASE_SHA}..{HEAD_SHA}. Plan: {plan_ref}",
  metadata: { reviewStage: "review", feature: "{feature}",
              baseSha: "{BASE_SHA}", headSha: "{HEAD_SHA}",
              priority: "P1", effort: "10m" },
  addBlockedBy: ["{scout-task-id}"]
)
```

### Fix Task (created after review finds issues)

```
TaskCreate(
  subject: "Fix {severity} issues from review",
  activeForm: "Fixing {severity} review issues",
  description: "Address: {issue_list}",
  metadata: { reviewStage: "fix", severity: "critical",
              issueCount: 3, priority: "P1", effort: "15m" },
  addBlockedBy: ["{review-task-id}"]
)
```

### Verify Task

```
TaskCreate(
  subject: "Verify fixes pass tests and build",
  activeForm: "Verifying fixes",
  description: "Run test suite, build, confirm 0 failures. Evidence before claims.",
  metadata: { reviewStage: "verify", priority: "P1", effort: "5m" },
  addBlockedBy: ["{fix-task-id}"]
)
```

## Parallel Review Coordination

For multi-scope reviews (e.g., backend + frontend changed independently):

```
// Create scoped review tasks — no blockedBy between them
TaskCreate(subject: "Review backend auth changes",
  metadata: { reviewStage: "review", scope: "src/api/,src/middleware/",
              agentIndex: 1, totalAgents: 2, priority: "P1" })

TaskCreate(subject: "Review frontend auth UI",
  metadata: { reviewStage: "review", scope: "src/components/auth/",
              agentIndex: 2, totalAgents: 2, priority: "P1" })

// Both run simultaneously via separate code-reviewer subagents
// Fix task blocks on BOTH completing:
TaskCreate(subject: "Fix all review issues",
  addBlockedBy: ["{backend-review-id}", "{frontend-review-id}"])
```

## Task Lifecycle

```
Scout:    pending → in_progress → completed (scout report returned)
Review:   pending → in_progress → completed (reviewer findings returned)
Fix:      pending → in_progress → completed (all Critical/Important fixed)
Verify:   pending → in_progress → completed (tests pass, build clean)
```

### Handling Re-Reviews

When fixes introduce new issues → create new review cycle:

```
TaskCreate(subject: "Re-review after fixes",
  addBlockedBy: ["{fix-task-id}"],
  metadata: { reviewStage: "review", cycle: 2, priority: "P1" })
```

Limit to 3 cycles. If still failing after cycle 3 → escalate to user.

## Integration with Planning Tasks

Review tasks are **separate from** cook/planning phase tasks.

**When cook spawns review:**
1. Cook completes implementation phase → creates review pipeline tasks
2. Review pipeline executes (scout → review → fix → verify)
3. All review tasks complete → cook marks phase as reviewed
4. Cook proceeds to next phase

Review tasks reference the phase but don't block it directly — the orchestrator manages handoff.

## Quality Check

After pipeline registration: `Registered [N] review tasks (scout → review → fix → verify chain)`

## Error Handling

If `TaskCreate` fails: log warning, fall back to sequential review without task tracking. Review pipeline functions identically — tasks add visibility, not functionality.


### verification before completion

---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before making any success claims; evidence before assertions always
---

# Verification Before Completion

## Overview

Claiming work is complete without verification is dishonesty, not efficiency.

**Core principle:** Evidence before claims, always.

**Violating the letter of this rule is violating the spirit of this rule.**

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying
```

## Common Failures

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| Tests pass | Test command output: 0 failures | Previous run, "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, extrapolation |
| Build succeeds | Build command: exit 0 | Linter passing, logs look good |
| Bug fixed | Test original symptom: passes | Code changed, assumed fixed |
| Regression test works | Red-green cycle verified | Test passes once |
| Agent completed | VCS diff shows changes | Agent reports "success" |
| Requirements met | Line-by-line checklist | Tests passing |

## Red Flags - STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!", etc.)
- About to commit/push/PR without verification
- Trusting agent success reports
- Relying on partial verification
- Thinking "just this once"
- Tired and wanting work over
- **ANY wording implying success without having run verification**

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter ≠ compiler |
| "Agent said success" | Verify independently |
| "I'm tired" | Exhaustion ≠ excuse |
| "Partial check is enough" | Partial proves nothing |
| "Different words so rule doesn't apply" | Spirit over letter |

## Key Patterns

**Tests:**
```
✅ [Run test command] [See: 34/34 pass] "All tests pass"
❌ "Should pass now" / "Looks correct"
```

**Regression tests (TDD Red-Green):**
```
✅ Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)
❌ "I've written a regression test" (without red-green verification)
```

**Build:**
```
✅ [Run build] [See: exit 0] "Build passes"
❌ "Linter passed" (linter doesn't check compilation)
```

**Requirements:**
```
✅ Re-read plan → Create checklist → Verify each → Report gaps or completion
❌ "Tests pass, phase complete"
```

**Agent delegation:**
```
✅ Agent reports success → Check VCS diff → Verify changes → Report actual state
❌ Trust agent report
```

## Why This Matters

From 24 failure memories:
- your human partner said "I don't believe you" - trust broken
- Undefined functions shipped - would crash
- Missing requirements shipped - incomplete features
- Time wasted on false completion → redirect → rework
- Violates: "Honesty is a core value. If you lie, you'll be replaced."

## When To Apply

**ALWAYS before:**
- ANY variation of success/completion claims
- ANY expression of satisfaction
- ANY positive statement about work state
- Committing, PR creation, task completion
- Moving to next task
- Delegating to agents

**Rule applies to:**
- Exact phrases
- Paraphrases and synonyms
- Implications of success
- ANY communication suggesting completion/correctness

## The Bottom Line

**No shortcuts for verification.**

Run the command. Read the output. THEN claim the result.

This is non-negotiable.



> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
