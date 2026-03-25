---
name: ck:preview
description: "View files/directories OR generate visual explanations, slides, diagrams."
argument-hint: "[path] OR --explain|--slides|--diagram|--ascii [topic]"
---

# Preview

Universal viewer + visual generator. View existing content OR generate new visual explanations.

## Default (No Arguments)

If invoked without arguments, use `AskUserQuestion` to present available preview operations:

| Operation | Description |
|-----------|-------------|
| `(view)` | View a file or directory |
| `--explain` | Generate visual explanation |
| `--slides` | Generate presentation slides |
| `--diagram` | Generate architecture diagram |
| `--ascii` | Terminal-friendly diagram |
| `--stop` | Stop preview server |

Present as options via `AskUserQuestion` with header "Preview Operation", question "What would you like to do?".

## Usage

### View Mode
- `/ck:preview <file.md>` - View markdown file in novel-reader UI
- `/ck:preview <directory/>` - Browse directory contents
- `/ck:preview --stop` - Stop running server

### Generation Mode
- `/ck:preview --explain <topic>` - Generate visual explanation (ASCII + Mermaid + prose)
- `/ck:preview --slides <topic>` - Generate presentation slides (one concept per slide)
- `/ck:preview --diagram <topic>` - Generate focused diagram (ASCII + Mermaid)
- `/ck:preview --ascii <topic>` - Generate ASCII-only diagram (terminal-friendly)

## Argument Resolution

When processing arguments, follow this priority order:

1. **`--stop`** → Stop server (exit)
2. **Generation flags** (`--explain`, `--slides`, `--diagram`, `--ascii`) → Generation mode. Load `references/generation-modes.md`
3. **Resolve path from argument:**
   - If argument is an explicit path → use directly
   - If argument is a contextual reference → resolve from recent conversation context
4. **Resolved path exists on filesystem** → View mode. Load `references/view-mode.md`
5. **Path doesn't exist or can't resolve** → Ask user to clarify

**Topic-to-slug conversion:**
- Lowercase the topic
- Replace spaces/special chars with hyphens
- Remove non-alphanumeric except hyphens
- Collapse multiple hyphens → single hyphen
- Trim leading/trailing hyphens
- **Max 80 chars** - truncate at word boundary if longer

**Multiple flags:** If multiple generation flags provided, use first one; remaining treated as topic.

**Placeholder `{topic}`:** Replaced with original user input in title case (not the slug).

## Error Handling

| Error | Action |
|-------|--------|
| Invalid topic (empty) | Ask user to provide a topic |
| Flag without topic | Ask user: "Please provide a topic: `/ck:preview --explain <topic>`" |
| Topic becomes empty after sanitization | Ask for topic with alphanumeric characters |
| File write failure | Report error, suggest checking permissions |
| Server startup failure | Check if port in use, try `/ck:preview --stop` first |
| No generation flag + unresolvable reference | Ask user to clarify which file they meant |
| Existing file at output path | Overwrite with new content (no prompt) |
| Server already running | Reuse existing server instance, just open new URL |
| Parent `plans/` dir missing | Create directories recursively before write |


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### generation modes

# Generation Modes

## Step 1: Determine Output Location

1. Check if there's an active plan context (from `## Plan Context` in hook injection)
2. If active plan exists: save to `{plan_dir}/visuals/{topic-slug}.md`
3. If no active plan: save to `plans/visuals/{topic-slug}.md`
4. Create `visuals/` directory if it doesn't exist

## Step 2: Generate Content

**Mermaid Diagram Syntax:**
When generating mermaid code blocks, use `/ck:mermaidjs-v11` skill for v11 syntax rules.

**Essential rules (always apply):**
- Quote node text with special characters: `A["text with /slashes"]`
- Escape brackets in labels: `A["array[0]"]`

Use the appropriate template based on flag:

### --explain (Visual Explanation)
```markdown
# Visual Explanation: {topic}

## Overview
Brief description of what we're explaining.

## Quick View (ASCII)
[ASCII diagram of component relationships]

## Detailed Flow
[Mermaid sequence/flowchart diagram]

## Key Concepts
1. **Concept A** - Explanation
2. **Concept B** - Explanation

## Code Example (if applicable)
[Relevant code snippet with comments]
```

### --slides (Presentation Format)
```markdown
# {Topic} - Visual Presentation

---
## Slide 1: Introduction
- One concept per slide
- Bullet points only

---
## Slide 2: The Problem
[Mermaid flowchart]

---
## Slide 3: The Solution
- Key point 1
- Key point 2

---
## Slide 4: Summary
Key takeaways...
```

### --diagram (Focused Diagram)
```markdown
# Diagram: {topic}

## ASCII Version
[ASCII architecture diagram]

## Mermaid Version
[Mermaid flowchart/graph]
```

### --ascii (Terminal-Friendly Only)
```
[ASCII-only box diagram with legend]
```

## Step 3: Save and Preview

1. Write generated content to determined path
2. Start preview server with the generated file:
```bash
node .claude/skills/markdown-novel-viewer/scripts/server.cjs \
  --file "<generated-file-path>" --host 0.0.0.0 --open --foreground
```

## Step 4: Report to User

Report:
- Generated file path
- Preview URL (local + network)
- Remind: file saved in plan's `visuals/` folder for future reference


### view mode

# View Mode

## Execution

**IMPORTANT:** Run server as Claude Code background task using `run_in_background: true` with the Bash tool.

The skill is located at `.claude/skills/markdown-novel-viewer/`.

### Stop Server

If `--stop` flag is provided:

```bash
node .claude/skills/markdown-novel-viewer/scripts/server.cjs --stop
```

### Start Server

Run the `markdown-novel-viewer` server as CC background task with `--foreground` flag:

```bash
INPUT_PATH="<resolved-path>"
if [[ -d "$INPUT_PATH" ]]; then
  node .claude/skills/markdown-novel-viewer/scripts/server.cjs \
    --dir "$INPUT_PATH" --host 0.0.0.0 --open --foreground
else
  node .claude/skills/markdown-novel-viewer/scripts/server.cjs \
    --file "$INPUT_PATH" --host 0.0.0.0 --open --foreground
fi
```

**Critical:** When calling the Bash tool:
- Set `run_in_background: true`
- Set `timeout: 300000` (5 minutes)
- Parse JSON output and report URL to user

After starting, report:
- Local URL for browser access
- Network URL for remote device access
- Inform user that server is now running as CC background task (visible in `/tasks`)

**CRITICAL:** MUST display the FULL URL including path and query string. NEVER truncate to just `host:port`.




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
