#!/bin/bash
# smoke-test.sh — CLI smoke tests for claudekit
# Runs all install scenarios in isolated temp dirs

CLI="$(cd "$(dirname "$0")/.." && pwd)/bin/claudekit.js"
PASS=0
FAIL=0

pass() { echo "  ✓ $1"; PASS=$((PASS + 1)); }
fail() { echo "  ✗ FAIL: $1"; FAIL=$((FAIL + 1)); }

# ─── Test 1: init --all ───────────────────────────────────────────────────────
echo "Test 1: init --all"
TMP=$(mktemp -d)
node "$CLI" init --all --force --cwd "$TMP" > /dev/null
[ -d "$TMP/.claude" ] && pass ".claude/ created" || fail ".claude/ not created"
[ -d "$TMP/.cursor" ] && pass ".cursor/ created" || fail ".cursor/ not created"
[ -f "$TMP/CLAUDE.md" ] && pass "CLAUDE.md created" || fail "CLAUDE.md not created"
[ -f "$TMP/AGENTS.md" ] && pass "AGENTS.md created" || fail "AGENTS.md not created"
# Verify template vars replaced
grep -q "{{PROJECT_NAME}}" "$TMP/AGENTS.md" && fail "Template vars not replaced" || pass "Template vars replaced"
rm -rf "$TMP"

# ─── Test 2: init --claude only ──────────────────────────────────────────────
echo "Test 2: init --claude only"
TMP=$(mktemp -d)
node "$CLI" init --claude --force --cwd "$TMP" > /dev/null
[ -d "$TMP/.claude" ] && pass ".claude/ created" || fail ".claude/ not created"
[ -d "$TMP/.cursor" ] && fail ".cursor/ should NOT exist" || pass ".cursor/ correctly absent"
rm -rf "$TMP"

# ─── Test 3: init --cursor only ──────────────────────────────────────────────
echo "Test 3: init --cursor only"
TMP=$(mktemp -d)
node "$CLI" init --cursor --force --cwd "$TMP" > /dev/null
[ -d "$TMP/.cursor" ] && pass ".cursor/ created" || fail ".cursor/ not created"
[ -d "$TMP/.claude" ] && fail ".claude/ should NOT exist" || pass ".claude/ correctly absent"
rm -rf "$TMP"

# ─── Test 4: sync overwrites without prompt ───────────────────────────────────
echo "Test 4: sync (no prompt)"
TMP=$(mktemp -d)
node "$CLI" init --all --force --cwd "$TMP" > /dev/null
node "$CLI" sync --all --cwd "$TMP" > /dev/null
[ -d "$TMP/.claude" ] && pass "sync: .claude/ present" || fail "sync: .claude/ missing"
[ -d "$TMP/.cursor" ] && pass "sync: .cursor/ present" || fail "sync: .cursor/ missing"
rm -rf "$TMP"

# ─── Test 5: --dry-run does not write files ───────────────────────────────────
echo "Test 5: --dry-run"
TMP=$(mktemp -d)
node "$CLI" init --all --dry-run --cwd "$TMP" > /dev/null
[ -d "$TMP/.claude" ] && fail "dry-run: .claude/ should not exist" || pass "dry-run: .claude/ correctly absent"
[ -d "$TMP/.cursor" ] && fail "dry-run: .cursor/ should not exist" || pass "dry-run: .cursor/ correctly absent"
rm -rf "$TMP"

# ─── Test 6: build:cursor output verification ────────────────────────────────
# ─── Test 6b: plan templates installed ───────────────────────────────────────
echo "Test 6b: plan templates"
TMP=$(mktemp -d)
node "$CLI" init --all --force --cwd "$TMP" > /dev/null
[ -f "$TMP/plans/templates/feature-implementation-template.md" ] && pass "feature template installed" || fail "feature template missing"
[ -f "$TMP/plans/templates/bug-fix-template.md" ] && pass "bug-fix template installed" || fail "bug-fix template missing"
[ -f "$TMP/plans/templates/refactor-template.md" ] && pass "refactor template installed" || fail "refactor template missing"
[ -f "$TMP/plans/templates/template-usage-guide.md" ] && pass "usage guide installed" || fail "usage guide missing"
rm -rf "$TMP"

echo "Test 6: cursor/ build output"
PKG_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
[ -f "$PKG_ROOT/cursor/rules/development-rules.mdc" ] && pass "development-rules.mdc exists" || fail "development-rules.mdc missing"
[ -f "$PKG_ROOT/cursor/rules/primary-workflow.mdc" ] && pass "primary-workflow.mdc exists" || fail "primary-workflow.mdc missing"
[ -f "$PKG_ROOT/cursor/skills/ask/SKILL.md" ] && pass "cursor skill 'ask' exists" || fail "cursor skill 'ask' missing"
[ -f "$PKG_ROOT/cursor/skills/docs/SKILL.md" ] && pass "cursor skill 'docs' exists" || fail "cursor skill 'docs' missing"
# Verify mdc has frontmatter
head -1 "$PKG_ROOT/cursor/rules/development-rules.mdc" | grep -q "^---" && pass "mdc has frontmatter" || fail "mdc missing frontmatter"

# ─── Summary ─────────────────────────────────────────────────────────────────
echo ""
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] && echo "✓ All tests passed" && exit 0 || echo "✗ Some tests failed" && exit 1
