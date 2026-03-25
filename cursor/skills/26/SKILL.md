---
name: ck:gkg
description: Semantic code analysis with GitLab Knowledge Graph. Use for go-to-definition, find-usages, impact analysis, architecture visualization. Supports Ruby, Java, Kotlin, Python, TypeScript/JavaScript.
argument-hint: "[symbol or query]"
---

# GitLab Knowledge Graph (GKG)

Semantic code analysis engine using AST parsing and KuzuDB graph database. Enables IDE-like code navigation for AI assistants.

**Status**: Public beta | **Requires**: Git repository | **Storage**: `~/.gkg/`

## When to Use

- Find all usages of a function/class across codebase
- Go-to-definition for symbols
- Impact analysis before refactoring
- Generate architecture diagrams
- RAG-enhanced code understanding

**Use repomix instead** for: quick context dumps, any-language support, remote repos, token counting.

## Quick Start

```bash
# Check installation
gkg --version

# Index current repo
gkg index

# Start server (for API/MCP)
gkg server start

# Stop before re-indexing
gkg server stop
```

## Installation

```bash
# macOS/Linux
curl -fsSL https://gitlab.com/gitlab-org/rust/knowledge-graph/-/raw/main/install.sh | bash

# Windows (PowerShell)
irm https://gitlab.com/gitlab-org/rust/knowledge-graph/-/raw/main/install.ps1 | iex
```

## Core Workflows

### Index and Query
```bash
gkg index /path/to/project --stats
gkg server start
# Query via HTTP API at http://localhost:27495
```

### Find Symbol Usages
1. Index project: `gkg index`
2. Start server: `gkg server start`
3. Use MCP tool `get_references` or HTTP API `/api/graph/search`

### Impact Analysis
1. Index affected repos
2. Query `get_references` for changed symbols
3. Review all call sites before refactoring

## Language Support

| Language | Cross-file Refs |
|----------|-----------------|
| Ruby | ✅ Full |
| Java | ✅ Full |
| Kotlin | ✅ Full |
| Python | 🚧 In progress |
| TypeScript | 🚧 In progress |
| JavaScript | 🚧 In progress |

## References

- [CLI Commands](./references/cli-commands.md) - `gkg index`, `gkg server`, `gkg remove`, `gkg clean`
- [MCP Tools](./references/mcp-tools.md) - 7 tools for AI integration
- [HTTP API](./references/http-api.md) - REST endpoints for querying
- [Language Details](./references/language-support.md) - Supported features per language

## Key Constraints

- Must stop server before re-indexing
- Requires initialized Git repository
- Languages not connected across repos (yet)
- TS/JS/Python cross-file refs incomplete


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### cli commands

# GKG CLI Commands

## gkg index

Index repositories into knowledge graph.

```bash
# Index current directory
gkg index

# Index specific path
gkg index /path/to/workspace

# With statistics output
gkg index --stats

# Save stats as JSON
gkg index --stats stats.json

# Verbose logging
gkg index -v

# Control thread count (default: CPU cores)
gkg index --threads 4
```

**Auto-detection**: Detects if path is workspace (multiple repos) or single repository.

**Output location**: `~/.gkg/{workspace_hash}/{project_hash}/`

## gkg server

Start HTTP server for API and MCP access.

```bash
# Start server (default: http://localhost:27495)
gkg server start

# Start with MCP endpoints
gkg server start --register-mcp

# Stop server
gkg server stop

# Check status
gkg server status
```

**Port**: 27495 (0x6b67 = "kg" in hex). Falls back to unused port if busy.

**Important**: Stop server before re-indexing: `gkg server stop`

## gkg remove

Remove indexed data.

```bash
# Remove entire workspace
gkg remove --workspace /path/to/workspace

# Remove single project
gkg remove --project /path/to/project --workspace-folder /path/to/workspace
```

## gkg clean

Clean orphaned or corrupted data.

```bash
# Clean all orphaned data
gkg clean

# Dry run (preview only)
gkg clean --dry-run
```

## Common Workflows

### Initial Setup
```bash
cd /my/project
gkg index --stats
gkg server start
```

### Re-index After Changes
```bash
gkg server stop
gkg index
gkg server start
```

### Multi-repo Workspace
```bash
# Index parent directory containing multiple repos
gkg index /path/to/workspace
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| High memory | Reduce `--threads` |
| Slow indexing | Increase `--threads` or use `-v` |
| Server conflict | Run `gkg server stop` first |
| Stale data | Run `gkg clean` |


### http api

# GKG HTTP API

Base URL: `http://localhost:27495`

## Server Info

```
GET /api/info
```
Returns port, version.

## Workspace Management

### List Workspaces
```
GET /api/workspace/list
```
Returns all indexed workspaces and projects.

### Index Workspace
```
POST /api/workspace/index
Content-Type: application/json

{"path": "/path/to/workspace"}
```
Index or re-index workspace.

### Delete Workspace
```
DELETE /api/workspace/delete
Content-Type: application/json

{"path": "/path/to/workspace"}
```

### Delete Project
```
DELETE /api/project/delete
Content-Type: application/json

{
  "project_path": "/path/to/project",
  "workspace_path": "/path/to/workspace"
}
```

## Graph Queries

### Initial Graph Data
```
GET /api/graph/initial?project=/path/to/project
```
Fetch visualization starting data.

### Neighbors
```
GET /api/graph/neighbors?node_id=xxx&project=/path
```
Get connected nodes for exploration.

### Search
```
GET /api/graph/search?pattern=MyClass&project=/path
```
Search definitions by pattern.

### Statistics
```
GET /api/graph/stats?project=/path
```
Returns: files, definitions, relationships counts.

## Real-time Events

```
GET /api/events
```
Server-Sent Events stream. Event types:
- `gkg-connection`: Connection status
- `gkg-event`: Indexing progress updates

## Error Handling

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 400 | Bad request |
| 404 | Not found |
| 500 | Server error |

Response format:
```json
{
  "error": "message",
  "code": "ERROR_CODE"
}
```

## CORS

Accepts localhost origins. No authentication required locally.


### language support

# GKG Language Support

## Support Matrix

| Language | Definitions | Imports | Intra-file Refs | Cross-file Refs |
|----------|-------------|---------|-----------------|-----------------|
| Ruby | ✅ | ✅ | ✅ | ✅ |
| Java | ✅ | ✅ | ✅ | ✅ |
| Kotlin | ✅ | ✅ | ✅ | ✅ |
| Python | ✅ | ✅ | ✅ | 🚧 |
| TypeScript | ✅ | ✅ | ✅ | 🚧 |
| JavaScript | ✅ | ✅ | ✅ | 🚧 |

## Feature Definitions

**Definitions**: Classes, functions, methods, constants, interfaces extracted from AST.

**Imports**: Module/package imports tracked for dependency analysis.

**Intra-file Refs**: References to symbols within same file.

**Cross-file Refs**: References to symbols defined in other files. Critical for impact analysis.

## Fully Supported (Ruby, Java, Kotlin)

Complete semantic analysis:
- Go-to-definition across files
- Find all usages across codebase
- Full dependency graph
- Impact analysis for refactoring

## Partially Supported (Python, TS/JS)

Current capabilities:
- Definition extraction works
- Import tracking works
- Same-file reference tracking works

Limitations:
- Cross-file `get_references` may miss some usages
- `get_definition` may not resolve all external symbols
- Use with awareness of gaps

## Best Practices

### For Full Support Languages
Use all MCP tools confidently for complete analysis.

### For Partial Support Languages
1. Verify critical refactoring impacts manually
2. Use `search_codebase_definitions` for discovery
3. Cross-reference with `grep` for completeness
4. Supplement with repomix for context dumps

## Future Plans

Cross-file reference support for Python/TS/JS under active development. Check [GitLab Knowledge Graph](https://gitlab.com/gitlab-org/rust/knowledge-graph) for updates.


### mcp tools

# GKG MCP Tools

7 Model Context Protocol tools for AI assistants. Available when server runs with `--register-mcp`.

## Endpoints

- **HTTP**: `http://localhost:27495/mcp`
- **SSE**: `http://localhost:27495/mcp/sse`

## Tools

### list_projects

List all indexed projects with paths.

**Use**: Discover available codebases before analysis.

**Returns**: Project names and absolute paths.

### search_codebase_definitions

Search for functions, classes, methods, constants, interfaces.

**Parameters**:
- `query`: Search terms
- `limit`: Max results (pagination)

**Use**: Find symbol definitions by name pattern.

**Returns**: Matching definitions with FQN and locations.

### index_project

Re-index a project to reflect code changes.

**Parameters**:
- `project_path`: Path to project

**Use**: Update graph after code modifications.

**Returns**: Statistics (files processed, definitions found).

### get_references

Find all usages of a specific definition.

**Parameters**:
- `definition_id`: Symbol identifier
- `project_path`: Project context

**Use**: Impact analysis, find call sites before refactoring.

**Returns**: All locations where symbol is referenced.

### read_definitions

Retrieve complete source code for multiple symbols.

**Parameters**:
- `definition_ids`: List of symbol IDs

**Use**: Batch-read implementations. Token-efficient for same-file symbols.

**Returns**: Full definition bodies.

### get_definition

Navigate to definition of a call on specific line.

**Parameters**:
- `file_path`: Source file
- `line`: Line number
- `column`: Column position

**Use**: Go-to-definition for function/method calls.

**Returns**: Definition location (handles workspace and external deps).

### repo_map

Generate token-efficient ASCII tree of repository structure.

**Parameters**:
- `project_path`: Repository path
- `depth`: Tree depth limit

**Use**: Quick codebase overview for LLMs.

**Returns**: Compact tree with condensed definitions, human-readable.

## Integration Pattern

```
1. list_projects → discover codebases
2. search_codebase_definitions → find symbols
3. read_definitions → get implementations
4. get_references → find usages
5. repo_map → architecture overview
```




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
