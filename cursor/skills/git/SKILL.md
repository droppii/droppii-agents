---
name: ck:git
description: "Git operations with conventional commits. Use for staging, committing, pushing, PRs, merges. Auto-splits commits by type/scope. Security scans for secrets."
argument-hint: "cm|cp|pr|merge [args]"
version: 1.0.0
---

# Git Operations

## Default (No Arguments)

If invoked without arguments, use `AskUserQuestion` to present available git operations:

| Operation | Description |
|-----------|-------------|
| `cm` | Stage files & create commits |
| `cp` | Stage files, create commits and push |
| `pr` | Create Pull Request |
| `merge` | Merge branches |

Present as options via `AskUserQuestion` with header "Git Operation", question "What would you like to do?".

Execute git workflows via `git-manager` subagent to isolate verbose output.
Activate `ck:context-engineering` skill.

**IMPORTANT:**
- Sacrifice grammar for the sake of concision.
- Ensure token efficiency while maintaining high quality.
- Pass these rules to subagents.

## Arguments
- `cm`: Stage files & create commits
- `cp`: Stage files, create commits and push
- `pr`: Create Pull Request [to-branch] [from-branch]
  - `to-branch`: Target branch (default: main)
  - `from-branch`: Source branch (default: current branch)
- `merge`: Merge [to-branch] [from-branch]
  - `to-branch`: Target branch (default: main)
  - `from-branch`: Source branch (default: current branch)

## Quick Reference

| Task | Reference |
|------|-----------|
| Commit | `references/workflow-commit.md` |
| Push | `references/workflow-push.md` |
| Pull Request | `references/workflow-pr.md` |
| Merge | `references/workflow-merge.md` |
| Standards | `references/commit-standards.md` |
| Safety | `references/safety-protocols.md` |
| Branches | `references/branch-management.md` |
| GitHub CLI | `references/gh-cli-guide.md` |

## Core Workflow

### Step 1: Stage + Analyze
```bash
git add -A && git diff --cached --stat && git diff --cached --name-only
```

### Step 2: Security Check
Scan for secrets before commit:
```bash
git diff --cached | grep -iE "(api[_-]?key|token|password|secret|credential)"
```
**If secrets found:** STOP, warn user, suggest `.gitignore`.

### Step 3: Split Decision

**NOTE:**
- Search for related issues on GitHub and add to body.
- Only use `feat`, `fix`, or `perf` prefixes for files in `.claude` directory (do not use `docs`).

**Split commits if:**
- Different types mixed (feat + fix, code + docs)
- Multiple scopes (auth + payments)
- Config/deps + code mixed
- FILES > 10 unrelated

**Single commit if:**
- Same type/scope, FILES ≤ 3, LINES ≤ 50

### Step 4: Commit
```bash
git commit -m "type(scope): description"
```

## Output Format
```
✓ staged: N files (+X/-Y lines)
✓ security: passed
✓ commit: HASH type(scope): description
✓ pushed: yes/no
```

## Error Handling

| Error | Action |
|-------|--------|
| Secrets detected | Block commit, show files |
| No changes | Exit cleanly |
| Push rejected | Suggest `git pull --rebase` |
| Merge conflicts | Suggest manual resolution |

## References

- `references/workflow-commit.md` - Commit workflow with split logic
- `references/workflow-push.md` - Push workflow with error handling
- `references/workflow-pr.md` - PR creation with remote diff analysis
- `references/workflow-merge.md` - Branch merge workflow
- `references/commit-standards.md` - Conventional commit format rules
- `references/safety-protocols.md` - Secret detection, branch protection
- `references/branch-management.md` - Naming, lifecycle, strategies
- `references/gh-cli-guide.md` - GitHub CLI commands reference


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### branch management

# Branch Management

## Naming Convention

**Format:** `<type>/<descriptive-name>`

| Type | Purpose | Example |
|------|---------|---------|
| `feature/` | New features | `feature/oauth-login` |
| `fix/` | Bug fixes | `fix/db-timeout` |
| `refactor/` | Code restructure | `refactor/api-cleanup` |
| `docs/` | Documentation | `docs/api-reference` |
| `test/` | Test improvements | `test/integration-suite` |
| `chore/` | Maintenance | `chore/deps-update` |
| `hotfix/` | Production fixes | `hotfix/payment-crash` |

## Branch Lifecycle

### Create
```bash
git checkout main
git pull origin main
git checkout -b feature/new-feature
```

### During Development
```bash
# Regular commits
git add <files> && git commit -m "feat(scope): description"

# Stay current with main
git fetch origin
git rebase origin/main
```

### Before Merge
```bash
# Push final state
git push origin feature/new-feature

# Or after rebase (feature branches only)
git push -f origin feature/new-feature
```

### After Merge
```bash
# Delete local
git branch -d feature/new-feature

# Delete remote
git push origin --delete feature/new-feature
```

## Branch Strategies

### Simple (small teams)
```
main (production)
  └─ feature/* (development)
```

### Git Flow (releases)
```
main (production)
develop (staging)
  ├─ feature/*
  ├─ bugfix/*
  ├─ hotfix/*
  └─ release/*
```

### Trunk-Based (CI/CD)
```
main (always deployable)
  └─ short-lived feature branches
```

## Quick Commands

| Task | Command |
|------|---------|
| List branches | `git branch -a` |
| Current branch | `git rev-parse --abbrev-ref HEAD` |
| Switch branch | `git checkout <branch>` |
| Create + switch | `git checkout -b <branch>` |
| Delete local | `git branch -d <branch>` |
| Delete remote | `git push origin --delete <branch>` |
| Rename | `git branch -m <old> <new>` |


### commit standards

# Commit Message Standards

## Format
```
type(scope): description
```

## Types (priority order)
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting (no logic change)
- `refactor`: Restructure without behavior change
- `test`: Tests
- `chore`: Maintenance, deps, config
- `perf`: Performance
- `build`: Build system
- `ci`: CI/CD

## Rules
- **<72 characters**
- **Present tense, imperative** ("add" not "added")
- **No period at end**
- **Scope optional but recommended**
- **Focus on WHAT, not HOW**
- Only use `feat`, `fix`, or `perf` prefixes for files in `.claude` directory (do not use `docs`).

## NEVER Include AI Attribution
- ❌ "Generated with Claude"
- ❌ "Co-Authored-By: Claude"
- ❌ Any AI reference

## Good Examples
- `feat(auth): add login validation`
- `fix(api): resolve query timeout`
- `docs(readme): update install guide`
- `refactor(utils): simplify date logic`

## Bad Examples
- ❌ `Updated files` (not descriptive)
- ❌ `feat(auth): added login using bcrypt with salt` (too long, describes HOW)
- ❌ `Fix bug` (not specific)

## Special Cases
- `.claude/` skill updates: `perf(skill): improve token efficiency`
- `.claude/` new skills: `feat(skill): add database-optimizer`


### gh cli guide

# GitHub CLI Guide

## Authentication
```bash
gh auth login        # Interactive login
gh auth status       # Check auth state
gh auth logout       # Logout
```

## Pull Requests

### Create PR
```bash
# Basic
gh pr create --base main --head feature-branch --title "feat: add login" --body "Summary"

# With HEREDOC body
gh pr create --base main --title "feat(auth): add OAuth" --body "$(cat <<'EOF'
## Summary
- Added OAuth2 provider support
- Implemented token refresh

## Test plan
- [ ] Unit tests pass
- [ ] Manual login test
EOF
)"

# Draft mode
gh pr create --draft --title "WIP: new feature"

# Assign reviewers
gh pr create --reviewer @user1,@user2

# Add labels
gh pr create --label "bug,priority:high"
```

### View/Review PR
```bash
gh pr list                    # List PRs
gh pr view 123                # View PR details
gh pr view 123 --web          # Open in browser
gh pr checkout 123            # Checkout PR locally
gh pr diff 123                # View PR diff
gh pr status                  # Your PRs + reviews
```

### Merge PR
```bash
gh pr merge 123               # Default merge commit
gh pr merge 123 --squash      # Squash commits
gh pr merge 123 --rebase      # Rebase merge
gh pr merge 123 --auto        # Auto-merge when checks pass
gh pr merge 123 --delete-branch  # Delete branch after
```

### PR Comments
```bash
gh pr comment 123 --body "LGTM!"
gh api repos/{owner}/{repo}/pulls/123/comments  # View all
```

## Issues

```bash
gh issue list                 # List issues
gh issue view 42              # View issue
gh issue create --title "Bug" --body "Description"
gh issue develop 42 -c        # Create branch from issue
```

## Repository

```bash
gh repo view                  # Current repo info
gh repo clone owner/repo      # Clone
gh browse                     # Open repo in browser
gh browse path/to/file:42     # Open file at line
```

## Workflow Runs

```bash
gh run list                   # List workflow runs
gh run view <run-id>          # View run details
gh run watch                  # Watch running workflow
gh run rerun <run-id>         # Rerun failed workflow
```

## JSON Output (scripting)

```bash
gh pr list --json number,title,author
gh pr view 123 --json commits,reviews
gh issue list --json number,title --jq '.[].title'
```

## Common Patterns

### Create PR with auto-merge
```bash
gh pr create --fill && gh pr merge --auto --squash
```

### Close stale PRs
```bash
gh pr list --state open --json number -q '.[].number' | xargs -I {} gh pr close {}
```


### safety protocols

# Git Safety Protocols

## Secret Detection Patterns

### Scan Command
```bash
git diff --cached | grep -iE "(AKIA|api[_-]?key|token|password|secret|credential|private[_-]?key|mongodb://|postgres://|mysql://|redis://|-----BEGIN)"
```

### Patterns to Detect

| Category | Pattern | Example |
|----------|---------|---------|
| API Keys | `api[_-]?key`, `apiKey` | `API_KEY=abc123` |
| AWS | `AKIA[0-9A-Z]{16}` | `AKIAIOSFODNN7EXAMPLE` |
| Tokens | `token`, `auth_token`, `jwt` | `AUTH_TOKEN=xyz` |
| Passwords | `password`, `passwd`, `pwd` | `DB_PASSWORD=secret` |
| Private Keys | `-----BEGIN PRIVATE KEY-----` | PEM files |
| DB URLs | `mongodb://`, `postgres://`, `mysql://` | Connection strings |
| OAuth | `client_secret`, `oauth_token` | `CLIENT_SECRET=abc` |

### Files to Warn About
- `.env`, `.env.*` (except `.env.example`)
- `*.key`, `*.pem`, `*.p12`
- `credentials.json`, `secrets.json`
- `config/private.*`

### Action on Detection
1. **BLOCK commit immediately**
2. Show matching lines: `git diff --cached | grep -B2 -A2 <pattern>`
3. Suggest: "Add to .gitignore or use environment variables"
4. Offer to unstage: `git reset HEAD <file>`

## Branch Protection

### Never Force Push To
- `main`, `master`, `production`, `prod`, `release/*`

### Pre-Merge Checks
```bash
# Check for conflicts before merge
git merge --no-commit --no-ff origin/{branch} && git merge --abort
```

### Remote-First Operations
Always use `origin/{branch}` for comparisons:
- ✅ `git diff origin/main...origin/feature`
- ❌ `git diff main...HEAD` (includes local uncommitted)

## Error Recovery

### Undo Last Commit (unpushed)
```bash
git reset --soft HEAD~1  # Keep changes staged
git reset HEAD~1         # Keep changes unstaged
```

### Abort Merge
```bash
git merge --abort
```

### Discard Local Changes
```bash
git checkout -- <file>   # Single file
git reset --hard HEAD    # All files (DANGER)
```

**Always confirm with user before destructive operations.**


### workflow commit

# Commit Workflow

Execute via `git-manager` subagent.

## Tool 1: Stage + Analyze
```bash
git add -A && \
echo "=== STAGED ===" && git diff --cached --stat && \
echo "=== SECURITY ===" && \
git diff --cached | grep -c -iE "(api[_-]?key|token|password|secret|credential)" | awk '{print "SECRETS:"$1}' && \
echo "=== GROUPS ===" && \
git diff --cached --name-only | awk -F'/' '{
  if ($0 ~ /\.(md|txt)$/) print "docs:"$0
  else if ($0 ~ /test|spec/) print "test:"$0
  else if ($0 ~ /\.claude/) print "config:"$0
  else if ($0 ~ /package\.json|lock/) print "deps:"$0
  else print "code:"$0
}'
```

**If SECRETS > 0:** STOP, show matches, block commit.

## Tool 2: Split Decision

NOTE: 
- Search for related issues on GitHub and add to body.
- Only use `feat`, `fix`, or `perf` prefixes for files in `.claude` directory (do not use `docs`).

**From groups, decide:**

**A) Single commit:** Same type/scope, FILES ≤ 3, LINES ≤ 50

**B) Multi commit:** Mixed types/scopes, group by:
- Group 1: `config:` → `chore(config): ...`
- Group 2: `deps:` → `chore(deps): ...`
- Group 3: `test:` → `test: ...`
- Group 4: `code:` → `feat|fix: ...`
- Group 5: `docs:` → `docs: ...`

## Tool 3: Commit

**Single:**
```bash
git commit -m "type(scope): description"
```

**Multi (sequential):**
```bash
git reset && git add file1 file2 && git commit -m "type(scope): desc"
```
Repeat for each group.

## Tool 4: Push (if requested)
```bash
git push && echo "✓ pushed: yes" || echo "✓ pushed: no"
```

**Only push if user explicitly requested** ("push", "commit and push").


### workflow merge

# Merge Workflow

Execute via `git-manager` subagent.

## Variables
- TO_BRANCH: target (defaults to `main`)
- FROM_BRANCH: source (defaults to current branch)

## Step 1: Sync with Remote

**IMPORTANT: Always merge `main` (or any default branch) to current branch first.**

```bash
git fetch origin
git checkout {TO_BRANCH}
git pull origin {TO_BRANCH}
```

## Step 2: Merge from REMOTE
```bash
git merge origin/{FROM_BRANCH} --no-ff -m "merge: {FROM_BRANCH} into {TO_BRANCH}"
```

**Why `origin/{FROM_BRANCH}`:** Ensures merging only committed+pushed changes, not local WIP.

## Step 3: Resolve Conflicts
If conflicts:
1. Resolve manually
2. `git add . && git commit`
3. If clarifications needed, report to main agent

## Step 4: Push
```bash
git push origin {TO_BRANCH}
```

## Pre-Merge Checklist
- Fetch latest: `git fetch origin`
- Ensure FROM_BRANCH pushed to remote
- Check for conflicts: `git merge --no-commit --no-ff origin/{FROM_BRANCH}` then abort

## Error Handling

| Error | Action |
|-------|--------|
| Merge conflicts | Resolve manually, then commit |
| Branch not found | Verify branch name, ensure pushed |
| Push rejected | `git pull --rebase`, retry |


### workflow pr

# Pull Request Workflow

Execute via `git-manager` subagent.

## Variables
- TO_BRANCH: target (defaults to `main`)
- FROM_BRANCH: source (defaults to current branch)

## CRITICAL: Use REMOTE diff
PRs based on remote branches. Local diff includes unpushed changes.

## Tool 1: Sync + Analyze

**IMPORTANT: Always merge `main` (or any default branch) to current branch first.**

```bash
git fetch origin && \
git push -u origin HEAD 2>/dev/null || true && \
BASE=${BASE_BRANCH:-main} && \
HEAD=$(git rev-parse --abbrev-ref HEAD) && \
echo "=== PR: $HEAD → $BASE ===" && \
echo "=== COMMITS ===" && \
git log origin/$BASE...origin/$HEAD --oneline && \
echo "=== FILES ===" && \
git diff origin/$BASE...origin/$HEAD --stat
```

**If "Branch not on remote":** Push first, retry.

## Tool 2: Generate Content
**Title:** Conventional commit format, <72 chars, NO version numbers
**Body:** Summary bullets + Test plan checklist

## Tool 3: Create PR
```bash
gh pr create --base $BASE --head $HEAD --title "..." --body "$(cat <<'EOF'
## Summary
- Bullet points

## Test plan
- [ ] Test item
EOF
)"
```

## DO NOT use (local comparison)
- ❌ `git diff main...HEAD`
- ❌ `git diff --cached`
- ❌ `git status`

## Error Handling

| Error | Action |
|-------|--------|
| Branch not on remote | `git push -u origin HEAD`, retry |
| Empty diff | Warn: "No changes for PR" |
| Push rejected | `git pull --rebase`, resolve, push |
| No upstream | `git push -u origin HEAD` |


### workflow push

# Push Workflow

Execute via `git-manager` subagent.

## Pre-Push Checklist
1. All changes committed
2. Secrets scanned (see `safety-protocols.md`)
3. Branch pushed to remote

## Tool 1: Verify State
```bash
git status && \
git log origin/$(git rev-parse --abbrev-ref HEAD)..HEAD --oneline 2>/dev/null || echo "NO_UPSTREAM"
```

**If uncommitted changes:** Warn user, suggest commit first.
**If NO_UPSTREAM:** Use `git push -u origin HEAD`.

## Tool 2: Push
```bash
git push origin HEAD
```

**On success:** Report commit hashes pushed.

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| `rejected - non-fast-forward` | Remote has newer commits | `git pull --rebase`, resolve conflicts, push again |
| `no upstream branch` | Branch not tracked | `git push -u origin HEAD` |
| `Authentication failed` | Invalid credentials | Check `gh auth status` or SSH keys |
| `Repository not found` | Wrong remote URL | Verify `git remote -v` |
| `Permission denied` | No write access | Check repository permissions |

## Force Push (DANGER)

**NEVER force push to main/master/production branches.**

If user explicitly requests force push on feature branch:
```bash
git push -f origin HEAD
```

**Warn user:** "Force push rewrites history. Collaborators may lose work."

## Output Format
```
✓ pushed: N commits to origin/{branch}
  - abc123 feat(auth): add login
  - def456 fix(api): resolve timeout
```




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
