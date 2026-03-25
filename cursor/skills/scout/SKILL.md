---
name: ck:scout
description: "Fast codebase scouting using parallel agents. Use for file discovery, task context gathering, quick searches across directories. Supports internal (Explore) and external (Gemini/OpenCode) agents."
version: 1.0.0
argument-hint: "[search-target] [ext]"
---

# Scout

Fast, token-efficient codebase scouting using parallel agents to find files needed for tasks.

## Arguments
- Default: Scout using built-in Explore subagents in parallel (`./references/internal-scouting.md`)
- `ext`: Scout using external Gemini/OpenCode CLI tools in parallel (`./references/external-scouting.md`)

## When to Use

- Beginning work on feature spanning multiple directories
- User mentions needing to "find", "locate", or "search for" files
- Starting debugging session requiring file relationships understanding
- User asks about project structure or where functionality lives
- Before changes that might affect multiple codebase parts

## Quick Start

1. Analyze user prompt to identify search targets
2. Use a wide range of Grep and Glob patterns to find relevant files and estimate scale of the codebase
3. Spawn parallel agents with divided directories
4. Collect results into concise report

## Configuration

Read from `.claude/.ck.json`:
- `gemini.model` - Gemini model (default: `gemini-3-flash-preview`)

## Workflow

### 1. Analyze Task
- Parse user prompt for search targets
- Identify key directories, patterns, file types, lines of code
- Determine optimal SCALE value of subagents to spawn

### 2. Divide and Conquer
- Split codebase into logical segments per agent
- Assign each agent specific directories or patterns
- Ensure no overlap, maximize coverage

### 3. Register Scout Tasks
- **Skip if:** Agent count ≤ 2 (overhead exceeds benefit)
- `TaskList` first — check for existing scout tasks in session
- If not found, `TaskCreate` per agent with scope metadata
- See `references/task-management-scouting.md` for patterns and examples

### 4. Spawn Parallel Agents
Load appropriate reference based on decision tree:
- **Internal (Default):** `references/internal-scouting.md` (Explore subagents)
- **External:** `references/external-scouting.md` (Gemini/OpenCode)

**Notes:**
- `TaskUpdate` each task to `in_progress` before spawning its agent
- Prompt detailed instructions for each subagent with exact directories or files it should read
- Remember that each subagent has less than 200K tokens of context window
- Amount of subagents to-be-spawned depends on the current system resources available and amount of files to be scanned
- Each subagent must return a detailed summary report to a main agent

### 5. Collect Results
- Timeout: 3 minutes per agent (skip non-responders)
- `TaskUpdate` completed tasks; log timed-out agents in report
- Aggregate findings into single report
- List unresolved questions at end

## Report Format

```markdown
# Scout Report

## Relevant Files
- `path/to/file.ts` - Brief description
- ...

## Unresolved Questions
- Any gaps in findings
```

## References

- `references/internal-scouting.md` - Using Explore subagents
- `references/external-scouting.md` - Using Gemini/OpenCode CLI
- `references/task-management-scouting.md` - Claude Task patterns for scout coordination


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### external scouting

# External Scouting with Gemini/OpenCode

Use external agentic tools for faster searches with large context windows (1M+ tokens).

## Tool Selection

```
SCALE <= 3  → gemini CLI
SCALE 4-5   → opencode CLI
SCALE >= 6  → Use internal scouting instead
```

## Configuration

Read from `.claude/.ck.json`:
```json
{
  "gemini": {
    "model": "gemini-3-flash-preview"
  }
}
```

Default model: `gemini-3-flash-preview`

## Gemini CLI (SCALE <= 3)

### Command
```bash
gemini -y -m <model> "[prompt]"
```

### Example
```bash
gemini -y -m gemini-3-flash-preview "Search src/ for authentication files. List paths with brief descriptions."
```

## OpenCode CLI (SCALE 4-5)

### Command
```bash
opencode run "[prompt]" --model opencode/grok-code
```

### Example
```bash
opencode run "Find all payment-related files in lib/ and api/" --model opencode/grok-code
```

## Installation Check

Before using, verify tools installed:
```bash
which gemini
which opencode
```

If not installed, ask user:
1. **Yes** - Provide installation instructions (may need manual auth steps)
2. **No** - Fall back to Explore subagents (`internal-scouting.md`)

## Spawning Parallel Bash Agents

Use `Task` tool with `subagent_type: "Bash"` to spawn parallel agents:

```
Task 1: subagent_type="Bash", prompt="Run: gemini -y -m gemini-3-flash-preview '[prompt1]'"
Task 2: subagent_type="Bash", prompt="Run: gemini -y -m gemini-3-flash-preview '[prompt2]'"
Task 3: subagent_type="Bash", prompt="Run: gemini -y -m gemini-3-flash-preview '[prompt3]'"
```

Spawn all in single message for parallel execution.

## Prompt Guidelines

- Be specific about directories to search
- Request file paths with descriptions
- Set clear scope boundaries
- Ask for patterns/relationships if relevant

## Example Workflow

User: "Find database migration files"

Spawn 3 parallel Bash agents via Task tool:
```
Task 1 (Bash): "Run: gemini -y -m gemini-3-flash-preview 'Search db/, migrations/ for migration files'"
Task 2 (Bash): "Run: gemini -y -m gemini-3-flash-preview 'Search lib/, src/ for database schema files'"
Task 3 (Bash): "Run: gemini -y -m gemini-3-flash-preview 'Search config/ for database configuration'"
```

## Reading File Content

When needing to read file content, use chunking to stay within context limits (<150K tokens safe zone).

### Step 1: Get Line Counts
```bash
wc -l path/to/file1.ts path/to/file2.ts path/to/file3.ts
```

### Step 2: Calculate Chunks
- **Target:** ~500 lines per chunk (safe for most files)
- **Max files per agent:** 3-5 small files OR 1 large file chunked

**Chunking formula:**
```
chunks = ceil(total_lines / 500)
lines_per_chunk = ceil(total_lines / chunks)
```

### Step 3: Spawn Parallel Bash Agents

**Small files (<500 lines each):**
```
Task 1: subagent_type="Bash", prompt="cat file1.ts file2.ts"
Task 2: subagent_type="Bash", prompt="cat file3.ts file4.ts"
```

**Large file (>500 lines) - use sed for ranges:**
```
Task 1: subagent_type="Bash", prompt="sed -n '1,500p' large-file.ts"
Task 2: subagent_type="Bash", prompt="sed -n '501,1000p' large-file.ts"
Task 3: subagent_type="Bash", prompt="sed -n '1001,1500p' large-file.ts"
```

### Chunking Decision Tree
```
File < 500 lines     → Read entire file
File 500-1500 lines  → Split into 2-3 chunks
File > 1500 lines    → Split into ceil(lines/500) chunks
```

Spawn all in single message for parallel execution.

## Timeout and Error Handling

- Set 3-minute timeout per bash call
- Skip timed-out agents
- Don't restart failed agents
- On persistent failures, fall back to internal scouting


### internal scouting

# Internal Scouting with Explore Subagents

Use Explore subagents when SCALE >= 6 or external tools unavailable.

## How It Works

Spawn multiple `Explore` subagents via `Task` tool to search codebase in parallel.

## Task Tool Configuration

```
subagent_type: "Explore"
```

## Prompt Template

```
Quickly scout {DIRECTORY} for files related to: {USER_PROMPT}

Instructions:
- Search for relevant files matching the task
- Use Glob/Grep for file discovery
- List files with brief descriptions
- Timeout: 3 minutes max
- Skip if timeout reached

Report format:
## Found Files
- `path/file.ext` - description

## Patterns
- Key patterns observed
```

## Spawning Strategy

### Directory Division
Split codebase logically:
- `src/` - Source code
- `lib/` - Libraries
- `tests/` - Test files
- `config/` - Configuration
- `api/` - API routes

### Parallel Execution
- Spawn all agents in single `Task` tool call
- Each agent gets distinct directory scope
- No overlap between agents

## Example

User prompt: "Find authentication-related files"

```
Agent 1: Scout src/auth/, src/middleware/ for auth files
Agent 2: Scout src/api/, src/routes/ for auth endpoints
Agent 3: Scout tests/ for auth tests
Agent 4: Scout lib/, utils/ for auth utilities
Agent 5: Scout config/ for auth configuration
Agent 6: Scout types/, interfaces/ for auth types
```

## Timeout Handling

- Set 3-minute timeout per agent
- Skip non-responding agents
- Don't restart timed-out agents
- Aggregate available results

## Reading File Content

When needing to read file content, use chunking to stay within context limits (<150K tokens safe zone).

### Step 1: Get Line Counts
```bash
wc -l path/to/file1.ts path/to/file2.ts path/to/file3.ts
```

### Step 2: Calculate Chunks
- **Target:** ~500 lines per chunk (safe for most files)
- **Max files per agent:** 3-5 small files OR 1 large file chunked

**Chunking formula:**
```
chunks = ceil(total_lines / 500)
lines_per_chunk = ceil(total_lines / chunks)
```

### Step 3: Spawn Parallel Bash Agents

**Small files (<500 lines each):**
```
Task 1: subagent_type="Bash", prompt="cat file1.ts file2.ts"
Task 2: subagent_type="Bash", prompt="cat file3.ts file4.ts"
```

**Large file (>500 lines) - use sed for ranges:**
```
Task 1: subagent_type="Bash", prompt="sed -n '1,500p' large-file.ts"
Task 2: subagent_type="Bash", prompt="sed -n '501,1000p' large-file.ts"
Task 3: subagent_type="Bash", prompt="sed -n '1001,1500p' large-file.ts"
```

### Chunking Decision Tree
```
File < 500 lines     → Read entire file
File 500-1500 lines  → Split into 2-3 chunks
File > 1500 lines    → Split into ceil(lines/500) chunks
```

Spawn all in single message for parallel execution.

## Result Aggregation

Combine results from all agents:
1. Deduplicate file paths
2. Merge descriptions
3. Note any gaps/timeouts
4. List unresolved questions


### task management scouting

# Scout Task Management Patterns

Track parallel scout agent execution via Claude Native Tasks (TaskCreate, TaskUpdate, TaskList).

## When to Create Tasks

| Agents | Create Tasks? | Rationale |
|--------|--------------|-----------|
| ≤ 2    | No           | Overhead exceeds benefit, finishes quickly |
| ≥ 3    | Yes          | Meaningful coordination, progress monitoring |

## Task Registration Flow

```
TaskList()                          // Check for existing scout tasks
  → Found tasks?  → Skip creation, reuse existing
  → Empty?        → TaskCreate per agent (see schema below)
```

## Metadata Schema

```
TaskCreate(
  subject: "Scout {directory} for {target}",
  activeForm: "Scouting {directory}",
  description: "Search {directories} for {patterns}",
  metadata: {
    agentType: "Explore",        // "Explore" (internal) or "Bash" (external)
    scope: "src/auth/,src/middleware/",
    scale: 6,
    agentIndex: 1,               // 1-indexed position
    totalAgents: 6,
    toolMode: "internal",        // "internal" or "external"
    priority: "P2",              // Always P2 for scout coordination
    effort: "3m"                 // Fixed timeout per agent
  }
)
```

### Required Fields

- `agentType` — Subagent type: `"Explore"` for internal, `"Bash"` for external
- `scope` — Comma-separated directory boundaries for this agent
- `scale` — Total SCALE value determined in Step 1
- `agentIndex` / `totalAgents` — Position tracking (e.g., 3 of 6)
- `toolMode` — `"internal"` or `"external"`
- `priority` — Always `"P2"` (scout = coordination, not primary work)
- `effort` — Always `"3m"` (fixed timeout)

### Optional Fields

- `searchPatterns` — Key patterns searched (aids debugging)
- `externalTool` — If external: `"gemini"` or `"opencode"`

## Task Lifecycle

```
Step 3: TaskCreate per agent     → status: pending
Step 4: Before spawning agent    → TaskUpdate → status: in_progress
Step 5: Agent returns report     → TaskUpdate → status: completed
Step 5: Agent times out (3m)     → Keep in_progress, add error metadata
```

### Timeout Handling

```
TaskUpdate(taskId, {
  metadata: { ...existing, error: "timeout" }
})
// Task stays in_progress — distinguishes timeout from incomplete
// Log in final report's "Unresolved Questions" section
```

## Examples

### Internal Scouting (SCALE=6)

```
// Step 3: Register 6 tasks
TaskCreate(subject: "Scout src/auth/ for auth files",
  activeForm: "Scouting src/auth/",
  metadata: { agentType: "Explore", scope: "src/auth/", scale: 6,
              agentIndex: 1, totalAgents: 6, toolMode: "internal",
              priority: "P2", effort: "3m" })  // → taskId1

// Repeat for agents 2-6 with different scopes

// Step 4: Spawn agents
TaskUpdate(taskId1, { status: "in_progress" })
// ... spawn all Explore subagents in single Task tool call

// Step 5: Collect
TaskUpdate(taskId1, { status: "completed" })  // report received
TaskUpdate(taskId3, { metadata: { error: "timeout" } })  // timed out
```

### External Scouting (SCALE=3, gemini)

```
TaskCreate(subject: "Scout db/ for migrations via gemini",
  activeForm: "Scouting db/ via gemini",
  metadata: { agentType: "Bash", scope: "db/,migrations/", scale: 3,
              agentIndex: 1, totalAgents: 3, toolMode: "external",
              externalTool: "gemini", priority: "P2", effort: "3m" })
```

## Integration with Cook/Planning

Scout tasks are **independent** from cook/planning phase tasks — NOT parent-child.

**Rationale:** Different lifecycle. Scout completes before cook continues. Mixing creates confusion in TaskList.

**Sequence when cook spawns scout:**
1. Cook Step 2 → spawns planner → planner spawns scout
2. Scout registers its own tasks (Step 3), executes (Step 4-5)
3. Scout returns aggregated report → planner continues
4. Cook Step 3 hydrates phase tasks (separate from scout tasks)

## Quality Check Output

After registration: `✓ Registered [N] scout tasks ([internal|external] mode, SCALE={scale})`

## Error Handling

If `TaskCreate` fails: log warning, continue without task tracking. Scout remains fully functional — tasks add observability, not functionality.




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
