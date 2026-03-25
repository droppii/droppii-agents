---
name: ck:plan
description: "Plan implementations, design architectures, create technical roadmaps with detailed phases. Use for feature planning, system design, solution architecture, implementation strategy, phase documentation."
argument-hint: "[task] OR archive|red-team|validate"
license: MIT
---

# Planning

Create detailed technical implementation plans through research, codebase analysis, solution design, and comprehensive documentation.

## Default (No Arguments)

If invoked with a task description, proceed with planning workflow. If invoked WITHOUT arguments or with unclear intent, use `AskUserQuestion` to present available operations:

| Operation | Description |
|-----------|-------------|
| `(default)` | Create implementation plan for a task |
| `archive` | Write journal entry & archive plans |
| `red-team` | Adversarial plan review |
| `validate` | Critical questions interview |

Present as options via `AskUserQuestion` with header "Planning Operation", question "What would you like to do?".

## Workflow Modes

Default: `--auto` (analyze task complexity and auto-pick mode).

| Flag | Mode | Research | Red Team | Validation | Cook Flag |
|------|------|----------|----------|------------|-----------|
| `--auto` | Auto-detect | Follows mode | Follows mode | Follows mode | Follows mode |
| `--fast` | Fast | Skip | Skip | Skip | `--auto` |
| `--hard` | Hard | 2 researchers | Yes | Optional | (none) |
| `--parallel` | Parallel | 2 researchers | Yes | Optional | `--parallel` |
| `--two` | Two approaches | 2+ researchers | After selection | After selection | (none) |

Add `--no-tasks` to skip task hydration in any mode.

Load: `references/workflow-modes.md` for auto-detection logic, per-mode workflows, context reminders.

## When to Use

- Planning new feature implementations
- Architecting system designs
- Evaluating technical approaches
- Creating implementation roadmaps
- Breaking down complex requirements

## Core Responsibilities & Rules

Always honoring **YAGNI**, **KISS**, and **DRY** principles.
**Be honest, be brutal, straight to the point, and be concise.**

### 1. Research & Analysis
Load: `references/research-phase.md`
**Skip if:** Fast mode or provided with researcher reports

### 2. Codebase Understanding
Load: `references/codebase-understanding.md`
**Skip if:** Provided with scout reports

### 3. Solution Design
Load: `references/solution-design.md`

### 4. Plan Creation & Organization
Load: `references/plan-organization.md`

### 5. Task Breakdown & Output Standards
Load: `references/output-standards.md`

## Workflow Process

1. **Pre-Creation Check** → Check Plan Context for active/suggested/none
2. **Mode Detection** → Auto-detect or use explicit flag (see `workflow-modes.md`)
3. **Research Phase** → Spawn researchers (skip in fast mode)
4. **Codebase Analysis** → Read docs, scout if needed
5. **Plan Documentation** → Write comprehensive plan via planner subagent
6. **Red Team Review** → Use `Skill` tool: `plan:red-team {plan-path}` (hard/parallel/two modes)
7. **Post-Plan Validation** → Use `Skill` tool: `plan:validate {plan-path}` (hard/parallel/two modes)
8. **Hydrate Tasks** → Create Claude Tasks from phases (default on, `--no-tasks` to skip)
9. **Context Reminder** → Output cook command with absolute path (MANDATORY)

## Output Requirements

- DO NOT implement code - only create plans
- Respond with plan file path and summary
- Ensure self-contained plans with necessary context
- Include code snippets/pseudocode when clarifying
- Fully respect the `./docs/development-rules.md` file

## Task Management

Plan files = persistent. Tasks = session-scoped. Hydration bridges the gap.

**Default:** Auto-hydrate tasks after plan files are written. Skip with `--no-tasks`.
**3-Task Rule:** <3 phases → skip task creation.

Load: `references/task-management.md` for hydration pattern, TaskCreate patterns, cook handoff protocol.

### Hydration Workflow
1. Write plan.md + phase files (persistent layer)
2. TaskCreate per phase with `addBlockedBy` chain
3. TaskCreate for critical/high-risk steps within phases
4. Metadata: phase, priority, effort, planDir, phaseFile
5. Cook picks up via TaskList (same session) or re-hydrates (new session)

## Active Plan State

Check `## Plan Context` injected by hooks:
- **"Plan: {path}"** → Active plan. Ask "Continue? [Y/n]"
- **"Suggested: {path}"** → Branch hint only. Ask if activate or create new.
- **"Plan: none"** → Create new using `Plan dir:` from `## Naming`

After creating plan: `node .claude/scripts/set-active-plan.cjs {plan-dir}`
Reports: Active plans → plan-specific path. Suggested → default path.

### Important
DO NOT create plans or reports in USER directory.
ALWAYS create plans or reports in CURRENT WORKING PROJECT DIRECTORY.

## Subcommands

| Subcommand | Reference | Purpose |
|------------|-----------|---------|
| `/ck:plan archive` | `references/archive-workflow.md` | Archive plans + write journal entries |
| `/ck:plan red-team` | `references/red-team-workflow.md` | Adversarial plan review with hostile reviewers |
| `/ck:plan validate` | `references/validate-workflow.md` | Validate plan with critical questions interview |

## Quality Standards

- Thorough and specific, consider long-term maintainability
- Research thoroughly when uncertain
- Address security and performance concerns
- Detailed enough for junior developers
- Validate against existing codebase patterns

**Remember:** Plan quality determines implementation success. Be comprehensive and consider all solution aspects.


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### archive workflow

# Archive Workflow

## Your mission
Read and analyze the plans, then write journal entries and archive specific plans or all plans in the `plans` directory.

## Plan Resolution
1. If `$ARGUMENTS` provided → Use that path
2. Else read all plans in the `plans` directory

## Workflow

### Step 1: Read Plan Files

Read the plan directory:
- `plan.md` - Overview and phases list
- `phase-*.md` - 20 first lines of each phase file to understand the progress and status

### Step 2: Summarize the plans and document them with `/ck:journal` slash command
Use `AskUserQuestion` tool to ask if user wants to document journal entries or not.
Skip this step if user selects "No".
If user selects "Yes":
- Analyze the information in previous steps.
- Use Task tool with `subagent_type="journal-writer"` in parallel to document all plans.
- Journal entries should be concise and focused on the most important events, key changes, impacts, and decisions.
- Keep journal entries in the `./docs/journals/` directory.

### Step 3: Ask user to confirm the action before archiving these plans
Use `AskUserQuestion` tool to ask if user wants to proceed with archiving these plans, select specific plans to archive or all completed plans only.
Use `AskUserQuestion` tool to ask if user wants to delete permanently or move to the `./plans/archive` directory.

### Step 4: Archive the plans
Start archiving the plans based on the user's choice:
- Move the plans to the `./plans/archive` directory.
- Delete the plans permanently: `rm -rf ./plans/<plan-1> ./plans/<plan-2> ...`

### Step 5: Ask if user wants to commit the changes
Use `AskUserQuestion` tool to ask if user wants to commit the changes with these options:
- Stage and commit the changes (Use `/ck:git cm` slash command)
- Commit and push the changes (Use `/ck:git cp` slash command)
- Nah, I'll do it later

## Output
After archiving the plans, provide summary:
- Number of plans archived
- Number of plans deleted permanently
- Table of plans that are archived or deleted (title, status, created date, LOC)
- Table of journal entries that are created (title, status, created date, LOC)

## Important Notes
- Only ask questions about genuine decision points
- Sacrifice grammar for concision
- List any unresolved questions at the end
- Ensure token efficiency while maintaining high quality


### codebase understanding

# Codebase Understanding Phase

**When to skip:** If provided with scout reports, skip this phase.

## Core Activities

### Parallel Scout Agents
- Use `/ck:scout ext` (preferred) or `/ck:scout` (fallback) slash command to search the codebase for files needed to complete the task
- Each scout locates files needed for specific task aspects
- Wait for all scout agents to report back before analysis
- Efficient for finding relevant code across large codebases

### Essential Documentation Review
ALWAYS read these files first:

1. **`./docs/development-rules.md`** (IMPORTANT)
   - File Name Conventions
   - File Size Management
   - Development rules and best practices
   - Code quality standards
   - Security guidelines

2. **`./docs/codebase-summary.md`**
   - Project structure and current status
   - High-level architecture overview
   - Component relationships

3. **`./docs/code-standards.md`**
   - Coding conventions and standards
   - Language-specific patterns
   - Naming conventions

4. **`./docs/design-guidelines.md`** (if exists)
   - Design system guidelines
   - Branding and UI/UX conventions
   - Component library usage

### Environment Analysis
- Review development environment setup
- Analyze dotenv files and configuration
- Identify required dependencies
- Understand build and deployment processes

### Pattern Recognition
- Study existing patterns in codebase
- Identify conventions and architectural decisions
- Note consistency in implementation approaches
- Understand error handling patterns

### Integration Planning
- Identify how new features integrate with existing architecture
- Map dependencies between components
- Understand data flow and state management
- Consider backward compatibility

## Best Practices

- Start with documentation before diving into code
- Use scouts for targeted file discovery
- Document patterns found for consistency
- Note any inconsistencies or technical debt
- Consider impact on existing features


### output standards

# Output Standards & Quality

## Plan File Format

### YAML Frontmatter (Required for plan.md)

All `plan.md` files MUST include YAML frontmatter at the top:

```yaml
---
title: "{Brief plan title}"
description: "{One-sentence summary for card preview}"
status: pending  # pending | in-progress | completed | cancelled
priority: P2     # P1 (High) | P2 (Medium) | P3 (Low)
effort: 4h       # Estimated total effort
issue: 74        # GitHub issue number (if applicable)
branch: kai/feat/feature-name
tags: [frontend, api]  # Category tags
created: 2025-12-16
---
```

### Auto-Population Rules

When creating plans, auto-populate these fields:
- **title**: Extract from task description
- **description**: First sentence of Overview section
- **status**: Always `pending` for new plans
- **priority**: From user request or default `P2`
- **effort**: Sum of phase estimates
- **issue**: Parse from branch name or context
- **branch**: Current git branch (`git branch --show-current`)
- **tags**: Infer from task keywords (e.g., frontend, backend, api, auth)
- **created**: Today's date in YYYY-MM-DD format

### Tag Vocabulary (Recommended)

Use these predefined tags for consistency:
- **Type**: `feature`, `bugfix`, `refactor`, `docs`, `infra`
- **Domain**: `frontend`, `backend`, `database`, `api`, `auth`
- **Scope**: `critical`, `tech-debt`, `experimental`

### Task Naming Conventions

**subject** (imperative): Action verb + deliverable, <60 chars
  Examples: "Setup database migrations", "Implement OAuth2 flow"

**activeForm** (continuous): Present participle of subject
  Examples: "Setting up database", "Implementing OAuth2"

**description**: 1-2 sentences, concrete deliverables, reference phase file

See `task-management.md` for full TaskCreate patterns and metadata.

## Task Breakdown

- Transform complex requirements into manageable, actionable tasks
- Each task independently executable with clear dependencies
- Prioritize by dependencies, risk, business value
- Eliminate ambiguity in instructions
- Include specific file paths for all modifications
- Provide clear acceptance criteria per task

### File Management

List affected files with:
- Full paths (not relative)
- Action type (modify/create/delete)
- Brief change description
- Dependencies on other changes
- Fully respect the `./docs/development-rules.md` file.

## Workflow Process

1. **Initial Analysis** → Read docs, understand context
2. **Research Phase** → Spawn researchers in parallel, investigate approaches
3. **Synthesis** → Analyze reports, identify optimal solution
4. **Design Phase** → Create architecture, implementation design
5. **Plan Documentation** → Write comprehensive plan in Markdown
6. **Review & Refine** → Ensure completeness, clarity, actionability

## Output Requirements

### What Planners Do
- Create plans ONLY (no implementation)
- Provide plan file path and summary
- Self-contained plans with necessary context
- Code snippets/pseudocode when clarifying
- Multiple options with trade-offs when appropriate
- Fully respect the `./docs/development-rules.md` file.

### Writing Style
**IMPORTANT:** Sacrifice grammar for concision
- Focus clarity over eloquence
- Use bullets and lists
- Short sentences
- Remove unnecessary words
- Prioritize actionable info

### Unresolved Questions
**IMPORTANT:** Use `AskUserQuestion` to ask users for unresolved questions at the end
- Questions needing clarification
- Technical decisions requiring input
- Unknowns impacting implementation
- Trade-offs requiring business decisions
Revise the plan and phases based on the answers.

## Quality Standards

### Thoroughness
- Thorough and specific in research/planning
- Consider edge cases, failure modes
- Think through entire user journey
- Document all assumptions

### Maintainability
- Consider long-term maintainability
- Design for future modifications
- Document decision rationale
- Avoid over-engineering
- Fully respect the `./docs/development-rules.md` file.

### Research Depth
- When uncertain, research more
- Multiple options with clear trade-offs
- Validate against best practices
- Consider industry standards

### Security & Performance
- Address all security concerns
- Identify performance implications
- Plan for scalability
- Consider resource constraints

### Implementability
- Detailed enough for junior developers
- Validate against existing patterns
- Ensure codebase standards consistency
- Provide clear examples

**Remember:** Plan quality determines implementation success. Be comprehensive, consider all solution aspects.


### plan organization

# Plan Creation & Organization

## Directory Structure

### Plan Location

Use `Plan dir:` from `## Naming` section injected by hooks. This is the full computed path.

**Example:** `plans/251101-1505-authentication/` or `ai_docs/feature/MRR-1453/`

### File Organization

IN CURRENT WORKING PROJECT DIRECTORY:
```
{plan-dir}/                                    # From `Plan dir:` in ## Naming
├── research/
│   ├── researcher-XX-report.md
│   └── ...
├── reports/
│   ├── scout-report.md
│   ├── researcher-report.md
│   └── ...
├── plan.md                                    # Overview access point
├── phase-01-setup-environment.md              # Setup environment
├── phase-02-implement-database.md             # Database models
├── phase-03-implement-api-endpoints.md        # API endpoints
├── phase-04-implement-ui-components.md        # UI components
├── phase-05-implement-authentication.md       # Auth & authorization
├── phase-06-implement-profile.md              # Profile page
└── phase-07-write-tests.md                    # Tests
```

### Task Hydration

After creating plan.md and phase files, hydrate tasks (unless `--no-tasks`):
1. TaskCreate per phase with `addBlockedBy` dependency chain
2. Add critical step tasks for high-risk items
3. See `task-management.md` for patterns and cook handoff protocol

### Active Plan State Tracking

See SKILL.md "Active Plan State" section for full rules. Key points:
- Check `## Plan Context` injected by hooks for active/suggested/none state
- After creating plan: `node .claude/scripts/set-active-plan.cjs {plan-dir}`
- Active plans use plan-specific reports path; suggested plans use default path

## File Structure

### Overview Plan (plan.md)

**IMPORTANT:** All plan.md files MUST include YAML frontmatter. See `output-standards.md` for schema.

**Example plan.md structure:**
```markdown
---
title: "Feature Implementation Plan"
description: "Add user authentication with OAuth2 support"
status: pending
priority: P1
effort: 8h
issue: 123
branch: kai/feat/oauth-auth
tags: [auth, backend, security]
created: 2025-12-16
---

# Feature Implementation Plan

## Overview

Brief description of what this plan accomplishes.

## Phases

| # | Phase | Status | Effort | Link |
|---|-------|--------|--------|------|
| 1 | Setup | Pending | 2h | [phase-01](./phase-01-setup.md) |
| 2 | Implementation | Pending | 4h | [phase-02](./phase-02-impl.md) |
| 3 | Testing | Pending | 2h | [phase-03](./phase-03-test.md) |

## Dependencies

- List key dependencies here
```

**Guidelines:**
- Keep generic and under 80 lines
- List each phase with status/progress
- Link to detailed phase files
- Key dependencies

### Phase Files (phase-XX-name.md)
Fully respect the `./docs/development-rules.md` file.
Each phase file should contain:

**Context Links**
- Links to related reports, files, documentation

**Overview**
- Priority
- Current status
- Brief description

**Key Insights**
- Important findings from research
- Critical considerations

**Requirements**
- Functional requirements
- Non-functional requirements

**Architecture**
- System design
- Component interactions
- Data flow

**Related Code Files**
- List of files to modify
- List of files to create
- List of files to delete

**Implementation Steps**
- Detailed, numbered steps
- Specific instructions

**Todo List**
- Checkbox list for tracking

**Success Criteria**
- Definition of done
- Validation methods

**Risk Assessment**
- Potential issues
- Mitigation strategies

**Security Considerations**
- Auth/authorization
- Data protection

**Next Steps**
- Dependencies
- Follow-up tasks


### red team personas

# Red Team Personas

## Available Lenses

| Reviewer | Lens | Focus |
|----------|------|-------|
| **Security Adversary** | Attacker mindset | Auth bypass, injection, data exposure, privilege escalation, supply chain, OWASP top 10 |
| **Failure Mode Analyst** | Murphy's Law | Race conditions, data loss, cascading failures, recovery gaps, deployment risks, rollback holes |
| **Assumption Destroyer** | Skeptic | Unstated dependencies, false "will work" claims, missing error paths, scale assumptions, integration assumptions |
| **Scope & Complexity Critic** | YAGNI enforcer | Over-engineering, premature abstraction, unnecessary complexity, missing MVP cuts, scope creep, gold plating |

## Reviewer Prompt Template

Each reviewer prompt MUST include:

1. This override: `"IGNORE your default code-review instructions. You are reviewing a PLAN DOCUMENT, not code. There is no code to lint, build, or test. Focus exclusively on plan quality."`
2. Their specific adversarial lens and persona
3. The plan file paths so they can read original files directly
4. These instructions:

```
You are a hostile reviewer. Your job is to DESTROY this plan.
Adopt the {LENS_NAME} perspective. Find every flaw you can.

Rules:
- Be specific: cite exact phase/section where the flaw lives
- Be concrete: describe the failure scenario, not just "could be a problem"
- Rate severity: Critical (blocks success) | High (significant risk) | Medium (notable concern)
- Skip trivial observations (style, naming, formatting)
- No praise. No "overall looks good". Only findings.
- 5-10 findings per reviewer. Quality over quantity.

Output format per finding:
## Finding {N}: {title}
- **Severity:** Critical | High | Medium
- **Location:** Phase {X}, section "{name}"
- **Flaw:** {what's wrong}
- **Failure scenario:** {concrete description of how this fails}
- **Evidence:** {quote from plan or missing element}
- **Suggested fix:** {brief recommendation}
```

## Adjudication Format

```markdown
## Red Team Findings

### Finding 1: {title} — {SEVERITY}
**Reviewer:** {lens name}
**Location:** {phase/section}
**Flaw:** {description}
**Failure scenario:** {concrete scenario}
**Disposition:** Accept | Reject
**Rationale:** {why accept/reject — be specific}
```

## Plan.md Section Format

```markdown
## Red Team Review

### Session — {YYYY-MM-DD}
**Findings:** {total} ({accepted} accepted, {rejected} rejected)
**Severity breakdown:** {N} Critical, {N} High, {N} Medium

| # | Finding | Severity | Disposition | Applied To |
|---|---------|----------|-------------|------------|
| 1 | {title} | Critical | Accept | Phase 2 |
```


### red team workflow

# Red Team Review

Adversarially review an implementation plan by spawning parallel reviewer subagents that try to tear it apart. Each reviewer adopts a different hostile lens. You then adjudicate findings, and the user decides which to apply.

**Mindset:** Like hiring someone who hates the implementer to destroy their work.

## Plan Resolution

1. If `$ARGUMENTS` provided → Use that path
2. Else check `## Plan Context` section → Use active plan path
3. If no plan found → Ask user to specify path or run `/ck:plan` first

## Workflow

### Step 1: Read Plan Files
Read the plan directory:
- `plan.md` — Overview, phases, dependencies
- `phase-*.md` — All phase files (full content)

### Step 2: Scale Reviewer Count

| Phase Count | Reviewers | Lenses Selected |
|-------------|-----------|-----------------|
| 1-2 phases | 2 | Security Adversary + Assumption Destroyer |
| 3-5 phases | 3 | + Failure Mode Analyst |
| 6+ phases | 4 | + Scope & Complexity Critic (all lenses) |

### Step 3: Define Adversarial Lenses
Load: `references/red-team-personas.md`

### Step 4: Spawn Reviewers
Launch reviewers simultaneously via Task tool with `subagent_type: "code-reviewer"`.
Each reviewer prompt MUST include override, persona, plan file paths, and hostile instructions.
Load: `references/red-team-personas.md` for reviewer prompt template.

### Step 5: Collect, Deduplicate & Cap
1. Collect all findings
2. Deduplicate overlapping findings
3. Sort by severity: Critical → High → Medium
4. Cap at 15 findings

### Step 6: Adjudicate
For each finding, evaluate and propose: **Accept** or **Reject**.

### Step 7: User Review
Present via `AskUserQuestion`:
- "Looks good, apply accepted findings"
- "Let me review each one"
- "Reject all, plan is fine"

**If "Let me review each one":**
For each finding marked Accept, ask via `AskUserQuestion`:
- Options: "Yes, apply" | "No, reject" | "Modify suggestion"

**If "Modify suggestion":**
Ask via `AskUserQuestion`: "Describe your modification to this finding's suggested fix:"
(user provides free text via "Other" option)
Record the modified suggestion. Set disposition to "Accept (modified)" in the Red Team Review table.

### Step 8: Apply to Plan
For accepted findings, edit target phase files inline with marker.
Add `## Red Team Review` section to `plan.md`.

## Output
- Total findings by severity
- Accepted vs rejected count
- Files modified
- Key risks addressed

## Next Steps (MANDATORY)
Remind user to run `/ck:plan validate` then `/ck:cook --auto`.

## Important Notes
- Reviewers must be HOSTILE, not helpful
- Deduplicate aggressively
- Adjudication must be evidence-based
- Reviewers read plan files directly


### research phase

# Research & Analysis Phase

**When to skip:** If provided with researcher reports, skip this phase.

## Core Activities

### Parallel Researcher Agents
- Spawn multiple `researcher` agents in parallel to investigate different approaches
- Wait for all researcher agents to report back before proceeding
- Each researcher investigates a specific aspect or approach

### Sequential Thinking
- Use `ck:sequential-thinking` skill for dynamic and reflective problem-solving
- Structured thinking process for complex analysis
- Enables multi-step reasoning with revision capability

### Documentation Research
- Use `ck:docs-seeker` skill to read and understand documentation
- Research plugins, packages, and frameworks
- Find latest technical documentation using llms.txt standard

### GitHub Analysis
- Use `gh` command to read and analyze:
  - GitHub Actions logs
  - Pull requests
  - Issues and discussions
- Extract relevant technical context from GitHub resources

### Remote Repository Analysis
When given GitHub repository URL, generate fresh codebase summary:
```bash
# usage: 
repomix --remote <github-repo-url>
# example: 
repomix --remote https://github.com/mrgoonie/human-mcp
```

### Debugger Delegation
- Delegate to `debugger` agent for root cause analysis
- Use when investigating complex issues or bugs
- Debugger agent specializes in diagnostic tasks

## Best Practices

- Research breadth before depth
- Document findings for synthesis phase
- Identify multiple approaches for comparison
- Consider edge cases during research
- Note security implications early


### solution design

# Solution Design

## Core Principles

Follow these fundamental principles:
- **YAGNI** (You Aren't Gonna Need It) - Don't add functionality until necessary
- **KISS** (Keep It Simple, Stupid) - Prefer simple solutions over complex ones
- **DRY** (Don't Repeat Yourself) - Avoid code duplication

## Design Activities

### Technical Trade-off Analysis
- Evaluate multiple approaches for each requirement
- Compare pros and cons of different solutions
- Consider short-term vs long-term implications
- Balance complexity with maintainability
- Assess development effort vs benefit
- Recommend optimal solution based on current best practices

### Security Assessment
- Identify potential vulnerabilities during design phase
- Consider authentication and authorization requirements
- Assess data protection needs
- Evaluate input validation requirements
- Plan for secure configuration management
- Address OWASP Top 10 concerns
- Consider API security (rate limiting, CORS, etc.)

### Performance & Scalability
- Identify potential bottlenecks early
- Consider database query optimization needs
- Plan for caching strategies
- Assess resource usage (memory, CPU, network)
- Design for horizontal/vertical scaling
- Plan for load distribution
- Consider asynchronous processing where appropriate

### Edge Cases & Failure Modes
- Think through error scenarios
- Plan for network failures
- Consider partial failure handling
- Design retry and fallback mechanisms
- Plan for data consistency
- Consider race conditions
- Design for graceful degradation

### Architecture Design
- Create scalable system architectures
- Design for maintainability
- Plan component interactions
- Design data flow
- Consider microservices vs monolith trade-offs
- Plan API contracts
- Design state management

## Best Practices

- Document design decisions and rationale
- Consider both technical and business requirements
- Think through the entire user journey
- Plan for monitoring and observability
- Design with testing in mind
- Consider deployment and rollback strategies


### task management

# Task Management Integration

## Session-Scoped Reality

Claude Tasks are **ephemeral** — they die when the session ends. `~/.claude/tasks/` holds lock files only, NOT task data. Plan files (plan.md, phase-XX.md with checkboxes) are the **persistent** layer.

The **hydration pattern** bridges sessions:

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

- **Hydrate:** Read plan files → TaskCreate per unchecked `[ ]` item
- **Work:** TaskUpdate tracks in_progress/completed in real-time
- **Sync-back:** Update `[ ]` → `[x]` in phase files, update plan.md frontmatter status

## When to Create Tasks

**Default:** On — auto-hydrate after plan files are written
**Skip with:** `--no-tasks` flag in planning request
**3-Task Rule:** <3 phases → skip tasks (overhead exceeds benefit)

| Scenario | Tasks? | Why |
|----------|--------|-----|
| Multi-phase feature (3+ phases) | Yes | Track progress, enable parallel |
| Complex dependencies between phases | Yes | Automatic unblocking |
| Plan will be executed by cook | Yes | Seamless handoff |
| Single-phase quick fix | No | Just do it directly |
| Trivial 1-2 step plan | No | Overhead not worth it |

## Task Creation Patterns

### Phase-Level TaskCreate

```
TaskCreate(
  subject: "Setup environment and dependencies",
  activeForm: "Setting up environment",
  description: "Install packages, configure env, setup database. See phase-01-setup.md",
  metadata: { phase: 1, priority: "P1", effort: "2h",
              planDir: "plans/260205-auth/", phaseFile: "phase-01-setup.md" }
)
```

### Critical Step TaskCreate

For high-risk/complex steps within phases:

```
TaskCreate(
  subject: "Implement OAuth2 token refresh",
  activeForm: "Implementing token refresh",
  description: "Handle token expiry, refresh flow, error recovery",
  metadata: { phase: 3, step: "3.4", priority: "P1", effort: "1.5h",
              planDir: "plans/260205-auth/", phaseFile: "phase-03-api.md",
              critical: true, riskLevel: "high" },
  addBlockedBy: ["{phase-2-task-id}"]
)
```

## Metadata & Naming Conventions

**Required metadata:** `phase`, `priority` (P1/P2/P3), `effort`, `planDir`, `phaseFile`
**Optional metadata:** `step`, `critical`, `riskLevel`, `dependencies`

**subject** (imperative): Action verb + deliverable, <60 chars
- "Setup database migrations", "Implement OAuth2 flow", "Create user profile endpoints"

**activeForm** (present continuous): Matches subject in -ing form
- "Setting up database", "Implementing OAuth2", "Creating user profile endpoints"

**description**: 1-2 sentences, concrete deliverables, reference phase file

## Dependency Chains

```
Phase 1 (no blockers)              ← start here
Phase 2 (addBlockedBy: [P1-id])    ← auto-unblocked when P1 completes
Phase 3 (addBlockedBy: [P2-id])
Step 3.4 (addBlockedBy: [P2-id])   ← critical steps share phase dependency
```

Use `addBlockedBy` for forward references ("I need X done first").
Use `addBlocks` when creating parent first ("X blocks these children").

## Cook Handoff Protocol

### Same-Session (planning → cook immediately)

1. Planning hydrates tasks → tasks exist in session
2. Cook Step 3: `TaskList` → finds existing tasks → picks them up
3. Cook skips re-creation, begins implementation directly

### Cross-Session (new session, resume plan)

1. User runs `/ck:cook path/to/plan.md` in new session
2. Cook Step 3: `TaskList` → empty (tasks died with old session)
3. Cook reads plan files → re-hydrates from unchecked `[ ]` items
4. Already-checked `[x]` items = done, skip those

### Sync-Back (cook Step 6)

1. `TaskUpdate` marks all session tasks complete.
2. `project-manager` subagent runs full-plan sync-back:
   - Sweep all `phase-XX-*.md` files.
   - Reconcile completed tasks by metadata (`phase`, `phaseFile`).
   - Backfill stale completed checkboxes `[ ]` → `[x]` across all phases (not only current phase).
   - Update `plan.md` status/progress from actual checkbox state.
3. If any completed task cannot be mapped to a phase file, report unresolved mappings before claiming completion.
4. Git commit captures the state transition for next session.

## Quality Checks

After task hydration, verify:
- Dependency chain has no cycles
- All phases have corresponding tasks
- Required metadata fields present (phase, priority, effort, planDir, phaseFile)
- Task count matches unchecked `[ ]` items in plan files
- Output: `✓ Hydrated [N] phase tasks + [M] critical step tasks with dependency chain`


### validate question framework

# Validation Question Framework

## Question Categories

| Category | Keywords to detect |
|----------|-------------------|
| **Architecture** | "approach", "pattern", "design", "structure", "database", "API" |
| **Assumptions** | "assume", "expect", "should", "will", "must", "default" |
| **Tradeoffs** | "tradeoff", "vs", "alternative", "option", "choice", "either/or" |
| **Risks** | "risk", "might", "could fail", "dependency", "blocker", "concern" |
| **Scope** | "phase", "MVP", "future", "out of scope", "nice to have" |

## Question Format Rules

- Each question must have 2-4 concrete options
- Mark recommended option with "(Recommended)" suffix
- "Other" option is automatic
- Questions should surface implicit decisions

## Example Questions

Category: Architecture
Question: "How should the validation results be persisted?"
Options:
1. Save to plan.md frontmatter (Recommended)
2. Create validation-answers.md
3. Don't persist

Category: Assumptions
Question: "The plan assumes API rate limiting is not needed. Is this correct?"
Options:
1. Yes, not needed for MVP
2. No, add basic rate limiting now (Recommended)
3. Defer to Phase 2

## Validation Log Format

```markdown
## Validation Log

### Session {N} — {YYYY-MM-DD}
**Trigger:** {what prompted this validation}
**Questions asked:** {count}

#### Questions & Answers

1. **[{Category}]** {full question text}
   - Options: {A} | {B} | {C}
   - **Answer:** {user's choice}
   - **Custom input:** {verbatim "Other" text if applicable}
   - **Rationale:** {why this decision matters}

#### Confirmed Decisions
- {decision}: {choice} — {brief why}

#### Action Items
- [ ] {specific change needed}

#### Impact on Phases
- Phase {N}: {what needs updating and why}
```

## Recording Rules

- **Full question text**: exact question, not summary
- **All options**: every option presented
- **Verbatim custom input**: record "Other" text exactly
- **Rationale**: explain why decision affects implementation
- **Session numbering**: increment from last session
- **Trigger**: state what prompted validation

## Section Mapping for Phase Propagation

| Change Type | Target Section |
|-------------|----------------|
| Requirements | Requirements |
| Architecture | Architecture |
| Scope | Overview / Implementation Steps |
| Risk | Risk Assessment |
| Unknown | Key Insights (new subsection) |


### validate workflow

# Validate Workflow

Interview the user with critical questions to validate assumptions, confirm decisions, and surface potential issues in an implementation plan before coding begins.

## Plan Resolution

1. If `$ARGUMENTS` provided → Use that path
2. Else check `## Plan Context` section → Use active plan path
3. If no plan found → Ask user to specify path or run `/ck:plan --hard` first

## Configuration

Check `## Plan Context` section for validation settings:
- `mode` - Controls auto/prompt/off behavior
- `questions` - Range like `3-8` (min-max)

## Workflow

### Step 1: Read Plan Files
- `plan.md` - Overview and phases list
- `phase-*.md` - All phase files
- Look for decision points, assumptions, risks, tradeoffs

### Step 2: Extract Question Topics
Load: `references/validate-question-framework.md`

### Step 3: Generate Questions
For each detected topic, formulate a concrete question with 2-4 options.
Mark recommended option with "(Recommended)" suffix.

### Step 4: Interview User
Use `AskUserQuestion` tool.
- Use question count from `## Plan Context` validation settings
- Group related questions (max 4 per tool call)
- Focus on: assumptions, risks, tradeoffs, architecture

### Step 5: Document Answers
Add or append `## Validation Log` section in `plan.md`.
Load: `references/validate-question-framework.md` for recording format.

### Step 6: Propagate Changes to Phases
Auto-propagate validation decisions to affected phase files.
Add marker: `<!-- Updated: Validation Session N - {change} -->`

## Output
- Number of questions asked
- Key decisions confirmed
- Phase propagation results
- Recommendation: proceed or revise

## Next Steps (MANDATORY)
Remind user with absolute path:
> **Best Practice:** Run `/clear` before implementing to start with fresh context.
> Then run:
> ```
> /ck:cook --auto {ABSOLUTE_PATH_TO_PLAN_DIR}/plan.md
> ```
> **Why `--auto`?** Plan was already validated — safe to skip review gates.
> **Why absolute path?** After `/clear`, the new session loses context.
> Fresh context helps Claude focus solely on implementation without planning context pollution.

## Important Notes
- Only ask about genuine decision points
- If plan is simple, fewer than min questions is okay
- Prioritize questions that could change implementation significantly


### workflow modes

# Workflow Modes

## Auto-Detection (Default: `--auto`)

When no flag specified, analyze task and pick mode:

| Signal | Mode | Rationale |
|--------|------|-----------|
| Simple task, clear scope, no unknowns | fast | Skip research overhead |
| Complex task, unfamiliar domain, new tech | hard | Research needed |
| 3+ independent features/layers/modules | parallel | Enable concurrent agents |
| Ambiguous approach, multiple valid paths | two | Compare alternatives |

Use `AskUserQuestion` if detection is uncertain.

## Fast Mode (`--fast`)

No research. Analyze → Plan → Hydrate Tasks.

1. Read codebase docs (`codebase-summary.md`, `code-standards.md`, `system-architecture.md`)
2. Use `planner` subagent to create plan
3. Hydrate tasks (unless `--no-tasks`)
4. **Context reminder:** `/ck:cook --auto {absolute-plan-path}/plan.md`

**Why `--auto` cook flag?** Fast planning pairs with fast execution — skip review gates.

## Hard Mode (`--hard`)

Research → Scout → Plan → Red Team → Validate → Hydrate Tasks.

1. Spawn max 2 `researcher` agents in parallel (different aspects, max 5 calls each)
2. Read codebase docs; if stale/missing: run `/ck:scout` to search codebase
3. Gather research + scout report filepaths → pass to `planner` subagent
4. Post-plan red team review (see Red Team Review section below)
5. Post-plan validation (see Validation section below)
6. Hydrate tasks (unless `--no-tasks`)
7. **Context reminder:** `/ck:cook {absolute-plan-path}/plan.md`

**Why no cook flag?** Thorough planning needs interactive review gates.

## Parallel Mode (`--parallel`)

Research → Scout → Plan with file ownership → Red Team → Validate → Hydrate Tasks with dependency graph.

1. Same as Hard mode steps 1-3
2. Planner creates phases with:
   - **Exclusive file ownership** per phase (no overlap)
   - **Dependency matrix** (which phases run concurrently vs sequentially)
   - **Conflict prevention** strategy
3. plan.md includes: dependency graph, execution strategy, file ownership matrix
4. Hydrate tasks: `addBlockedBy` for sequential deps, no blockers for parallel groups
5. Post-plan red team review
6. Post-plan validation
7. **Context reminder:** `/ck:cook --parallel {absolute-plan-path}/plan.md`

### Parallel Phase Requirements
- Each phase self-contained, no runtime deps on other phases
- Clear file boundaries — each file modified in ONE phase only
- Group by: architectural layer, feature domain, or technology stack
- Example: Phases 1-3 parallel (DB/API/UI), Phase 4 sequential (integration tests)

## Two-Approach Mode (`--two`)

Research → Scout → Plan 2 approaches → Compare → Hydrate Tasks.

1. Same as Hard mode steps 1-3
2. Planner creates 2 implementation approaches with:
   - Clear trade-offs (pros/cons each)
   - Recommended approach with rationale
3. User selects approach
4. Post-plan red team review on selected approach
5. Post-plan validation
6. Hydrate tasks for selected approach (unless `--no-tasks`)
7. **Context reminder:** `/ck:cook {absolute-plan-path}/plan.md`

## Task Hydration Per Mode

| Mode | Task Granularity | Dependency Pattern |
|------|------------------|--------------------|
| fast | Phase-level only | Sequential chain |
| hard | Phase + critical steps | Sequential + step deps |
| parallel | Phase + steps + ownership | Parallel groups + sequential deps |
| two | After user selects approach | Sequential chain |

All modes: See `task-management.md` for TaskCreate patterns and metadata.

## Post-Plan Red Team Review

Adversarial review that spawns hostile reviewers to find flaws before validation.

**Available in:** hard, parallel, two modes. **Skipped in:** fast mode.

**Invocation:** Use the `Skill` tool to invoke `plan:red-team` with the plan directory path as argument:
```
Skill(skill: "ck:plan:red-team", args: "{plan-directory-path}")
```

**Sequence:** Red team runs BEFORE validation because:
1. Red team may change the plan (added risks, removed sections, new constraints)
2. Validation should confirm the FINAL plan, not a pre-review draft
3. Validating first then red-teaming would invalidate validation answers

## Post-Plan Validation

Check `## Plan Context` → `Validation: mode=X, questions=MIN-MAX`:

| Mode | Behavior |
|------|----------|
| `prompt` | Ask: "Validate this plan with interview?" → Yes (Recommended) / No |
| `auto` | Use the `Skill` tool: `Skill(skill: "ck:plan:validate", args: "{plan-directory-path}")` |
| `off` | Skip validation |

**Invocation (when prompt mode, user says yes):** Use the `Skill` tool to invoke `plan:validate`:
```
Skill(skill: "ck:plan:validate", args: "{plan-directory-path}")
```

**Available in:** hard, parallel, two modes. **Skipped in:** fast mode.

## Context Reminder (MANDATORY)

After plan creation, MUST output with **actual absolute path**:

| Mode | Cook Command |
|------|-----------------------------|
| fast | `/ck:cook --auto {path}/plan.md` |
| hard | `/ck:cook {path}/plan.md` |
| parallel | `/ck:cook --parallel {path}/plan.md` |
| two | `/ck:cook {path}/plan.md` |

> **Best Practice:** Run `/clear` before implementing to start fresh context.
> Then run the cook command above.

**Why absolute path?** After `/clear`, new session loses context.
This reminder is **NON-NEGOTIABLE** — always output after presenting the plan.

## Pre-Creation Check

Check `## Plan Context` in injected context:
- **"Plan: {path}"** → Ask "Continue with existing plan? [Y/n]"
- **"Suggested: {path}"** → Branch hint only, ask if activate or create new
- **"Plan: none"** → Create new using `Plan dir:` from `## Naming`

After creating: `node .claude/scripts/set-active-plan.cjs {plan-dir}`
Pass plan directory path to every subagent during the process.




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
