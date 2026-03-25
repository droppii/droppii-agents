---
name: ck:mcp-management
description: Manage MCP servers - discover, analyze, execute tools/prompts/resources. Use for MCP integrations, intelligent tool selection, multi-server management, context-efficient capability discovery.
argument-hint: "[task or server-name]"
---

# MCP Management

Skill for managing and interacting with Model Context Protocol (MCP) servers.

## Overview

MCP is an open protocol enabling AI agents to connect to external tools and data sources. This skill provides scripts and utilities to discover, analyze, and execute MCP capabilities from configured servers without polluting the main context window.

**Key Benefits**:
- Progressive disclosure of MCP capabilities (load only what's needed)
- Intelligent tool/prompt/resource selection based on task requirements
- Multi-server management from single config file
- Context-efficient: subagents handle MCP discovery and execution
- Persistent tool catalog: automatically saves discovered tools to JSON for fast reference

## When to Use This Skill

Use this skill when:
1. **Discovering MCP Capabilities**: Need to list available tools/prompts/resources from configured servers
2. **Task-Based Tool Selection**: Analyzing which MCP tools are relevant for a specific task
3. **Executing MCP Tools**: Calling MCP tools programmatically with proper parameter handling
4. **MCP Integration**: Building or debugging MCP client implementations
5. **Context Management**: Avoiding context pollution by delegating MCP operations to subagents

## Core Capabilities

### 1. Configuration Management

MCP servers configured in `.claude/.mcp.json`.

**Gemini CLI Integration** (recommended): Create symlink to `.gemini/settings.json`:
```bash
mkdir -p .gemini && ln -sf .claude/.mcp.json .gemini/settings.json
```

See [references/configuration.md](references/configuration.md) and [references/gemini-cli-integration.md](references/gemini-cli-integration.md).

**GEMINI.md Response Format**: Project root contains `GEMINI.md` that Gemini CLI auto-loads, enforcing structured JSON responses:
```json
{"server":"name","tool":"name","success":true,"result":<data>,"error":null}
```

This ensures parseable, consistent output instead of unpredictable natural language. The file defines:
- Mandatory JSON-only response format (no markdown, no explanations)
- Maximum 500 character responses
- Error handling structure
- Available MCP servers reference

**Benefits**: Programmatically parseable output, consistent error reporting, DRY configuration (format defined once), context-efficient (auto-loaded by Gemini CLI).

### 2. Capability Discovery

```bash
npx tsx scripts/cli.ts list-tools  # Saves to assets/tools.json
npx tsx scripts/cli.ts list-prompts
npx tsx scripts/cli.ts list-resources
```

Aggregates capabilities from multiple servers with server identification.

### 3. Intelligent Tool Analysis

LLM analyzes `assets/tools.json` directly - better than keyword matching algorithms.

### 4. Tool Execution

**Primary: Gemini CLI** (if available)
```bash
# IMPORTANT: Use stdin piping, NOT -p flag (deprecated, skips MCP init)
echo "Take a screenshot of https://example.com" | gemini -y -m <gemini.model>
```

**Secondary: Direct Scripts**
```bash
npx tsx scripts/cli.ts call-tool memory create_entities '{"entities":[...]}'
```

**Fallback: mcp-manager Subagent**

See [references/gemini-cli-integration.md](references/gemini-cli-integration.md) for complete examples.

## Implementation Patterns

### Pattern 1: Gemini CLI Auto-Execution (Primary)

Use Gemini CLI for automatic tool discovery and execution. Gemini CLI auto-loads `GEMINI.md` from project root to enforce structured JSON responses.

**Quick Example**:
```bash
# IMPORTANT: Use stdin piping, NOT -p flag (deprecated, skips MCP init)
# Add "Return JSON only per GEMINI.md instructions" to enforce structured output
echo "Take a screenshot of https://example.com. Return JSON only per GEMINI.md instructions." | gemini -y -m <gemini.model>
```

**Expected Output**:
```json
{"server":"puppeteer","tool":"screenshot","success":true,"result":"screenshot.png","error":null}
```

**Benefits**:
- Automatic tool discovery
- Structured JSON responses (parseable by Claude)
- GEMINI.md auto-loaded for consistent formatting
- Faster than subagent orchestration
- No natural language ambiguity

See [references/gemini-cli-integration.md](references/gemini-cli-integration.md) for complete guide.

### Pattern 2: Subagent-Based Execution (Fallback)

Use `mcp-manager` agent when Gemini CLI unavailable. Subagent discovers tools, selects relevant ones, executes tasks, reports back.

**Benefit**: Main context stays clean, only relevant tool definitions loaded when needed.

### Pattern 3: LLM-Driven Tool Selection

LLM reads `assets/tools.json`, intelligently selects relevant tools using context understanding, synonyms, and intent recognition.

### Pattern 4: Multi-Server Orchestration

Coordinate tools across multiple servers. Each tool knows its source server for proper routing.

## Scripts Reference

### scripts/mcp-client.ts

Core MCP client manager class. Handles:
- Config loading from `.claude/.mcp.json`
- Connecting to multiple MCP servers
- Listing tools/prompts/resources across all servers
- Executing tools with proper error handling
- Connection lifecycle management

### scripts/cli.ts

Command-line interface for MCP operations. Commands:
- `list-tools` - Display all tools and save to `assets/tools.json`
- `list-prompts` - Display all prompts
- `list-resources` - Display all resources
- `call-tool <server> <tool> <json>` - Execute a tool

**Note**: `list-tools` persists complete tool catalog to `assets/tools.json` with full schemas for fast reference, offline browsing, and version control.

## Quick Start

**Method 1: Gemini CLI** (recommended)
```bash
npm install -g gemini-cli
mkdir -p .gemini && ln -sf .claude/.mcp.json .gemini/settings.json
# IMPORTANT: Use stdin piping, NOT -p flag (deprecated, skips MCP init)
# GEMINI.md auto-loads to enforce JSON responses
echo "Take a screenshot of https://example.com. Return JSON only per GEMINI.md instructions." | gemini -y -m <gemini.model>
```

Returns structured JSON: `{"server":"puppeteer","tool":"screenshot","success":true,"result":"screenshot.png","error":null}`

**Method 2: Scripts**
```bash
cd .claude/skills/mcp-management/scripts && npm install
npx tsx cli.ts list-tools  # Saves to assets/tools.json
npx tsx cli.ts call-tool memory create_entities '{"entities":[...]}'
```

**Method 3: mcp-manager Subagent**

See [references/gemini-cli-integration.md](references/gemini-cli-integration.md) for complete guide.

## Technical Details

See [references/mcp-protocol.md](references/mcp-protocol.md) for:
- JSON-RPC protocol details
- Message types and formats
- Error codes and handling
- Transport mechanisms (stdio, HTTP+SSE)
- Best practices

## Integration Strategy

### Execution Priority

1. **Gemini CLI** (Primary): Fast, automatic, intelligent tool selection
   - Check: `command -v gemini`
   - Execute: `echo "<task>" | gemini -y -m <gemini.model>`
   - **IMPORTANT**: Use stdin piping, NOT `-p` flag (deprecated, skips MCP init)
   - Best for: All tasks when available

2. **Direct CLI Scripts** (Secondary): Manual tool specification
   - Use when: Need specific tool/server control
   - Execute: `npx tsx scripts/cli.ts call-tool <server> <tool> <args>`

3. **mcp-manager Subagent** (Fallback): Context-efficient delegation
   - Use when: Gemini unavailable or failed
   - Keeps main context clean

### Integration with Agents

The `mcp-manager` agent uses this skill to:
- Check Gemini CLI availability first
- Execute via `gemini` command if available
- Fallback to direct script execution
- Discover MCP capabilities without loading into main context
- Report results back to main agent

This keeps main agent context clean and enables efficient MCP integration.


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### configuration

# MCP Configuration Guide

## Configuration File Structure

MCP servers are configured in `.claude/.mcp.json`:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "executable",
      "args": ["arg1", "arg2"],
      "env": {
        "API_KEY": "value"
      }
    }
  }
}
```

## Common Server Configurations

### Memory Server

Store and retrieve key-value data:

```json
{
  "memory": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-memory"]
  }
}
```

### Filesystem Server

File operations with restricted access:

```json
{
  "filesystem": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/allowed/path"
    ]
  }
}
```

### Brave Search Server

Web search capabilities:

```json
{
  "brave-search": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-brave-search"],
    "env": {
      "BRAVE_API_KEY": "${BRAVE_API_KEY}"
    }
  }
}
```

### Puppeteer Server

Browser automation:

```json
{
  "puppeteer": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
  }
}
```

## Environment Variables

Reference env vars with `${VAR_NAME}` syntax:

```json
{
  "api-server": {
    "command": "node",
    "args": ["server.js"],
    "env": {
      "API_KEY": "${MY_API_KEY}",
      "BASE_URL": "${API_BASE_URL}"
    }
  }
}
```

## Configuration Loading Order

Scripts check for config in this order:

1. `process.env` (runtime environment)
2. `.claude/skills/mcp-management/.env`
3. `.claude/skills/.env`
4. `.claude/.env`

## Validation

Config must:
- Be valid JSON
- Include `mcpServers` object
- Each server must have `command` and `args`
- `env` is optional but must be object if present


### gemini cli integration

# Gemini CLI Integration Guide

## Model Configuration

Read model from `.claude/.ck.json`: `gemini.model` (default: `gemini-3-flash-preview`)

## ⚠️ CRITICAL: Use Stdin Piping, NOT -p Flag

The `-p` flag is **deprecated** and skips MCP server initialization, causing tools to be unavailable:

```bash
# ❌ WRONG - Deprecated -p flag skips MCP connections!
gemini -y -m <gemini.model> -p "Take a screenshot"
# Also wrong: Using --model instead of -m
gemini -y -p "Take a screenshot" --model gemini-3-flash-preview

# ✅ CORRECT - This initializes MCP servers
echo "Take a screenshot" | gemini -y -m <gemini.model>
```

**Why**: The `-p` flag runs in "quick mode" and bypasses MCP server connection initialization. Always use stdin piping (echo + pipe) to ensure MCP tools are available.

## Overview

Gemini CLI provides automatic MCP tool discovery and execution via natural language prompts. This is the recommended primary method for executing MCP tools.

## Installation

```bash
npm install -g gemini-cli
```

Verify installation:
```bash
gemini --version
```

## Configuration

### Symlink Setup

Gemini CLI reads MCP servers from `.gemini/settings.json`. Create a symlink to `.claude/.mcp.json`:

```bash
# Create .gemini directory
mkdir -p .gemini

# Create symlink (Unix/Linux/macOS)
ln -sf .claude/.mcp.json .gemini/settings.json

# Create symlink (Windows - requires admin or developer mode)
mklink .gemini\settings.json .claude\.mcp.json
```

### Security

Add to `.gitignore`:
```
.gemini/settings.json
```

This prevents committing sensitive API keys and server configurations.

## Usage

### Basic Syntax

```bash
# IMPORTANT: Use stdin piping, NOT -p flag (deprecated, skips MCP init)
echo "<prompt>" | gemini [flags]
```

### Essential Flags

- `-y`: Skip confirmation prompts (auto-approve tool execution)
- `-m <model>`: Model selection
  - `gemini-3-flash-preview` (fast, recommended for MCP)
  - `gemini-3-pro-preview` (balanced)
  - `gemini-pro` (high quality)

### Examples

**Screenshot Capture**:
```bash
echo "Take a screenshot of https://www.google.com.vn" | gemini -y -m <gemini.model>
```

**Memory Operations**:
```bash
echo "Remember that Alice is a React developer working on e-commerce projects" | gemini -y -m <gemini.model>
```

**Web Research**:
```bash
echo "Search for latest Next.js 15 features and summarize the top 3" | gemini -y -m <gemini.model>
```

**Multi-Tool Orchestration**:
```bash
echo "Search for Claude AI documentation, take a screenshot of the homepage, and save both to memory" | gemini -y -m <gemini.model>
```

**Browser Automation**:
```bash
echo "Navigate to https://example.com, click the signup button, and take a screenshot" | gemini -y -m <gemini.model>
```

## How It Works

1. **Configuration Loading**: Reads `.gemini/settings.json` (symlinked to `.claude/.mcp.json`)
2. **Server Connection**: Connects to all configured MCP servers
3. **Tool Discovery**: Lists all available tools from servers
4. **Prompt Analysis**: Gemini model analyzes the prompt
5. **Tool Selection**: Automatically selects relevant tools
6. **Execution**: Calls tools with appropriate parameters
7. **Result Synthesis**: Combines tool outputs into coherent response

## Advanced Configuration

### Trusted Servers (Skip Confirmations)

Edit `.claude/.mcp.json`:

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "trust": true
    }
  }
}
```

With `trust: true`, the `-y` flag is unnecessary.

### Tool Filtering

Limit tool exposure:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"],
      "includeTools": ["navigate_page", "screenshot"],
      "excludeTools": ["evaluate_js"]
    }
  }
}
```

### Environment Variables

Use `$VAR_NAME` syntax for sensitive data:

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "$BRAVE_API_KEY"
      }
    }
  }
}
```

## Troubleshooting

### Check MCP Status

```bash
gemini
> /mcp
```

Shows:
- Connected servers
- Available tools
- Configuration errors

### Verify Symlink

```bash
# Unix/Linux/macOS
ls -la .gemini/settings.json

# Windows
dir .gemini\settings.json
```

Should show symlink pointing to `.claude/.mcp.json`.

### Debug Mode

```bash
echo "Take a screenshot" | gemini --debug
```

Shows detailed MCP communication logs.

## Comparison with Alternatives

| Method | Speed | Flexibility | Setup | Best For |
|--------|-------|-------------|-------|----------|
| Gemini CLI | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | All tasks |
| Direct Scripts | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Specific tools |
| mcp-manager | ⭐ | ⭐⭐ | ⭐⭐⭐ | Fallback |

**Recommendation**: Use Gemini CLI as primary method, fallback to scripts/subagent when unavailable.

## Resources

- [Gemini CLI Documentation](https://geminicli.com/docs)
- [MCP Server Configuration](https://geminicli.com/docs/tools/mcp-server)
- [Tool Reference](https://geminicli.com/docs/tools/mcp-server/#tool-interaction)


### mcp protocol

# Model Context Protocol (MCP) Reference

## Protocol Overview

MCP is JSON-RPC 2.0 based protocol for AI-tool integration.

**Version**: 2025-03-26
**Foundation**: JSON-RPC 2.0
**Architecture**: Client-Host-Server

## Connection Lifecycle

1. **Initialize**: Client sends `initialize` request with capabilities
2. **Response**: Server responds with its capabilities
3. **Handshake**: Client sends `notifications/initialized`
4. **Active**: Bidirectional messaging
5. **Shutdown**: Close connections, cleanup

## Core Capabilities

### Tools (Executable Functions)

Tools are functions that servers expose for execution.

**List Tools**:
```json
{"method": "tools/list"}
```

**Call Tool**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "tool_name",
    "arguments": {}
  }
}
```

### Prompts (Interaction Templates)

Prompts are reusable templates for LLM interactions.

**List Prompts**:
```json
{"method": "prompts/list"}
```

**Get Prompt**:
```json
{
  "method": "prompts/get",
  "params": {
    "name": "prompt_name",
    "arguments": {}
  }
}
```

### Resources (Data Sources)

Resources expose read-only data to clients.

**List Resources**:
```json
{"method": "resources/list"}
```

**Read Resource**:
```json
{
  "method": "resources/read",
  "params": {"uri": "resource://path"}
}
```

## Transport Types

### stdio (Local)

Server runs as subprocess. Messages via stdin/stdout.

```typescript
const transport = new StdioClientTransport({
  command: 'node',
  args: ['server.js']
});
```

### HTTP+SSE (Remote)

POST for requests, GET for server events.

```typescript
const transport = new StreamableHTTPClientTransport({
  url: 'http://localhost:3000/mcp'
});
```

## Error Codes

- **-32700**: Parse error
- **-32600**: Invalid request
- **-32601**: Method not found
- **-32602**: Invalid params
- **-32603**: Internal error
- **-32002**: Resource not found (MCP-specific)

## Best Practices

1. **Progressive Disclosure**: Load tool definitions on-demand
2. **Context Efficiency**: Filter data before returning
3. **Security**: Validate inputs, sanitize outputs
4. **Resource Management**: Cleanup connections properly
5. **Error Handling**: Handle all error cases gracefully




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
