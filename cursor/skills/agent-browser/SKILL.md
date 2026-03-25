---
name: ck:agent-browser
description: AI-optimized browser automation CLI with context-efficient snapshots. Use for long autonomous sessions, self-verifying workflows, video recording, and cloud browser testing (Browserbase).
license: Apache-2.0
argument-hint: "[url or task]"
---

# agent-browser Skill

Browser automation CLI designed for AI agents. Uses "snapshot + refs" paradigm for 93% less context than Playwright MCP.

## Quick Start

```bash
# Install globally
npm install -g agent-browser

# Download Chromium (one-time)
agent-browser install

# Linux: include system deps
agent-browser install --with-deps

# Verify
agent-browser --version
```

## Core Workflow

The 4-step pattern for all browser automation:

```bash
# 1. Navigate
agent-browser open https://example.com

# 2. Snapshot (get interactive elements with refs)
agent-browser snapshot -i
# Output: button "Sign In" @e1, textbox "Email" @e2, ...

# 3. Interact using refs
agent-browser fill @e2 "user@example.com"
agent-browser click @e1

# 4. Re-snapshot after page changes
agent-browser snapshot -i
```

## When to Use (vs chrome-devtools)

| Use agent-browser | Use chrome-devtools |
|-------------------|---------------------|
| Long autonomous AI sessions | Quick one-off screenshots |
| Context-constrained workflows | Custom Puppeteer scripts needed |
| Video recording for debugging | WebSocket full frame debugging |
| Cloud browsers (Browserbase) | Existing workflow integration |
| Multi-tab handling | Need Sharp auto-compression |
| Self-verifying build loops | Session with auth injection |

**Token efficiency:** ~280 chars/snapshot vs 8K+ for Playwright MCP.

## Command Reference

### Navigation
```bash
agent-browser open <url>       # Navigate to URL
agent-browser back             # Go back
agent-browser forward          # Go forward
agent-browser reload           # Reload page
agent-browser close            # Close browser
```

### Analysis (Snapshot)
```bash
agent-browser snapshot         # Full accessibility tree
agent-browser snapshot -i      # Interactive elements only (recommended)
agent-browser snapshot -c      # Compact output
agent-browser snapshot -d 3    # Limit depth
agent-browser snapshot -s "nav" # Scope to CSS selector
```

### Interactions (use @refs from snapshot)
```bash
agent-browser click @e1        # Click element
agent-browser dblclick @e1     # Double-click
agent-browser fill @e2 "text"  # Clear and fill input
agent-browser type @e2 "text"  # Type without clearing
agent-browser press Enter      # Press key
agent-browser hover @e1        # Hover over element
agent-browser check @e3        # Check checkbox
agent-browser uncheck @e3      # Uncheck checkbox
agent-browser select @e4 "opt" # Select dropdown option
agent-browser scroll @e1       # Scroll element into view
agent-browser scroll down 500  # Scroll page by pixels
agent-browser drag @e1 @e2     # Drag from e1 to e2
agent-browser upload @e5 file.pdf  # Upload file
```

### Information Retrieval
```bash
agent-browser get text @e1     # Get text content
agent-browser get html @e1     # Get HTML
agent-browser get value @e2    # Get input value
agent-browser get attr @e1 href  # Get attribute
agent-browser get title        # Page title
agent-browser get url          # Current URL
agent-browser get count "li"   # Count elements
agent-browser get box @e1      # Bounding box
```

### State Checks
```bash
agent-browser is visible @e1   # Check visibility
agent-browser is enabled @e1   # Check if enabled
agent-browser is checked @e3   # Check if checked
```

### Media
```bash
agent-browser screenshot           # Capture viewport
agent-browser screenshot --full    # Full page
agent-browser screenshot -o ss.png # Save to file
agent-browser pdf -o page.pdf      # Export PDF
agent-browser record start         # Start video recording
agent-browser record stop          # Stop and save video
agent-browser record restart       # Restart recording
```

### Wait Conditions
```bash
agent-browser wait @e1                    # Wait for element
agent-browser wait --text "Success"       # Wait for text to appear
agent-browser wait --url "/dashboard"     # Wait for URL pattern
agent-browser wait --load                 # Wait for page load
agent-browser wait --idle                 # Wait for network idle
agent-browser wait --fn "() => window.ready"  # Wait for JS condition
```

### Browser Configuration
```bash
agent-browser viewport 1920 1080   # Set viewport size
agent-browser device "iPhone 14"   # Emulate device
agent-browser geolocation 40.7 -74.0  # Set geolocation
agent-browser offline true         # Enable offline mode
agent-browser headers '{"X-Custom":"val"}'  # Set headers
agent-browser credentials user pass  # HTTP auth
agent-browser color-scheme dark    # Set color scheme
```

### Storage Management
```bash
agent-browser cookies              # List cookies
agent-browser cookies set name=val # Set cookie
agent-browser cookies clear        # Clear cookies
agent-browser storage local        # Get localStorage
agent-browser storage session      # Get sessionStorage
agent-browser state save auth.json # Save browser state
agent-browser state load auth.json # Load browser state
```

### Network Control
```bash
agent-browser network route "**/*.jpg" --abort    # Block requests
agent-browser network route "**/api/*" --body '{"data":[]}'  # Mock response
agent-browser network unroute "**/*.jpg"          # Remove specific route
agent-browser network requests                    # List intercepted requests
```

### Semantic Finding
```bash
agent-browser find role button           # Find by ARIA role
agent-browser find text "Submit"         # Find by text content
agent-browser find label "Email"         # Find by label
agent-browser find placeholder "Search"  # Find by placeholder
agent-browser find testid "login-btn"    # Find by data-testid
agent-browser find first "button"        # First matching element
agent-browser find last "li"             # Last matching element
agent-browser find nth 2 "li"            # Nth element (0-indexed)
```

### Advanced
```bash
agent-browser tabs                 # List tabs
agent-browser tab new              # New tab
agent-browser tab 2                # Switch to tab
agent-browser tab close            # Close current tab
agent-browser frame 0              # Switch to frame
agent-browser dialog accept        # Accept dialog
agent-browser dialog dismiss       # Dismiss dialog
agent-browser eval "document.title"  # Execute JS
agent-browser highlight @e1        # Highlight element visually
agent-browser mouse move 100 200   # Move mouse to coordinates
agent-browser mouse down           # Mouse button down
agent-browser mouse up             # Mouse button up
```

## Global Options

| Option | Description |
|--------|-------------|
| `--session <name>` | Named session for parallel testing |
| `--json` | JSON output for parsing |
| `--headed` | Show browser window |
| `--cdp <port>` | Connect via Chrome DevTools Protocol |
| `-p <provider>` | Cloud browser provider |
| `--proxy <url>` | Proxy server |
| `--headers <json>` | Custom HTTP headers |
| `--executable-path` | Custom browser binary |
| `--extension <path>` | Load browser extension |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AGENT_BROWSER_SESSION` | Default session name |
| `AGENT_BROWSER_PROVIDER` | Cloud provider (e.g., browserbase) |
| `AGENT_BROWSER_EXECUTABLE_PATH` | Browser binary location |
| `AGENT_BROWSER_EXTENSIONS` | Comma-separated extension paths |
| `AGENT_BROWSER_STREAM_PORT` | WebSocket streaming port |
| `AGENT_BROWSER_HOME` | Custom installation directory |
| `AGENT_BROWSER_PROFILE` | Browser profile directory |
| `BROWSERBASE_API_KEY` | Browserbase API key |
| `BROWSERBASE_PROJECT_ID` | Browserbase project ID |

## Common Patterns

### Form Submission
```bash
agent-browser open https://example.com/login
agent-browser snapshot -i
agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "password123"
agent-browser click @e3  # Submit button
agent-browser wait url "/dashboard"
```

### State Persistence (Auth)
```bash
# Save authenticated state
agent-browser open https://example.com/login
# ... login steps ...
agent-browser state save auth.json

# Reuse in future sessions
agent-browser state load auth.json
agent-browser open https://example.com/dashboard
```

### Video Recording (Debugging)
```bash
agent-browser open https://example.com
agent-browser record start
# ... perform actions ...
agent-browser record stop  # Saves to recording.webm
```

### Parallel Sessions
```bash
# Terminal 1
agent-browser --session test1 open https://example.com

# Terminal 2
agent-browser --session test2 open https://example.com
```

## Cloud Browsers (Browserbase)

For CI/CD or environments without local browser:

```bash
# Set credentials
export BROWSERBASE_API_KEY="your-api-key"
export BROWSERBASE_PROJECT_ID="your-project-id"

# Use cloud browser
agent-browser -p browserbase open https://example.com
```

See `references/browserbase-cloud-setup.md` for detailed setup.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Command not found | Run `npm install -g agent-browser` |
| Chromium missing | Run `agent-browser install` |
| Linux deps missing | Run `agent-browser install --with-deps` |
| Session stale | Close browser: `agent-browser close` |
| Element not found | Re-run `snapshot -i` after page changes |

## Resources

- [GitHub Repository](https://github.com/vercel-labs/agent-browser)
- [Official Documentation](https://github.com/vercel-labs/agent-browser#readme)
- [Browserbase Docs](https://docs.browserbase.com/)


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### agent browser vs chrome devtools

# agent-browser vs chrome-devtools

Detailed comparison guide for choosing between browser automation skills.

## Feature Comparison

| Feature | agent-browser | chrome-devtools |
|---------|---------------|-----------------|
| **Engine** | Playwright (via Rust CLI) | Puppeteer |
| **Refs system** | `@e1` inline | `[ref=e1]` YAML |
| **Session persistence** | Named sessions (`--session`) | `.browser-session.json` |
| **Screenshot** | Basic | Auto-compress >5MB (Sharp) |
| **Network intercept** | `route` command | `network.js` script |
| **Console capture** | Basic | With filtering |
| **WebSocket debug** | Limited | Full frames support |
| **Video recording** | Built-in `record` | Not available |
| **PDF export** | Built-in `pdf` | Via Puppeteer API |
| **Auth persistence** | `state save/load` | `inject-auth.js` |
| **Multi-tab** | Full support | Limited |
| **Cloud browsers** | Browserbase native | Manual setup |
| **Performance** | Rust CLI (fast) | Node.js |
| **Custom scripts** | None (CLI only) | 20+ utilities |

## Token Efficiency Benchmarks

| Metric | agent-browser | chrome-devtools | Playwright MCP |
|--------|---------------|-----------------|----------------|
| Homepage snapshot | ~280 chars | ~300-500 chars | ~8,247 chars |
| Context reduction | 93% vs MCP | 90% vs MCP | Baseline |
| Tool definitions | ~2K tokens | 0 (CLI scripts) | ~17K tokens |

**Conclusion:** Both agent-browser and chrome-devtools are similarly efficient. Both dramatically outperform Playwright MCP.

## Use Case Decision Tree

```
Need browser automation?
|
+-- Long autonomous AI session?
|   +-- YES --> agent-browser (better context efficiency)
|   +-- NO --> Continue
|
+-- Need video recording?
|   +-- YES --> agent-browser (built-in)
|   +-- NO --> Continue
|
+-- Cloud browser (CI/CD)?
|   +-- YES --> agent-browser (Browserbase native)
|   +-- NO --> Continue
|
+-- Custom Puppeteer scripts?
|   +-- YES --> chrome-devtools (20+ utilities)
|   +-- NO --> Continue
|
+-- WebSocket debugging?
|   +-- YES --> chrome-devtools (full frames)
|   +-- NO --> Continue
|
+-- Screenshot auto-compression?
|   +-- YES --> chrome-devtools (Sharp)
|   +-- NO --> agent-browser OR chrome-devtools
```

## Parallel Usage Patterns

Both skills can coexist - use the right tool for each task:

```bash
# Quick screenshot with compression -> chrome-devtools
node "$SKILL_DIR/screenshot.js" --url https://example.com --output ss.png

# Long autonomous session -> agent-browser
agent-browser --session test1 open https://example.com
agent-browser snapshot -i
# ... many interactions ...
agent-browser close
```

## Migration Guide

### From chrome-devtools to agent-browser

| chrome-devtools | agent-browser |
|-----------------|---------------|
| `node navigate.js --url X` | `agent-browser open X` |
| `node aria-snapshot.js --url X` | `agent-browser open X && agent-browser snapshot -i` |
| `node select-ref.js --ref e5 --action click` | `agent-browser click @e5` |
| `node fill.js --selector "#email" --value "X"` | `agent-browser fill @e1 "X"` |
| `node screenshot.js --output X.png` | `agent-browser screenshot -o X.png` |
| `node console.js --types error` | No direct equivalent |
| `node network.js` | No direct equivalent |

### Key Differences

1. **Refs format:** `[ref=e5]` vs `@e5`
2. **Session:** File-based vs named sessions
3. **Commands:** Node scripts vs CLI commands
4. **Output:** JSON always vs JSON with `--json` flag

## When to Switch

**Switch to agent-browser when:**
- Starting new long-running automation
- Need video recording capability
- Moving to cloud browsers (Browserbase)
- Want simpler CLI syntax

**Keep chrome-devtools when:**
- Existing workflows depend on custom scripts
- Need WebSocket full-frame debugging
- Need automatic screenshot compression
- Need fine-grained console log filtering


### browserbase cloud setup

# Browserbase Cloud Setup

Configure agent-browser to use Browserbase cloud browsers for CI/CD and headless environments.

## Overview

Browserbase provides remote browser infrastructure. Use when:
- Running in CI/CD pipelines
- Local browser not available
- Need consistent browser environment
- Scaling parallel browser sessions

## Account Setup

1. Sign up at [browserbase.com](https://browserbase.com)
2. Create a project
3. Get API key from dashboard
4. Note your project ID

## Environment Variables

```bash
# Required
export BROWSERBASE_API_KEY="bb_live_xxxxxxxxxxxxx"
export BROWSERBASE_PROJECT_ID="proj_xxxxxxxxxxxxx"

# Optional: set provider default
export AGENT_BROWSER_PROVIDER="browserbase"
```

## Usage

### Explicit Provider Flag
```bash
agent-browser -p browserbase open https://example.com
agent-browser snapshot -i
agent-browser click @e1
agent-browser close
```

### With Default Provider (env var)
```bash
# After setting AGENT_BROWSER_PROVIDER=browserbase
agent-browser open https://example.com  # Uses Browserbase automatically
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Browser Tests
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install agent-browser
        run: npm install -g agent-browser

      - name: Run browser tests
        env:
          BROWSERBASE_API_KEY: ${{ secrets.BROWSERBASE_API_KEY }}
          BROWSERBASE_PROJECT_ID: ${{ secrets.BROWSERBASE_PROJECT_ID }}
          AGENT_BROWSER_PROVIDER: browserbase
        run: |
          agent-browser open https://example.com
          agent-browser snapshot -i
          agent-browser screenshot -o screenshot.png
          agent-browser close

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: screenshots
          path: screenshot.png
```

### GitLab CI
```yaml
browser-test:
  image: node:20
  variables:
    AGENT_BROWSER_PROVIDER: browserbase
  script:
    - npm install -g agent-browser
    - agent-browser open https://example.com
    - agent-browser snapshot -i
    - agent-browser close
  artifacts:
    paths:
      - "*.png"
```

## Session Management

Browserbase sessions are managed automatically. Each `open` creates a new session, `close` terminates it.

```bash
# Long-running session
agent-browser -p browserbase open https://example.com
# ... many commands ...
agent-browser close  # Terminates Browserbase session
```

## Parallel Sessions

Use named sessions for parallel browser instances:

```bash
# Session 1
agent-browser -p browserbase --session user1 open https://example.com

# Session 2 (separate terminal/process)
agent-browser -p browserbase --session user2 open https://example.com
```

## Debugging

### View Session Logs
Check Browserbase dashboard for:
- Session recordings
- Network logs
- Console output
- Screenshots

### Local Fallback
If Browserbase unavailable, remove provider flag to use local browser:
```bash
agent-browser open https://example.com  # Uses local Chromium
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Authentication failed | Verify API key is correct and not expired |
| Project not found | Check BROWSERBASE_PROJECT_ID matches dashboard |
| Connection timeout | Check network/firewall allows outbound connections |
| Session limit reached | Upgrade Browserbase plan or wait for sessions to expire |
| Commands hang | Ensure previous session closed properly |

## Pricing Considerations

- Browserbase charges per session minute
- Close sessions promptly with `agent-browser close`
- Use local browser for development, cloud for CI/CD
- Monitor usage in Browserbase dashboard

## Resources

- [Browserbase Documentation](https://docs.browserbase.com/)
- [Browserbase Dashboard](https://browserbase.com/dashboard)
- [agent-browser GitHub](https://github.com/vercel-labs/agent-browser)




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
