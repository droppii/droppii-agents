---
name: ck:test
description: "Run unit, integration, e2e, and UI tests. Use for test execution, coverage analysis, build verification, visual regression, and QA reports."
argument-hint: "[context] OR ui [url]"
version: 1.0.0
---

# Testing & Quality Assurance

Comprehensive testing framework covering code-level testing (unit, integration, e2e), UI/visual testing via browser automation, coverage analysis, and structured QA reporting.

## Default (No Arguments)

If invoked with context (test scope), proceed with testing. If invoked WITHOUT arguments, use `AskUserQuestion` to present available test operations:

| Operation | Description |
|-----------|-------------|
| `(default)` | Run unit/integration/e2e tests |
| `ui` | Run UI tests on a website |

Present as options via `AskUserQuestion` with header "Test Operation", question "What would you like to do?".

## Core Principle

**NEVER IGNORE FAILING TESTS.** Fix root causes, not symptoms. No mocks/cheats/tricks to pass builds.

## When to Use

- **After implementation**: Validate new features or bug fixes
- **Coverage checks**: Ensure coverage meets project thresholds (80%+)
- **UI verification**: Visual regression, responsive layout, accessibility
- **Build validation**: Verify build process, dependencies, CI/CD compatibility
- **Pre-commit/push**: Final quality gate

## Workflows

### 1. Code Testing (`references/test-execution-workflow.md`)

Execute test suites, analyze results, generate coverage. Supports JS/TS (Jest/Vitest/Mocha), Python (pytest), Go, Rust, Flutter. Includes working process, quality standards, and tool commands.

**Load when:** Running unit/integration/e2e tests, checking coverage, validating builds

### 2. UI Testing (`references/ui-testing-workflow.md`)

Browser-based visual testing via `ck:chrome-devtools` skill. Screenshots, responsive checks, accessibility audits, form automation, console error collection. Includes auth injection for protected routes.

**Load when:** Visual regression testing, UI bugs, responsive layout checks, accessibility audits

### 3. Report Format (`references/report-format.md`)

Structured QA report template: test results overview, coverage metrics, failed tests, performance, build status, recommendations.

**Load when:** Generating test summary reports

## Quick Reference

```
Code tests     → test-execution-workflow.md
  npm test / pytest / go test / cargo test / flutter test
  Coverage: npm run test:coverage / pytest --cov

UI tests       → ui-testing-workflow.md
  Screenshots, responsive, a11y, forms, console errors
  Auth: inject-auth.js for protected routes

Reports        → report-format.md
  Structured QA summary with metrics & recommendations
```

## Working Process

1. Identify testing scope from recent changes or requirements
2. Run typecheck/analyze commands to catch syntax errors first
3. Execute appropriate test suites
4. Analyze results — focus on failures
5. Generate coverage reports if applicable
6. For frontend: run UI tests via `ck:chrome-devtools` skill
7. Produce structured summary report

## Tools Integration

- **Test runners**: Jest, Vitest, Mocha, pytest, go test, cargo test, flutter test
- **Coverage**: Istanbul/c8/nyc, pytest-cov, go cover
- **Browser**: `ck:chrome-devtools` skill for UI testing (screenshots, ARIA, console, network)
- **Analysis**: `ck:ai-multimodal` skill for screenshot analysis
- **Debugging**: `ck:debug` skill when tests reveal bugs requiring investigation
- **Thinking**: `ck:sequential-thinking` skill for complex test failure analysis

## Quality Standards

- All critical paths must have test coverage
- Validate happy path AND error scenarios
- Ensure test isolation — no interdependencies
- Tests must be deterministic and reproducible
- Clean up test data after execution
- Never ignore failing tests to pass the build

## Report Output

Use naming pattern from `## Naming` section injected by hooks.

## Team Mode

When operating as teammate:
1. On start: check `TaskList`, claim assigned/next unblocked task via `TaskUpdate`
2. Read full task description via `TaskGet` before starting
3. Wait for blocked tasks (implementation) to complete before testing
4. Respect file ownership — only create/edit test files assigned
5. When done: `TaskUpdate(status: "completed")` then `SendMessage` results to lead


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### report format

# Test Report Format

Structured QA report template. Sacrifice grammar for concision.

## Template

```markdown
# Test Report — {date} — {scope}

## Test Results Overview
- **Total**: X tests
- **Passed**: X | **Failed**: X | **Skipped**: X
- **Duration**: Xs

## Coverage Metrics
| Metric   | Value | Threshold | Status |
|----------|-------|-----------|--------|
| Lines    | X%    | 80%       | PASS/FAIL |
| Branches | X%    | 70%       | PASS/FAIL |
| Functions| X%    | 80%       | PASS/FAIL |

## Failed Tests
### `test/path/file.test.ts` — TestName
- **Error**: Error message
- **Stack**: Relevant stack trace (truncated)
- **Cause**: Brief root cause analysis
- **Fix**: Suggested resolution

## UI Test Results (if applicable)
- **Pages tested**: X
- **Screenshots**: ./screenshots/
- **Console errors**: none | [list]
- **Responsive**: checked at [viewports] | skipped
- **Performance**: LCP Xs, FID Xms, CLS X

## Build Status
- **Build**: PASS/FAIL
- **Warnings**: none | [list]
- **Dependencies**: all resolved | [issues]

## Critical Issues
1. [Blocking issue description + impact]

## Recommendations
1. [Actionable improvement with priority]

## Unresolved Questions
- [Any open questions, if any]
```

## Guidelines

- Include ALL failed tests with error messages — don't summarize away details
- Coverage: highlight specific uncovered files/functions, not just percentages
- Screenshots: embed paths directly in report for easy access
- Recommendations: prioritize by impact (critical > high > medium > low)
- Keep report under 200 lines — split into sections if larger scope needed
- Save report using naming pattern from `## Naming` section injected by hooks


### test execution workflow

# Test Execution Workflow

## Step 1: Identify Scope

Determine what to test based on recent changes:
- New feature → full test suite + new test cases
- Bug fix → regression tests + targeted fix validation
- Refactor → existing test suite (no new tests unless gaps found)
- Coverage check → full suite with coverage flags

## Step 2: Pre-flight Checks

Run syntax/type checks before tests to catch compile errors early:

```bash
# JavaScript/TypeScript
npx tsc --noEmit          # TypeScript check
npx eslint .              # Lint check

# Python
python -m py_compile file.py
flake8 .

# Flutter
flutter analyze

# Go
go vet ./...

# Rust
cargo check
```

## Step 3: Execute Tests

### JavaScript/TypeScript
```bash
npm test                    # or yarn test / pnpm test / bun test
npm run test:coverage       # with coverage
npx vitest run              # Vitest
npx jest --coverage         # Jest with coverage
```

### Python
```bash
pytest                      # basic
pytest --cov=src --cov-report=term-missing  # with coverage
python -m unittest discover # unittest
```

### Go / Rust / Flutter
```bash
go test ./... -cover        # Go with coverage
cargo test                  # Rust
flutter test --coverage     # Flutter
```

## Step 4: Analyze Results

Focus on:
1. **Failing tests** — read error messages and stack traces carefully
2. **Flaky tests** — tests that pass/fail intermittently indicate race conditions or state leaks
3. **Slow tests** — identify bottlenecks (>5s per test is suspicious)
4. **Skipped tests** — ensure skips are intentional, not hiding failures

## Step 5: Coverage Analysis

Thresholds:
- **80%+** line coverage — standard minimum
- **70%+** branch coverage — acceptable for most projects
- Focus on critical paths: auth, payment, data mutations

Identify gaps:
- Uncovered error handlers
- Missing edge case branches
- Untested utility functions

## Step 6: Build Verification

```bash
npm run build               # JS/TS production build
python setup.py build       # Python
go build ./...              # Go
cargo build --release       # Rust
flutter build               # Flutter
```

Check for:
- Build warnings or deprecation notices
- Unresolved dependencies
- Production config correctness

## Quality Checklist

- [ ] All tests pass (zero failures)
- [ ] Coverage meets project threshold
- [ ] No flaky tests detected
- [ ] Build completes without errors
- [ ] Error scenarios tested
- [ ] Test isolation verified (no shared state)
- [ ] Test data cleaned up after execution
- [ ] Mocks/stubs properly configured
- [ ] Environment variables correctly set


### ui testing workflow

# UI Testing Workflow

Activate the ck:chrome-devtools skill.

## Purpose
Run comprehensive UI tests on a website and generate a detailed report.

## Arguments
- $1: URL - The URL of the website to test
- $2: OPTIONS - Optional test configuration (e.g., --headless, --mobile, --auth)

## Testing Protected Routes (Authentication)

### Step 1: User Manual Login
Instruct the user to:
1. Open the target site in their browser
2. Log in manually with their credentials
3. Open browser DevTools (F12) → Application tab → Cookies/Storage

### Step 2: Extract Auth Credentials
Ask the user to provide one of:
- **Cookies**: Copy cookie values (name, value, domain)
- **Access Token**: Copy JWT/Bearer token from localStorage or cookies
- **Session Storage**: Copy relevant session keys

### Step 3: Inject Authentication
Use the `inject-auth.js` script:

```bash
cd $SKILL_DIR  # .claude/skills/chrome-devtools/scripts

# Option A: Inject cookies
node inject-auth.js --url https://example.com --cookies '[{"name":"session","value":"abc123","domain":".example.com"}]'

# Option B: Inject Bearer token
node inject-auth.js --url https://example.com --token "Bearer eyJhbGciOi..." --header Authorization --token-key access_token

# Option C: Inject localStorage
node inject-auth.js --url https://example.com --local-storage '{"auth_token":"xyz","user_id":"123"}'
```

### Step 4: Run Tests
After auth injection, run tests normally:
```bash
node navigate.js --url https://example.com/dashboard
node screenshot.js --url https://example.com/profile --output profile.png
```

## Workflow
- Use `ck:plan` skill to organize the test plan & report
- All screenshots saved in the same report directory
- Browse URL, discover all pages, components, endpoints
- Create test plan based on discovered structure
- Use multiple `tester` subagents in parallel for: pages, forms, navigation, user flows, accessibility, responsive layouts, performance, security, seo
- Use `ck:ai-multimodal` to analyze all screenshots
- Generate comprehensive Markdown report
- Ask user if they want to preview with `/ck:preview`

## Output Requirements
- Clear, structured Markdown with headers, lists, code blocks
- Include test results summary, key findings, screenshot references
- Ensure token efficiency while maintaining high quality
- Sacrifice grammar for concision

**Do not** start implementing fixes.




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
