---
name: ck:repomix
description: Pack repositories into AI-friendly files with Repomix (XML, Markdown, plain text). Use for codebase snapshots, LLM context preparation, security audits, third-party library analysis.
argument-hint: "[path] [--style xml|markdown|plain|json]"
---

# Repomix Skill

Repomix packs entire repositories into single, AI-friendly files. Perfect for feeding codebases to LLMs like Claude, ChatGPT, and Gemini.

## When to Use

Use when:
- Packaging codebases for AI analysis
- Creating repository snapshots for LLM context
- Analyzing third-party libraries
- Preparing for security audits
- Generating documentation context
- Investigating bugs across large codebases
- Creating AI-friendly code representations

## Quick Start

### Check Installation
```bash
repomix --version
```

### Install
```bash
# npm
npm install -g repomix

# Homebrew (macOS/Linux)
brew install repomix
```

### Basic Usage
```bash
# Package current directory (generates repomix-output.xml)
repomix

# Specify output format
repomix --style markdown
repomix --style json

# Package remote repository
npx repomix --remote owner/repo

# Custom output with filters
repomix --include "src/**/*.ts" --remove-comments -o output.md
```

## Core Capabilities

### Repository Packaging
- AI-optimized formatting with clear separators
- Multiple output formats: XML, Markdown, JSON, Plain text
- Git-aware processing (respects .gitignore)
- Token counting for LLM context management
- Security checks for sensitive information

### Remote Repository Support
Process remote repositories without cloning:
```bash
# Shorthand
npx repomix --remote yamadashy/repomix

# Full URL
npx repomix --remote https://github.com/owner/repo

# Specific commit
npx repomix --remote https://github.com/owner/repo/commit/hash
```

### Comment Removal
Strip comments from supported languages (HTML, CSS, JavaScript, TypeScript, Vue, Svelte, Python, PHP, Ruby, C, C#, Java, Go, Rust, Swift, Kotlin, Dart, Shell, YAML):
```bash
repomix --remove-comments
```

## Common Use Cases

### Code Review Preparation
```bash
# Package feature branch for AI review
repomix --include "src/**/*.ts" --remove-comments -o review.md --style markdown
```

### Security Audit
```bash
# Package third-party library
npx repomix --remote vendor/library --style xml -o audit.xml
```

### Documentation Generation
```bash
# Package with docs and code
repomix --include "src/**,docs/**,*.md" --style markdown -o context.md
```

### Bug Investigation
```bash
# Package specific modules
repomix --include "src/auth/**,src/api/**" -o debug-context.xml
```

### Implementation Planning
```bash
# Full codebase context
repomix --remove-comments --copy
```

## Command Line Reference

### File Selection
```bash
# Include specific patterns
repomix --include "src/**/*.ts,*.md"

# Ignore additional patterns
repomix -i "tests/**,*.test.js"

# Disable .gitignore rules
repomix --no-gitignore
```

### Output Options
```bash
# Output format
repomix --style markdown  # or xml, json, plain

# Output file path
repomix -o output.md

# Remove comments
repomix --remove-comments

# Copy to clipboard
repomix --copy
```

### Configuration
```bash
# Use custom config file
repomix -c custom-config.json

# Initialize new config
repomix --init  # creates repomix.config.json
```

## Token Management

Repomix automatically counts tokens for individual files, total repository, and per-format output.

Typical LLM context limits:
- Claude Sonnet 4.5: ~200K tokens
- GPT-4: ~128K tokens
- GPT-3.5: ~16K tokens

### Token Count Optimization
Understanding your codebase's token distribution is crucial for optimizing AI interactions. Use the --token-count-tree option to visualize token usage across your project:

```bash
repomix --token-count-tree
```
This displays a hierarchical view of your codebase with token counts:

```
🔢 Token Count Tree:
────────────────────
└── src/ (70,925 tokens)
    ├── cli/ (12,714 tokens)
    │   ├── actions/ (7,546 tokens)
    │   └── reporters/ (990 tokens)
    └── core/ (41,600 tokens)
        ├── file/ (10,098 tokens)
        └── output/ (5,808 tokens)
```
You can also set a minimum token threshold to focus on larger files:

```bash
repomix --token-count-tree 1000  # Only show files/directories with 1000+ tokens
```

This helps you:

- Identify token-heavy files that might exceed AI context limits
- Optimize file selection using --include and --ignore patterns
- Plan compression strategies by targeting the largest contributors
- Balance content vs. context when preparing code for AI analysis

## Security Considerations

Repomix uses Secretlint to detect sensitive data (API keys, passwords, credentials, private keys, AWS secrets).

Best practices:
1. Always review output before sharing
2. Use `.repomixignore` for sensitive files
3. Enable security checks for unknown codebases
4. Avoid packaging `.env` files
5. Check for hardcoded credentials

Disable security checks if needed:
```bash
repomix --no-security-check
```

## Implementation Workflow

When user requests repository packaging:

1. **Assess Requirements**
   - Identify target repository (local/remote)
   - Determine output format needed
   - Check for sensitive data concerns

2. **Configure Filters**
   - Set include patterns for relevant files
   - Add ignore patterns for unnecessary files
   - Enable/disable comment removal

3. **Execute Packaging**
   - Run repomix with appropriate options
   - Monitor token counts
   - Verify security checks

4. **Validate Output**
   - Review generated file
   - Confirm no sensitive data
   - Check token limits for target LLM

5. **Deliver Context**
   - Provide packaged file to user
   - Include token count summary
   - Note any warnings or issues

## Reference Documentation

For detailed information, see:
- [Configuration Reference](./references/configuration.md) - Config files, include/exclude patterns, output formats, advanced options
- [Usage Patterns](./references/usage-patterns.md) - AI analysis workflows, security audit preparation, documentation generation, library evaluation

## Additional Resources

- GitHub: https://github.com/yamadashy/repomix
- Documentation: https://repomix.com/guide/
- MCP Server: Available for AI assistant integration


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### configuration

# Configuration Reference

Detailed configuration options for Repomix.

## Configuration File

Create `repomix.config.json` in project root:

```json
{
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",
    "removeComments": false,
    "showLineNumbers": true,
    "copyToClipboard": false
  },
  "include": ["**/*"],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": ["additional-folder", "**/*.log", "**/tmp/**"]
  },
  "security": {
    "enableSecurityCheck": true
  }
}
```

### Output Options

- `filePath`: Output file path (default: `repomix-output.xml`)
- `style`: Format - `xml`, `markdown`, `json`, `plain` (default: `xml`)
- `removeComments`: Strip comments (default: `false`). Supports HTML, CSS, JS/TS, Vue, Svelte, Python, PHP, Ruby, C, C#, Java, Go, Rust, Swift, Kotlin, Dart, Shell, YAML
- `showLineNumbers`: Include line numbers (default: `true`)
- `copyToClipboard`: Auto-copy output (default: `false`)

### Include/Ignore

- `include`: Glob patterns for files to include (default: `["**/*"]`)
- `useGitignore`: Respect .gitignore (default: `true`)
- `useDefaultPatterns`: Use default ignore patterns (default: `true`)
- `customPatterns`: Additional ignore patterns (same format as .gitignore)

### Security

- `enableSecurityCheck`: Scan for sensitive data with Secretlint (default: `true`)
- Detects: API keys, passwords, credentials, private keys, AWS secrets, DB connections

## Glob Patterns

**Wildcards:**
- `*` - Any chars except `/`
- `**` - Any chars including `/`
- `?` - Single char
- `[abc]` - Char from set
- `{js,ts}` - Either extension

**Examples:**
- `**/*.ts` - All TypeScript
- `src/**` - Specific dir
- `**/*.{js,jsx,ts,tsx}` - Multiple extensions
- `!**/*.test.ts` - Exclude tests

### CLI Options

```bash
# Include patterns
repomix --include "src/**/*.ts,*.md"

# Ignore patterns
repomix -i "tests/**,*.test.js"

# Disable .gitignore
repomix --no-gitignore

# Disable defaults
repomix --no-default-patterns
```

### .repomixignore File

Create `.repomixignore` for Repomix-specific patterns (same format as .gitignore):

```
# Build artifacts
dist/
build/
*.min.js
out/

# Test files
**/*.test.ts
**/*.spec.ts
coverage/
__tests__/

# Dependencies
node_modules/
vendor/
packages/*/node_modules/

# Large files
*.mp4
*.zip
*.tar.gz
*.iso

# Sensitive files
.env*
secrets/
*.key
*.pem

# IDE files
.vscode/
.idea/
*.swp

# Logs
logs/
**/*.log
```

### Pattern Precedence

Order (highest to lowest priority):
1. CLI ignore patterns (`-i`)
2. `.repomixignore` file
3. Custom patterns in config
4. `.gitignore` (if enabled)
5. Default patterns (if enabled)

### Pattern Examples

**TypeScript:**
```json
{"include": ["**/*.ts", "**/*.tsx"], "ignore": {"customPatterns": ["**/*.test.ts", "dist/"]}}
```

**React:**
```json
{"include": ["src/**/*.{js,jsx,ts,tsx}", "*.md"], "ignore": {"customPatterns": ["build/"]}}
```

**Monorepo:**
```json
{"include": ["packages/*/src/**"], "ignore": {"customPatterns": ["packages/*/dist/"]}}
```

## Output Formats

### XML (Default)
```bash
repomix --style xml
```
Structured AI consumption. Features: tags, hierarchy, metadata, AI-optimized separators.
Use for: LLMs, structured analysis, programmatic parsing.

### Markdown
```bash
repomix --style markdown
```
Human-readable with syntax highlighting. Features: syntax highlighting, headers, TOC.
Use for: documentation, code review, sharing.

### JSON
```bash
repomix --style json
```
Programmatic processing. Features: structured data, easy parsing, metadata.
Use for: API integration, custom tooling, data analysis.

### Plain Text
```bash
repomix --style plain
```
Simple concatenation. Features: no formatting, minimal overhead.
Use for: simple analysis, minimal processing.

## Advanced Options

```bash
# Verbose - show processing details
repomix --verbose

# Custom config file
repomix -c /path/to/custom-config.json

# Initialize config
repomix --init

# Disable line numbers - smaller output
repomix --no-line-numbers
```

### Performance

**Worker Threads:** Parallel processing handles large codebases efficiently (e.g., facebook/react: 29x faster, 123s → 4s)

**Optimization:**
```bash
# Exclude unnecessary files
repomix -i "node_modules/**,dist/**,*.min.js"

# Specific directories only
repomix --include "src/**/*.ts"

# Remove comments, disable line numbers
repomix --remove-comments --no-line-numbers
```


### usage patterns

# Usage Patterns

Practical workflows and patterns for using Repomix in different scenarios.

## AI Analysis Workflows

### Full Repository
```bash
repomix --remove-comments --style markdown -o full-repo.md
```
**Use:** New codebase, architecture review, complete LLM context, planning
**Tips:** Remove comments, use markdown, check token limits, review before sharing

### Focused Module
```bash
repomix --include "src/auth/**,src/api/**" -o modules.xml
```
**Use:** Feature analysis, debugging specific areas, targeted refactoring
**Tips:** Include related files only, stay within token limits, use XML for AI

### Incremental Analysis
```bash
git checkout feature-branch && repomix --include "src/**" -o feature.xml
git checkout main && repomix --include "src/**" -o main.xml
```
**Use:** Feature branch review, change impact, before/after comparison, migration planning

### Cross-Repository
```bash
npx repomix --remote org/repo1 -o repo1.xml
npx repomix --remote org/repo2 -o repo2.xml
```
**Use:** Microservices, library comparisons, consistency checks, integration analysis

## Security Audit

### Third-Party Library
```bash
npx repomix --remote vendor/library --style xml -o audit.xml
```
**Workflow:** Package library → enable security checks → review vulnerabilities → check suspicious patterns → AI analysis
**Check for:** API keys, hardcoded credentials, network calls, obfuscation, malicious patterns

### Pre-Deployment
```bash
repomix --include "src/**,config/**" --style xml -o pre-deploy-audit.xml
```
**Checklist:** No sensitive data, no test credentials, env vars correct, security practices, no debug code

### Dependency Audit
```bash
repomix --include "**/package.json,**/package-lock.json" -o deps.md --style markdown
repomix --include "node_modules/suspicious-package/**" -o dep-audit.xml
```
**Use:** Suspicious dependency, security advisory, license compliance, vulnerability assessment

### Compliance
```bash
repomix --include "src/**,LICENSE,README.md,docs/**" --style markdown -o compliance.md
```
**Include:** Source, licenses, docs, configs. **Exclude:** Test data, dependencies

## Documentation

### Doc Context
```bash
repomix --include "src/**,docs/**,*.md" --style markdown -o doc-context.md
```
**Use:** API docs, architecture docs, user guides, onboarding
**Tips:** Include existing docs, include source, use markdown

### API Documentation
```bash
repomix --include "src/api/**,src/routes/**,src/controllers/**" --remove-comments -o api-context.xml
```
**Include:** Routes, controllers, schemas, middleware
**Workflow:** Package → AI → OpenAPI/Swagger → endpoint docs → examples

### Architecture
```bash
repomix --include "src/**/*.ts,*.md" -i "**/*.test.ts" --style markdown -o architecture.md
```
**Focus:** Module structure, dependencies, design patterns, data flow

### Examples
```bash
repomix --include "examples/**,demos/**,*.example.js" --style markdown -o examples.md
```

## Library Evaluation

### Quick Assessment
```bash
npx repomix --remote owner/library --style markdown -o library-eval.md
```
**Evaluate:** Code quality, architecture, dependencies, tests, docs, maintenance

### Feature Comparison
```bash
npx repomix --remote owner/lib-a --style xml -o lib-a.xml
npx repomix --remote owner/lib-b --style xml -o lib-b.xml
```
**Compare:** Features, API design, performance, bundle size, dependencies, maintenance

### Integration Feasibility
```bash
npx repomix --remote vendor/library --include "src/**,*.md" -o library.xml
repomix --include "src/integrations/**" -o our-integrations.xml
```
Analyze compatibility between target library and your integration points

### Migration Planning
```bash
repomix --include "node_modules/old-lib/**" -o old-lib.xml
npx repomix --remote owner/new-lib -o new-lib.xml
```
Compare current vs target library, analyze usage patterns

## Workflow Integration

### CI/CD
```yaml
# GitHub Actions
- name: Generate Snapshot
  run: |
    npm install -g repomix
    repomix --style markdown -o release-snapshot.md
- name: Upload Artifact
  uses: actions/upload-artifact@v3
  with: {name: repo-snapshot, path: release-snapshot.md}
```
**Use:** Release docs, compliance archives, change tracking, audit trails

### Git Hooks
```bash
#!/bin/bash
# .git/hooks/pre-commit
git diff --cached --name-only > staged-files.txt
repomix --include "$(cat staged-files.txt | tr '\n' ',')" -o .context/latest.xml
```

### IDE (VS Code)
```json
{"version": "2.0.0", "tasks": [{"label": "Package for AI", "type": "shell", "command": "repomix --include 'src/**' --remove-comments --copy"}]}
```

### Claude Code
```bash
repomix --style markdown --copy  # Then paste into Claude
```

## Language-Specific Patterns

### TypeScript
```bash
repomix --include "**/*.ts,**/*.tsx" --remove-comments --no-line-numbers
```
**Exclude:** `**/*.test.ts`, `dist/`, `coverage/`

### React
```bash
repomix --include "src/**/*.{js,jsx,ts,tsx},public/**" -i "build/,*.test.*"
```
**Include:** Components, hooks, utils, public assets

### Node.js Backend
```bash
repomix --include "src/**/*.js,config/**" -i "node_modules/,logs/,tmp/"
```
**Focus:** Routes, controllers, models, middleware, configs

### Python
```bash
repomix --include "**/*.py,requirements.txt,*.md" -i "**/__pycache__/,venv/"
```
**Exclude:** `__pycache__/`, `*.pyc`, `venv/`, `.pytest_cache/`

### Monorepo
```bash
repomix --include "packages/*/src/**" -i "packages/*/node_modules/,packages/*/dist/"
```
**Consider:** Package-specific patterns, shared deps, cross-package refs, workspace structure

## Troubleshooting

### Output Too Large
**Problem:** Exceeds LLM token limits
**Fix:**
```bash
repomix -i "node_modules/**,dist/**,coverage/**" --include "src/core/**" --remove-comments --no-line-numbers
```

### Missing Files
**Problem:** Expected files not included
**Debug:**
```bash
cat .gitignore .repomixignore  # Check ignore patterns
repomix --no-gitignore --no-default-patterns --verbose
```

### Sensitive Data Warnings
**Problem:** Security scanner flags secrets
**Actions:** Review files → add to `.repomixignore` → remove sensitive data → use env vars
```bash
repomix --no-security-check  # Use carefully for false positives
```

### Performance Issues
**Problem:** Slow on large repo
**Optimize:**
```bash
repomix --include "src/**/*.ts" -i "node_modules/**,dist/**,vendor/**"
```

### Remote Access
**Problem:** Cannot access remote repo
**Fix:**
```bash
npx repomix --remote https://github.com/owner/repo  # Full URL
npx repomix --remote https://github.com/owner/repo/commit/abc123  # Specific commit
# For private: clone first, run locally
```

## Best Practices

**Planning:** Define scope → identify files → check token limits → consider security

**Execution:** Start broad, refine narrow → use appropriate format → enable security checks → monitor tokens

**Review:** Verify no sensitive data → check completeness → validate format → test with LLM

**Iteration:** Refine patterns → adjust format → optimize tokens → document patterns




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
