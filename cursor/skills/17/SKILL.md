---
name: ck:debug
description: "Debug systematically with root cause analysis before fixes. Use for bugs, test failures, unexpected behavior, performance issues, call stack tracing, multi-layer validation, log analysis, CI/CD failures, database diagnostics, system investigation."
version: 4.0.0
languages: all
argument-hint: "[error or issue description]"
---

# Debugging & System Investigation

Comprehensive framework combining systematic debugging, root cause tracing, defense-in-depth validation, verification protocols, and system-level investigation (logs, CI/CD, databases, performance).

## Core Principle

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST**

Random fixes waste time and create new bugs. Find root cause, fix at source, validate at every layer, verify before claiming success.

## When to Use

**Code-level:** Test failures, bugs, unexpected behavior, build failures, integration problems
**System-level:** Server errors, CI/CD pipeline failures, performance degradation, database issues, log analysis
**Always:** Before claiming work complete

## Techniques

### 1. Systematic Debugging (`references/systematic-debugging.md`)

Four-phase framework: Root Cause Investigation → Pattern Analysis → Hypothesis Testing → Implementation. Complete each phase before proceeding. No fixes without Phase 1.

**Load when:** Any bug/issue requiring investigation and fix

### 2. Root Cause Tracing (`references/root-cause-tracing.md`)

Trace bugs backward through call stack to find original trigger. Fix at source, not symptom. Includes `scripts/find-polluter.sh` for bisecting test pollution.

**Load when:** Error deep in call stack, unclear where invalid data originated

### 3. Defense-in-Depth (`references/defense-in-depth.md`)

Validate at every layer: Entry validation → Business logic → Environment guards → Debug instrumentation

**Load when:** After finding root cause, need comprehensive validation

### 4. Verification (`references/verification.md`)

**Iron law:** NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE. Run command. Read output. Then claim result.

**Load when:** About to claim work complete, fixed, or passing

### 5. Investigation Methodology (`references/investigation-methodology.md`)

Five-step structured investigation for system-level issues: Initial Assessment → Data Collection → Analysis → Root Cause ID → Solution Development

**Load when:** Server incidents, system behavior analysis, multi-component failures

### 6. Log & CI/CD Analysis (`references/log-and-ci-analysis.md`)

Collect and analyze logs from servers, CI/CD pipelines (GitHub Actions), application layers. Tools: `gh` CLI, structured log queries, correlation across sources.

**Load when:** CI/CD pipeline failures, server errors, deployment issues

### 7. Performance Diagnostics (`references/performance-diagnostics.md`)

Identify bottlenecks, analyze query performance, develop optimization strategies. Covers database queries, API response times, resource utilization.

**Load when:** Performance degradation, slow queries, high latency, resource exhaustion

### 8. Reporting Standards (`references/reporting-standards.md`)

Structured diagnostic reports: Executive Summary → Technical Analysis → Recommendations → Evidence

**Load when:** Need to produce investigation report or diagnostic summary

### 9. Task Management (`references/task-management-debugging.md`)

Track investigation pipelines via Claude Native Tasks (TaskCreate, TaskUpdate, TaskList). Hydration pattern for multi-step investigations with dependency chains and parallel evidence collection.

**Load when:** Multi-component investigation (3+ steps), parallel log collection, coordinating debugger subagents

### 10. Frontend Verification (`references/frontend-verification.md`)

Visual verification of frontend implementations via Chrome MCP (Claude Chrome Extension) or `ck:chrome-devtools` skill fallback. Detect if frontend-related → check Chrome MCP availability → screenshot + console error check → report. Skip if not frontend.

**Load when:** Implementation touches frontend files (tsx/jsx/vue/svelte/html/css), UI bugs, visual regressions

## Quick Reference

```
Code bug       → systematic-debugging.md (Phase 1-4)
  Deep in stack  → root-cause-tracing.md (trace backward)
  Found cause    → defense-in-depth.md (add layers)
  Claiming done  → verification.md (verify first)

System issue   → investigation-methodology.md (5 steps)
  CI/CD failure  → log-and-ci-analysis.md
  Slow system    → performance-diagnostics.md
  Need report    → reporting-standards.md

Frontend fix   → frontend-verification.md (Chrome/devtools)
```

## Tools Integration

- **Database:** `psql` for PostgreSQL queries and diagnostics
- **CI/CD:** `gh` CLI for GitHub Actions logs and pipeline debugging
- **Codebase:** `ck:docs-seeker` skill for package/plugin docs; `repomix` for codebase summary
- **Scouting:** `/ck:scout` or `/ck:scout ext` for finding relevant files
- **Frontend:** Chrome browser or `ck:chrome-devtools` skill for visual verification (screenshots, console, network)
- **Skills:** Activate `ck:problem-solving` skill when stuck on complex issues

## Red Flags

Stop and follow process if thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "It's probably X, let me fix that"
- "Should work now" / "Seems fixed"
- "Tests pass, we're done"

**All mean:** Return to systematic process.


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### defense in depth

# Defense-in-Depth Validation

Validate at every layer data passes through to make bugs impossible.

## Core Principle

**Validate at EVERY layer data passes through. Make bug structurally impossible.**

When fix bug caused by invalid data, adding validation at one place feels sufficient. But single check can be bypassed by different code paths, refactoring, or mocks.

## Why Multiple Layers

Single validation: "We fixed bug"
Multiple layers: "We made bug impossible"

Different layers catch different cases:
- Entry validation catches most bugs
- Business logic catches edge cases
- Environment guards prevent context-specific dangers
- Debug logging helps when other layers fail

## The Four Layers

### Layer 1: Entry Point Validation
**Purpose:** Reject obviously invalid input at API boundary

```typescript
function createProject(name: string, workingDirectory: string) {
  if (!workingDirectory || workingDirectory.trim() === '') {
    throw new Error('workingDirectory cannot be empty');
  }
  if (!existsSync(workingDirectory)) {
    throw new Error(`workingDirectory does not exist: ${workingDirectory}`);
  }
  if (!statSync(workingDirectory).isDirectory()) {
    throw new Error(`workingDirectory is not a directory: ${workingDirectory}`);
  }
  // proceed
}
```

### Layer 2: Business Logic Validation
**Purpose:** Ensure data makes sense for this operation

```typescript
function initializeWorkspace(projectDir: string, sessionId: string) {
  if (!projectDir) {
    throw new Error('projectDir required for workspace initialization');
  }
  // proceed
}
```

### Layer 3: Environment Guards
**Purpose:** Prevent dangerous operations in specific contexts

```typescript
async function gitInit(directory: string) {
  // In tests, refuse git init outside temp directories
  if (process.env.NODE_ENV === 'test') {
    const normalized = normalize(resolve(directory));
    const tmpDir = normalize(resolve(tmpdir()));

    if (!normalized.startsWith(tmpDir)) {
      throw new Error(
        `Refusing git init outside temp dir during tests: ${directory}`
      );
    }
  }
  // proceed
}
```

### Layer 4: Debug Instrumentation
**Purpose:** Capture context for forensics

```typescript
async function gitInit(directory: string) {
  const stack = new Error().stack;
  logger.debug('About to git init', {
    directory,
    cwd: process.cwd(),
    stack,
  });
  // proceed
}
```

## Applying the Pattern

When find bug:

1. **Trace data flow** - Where does bad value originate? Where used?
2. **Map all checkpoints** - List every point data passes through
3. **Add validation at each layer** - Entry, business, environment, debug
4. **Test each layer** - Try to bypass layer 1, verify layer 2 catches it

## Example from Real Session

Bug: Empty `projectDir` caused `git init` in source code

**Data flow:**
1. Test setup → empty string
2. `Project.create(name, '')`
3. `WorkspaceManager.createWorkspace('')`
4. `git init` runs in `process.cwd()`

**Four layers added:**
- Layer 1: `Project.create()` validates not empty/exists/writable
- Layer 2: `WorkspaceManager` validates projectDir not empty
- Layer 3: `WorktreeManager` refuses git init outside tmpdir in tests
- Layer 4: Stack trace logging before git init

**Result:** All 1847 tests passed, bug impossible to reproduce

## Key Insight

All four layers were necessary. During testing, each layer caught bugs others missed:
- Different code paths bypassed entry validation
- Mocks bypassed business logic checks
- Edge cases on different platforms needed environment guards
- Debug logging identified structural misuse

**Don't stop at one validation point.** Add checks at every layer.


### frontend verification

# Frontend Verification

Visual verification of frontend implementations using Chrome MCP (Claude Chrome Extension) or `ck:chrome-devtools` skill fallback.

## Applicability Check

**Skip entirely if task is NOT frontend-related.** Frontend indicators:
- Files modified: `*.tsx`, `*.jsx`, `*.vue`, `*.svelte`, `*.html`, `*.css`, `*.scss`
- Changes to: components, layouts, pages, styles, DOM structure, UI behavior
- Keywords: render, display, layout, responsive, animation, visual, UI, UX

If none match, skip this technique.

## Step 1: Detect Chrome MCP Availability

Check if Chrome MCP server is available via `ck:mcp-management` skill or `ListMcpResourcesTool`:

```
Use ListMcpResourcesTool to check for Chrome MCP tools.
Look for tools prefixed with "chrome__" (e.g., chrome__navigate, chrome__screenshot).
```

**Available** → Proceed to Step 2A (Chrome MCP)
**Not available** → Proceed to Step 2B (chrome-devtools fallback)

## Step 2A: Chrome MCP Available — Direct Verification

Use Chrome MCP tools to verify the implementation in the user's actual browser. Ensure dev server is running first.

### Navigate & Screenshot

```
1. chrome__navigate → http://localhost:3000 (or project dev URL)
2. chrome__screenshot → capture current page state
3. Read the screenshot with Read tool to visually inspect
```

### Visual Inspection Checklist

After capturing screenshot, verify:
1. **Layout** — Elements positioned correctly, no overflow/overlap
2. **Content** — Text, images, data rendered as expected
3. **Responsiveness** — Resize viewport if MCP supports it
4. **Interactions** — Use chrome__click / chrome__type to test interactive elements
5. **Console errors** — Use chrome__evaluate to check `console.error` output

### Console Error Check

```
chrome__evaluate → "JSON.stringify(window.__consoleErrors || [])"
```

Or navigate and observe any error output from Chrome MCP tool responses.

### Get Page Content

```
chrome__get_content → extract DOM/text to verify rendered output matches expectations
```

## Step 2B: Chrome MCP NOT Available — Fallback to chrome-devtools Skill

When Chrome MCP is not configured, use `ck:chrome-devtools` skill (Puppeteer with bundled Chromium):

```bash
SKILL_DIR="$HOME/.claude/skills/chrome-devtools/scripts"

# Install deps if first time
npm install --prefix "$SKILL_DIR" 2>/dev/null

# Screenshot + console error check
node "$SKILL_DIR/screenshot.js" --url http://localhost:3000 --output ./verification-screenshot.png
node "$SKILL_DIR/console.js" --url http://localhost:3000 --types error,pageerror --duration 5000
```

If `ck:chrome-devtools` skill is also unavailable, skip visual verification and note in report:
> "Visual verification skipped — no Chrome MCP or chrome-devtools available."

## Step 3: Analyze Results

After capture:
1. **Read screenshot** — Use Read tool on the PNG to visually inspect
2. **Check console output** — Zero errors = pass; errors = investigate before claiming done
3. **Compare with expected** — Match against design specs or user description
4. **Document findings** — Include screenshot path and any issues found in verification report

## Integration with Verification Protocol

This technique extends `verification.md`. After standard verification (tests pass, build succeeds), add frontend verification as final gate:

```
Standard verification → Tests pass → Build succeeds → Frontend visual verification → Claim complete
```

Report format:
```
## Frontend Verification
- Method: [Chrome MCP | chrome-devtools | skipped]
- Screenshot: ./verification-screenshot.png
- Console errors: [none | list]
- Visual check: [pass | issues found]
- Responsive: [checked at X viewports | skipped]
```


### investigation methodology

# Investigation Methodology

Five-step structured investigation for system-level issues, incidents, and multi-component failures.

## When to Use

- Server returning 500 errors or unexpected responses
- System behavior changed without obvious code changes
- Multi-component failures spanning services/databases/infrastructure
- Need to understand "what happened" before fixing

## Step 1: Initial Assessment

**Gather scope and impact before diving in.**

1. **Collect symptoms** - Error messages, affected endpoints, user reports
2. **Identify affected components** - Which services, databases, queues involved?
3. **Determine timeframe** - When did issue start? Correlate with deployments/changes
4. **Assess severity** - Users affected? Data at risk? Revenue impact?
5. **Check recent changes** - Git log, deployment history, config changes, dependency updates

```bash
# Recent deployments
gh run list --limit 10
# Recent commits
git log --oneline -20 --since="2 days ago"
# Config changes
git diff HEAD~5 -- '*.env*' '*.config*' '*.yml' '*.yaml' '*.json'
```

## Step 2: Data Collection

**Gather evidence systematically before analysis.**

1. **Server/application logs** - Filter by timeframe and affected components
2. **CI/CD pipeline logs** - Use `gh run view <run-id> --log-failed` for GitHub Actions
3. **Database state** - Query relevant tables, check recent migrations
4. **System metrics** - CPU, memory, disk, network utilization
5. **External dependencies** - Third-party API status, DNS, CDN

```bash
# GitHub Actions: list recent workflow runs
gh run list --workflow=<workflow> --limit 5
# View failed run logs
gh run view <run-id> --log-failed
# Download full logs
gh run view <run-id> --log > /tmp/ci-logs.txt
```

**For codebase understanding:**
- Read `docs/codebase-summary.md` if exists and up-to-date (<2 days old)
- Otherwise use `ck:repomix` to generate fresh codebase summary
- Use `/ck:scout` or `/ck:scout ext` to find relevant files
- Use `ck:docs-seeker` skill for package/plugin documentation

## Step 3: Analysis Process

**Correlate evidence across sources.**

1. **Timeline reconstruction** - Order events chronologically across all log sources
2. **Pattern identification** - Recurring errors, timing patterns, affected user segments
3. **Execution path tracing** - Follow request flow through system components
4. **Database analysis** - Query performance, table relationships, data integrity
5. **Dependency mapping** - Which components depend on the failing one?

**Key questions:**
- Does issue correlate with specific deployments or time windows?
- Is it intermittent or consistent?
- Does it affect all users or a subset?
- Are there related errors in upstream/downstream services?

## Step 4: Root Cause Identification

**Systematic elimination with evidence.**

1. **List hypotheses** ranked by evidence strength
2. **Test each** - Design smallest experiment to confirm/eliminate
3. **Validate with evidence** - Logs, metrics, reproduction steps
4. **Consider environmental factors** - Race conditions, resource limits, config drift
5. **Document the chain** - Full event sequence from trigger to symptom

**Avoid:** Fixing first hypothesis without testing alternatives. Multiple plausible causes require elimination.

## Step 5: Solution Development

**Design targeted, evidence-backed fixes.**

1. **Immediate fix** - Minimum change to restore service (hotfix, rollback, config change)
2. **Root cause fix** - Address underlying issue permanently
3. **Preventive measures** - Monitoring, alerting, validation to catch recurrence early
4. **Verification plan** - How to confirm fix works in production

**Prioritize:** Impact × urgency. Restore service first, then fix root cause, then prevent recurrence.

## Integration with Code-Level Debugging

When investigation narrows to specific code:
- Switch to `systematic-debugging.md` for the code-level fix
- Use `root-cause-tracing.md` if error is deep in call stack
- Apply `defense-in-depth.md` after fixing
- Always finish with `verification.md`


### log and ci analysis

# Log & CI/CD Analysis

Collect and analyze logs from servers, CI/CD pipelines, and application layers to diagnose failures.

## GitHub Actions Analysis

### List and Inspect Runs

```bash
# List recent runs (all workflows)
gh run list --limit 10

# List runs for specific workflow
gh run list --workflow=ci.yml --limit 5

# View specific run details
gh run view <run-id>

# View failed job logs only
gh run view <run-id> --log-failed

# Download complete logs
gh run view <run-id> --log > /tmp/ci-full.txt

# Re-run failed jobs
gh run rerun <run-id> --failed
```

### Common CI/CD Failure Patterns

| Pattern | Likely Cause | Investigation |
|---------|-------------|---------------|
| Passes locally, fails CI | Environment diff | Check Node/Python version, OS, env vars |
| Intermittent failures | Race conditions, flaky tests | Run 3x, check timing, shared state |
| Timeout failures | Resource limits, infinite loops | Check resource usage, add timeouts |
| Permission errors | Token/secret misconfiguration | Verify `GITHUB_TOKEN`, secret names |
| Dependency install fails | Registry issues, version conflicts | Check lockfile, registry status |
| Build succeeds, tests fail | Test environment setup | Check test config, database setup, fixtures |

### Analyzing Failed Steps

1. **Identify which step failed** - `gh run view <id>` shows step-by-step status
2. **Get the logs** - `gh run view <id> --log-failed` for focused output
3. **Search for error patterns** - Look for `Error:`, `FAIL`, `exit code`, stack traces
4. **Check annotations** - `gh api repos/{owner}/{repo}/check-runs/{id}/annotations`

## Server Log Analysis

### Log Collection Strategy

1. **Identify log locations** - Application logs, system logs, web server logs
2. **Filter by timeframe** - Narrow to incident window
3. **Correlate request IDs** - Trace single request across services
4. **Look for patterns** - Repeated errors, error rate changes, unusual payloads

### Structured Log Queries

```bash
# Search application logs for errors (use Grep tool when possible)
# Pattern: timestamp, level, message
# Filter by time range and severity

# PostgreSQL slow query log
psql -c "SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"

# Check database connections
psql -c "SELECT count(*), state FROM pg_stat_activity GROUP BY state;"
```

### Cross-Source Correlation

1. **Align timestamps** across all log sources (timezone awareness)
2. **Build timeline** - First error → propagation → user impact
3. **Identify trigger** - What changed immediately before first error?
4. **Map blast radius** - Which services/endpoints affected?

## Application Log Analysis

### Error Pattern Recognition

- **Sudden spike** → Deployment, config change, external dependency failure
- **Gradual increase** → Resource leak, data growth, degradation
- **Periodic failures** → Cron jobs, scheduled tasks, resource contention
- **Single endpoint** → Code bug, data issue, specific dependency
- **All endpoints** → Infrastructure, database, network issue

### Key Log Fields

Prioritize: timestamp, level, error message, stack trace, request ID, user ID, endpoint, response code, duration

### Evidence Preservation

Always capture relevant log excerpts for the diagnostic report. Include:
- Exact error messages and stack traces
- Timestamps and request IDs
- Before/after comparison (normal vs error state)
- Counts and frequencies


### performance diagnostics

# Performance Diagnostics

Identify bottlenecks, analyze query performance, and develop optimization strategies.

## When to Use

- Response times increased significantly
- Application feels slow or unresponsive
- Database queries taking too long
- High CPU/memory/disk usage
- Resource exhaustion or OOM errors

## Diagnostic Process

### 1. Quantify the Problem

**Measure before optimizing.** Establish baseline and current state.

- What is the expected response time vs actual?
- When did degradation start? (correlate with changes)
- Which endpoints/operations are affected?
- Is it consistent or intermittent?

### 2. Identify the Bottleneck Layer

```
Request → Network → Web Server → Application → Database → Filesystem
                                      ↓
                              External APIs / Services
```

**Elimination approach:** Measure time at each layer to find where delay occurs.

| Layer | Check | Tool |
|-------|-------|------|
| Network | Latency, DNS, TLS | `curl -w` timing, network logs |
| Web server | Request queue, connections | Server metrics, access logs |
| Application | CPU profiling, memory | Profiler, APM, `process.memoryUsage()` |
| Database | Query time, connections | `EXPLAIN ANALYZE`, `pg_stat_statements` |
| Filesystem | I/O wait, disk usage | `iostat`, `df -h` |
| External APIs | Response time, timeouts | Request logging with durations |

### 3. Database Performance

#### PostgreSQL Diagnostics

```sql
-- Slow queries (requires pg_stat_statements extension)
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 20;

-- Active queries right now
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

-- Table sizes and bloat
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC LIMIT 20;

-- Missing indexes (sequential scans on large tables)
SELECT relname, seq_scan, seq_tup_read, idx_scan
FROM pg_stat_user_tables
WHERE seq_scan > 100 AND seq_tup_read > 10000
ORDER BY seq_tup_read DESC;

-- Connection pool status
SELECT count(*), state FROM pg_stat_activity GROUP BY state;
```

#### Query Optimization

```sql
-- Analyze specific query execution plan
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) <your-query>;
```

**Look for:** Sequential scans on large tables, nested loops with high row counts, sorts without indexes, excessive buffer hits.

### 4. Application Performance

**Common bottlenecks:**

| Issue | Symptom | Fix |
|-------|---------|-----|
| N+1 queries | Many small DB calls per request | Eager loading, batch queries |
| Memory leaks | Growing memory over time | Profile heap, check event listeners |
| Blocking I/O | High response time, low CPU | Async operations, connection pooling |
| CPU-bound | High CPU, proportional to load | Optimize algorithms, caching |
| Connection exhaustion | Intermittent timeouts | Pool sizing, connection reuse |
| Large payloads | Slow transfers, high memory | Pagination, compression, streaming |

### 5. Optimization Strategy

**Priority order:**
1. **Quick wins** - Add missing index, fix N+1 query, enable caching
2. **Configuration** - Pool sizes, timeouts, buffer sizes, worker counts
3. **Code changes** - Algorithm optimization, data structure changes
4. **Architecture** - Caching layer, read replicas, async processing, CDN

**Always:** Measure after each change to verify improvement. One change at a time.

## Reporting Performance Issues

Include in diagnostic report:
- **Baseline vs current** metrics (with numbers)
- **Bottleneck identification** with evidence
- **Root cause** explanation
- **Recommended fixes** with expected impact
- **Verification plan** to confirm improvement


### reporting standards

# Reporting Standards

Structured format for diagnostic and investigation reports. Sacrifice grammar for concision.

## When to Use

- After completing system investigation
- Summarizing debugging session findings
- Producing incident post-mortems
- Reporting performance analysis results

## Report Structure

### 1. Executive Summary (3-5 lines)

- **Issue:** One-line description
- **Impact:** Users/systems affected, severity
- **Root cause:** One-line explanation
- **Status:** Resolved / Mitigated / Under investigation
- **Fix:** What was done or recommended

### 2. Technical Analysis

**Timeline:**
```
HH:MM - Event description
HH:MM - Next event
...
```

**Evidence:**
- Relevant log excerpts (trimmed to essential lines)
- Query results with key metrics
- Error messages and stack traces
- Before/after comparisons

**Findings:**
- List each finding with supporting evidence
- Distinguish confirmed facts from hypotheses
- Note correlation vs causation

### 3. Actionable Recommendations

**Immediate (P0):**
- [ ] Critical fix with implementation steps

**Short-term (P1):**
- [ ] Follow-up improvements

**Long-term (P2):**
- [ ] Monitoring/alerting enhancements
- [ ] Architecture improvements
- [ ] Preventive measures

Each recommendation: what to do, why, expected impact, effort estimate (low/medium/high).

### 4. Supporting Evidence

- Relevant log excerpts
- Query results and execution plans
- Performance metrics
- Test results and error traces
- Screenshots or diagrams if applicable

### 5. Unresolved Questions

List anything that remains unclear:
- Items needing further investigation
- Questions for the team
- Assumptions that need validation

## Report File Naming

Use naming pattern from `## Naming` section injected by hooks. Pattern includes full path and computed date.

**Example:** `plans/reports/debugger-260205-2215-api-500-investigation.md`

## Writing Guidelines

- **Concise:** Facts and evidence, not narrative. Sacrifice grammar for brevity
- **Evidence-backed:** Every claim supported by logs, metrics, or reproduction steps
- **Actionable:** Recommendations are specific with clear next steps
- **Honest:** State unknowns explicitly. "Likely cause" vs "confirmed cause"
- **Structured:** Use headers, tables, and bullet points for scanability

## Template

```markdown
# [Issue Title] - Investigation Report

## Executive Summary
- **Issue:**
- **Impact:**
- **Root cause:**
- **Status:**
- **Fix:**

## Timeline
- HH:MM -
- HH:MM -

## Technical Analysis
### Findings
1.
2.

### Evidence
[logs, queries, metrics]

## Recommendations
### Immediate (P0)
- [ ]

### Short-term (P1)
- [ ]

### Long-term (P2)
- [ ]

## Unresolved Questions
-
```


### root cause tracing

# Root Cause Tracing

Systematically trace bugs backward through call stack to find original trigger.

## Core Principle

**Trace backward through call chain until finding original trigger, then fix at source.**

Bugs often manifest deep in call stack (git init in wrong directory, file created in wrong location). Instinct is to fix where error appears, but that's treating symptom.

## When to Use

**Use when:**
- Error happens deep in execution (not at entry point)
- Stack trace shows long call chain
- Unclear where invalid data originated
- Need to find which test/code triggers problem

## The Tracing Process

### 1. Observe the Symptom
```
Error: git init failed in /Users/jesse/project/packages/core
```

### 2. Find Immediate Cause
What code directly causes this?
```typescript
await execFileAsync('git', ['init'], { cwd: projectDir });
```

### 3. Ask: What Called This?
```typescript
WorktreeManager.createSessionWorktree(projectDir, sessionId)
  → called by Session.initializeWorkspace()
  → called by Session.create()
  → called by test at Project.create()
```

### 4. Keep Tracing Up
What value was passed?
- `projectDir = ''` (empty string!)
- Empty string as `cwd` resolves to `process.cwd()`
- That's the source code directory!

### 5. Find Original Trigger
Where did empty string come from?
```typescript
const context = setupCoreTest(); // Returns { tempDir: '' }
Project.create('name', context.tempDir); // Accessed before beforeEach!
```

## Adding Stack Traces

When can't trace manually, add instrumentation:

```typescript
async function gitInit(directory: string) {
  const stack = new Error().stack;
  console.error('DEBUG git init:', {
    directory,
    cwd: process.cwd(),
    stack,
  });

  await execFileAsync('git', ['init'], { cwd: directory });
}
```

**Critical:** Use `console.error()` in tests (not logger - may not show)

**Run and capture:**
```bash
npm test 2>&1 | grep 'DEBUG git init'
```

**Analyze stack traces:**
- Look for test file names
- Find line number triggering call
- Identify pattern (same test? same parameter?)

## Finding Which Test Causes Pollution

If something appears during tests but don't know which test:

Use bisection script: `scripts/find-polluter.sh`

```bash
./scripts/find-polluter.sh '.git' 'src/**/*.test.ts'
```

Runs tests one-by-one, stops at first polluter.

## Key Principle

**NEVER fix just where error appears.** Trace back to find original trigger.

When found immediate cause:
- Can trace one level up? → Trace backwards
- Is this the source? → Fix at source
- Then add validation at each layer (see defense-in-depth.md)

## Real Example

**Symptom:** `.git` created in `packages/core/` (source code)

**Trace chain:**
1. `git init` runs in `process.cwd()` ← empty cwd parameter
2. WorktreeManager called with empty projectDir
3. Session.create() passed empty string
4. Test accessed `context.tempDir` before beforeEach
5. setupCoreTest() returns `{ tempDir: '' }` initially

**Root cause:** Top-level variable initialization accessing empty value

**Fix:** Made tempDir a getter that throws if accessed before beforeEach

**Also added defense-in-depth:**
- Layer 1: Project.create() validates directory
- Layer 2: WorkspaceManager validates not empty
- Layer 3: NODE_ENV guard refuses git init outside tmpdir
- Layer 4: Stack trace logging before git init


### systematic debugging

# Systematic Debugging

Four-phase debugging framework that ensures root cause investigation before attempting fixes.

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If haven't completed Phase 1, cannot propose fixes.

## The Four Phases

Must complete each phase before proceeding to next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read Error Messages Carefully** - Don't skip past errors/warnings, read stack traces completely
2. **Reproduce Consistently** - Can trigger reliably? Exact steps? If not reproducible → gather more data
3. **Check Recent Changes** - What changed? Git diff, recent commits, new dependencies, config changes
4. **Gather Evidence in Multi-Component Systems**
   - For EACH component boundary: log data entering/exiting, verify environment propagation
   - Run once to gather evidence showing WHERE it breaks
   - THEN analyze to identify failing component
5. **Trace Data Flow** - Where does bad value originate? Trace up call stack until finding source (see root-cause-tracing.md)

### Phase 2: Pattern Analysis

**Find pattern before fixing:**

1. **Find Working Examples** - Locate similar working code in same codebase
2. **Compare Against References** - Read reference implementation COMPLETELY, understand fully before applying
3. **Identify Differences** - List every difference however small, don't assume "that can't matter"
4. **Understand Dependencies** - What other components, settings, config, environment needed?

### Phase 3: Hypothesis and Testing

**Scientific method:**

1. **Form Single Hypothesis** - "I think X is root cause because Y", be specific not vague
2. **Test Minimally** - SMALLEST possible change to test hypothesis, one variable at a time
3. **Verify Before Continuing** - Worked? → Phase 4. Didn't work? → NEW hypothesis. DON'T add more fixes
4. **When Don't Know** - Say "I don't understand X", don't pretend, ask for help

### Phase 4: Implementation

**Fix root cause, not symptom:**

1. **Create Failing Test Case** - Simplest reproduction, automated if possible, MUST have before fixing
2. **Implement Single Fix** - Address root cause identified, ONE change, no "while I'm here" improvements
3. **Verify Fix** - Test passes? No other tests broken? Issue actually resolved?
4. **If Fix Doesn't Work**
   - STOP. Count: How many fixes tried?
   - If < 3: Return to Phase 1, re-analyze with new information
   - **If ≥ 3: STOP and question architecture**
5. **If 3+ Fixes Failed: Question Architecture**
   - Pattern: Each fix reveals new shared state/coupling problem elsewhere
   - STOP and question fundamentals: Is pattern sound? Wrong architecture?
   - Discuss with human partner before more fixes

## Red Flags - STOP and Follow Process

If catch yourself thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "Skip the test, I'll manually verify"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- "One more fix attempt" (when already tried 2+)

**ALL mean:** STOP. Return to Phase 1.

## Human Partner Signals You're Doing It Wrong

- "Is that not happening?" - Assumed without verifying
- "Will it show us...?" - Should have added evidence gathering
- "Stop guessing" - Proposing fixes without understanding
- "Ultrathink this" - Question fundamentals, not just symptoms
- "We're stuck?" (frustrated) - Approach isn't working

**When see these:** STOP. Return to Phase 1.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too |
| "Emergency, no time for process" | Systematic is FASTER than guess-and-check |
| "Just try this first, then investigate" | First fix sets pattern. Do right from start |
| "One more fix attempt" (after 2+ failures) | 3+ failures = architectural problem |

## Real-World Impact

From debugging sessions:
- Systematic approach: 15-30 minutes to fix
- Random fixes approach: 2-3 hours of thrashing
- First-time fix rate: 95% vs 40%
- New bugs introduced: Near zero vs common


### task management debugging

# Debug Task Management Patterns

Track investigation and debugging pipelines via Claude Native Tasks (TaskCreate, TaskUpdate, TaskList).

## When to Create Tasks

| Debug Scope | Tasks? | Rationale |
|-------------|--------|-----------|
| Single bug, one file | No | Systematic debugging handles directly |
| Multi-component investigation (3+ steps) | Yes | Track assess → collect → analyze → fix → verify |
| Parallel log/data collection agents | Yes | Coordinate independent evidence gathering |
| Performance investigation with multiple layers | Yes | Track bottleneck analysis per layer |
| CI/CD pipeline failure with 3+ possible causes | Yes | Track hypothesis elimination |

**3-Task Rule:** Skip task creation when investigation has <3 meaningful steps.

## Investigation Pipeline as Tasks

```
TaskCreate: "Assess incident scope"      → pending
TaskCreate: "Collect logs and evidence"  → pending, blockedBy: [assess]
TaskCreate: "Analyze root cause"         → pending, blockedBy: [collect]
TaskCreate: "Implement fix"              → pending, blockedBy: [analyze]
TaskCreate: "Verify fix resolves issue"  → pending, blockedBy: [fix]
```

Maps to investigation-methodology.md 5-step process. Auto-unblocks as each step completes.

## Task Schemas

### Assess Task

```
TaskCreate(
  subject: "Assess {incident} scope and impact",
  activeForm: "Assessing incident scope",
  description: "Gather symptoms, identify affected components, check recent changes. See investigation-methodology.md Step 1",
  metadata: { debugStage: "assess", incident: "{incident}",
              severity: "P1", effort: "5m" }
)
```

### Collect Task

```
TaskCreate(
  subject: "Collect evidence for {incident}",
  activeForm: "Collecting evidence",
  description: "Server logs, CI/CD logs, database state, metrics. See log-and-ci-analysis.md",
  metadata: { debugStage: "collect", incident: "{incident}",
              sources: "logs,ci,db", priority: "P1", effort: "10m" },
  addBlockedBy: ["{assess-task-id}"]
)
```

### Analyze Task

```
TaskCreate(
  subject: "Analyze root cause of {incident}",
  activeForm: "Analyzing root cause",
  description: "Correlate evidence, trace execution paths, identify root cause. See systematic-debugging.md Phase 1-3",
  metadata: { debugStage: "analyze", incident: "{incident}",
              technique: "systematic", priority: "P1", effort: "15m" },
  addBlockedBy: ["{collect-task-id}"]
)
```

### Fix Task

```
TaskCreate(
  subject: "Fix root cause: {root_cause_summary}",
  activeForm: "Implementing fix",
  description: "Address root cause, add defense-in-depth validation. See defense-in-depth.md",
  metadata: { debugStage: "fix", rootCause: "{root_cause}",
              priority: "P1", effort: "20m" },
  addBlockedBy: ["{analyze-task-id}"]
)
```

### Verify Task

```
TaskCreate(
  subject: "Verify fix with fresh evidence",
  activeForm: "Verifying fix",
  description: "Run tests, check build, confirm issue resolved. NO CLAIMS WITHOUT EVIDENCE. See verification.md",
  metadata: { debugStage: "verify", priority: "P1", effort: "5m" },
  addBlockedBy: ["{fix-task-id}"]
)
```

## Parallel Evidence Collection

For multi-source investigations, spawn parallel collection agents:

```
// Parallel — no blockedBy between them
TaskCreate(subject: "Collect CI/CD pipeline logs",
  metadata: { debugStage: "collect", source: "ci",
              agentIndex: 1, totalAgents: 3, priority: "P1" })

TaskCreate(subject: "Collect application server logs",
  metadata: { debugStage: "collect", source: "server",
              agentIndex: 2, totalAgents: 3, priority: "P1" })

TaskCreate(subject: "Query database for anomalies",
  metadata: { debugStage: "collect", source: "db",
              agentIndex: 3, totalAgents: 3, priority: "P1" })

// Analyze blocks on ALL collection completing:
TaskCreate(subject: "Analyze root cause from collected evidence",
  addBlockedBy: ["{ci-id}", "{server-id}", "{db-id}"])
```

## Task Lifecycle

```
Assess:   pending → in_progress → completed (scope + impact identified)
Collect:  pending → in_progress → completed (evidence gathered)
Analyze:  pending → in_progress → completed (root cause identified)
Fix:      pending → in_progress → completed (fix implemented)
Verify:   pending → in_progress → completed (fresh verification evidence)
```

### Re-Investigation Cycle

When fix doesn't resolve the issue → new analyze-fix-verify cycle:

```
TaskCreate(subject: "Re-analyze: fix attempt {N} failed",
  addBlockedBy: ["{verify-task-id}"],
  metadata: { debugStage: "analyze", cycle: 2, priority: "P1" })
```

Limit to 3 cycles. After cycle 3 → question architecture (systematic-debugging.md Phase 4.5).

## Integration with Cook/Planning

Debug tasks are **separate from** cook/planning phase tasks.

**When cook spawns debugger:**
1. Cook encounters failing tests → creates debug pipeline tasks
2. Debug pipeline executes (assess → collect → analyze → fix → verify)
3. All debug tasks complete → cook marks phase debugging as done
4. Cook proceeds to next phase

## Report Sync-Back

After investigation completes, write diagnostic report per reporting-standards.md. Report persists as the "source of truth" for cross-session reference (tasks are session-scoped only).

## Error Handling

If `TaskCreate` fails: log warning, continue with sequential debugging. Tasks add visibility and coordination, not core functionality.


### verification

# Verification Before Completion

Run verification commands and confirm output before claiming success.

## Core Principle

**Evidence before claims, always.**

Claiming work complete without verification is dishonesty, not efficiency.

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If haven't run verification command in this message, cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make claim

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
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!")
- About to commit/push/PR without verification
- Trusting agent success reports
- Relying on partial verification
- Thinking "just this once"
- Tired and wanting work over
- **ANY wording implying success without having run verification**

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter ≠ compiler |
| "Agent said success" | Verify independently |
| "Partial check is enough" | Partial proves nothing |

## Key Patterns

**Tests:**
```
✅ [Run test command] [See: 34/34 pass] "All tests pass"
❌ "Should pass now" / "Looks correct"
```

**Regression tests (TDD Red-Green):**
```
✅ Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)
❌ "I've written regression test" (without red-green verification)
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

Run command. Read output. THEN claim result.

Non-negotiable.




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
