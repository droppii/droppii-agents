---
name: ck:team
description: "Orchestrate Agent Teams for parallel multi-session collaboration. Use for research, implementation, review, and debug workflows requiring independent teammates."
version: 2.1.0
argument-hint: "<template> <context> [--devs|--researchers|--reviewers N] [--delegate]"
---

# Agent Teams - CK-Native Orchestration Engine

Coordinate multiple independent Claude Code sessions. Each teammate has own context window, loads project context (CLAUDE.md, skills, agents), communicates via shared task list and messaging.

**Requires:** Agent Teams enabled. Set `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings.json env if using Claude Code < 2.1.33. May be GA in 2.1.33+.

## Usage

```
/team <template> <context> [flags]
```

**Templates:** `ck:research`, `ck:cook`, `ck:code-review`, `ck:debug`

**Flags:**
- `--devs N` | `--researchers N` | `--reviewers N` | `--debuggers N` — team size
- `--plan-approval` / `--no-plan-approval` — plan gate (default: on for cook)
- `--delegate` — lead only coordinates, never touches code

## Execution Protocol

**Pre-flight (MANDATORY — merged into step 2 of every template):**
1. Step 2 of every template calls `TeamCreate(team_name: "...", ...)`. Do NOT check whether the tool exists first — just call it.
2. If the call SUCCEEDS: continue with the template.
3. If the call returns an ERROR or is unrecognized: **STOP. Tell user:** "Agent Teams requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings.json. Team mode is not available."
4. Do NOT fall back to subagents. `/ck:team` MUST use Agent Teams or abort.
5. All teammate spawns MUST include `team_name` parameter — never spawn Task without it.

When activated, IMMEDIATELY execute the matching template sequence below.
Do NOT ask for confirmation. Do NOT explain what you're about to do.
Execute the tool calls in order. Report progress after each major step.

---

## CK Context Block

Every teammate spawn prompt MUST include this context at the end:

```
CK Context:
- Work dir: {CK_PROJECT_ROOT or CWD}
- Reports: {CK_REPORTS_PATH or "plans/reports/"}
- Plans: {CK_PLANS_PATH or "plans/"}
- Branch: {CK_GIT_BRANCH or current branch}
- Naming: {CK_NAME_PATTERN or "YYMMDD-HHMM"}
- Active plan: {CK_ACTIVE_PLAN or "none"}
- Commits: conventional (feat:, fix:, docs:, refactor:, test:, chore:)
- Refer to teammates by NAME, not agent ID
```

---

## ON `/ck:team research <topic>` [--researchers N]:

*Wraps /ck:research skill — scope, gather, analyze, report.*

IMMEDIATELY execute in order:

1. **Derive N angles** from `<topic>` (default N=3):
   - Angle 1: Architecture, patterns, proven approaches
   - Angle 2: Alternatives, competing solutions, trade-offs
   - Angle 3: Risks, edge cases, failure modes, security
   - (If N>3, derive additional angles from topic context)

2. **CALL** `TeamCreate(team_name: "<topic-slug>")`

3. **CALL** `TaskCreate` x N — one per angle:
   - Subject: `Research: <angle-title>`
   - Description: `Investigate <angle> for topic: <topic>. Save report to: {CK_REPORTS_PATH}/researcher-{N}-{CK_NAME_PATTERN}-{topic-slug}.md. Format: Executive summary, key findings, evidence, recommendations. Mark task completed when done. Send findings summary to lead.`

4. **CALL** `Task` x N to spawn researcher teammates:
   - `subagent_type: "researcher"`, `team_name: "<topic-slug>"`, `model: "haiku"`
   - `name: "researcher-{N}"`
   - Prompt: task description + CK Context Block

5. **MONITOR** via TaskCompleted hook events + TaskList fallback:
   - TaskCompleted events auto-notify when researchers finish
   - Fallback: Check TaskList if no event received in 60s
   - If stuck >5 min, message teammate directly

6. **READ** all researcher reports from `{CK_REPORTS_PATH}/`

7. **SYNTHESIZE** into: `{CK_REPORTS_PATH}/research-summary-{CK_NAME_PATTERN}-{topic-slug}.md`
   Format: exec summary, key findings, comparative analysis, recommendations, unresolved questions.

8. **SHUTDOWN**: `SendMessage(type: "shutdown_request")` to each teammate

9. **CLEANUP**: `TeamDelete` (no parameters — just call it)

10. **REPORT**: Tell user `Research complete. Summary: {path}. N reports generated.`

---

## ON `/ck:team cook <plan-path-or-description>` [--devs N]:

*Wraps /ck:cook skill — plan, code, test, review, finalize.*

IMMEDIATELY execute in order:

1. **READ** plan (if path provided) OR create via planner teammate:
   - If description only: spawn `Task(subagent_type: "planner")` to create plan first
   - Parse plan into N independent task groups with file ownership boundaries

2. **CALL** `TeamCreate(team_name: "<feature-slug>")`

3. **CALL** `TaskCreate` x (N + 1) — N dev tasks + 1 tester task:
   - Dev tasks: include `File ownership: <glob patterns>` — NO overlap between devs
   - Tester task: `addBlockedBy` all dev task IDs
   - Each task description includes: implementation scope, file ownership, acceptance criteria

4. **CALL** `Task` x N to spawn developer teammates:
   - `subagent_type: "fullstack-developer"`, `mode: "plan"`
   - `model: "sonnet"`, `name: "dev-{N}"`
   - Prompt: task description + CK Context Block
   - REVIEW and APPROVE each developer's plan via `plan_approval_response`

5. **MONITOR** dev completion via TaskCompleted events:
   - TaskCompleted hook notifies when each dev task finishes
   - When all N dev tasks show completed, spawn tester immediately
   - TeammateIdle events confirm devs are available for shutdown
   - Fallback: Check TaskList if no events received in 60s
   - `Task(subagent_type: "tester", model: "haiku", name: "tester")`
   - Tester runs full test suite, reports pass/fail

6. **DOCS SYNC EVAL** (MANDATORY for cook — from /ck:cook finalize):
   ```
   Docs impact: [none|minor|major]
   Action: [no update needed — <reason>] | [updated <page>] | [needs separate PR]
   ```

7. **SHUTDOWN** all teammates via `SendMessage(type: "shutdown_request")`
8. **CLEANUP**: `TeamDelete` (no parameters — just call it)

9. **REPORT**: Tell user what was cooked, test results, docs impact.

---

## ON `/ck:team review <scope>` [--reviewers N]:

*Wraps /ck:code-review skill — scout, review, synthesize with evidence gates.*

IMMEDIATELY execute in order:

1. **DERIVE** N review focuses from `<scope>` (default N=3):
   - Focus 1: Security — vulnerabilities, auth, input validation, OWASP
   - Focus 2: Performance — bottlenecks, memory, complexity, scaling
   - Focus 3: Test coverage — gaps, edge cases, error paths
   - (If N>3, derive from scope: architecture, DX, accessibility, etc.)

2. **CALL** `TeamCreate(team_name: "review-<scope-slug>")`

3. **CALL** `TaskCreate` x N — one per focus:
   - Subject: `Review: <focus-title>`
   - Description: `Review <scope> for <focus>. Output severity-rated findings only. Format: [CRITICAL|IMPORTANT|MODERATE] <finding> — <evidence> — <recommendation>. No "seems" or "probably" — concrete evidence only. Save to: {CK_REPORTS_PATH}/reviewer-{N}-{CK_NAME_PATTERN}-{scope-slug}.md. Mark task completed when done.`

4. **CALL** `Task` x N to spawn reviewers:
   - `subagent_type: "code-reviewer"`, `model: "haiku"`, `name: "reviewer-{N}"`
   - Prompt: task description + CK Context Block

5. **MONITOR** via TaskCompleted hook events + TaskList fallback:
   - TaskCompleted events auto-notify when reviewers finish
   - Fallback: Check TaskList if no event received in 60s

6. **SYNTHESIZE** into: `{CK_REPORTS_PATH}/review-{scope-slug}.md`
   - Deduplicate findings across reviewers
   - Prioritize by severity: CRITICAL > IMPORTANT > MODERATE
   - Create action items list with owners

7. **SHUTDOWN** all teammates via `SendMessage(type: "shutdown_request")`
8. **CLEANUP**: `TeamDelete` (no parameters — just call it)

9. **REPORT**: Tell user `Review complete. {X} findings ({Y} critical). Report: {path}.`

---

## ON `/ck:team debug <issue>` [--debuggers N]:

*Wraps /ck:fix skill — root-cause-first, adversarial hypotheses, disprove to converge.*

IMMEDIATELY execute in order:

1. **GENERATE** N competing hypotheses from `<issue>` (default N=3):
   - Each hypothesis must be independently testable
   - Each must predict different observable symptoms
   - Frame as: "If <cause>, then we should see <evidence>"

2. **CALL** `TeamCreate(team_name: "debug-<issue-slug>")`

3. **CALL** `TaskCreate` x N — one per hypothesis:
   - Subject: `Debug: Test hypothesis — <theory>`
   - Description: `Investigate hypothesis: <theory>. For issue: <issue>. ADVERSARIAL: actively try to disprove other theories. Message other debuggers to challenge findings. Report evidence FOR and AGAINST your theory. Save findings to: {CK_REPORTS_PATH}/debugger-{N}-{CK_NAME_PATTERN}-{issue-slug}.md. Mark task completed when done.`

4. **CALL** `Task` x N to spawn debugger teammates:
   - `subagent_type: "debugger"`, `model: "sonnet"`, `name: "debugger-{N}"`
   - Prompt: task description + CK Context Block

5. **MONITOR** via TaskCompleted events. Debuggers should message each other — let them converge.
   - TaskCompleted events notify as each hypothesis is tested
   - TeammateIdle events indicate debugger awaiting peer input
   - Fallback: Check TaskList if no events in 60s

6. **READ** all debugger reports. Identify surviving theory as root cause.

7. **WRITE** root cause report: `{CK_REPORTS_PATH}/debug-{issue-slug}.md`
   Format: Root cause, evidence chain, disproven hypotheses, recommended fix.

8. **SHUTDOWN** all teammates via `SendMessage(type: "shutdown_request")`
9. **CLEANUP**: `TeamDelete` (no parameters — just call it)

10. **REPORT**: Tell user `Debug complete. Root cause: <summary>. Report: {path}.`

---

## Agent Memory

Agents with `memory: project` retain learnings across team sessions. Memory persists in `.claude/agent-memory/<name>/` (gitignored). Useful for:
- Code reviewer remembering project conventions
- Debugger recalling past failure patterns
- Tester tracking flaky tests and coverage gaps

---

## Agent Memory

Agents with `memory: project` retain learnings across team sessions. Memory persists in `.claude/agent-memory/<name>/` (gitignored). Useful for:
- Code reviewer remembering project conventions
- Debugger recalling past failure patterns
- Tester tracking flaky tests and coverage gaps

---

## When to Use Agent Teams vs Subagents

| Scenario | Subagents (Task tool) | Agent Teams |
|----------|----------------------|-------------|
| Focused task (test, lint, single review) | **Yes** | Overkill |
| Sequential chain (plan → code → test) | **Yes** | No |
| 3+ independent parallel workstreams | Maybe | **Yes** |
| Competing debug hypotheses | No | **Yes** |
| Cross-layer work (FE + BE + tests) | Maybe | **Yes** |
| Workers need to discuss/challenge findings | No | **Yes** |
| Token budget is tight | **Yes** | No (high cost) |

## Token Budget

| Template | Estimated Tokens | Model Strategy |
|----------|-----------------|----------------|
| Research (3) | ~150K-300K | haiku for all |
| Cook (4) | ~400K-800K | sonnet for devs, haiku for tester |
| Review (3) | ~100K-200K | haiku for all |
| Debug (3) | ~200K-400K | sonnet for all |

## Error Recovery

1. **Check status**: `Shift+Up/Down` (in-process) or click pane (split)
2. **Redirect**: Send direct message with corrective instructions
3. **Replace**: Shut down failed teammate, spawn replacement for same task
4. **Reassign**: `TaskUpdate` stuck task to unblock dependents

## Abort Team

```
Shut down all teammates. Then call TeamDelete (no parameters).
```

If unresponsive: close terminal or kill session. Clean orphaned configs at `~/.claude/teams/` manually.

## Display Modes

- **auto** (default): split panes if in tmux, otherwise in-process
- **in-process**: all in one terminal. `Shift+Up/Down` navigate. `Ctrl+T` task list.
- **tmux/split**: each teammate own pane. Requires tmux or iTerm2.

## Rules Reference

See `.claude/rules/team-coordination-rules.md` for teammate behavior rules.

> v2.1.0: Event-driven orchestration via TaskCompleted/TeammateIdle hooks. Agent memory + Task restrictions.


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### agent teams controls and modes

# Agent Teams — Controls, Display Modes & Task Management

> **Source:** https://code.claude.com/docs/en/agent-teams

## Display Modes

- **In-process** (default fallback): all teammates in one terminal. `Shift+Up/Down` to navigate. Works in any terminal.
- **Split panes**: each teammate gets own pane. Requires tmux or iTerm2.

Default is `"auto"` — uses split panes if already inside a tmux session, otherwise in-process. The `"tmux"` setting enables split-pane mode and auto-detects tmux vs iTerm2.

```json
{ "teammateMode": "in-process" }
```

Per-session override: `claude --teammate-mode in-process`

Split panes NOT supported in: VS Code terminal, Windows Terminal, Ghostty.

**tmux setup:** install via system package manager.
**iTerm2 setup:** install `it2` CLI, enable Python API in iTerm2 > Settings > General > Magic.

## Specify Teammates & Models

Claude decides teammate count based on task, or you specify:

```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

## Plan Approval

Require teammates to plan before implementing:

```
Spawn an architect teammate to refactor the auth module.
Require plan approval before they make any changes.
```

**Flow:**
1. Teammate works in read-only plan mode
2. Teammate finishes planning → sends `plan_approval_request` to lead
3. Lead reviews → approves via `SendMessage(type: "plan_approval_response", approve: true)`
4. If rejected: teammate stays in plan mode, revises based on feedback, resubmits
5. Once approved: teammate exits plan mode, begins implementation

**Influence criteria:** "only approve plans that include test coverage" or "reject plans that modify the database schema"

## Delegate Mode

Restricts lead to coordination-only tools: spawning, messaging, shutting down teammates, and managing tasks. No code editing.

Useful when lead should focus entirely on orchestration — breaking down work, assigning tasks, synthesizing results.

**Enable:** Press `Shift+Tab` after team creation to cycle into delegate mode.

## Direct Teammate Interaction

- **In-process**: `Shift+Up/Down` select teammate, type to message. `Enter` view session. `Escape` interrupt current turn. `Ctrl+T` toggle task list.
- **Split panes**: click into pane to interact directly. Each teammate has full terminal view.

## Task Assignment & Claiming

Three states: **pending** → **in_progress** → **completed**. Tasks can have dependencies — blocked until dependencies resolve.

- **Lead assigns**: tell lead which task → which teammate
- **Self-claim**: after finishing, teammate picks next unassigned, unblocked task automatically

File locking prevents race conditions on simultaneous claiming.

Task dependencies managed automatically — completing a blocking task unblocks dependents.

## Shutdown

```
Ask the researcher teammate to shut down
```

Teammate can approve (exit) or reject with explanation. Teammates finish current request/tool call before shutting down — can be slow.

## Cleanup

After all teammates shut down, call `TeamDelete` (no parameters). Fails if active teammates still exist.

Removes shared team resources (`~/.claude/teams/` and `~/.claude/tasks/` entries).

## Hook-Based Orchestration (2.1.33+)

### Event-Driven Monitoring

Instead of polling TaskList, lead receives automatic context injection:

- **TaskCompleted** — fires when any teammate completes a task. Lead gets progress counts.
- **TeammateIdle** — fires when teammate turn ends. Lead gets available task info.

CK hooks (`task-completed-handler.cjs`, `teammate-idle-handler.cjs`) process these events and inject summary into lead's context.

### Recommended Pattern

1. Lead creates tasks and spawns teammates
2. TaskCompleted hook notifies lead as tasks finish (progress: N/M)
3. TeammateIdle hook suggests reassignment or shutdown
4. Lead acts on suggestions (spawn tester, shut down, reassign)
5. Fallback: Check TaskList manually if no events received in 60s

This replaces the "poll TaskList every 30s" pattern with reactive orchestration.


### agent teams examples and best practices

# Agent Teams — Examples, Best Practices & Troubleshooting

> **Source:** https://code.claude.com/docs/en/agent-teams

## Use Case Examples

### Parallel Code Review

```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

Each reviewer applies different filter to same PR. Lead synthesizes across all three.

### Competing Hypotheses Investigation

```
Users report the app exits after one message instead of staying connected.
Spawn 5 agent teammates to investigate different hypotheses. Have them talk to
each other to try to disprove each other's theories, like a scientific
debate. Update the findings doc with whatever consensus emerges.
```

Adversarial debate structure fights anchoring bias — surviving theory is most likely correct.

### Parallel Feature Implementation

```
Create a team to implement the new dashboard feature.
Developer A owns src/api/* and src/models/*.
Developer B owns src/components/* and src/pages/*.
Tester writes tests after both devs finish.
Require plan approval for developers.
```

Each developer works in isolation. Tester blocked until both complete.

## Best Practices

### Give Enough Context

Teammates don't inherit lead's conversation. Include details in spawn prompt:

```
Spawn a security reviewer with prompt: "Review src/auth/ for vulnerabilities.
Focus on token handling, session management, input validation.
App uses JWT in httpOnly cookies. Report with severity ratings."
```

### Size Tasks Right

- **Too small**: coordination overhead exceeds benefit
- **Too large**: teammates work too long without check-ins
- **Right**: self-contained units with clear deliverable (function, test file, review)

### Start with Research/Review

If new to agent teams, start with read-only tasks (reviewing PRs, researching libraries, investigating bugs). Shows parallel value without coordination challenges of parallel implementation.

### Wait for Teammates

If lead starts implementing instead of delegating:
```
Wait for your teammates to complete their tasks before proceeding
```

### Avoid File Conflicts

Two teammates editing same file = overwrites. Each teammate must own distinct files. If shared file needed, lead handles it or restructure tasks.

### Use Git Worktrees for Implementation Teams

For implementation teams with multiple developers editing code:
1. Create a worktree per developer: `git worktree add ../worktrees/<dev-name> -b <branch>`
2. Each developer works in their own worktree — eliminates git conflicts
3. Lead merges worktree branches after completion
4. Cleanup: `git worktree remove ../worktrees/<dev-name>`

This is the safest pattern for parallel code changes.

### Monitor & Steer

Check progress regularly. Redirect bad approaches. Synthesize findings as they arrive. Letting a team run unattended too long increases wasted effort risk.

### File Ownership Enforcement

- Define explicit file boundaries in each task description
- Include glob patterns: `File ownership: src/api/*, src/models/*`
- If two tasks need same file: escalate to lead, restructure, or have lead handle directly
- Tester owns test files only; reads implementation files but never edits them

### Leverage Event-Driven Hooks (2.1.33+)

With `TaskCompleted` and `TeammateIdle` hooks enabled:

- Lead is automatically notified when tasks complete — no manual polling needed
- Progress is tracked via hook-injected context: "3/5 tasks done, 2 pending"
- Idle teammates trigger suggestions: "worker-2 idle, 1 unblocked task available"
- All tasks done triggers: "Consider shutting down teammates and synthesizing"

**Cook workflow example:**
```
1. Lead spawns 3 devs + creates tasks
2. TaskCompleted(dev-1, task #1) → "1/4 done"
3. TaskCompleted(dev-2, task #2) → "2/4 done"
4. TaskCompleted(dev-3, task #3) → "3/4 done"
5. TaskCompleted(dev-1, task #4) → "4/4 done. All tasks completed."
6. Lead spawns tester (reactively, no delay)
```

### Use Agent Memory for Long-Running Projects

For projects with recurring team sessions:
- Code reviewer learns project conventions, stops flagging known patterns
- Debugger remembers past failures, faster root-cause identification
- Tester tracks flaky tests, avoids re-investigating known issues
- Researcher accumulates domain knowledge across projects (user scope)

Memory persists after team cleanup — it's in `.claude/agent-memory/`, not `~/.claude/teams/`.

### Restrict Sub-Agent Spawning

Use `Task(agent_type)` in agent definitions to prevent:
- Recursive agent chains (agent spawns agent spawns agent)
- Cost escalation (haiku agent spawning opus sub-agent)
- Scope creep (tester spawning developer to "fix" issues)

Recommended: Most agents get `Task(Explore)` only. Planner gets `Task(Explore), Task(researcher)`.

## Token Budget Guidance

| Template | Estimated Tokens | Model Strategy |
|----------|-----------------|----------------|
| Research (3 teammates) | ~150K-300K | haiku for all researchers |
| Cook (4 teammates) | ~400K-800K | sonnet for devs, haiku for tester |
| Review (3 teammates) | ~100K-200K | haiku for all reviewers |
| Debug (3 teammates) | ~200K-400K | sonnet for debuggers |

Agent Teams use significantly more tokens than subagents. Use only when parallel exploration + discussion adds clear value. For routine tasks, single session is more cost-effective.

## Troubleshooting

### Teammates Not Appearing

- In-process: press `Shift+Down` to cycle through active teammates
- Task may not be complex enough — Claude decides based on task
- Split panes: verify tmux installed and in PATH
- iTerm2: verify `it2` CLI installed and Python API enabled

### Too Many Permission Prompts

Pre-approve common operations in permission settings before spawning.

### Teammates Stopping on Errors

Check output via `Shift+Up/Down` or clicking pane. Give additional instructions or spawn replacement.

### Lead Shuts Down Early

Tell lead to keep going or wait for teammates.

### Orphaned tmux Sessions

```
tmux ls
tmux kill-session -t <session-name>
```

## Limitations

- **No session resumption**: `/resume` and `/rewind` don't restore in-process teammates
- **Task status can lag**: teammates may not mark tasks completed; check manually
- **Shutdown can be slow**: finishes current request first
- **One team per session**: clean up before starting new one
- **No nested teams**: only lead manages team
- **Lead is fixed**: can't promote teammate or transfer leadership
- **Permissions at spawn**: all inherit lead's mode; changeable after but not at spawn time
- **Split panes**: require tmux or iTerm2 only


### agent teams official docs

# Agent Teams — Overview & Architecture

> **Canonical source:** https://code.claude.com/docs/en/agent-teams
> **Version captured:** Claude Code (Feb 2026)
> **Update policy:** Re-fetch canonical URL when Claude Code releases new Agent Teams features.

This is a **self-contained knowledge base** — AI agents should NOT need to re-fetch the URL.

## Overview

Agent Teams coordinate multiple Claude Code instances working together. One session acts as the team lead, coordinating work, assigning tasks, and synthesizing results. Teammates work independently, each in its own context window, and communicate directly with each other.

Unlike subagents (run within a single session, report back only), teammates are full independent sessions you can interact with directly.

## When to Use

Best for tasks where parallel exploration adds real value:

- **Research and review**: multiple teammates investigate different aspects, share and challenge findings
- **New modules or features**: teammates each own a separate piece without conflicts
- **Debugging with competing hypotheses**: test different theories in parallel
- **Cross-layer coordination**: changes spanning frontend, backend, tests — each owned by different teammate

**Not suitable for:** sequential tasks, same-file edits, work with many dependencies.

### Subagents vs Agent Teams

| | Subagents | Agent Teams |
|---|---|---|
| **Context** | Own window; results return to caller | Own window; fully independent |
| **Communication** | Report back to main agent only | Message each other directly |
| **Coordination** | Main agent manages all work | Shared task list, self-coordination |
| **Best for** | Focused tasks, result-only | Complex work requiring discussion |
| **Token cost** | Lower | Higher (each teammate = separate instance) |

## Enable

Still experimental — requires opt-in:

```json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```

Set in shell environment or settings.json.

## How Teams Start

Two paths:
1. **You request**: describe task + ask for agent team. Claude creates based on instructions.
2. **Claude proposes**: suggests team if task benefits from parallel work.

Both require your confirmation. Claude won't create a team without approval.

## Architecture

| Component | Role |
|-----------|------|
| **Team lead** | Main session — creates team, spawns teammates, coordinates |
| **Teammates** | Separate Claude Code instances with own context windows |
| **Task list** | Shared work items at `~/.claude/tasks/{team-name}/` |
| **Mailbox** | Messaging system for inter-agent communication |

Storage:
- **Team config**: `~/.claude/teams/{team-name}/config.json` (members array with name, agent ID, type)
- **Task list**: `~/.claude/tasks/{team-name}/`

Task dependencies managed automatically — completing a blocking task unblocks dependents without manual intervention.

## Tools API Surface

### TeamCreate

Create team + task list. Params: `team_name`, `description`.

### TeamDelete

Remove team/task dirs. **Takes NO parameters** — just call `TeamDelete` with empty params. Fails if active teammates still exist.

### SendMessage Types

| Type | Purpose |
|------|---------|
| `message` | DM to one teammate (requires `recipient`) |
| `broadcast` | Send to ALL teammates (use sparingly — costs scale with N) |
| `shutdown_request` | Ask teammate to gracefully exit |
| `shutdown_response` | Teammate approves/rejects shutdown (requires `request_id`) |
| `plan_approval_response` | Lead approves/rejects teammate plan (requires `request_id`) |

### Task System Fields

| Field | Values/Purpose |
|-------|---------------|
| `status` | `pending` → `in_progress` → `completed` (or `deleted`) |
| `owner` | Agent name assigned to task |
| `blocks` | Task IDs this task blocks (read via TaskGet) |
| `blockedBy` | Task IDs that must complete first (read via TaskGet) |
| `addBlocks` | Set blocking relations (write via TaskUpdate) |
| `addBlockedBy` | Set dependency relations (write via TaskUpdate) |
| `metadata` | Arbitrary key-value pairs |
| `subject` | Brief imperative title |
| `description` | Full requirements and context |

Task claiming uses file locking to prevent race conditions.

## Hook Events (2.1.33+)

### TaskCompleted

Fires when teammate calls `TaskUpdate` with `status: "completed"`.

| Field | Type | Description |
|-------|------|-------------|
| `task_id` | string | Completed task ID |
| `task_subject` | string | Task title |
| `task_description` | string | Full task description |
| `teammate_name` | string | Who completed it |
| `team_name` | string | Team name |

Note: Does NOT include `permission_mode`.

### TeammateIdle

Fires after `SubagentStop` for team members.

| Field | Type | Description |
|-------|------|-------------|
| `teammate_name` | string | Idle teammate name |
| `team_name` | string | Team name |

Note: Includes `permission_mode`. Always pairs with SubagentStop.

### Event Lifecycle

```
SubagentStart(worker) → TaskCompleted(task) → SubagentStop(worker) → TeammateIdle(worker)
```

TaskCompleted fires BEFORE SubagentStop/TeammateIdle.

## Agent Memory

Agents can declare `memory` in frontmatter for persistent cross-session learning.

| Scope | Location | Persists across |
|-------|----------|-----------------|
| `user` | `~/.claude/agent-memory/<name>/` | All projects |
| `project` | `.claude/agent-memory/<name>/` | Sessions in same project |

First 200 lines of `MEMORY.md` auto-injected into system prompt.

## Task(agent_type) Restrictions

Limit which sub-agents an agent can spawn:

```yaml
tools: Read, Grep, Bash, Task(Explore)
```

This agent can only spawn `Explore` sub-agents. Restricts recursive spawning and cost escalation.

## Context & Communication

Each teammate loads: CLAUDE.md, MCP servers, skills, agents. Receives spawn prompt from lead. Lead's conversation history does NOT carry over.

- **Automatic message delivery** — no polling needed
- **Idle notifications** — teammates notify lead when turn ends
- **Shared task list** — all agents see status and claim work

## Permissions

Teammates inherit lead's permission settings at spawn. If lead uses `--dangerously-skip-permissions`, all teammates do too. Can change individually after spawning but not at spawn time.

## Token Usage

Scales with active teammates. Worth it for research/review/features. Single session more cost-effective for routine tasks.


