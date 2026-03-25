---
name: ck:context-engineering
description: >-
  Check context usage limits, monitor time remaining, optimize token consumption, debug context failures.
  Use when asking about context percentage, rate limits, usage warnings, context optimization, agent architectures, memory systems.
version: 1.0.0
argument-hint: "[topic or question]"
---

# Context Engineering

Context engineering curates the smallest high-signal token set for LLM tasks. The goal: maximize reasoning quality while minimizing token usage.

## When to Activate

- Designing/debugging agent systems
- Context limits constrain performance
- Optimizing cost/latency
- Building multi-agent coordination
- Implementing memory systems
- Evaluating agent performance
- Developing LLM-powered pipelines

## Core Principles

1. **Context quality > quantity** - High-signal tokens beat exhaustive content
2. **Attention is finite** - U-shaped curve favors beginning/end positions
3. **Progressive disclosure** - Load information just-in-time
4. **Isolation prevents degradation** - Partition work across sub-agents
5. **Measure before optimizing** - Know your baseline

**IMPORTANT:**
- Sacrifice grammar for the sake of concision.
- Ensure token efficiency while maintaining high quality.
- Pass these rules to subagents.

## Quick Reference

| Topic | When to Use | Reference |
|-------|-------------|-----------|
| **Fundamentals** | Understanding context anatomy, attention mechanics | [context-fundamentals.md](./references/context-fundamentals.md) |
| **Degradation** | Debugging failures, lost-in-middle, poisoning | [context-degradation.md](./references/context-degradation.md) |
| **Optimization** | Compaction, masking, caching, partitioning | [context-optimization.md](./references/context-optimization.md) |
| **Compression** | Long sessions, summarization strategies | [context-compression.md](./references/context-compression.md) |
| **Memory** | Cross-session persistence, knowledge graphs | [memory-systems.md](./references/memory-systems.md) |
| **Multi-Agent** | Coordination patterns, context isolation | [multi-agent-patterns.md](./references/multi-agent-patterns.md) |
| **Evaluation** | Testing agents, LLM-as-Judge, metrics | [evaluation.md](./references/evaluation.md) |
| **Tool Design** | Tool consolidation, description engineering | [tool-design.md](./references/tool-design.md) |
| **Pipelines** | Project development, batch processing | [project-development.md](./references/project-development.md) |
| **Runtime Awareness** | Usage limits, context window monitoring | [runtime-awareness.md](./references/runtime-awareness.md) |

## Key Metrics

- **Token utilization**: Warning at 70%, trigger optimization at 80%
- **Token variance**: Explains 80% of agent performance variance
- **Multi-agent cost**: ~15x single agent baseline
- **Compaction target**: 50-70% reduction, <5% quality loss
- **Cache hit target**: 70%+ for stable workloads

## Four-Bucket Strategy

1. **Write**: Save context externally (scratchpads, files)
2. **Select**: Pull only relevant context (retrieval, filtering)
3. **Compress**: Reduce tokens while preserving info (summarization)
4. **Isolate**: Split across sub-agents (partitioning)

## Anti-Patterns

- Exhaustive context over curated context
- Critical info in middle positions
- No compaction triggers before limits
- Single agent for parallelizable tasks
- Tools without clear descriptions

## Guidelines

1. Place critical info at beginning/end of context
2. Implement compaction at 70-80% utilization
3. Use sub-agents for context isolation, not role-play
4. Design tools with 4-question framework (what, when, inputs, returns)
5. Optimize for tokens-per-task, not tokens-per-request
6. Validate with probe-based evaluation
7. Monitor KV-cache hit rates in production
8. Start minimal, add complexity only when proven necessary

## Runtime Awareness

The system automatically injects usage awareness via PostToolUse hook:

```xml
<usage-awareness>
Claude Usage Limits: 5h=45%, 7d=32%
Context Window Usage: 67%
</usage-awareness>
```

**Thresholds:**
- 70%: WARNING - consider optimization/compaction
- 90%: CRITICAL - immediate action needed

**Data Sources:**
- Usage limits: Anthropic OAuth API (`https://api.anthropic.com/api/oauth/usage`)
- Context window: Statusline temp file (`/tmp/ck-context-{session_id}.json`)

## Scripts

- [context_analyzer.py](./scripts/context_analyzer.py) - Context health analysis, degradation detection
- [compression_evaluator.py](./scripts/compression_evaluator.py) - Compression quality evaluation


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### context compression

# Context Compression

Strategies for long-running sessions exceeding context windows.

## Core Insight

Optimize **tokens-per-task** (total to completion), not tokens-per-request.
Aggressive compression causing re-fetching costs more than better retention.

## Compression Methods

| Method | Compression | Quality | Best For |
|--------|-------------|---------|----------|
| **Anchored Iterative** | 98.6% | 3.70/5 | Best balance |
| **Regenerative Full** | 98.7% | 3.44/5 | Readability |
| **Opaque** | 99.3% | 3.35/5 | Max compression |

## Anchored Iterative Summary Template

```markdown
## Session Intent
Original goal: [preserved]

## Files Modified
- file.py: Changes made

## Decisions Made
- Key decisions with rationale

## Current State
Progress summary

## Next Steps
1. Next action items
```

**On compression**: Merge new content into existing sections, don't regenerate.

## Compression Triggers

| Strategy | Trigger | Use Case |
|----------|---------|----------|
| Fixed threshold | 70-80% utilization | General purpose |
| Sliding window | Keep last N turns + summary | Conversations |
| Task-boundary | At logical completion | Multi-step workflows |

## Artifact Trail Problem

Weakest dimension (2.2-2.5/5.0). Coding agents need explicit tracking of:
- Files created/modified/read
- Function/variable names, error messages

**Solution**: Dedicated artifact section in summary.

## Probe-Based Evaluation

| Probe Type | Tests | Example |
|------------|-------|---------|
| Recall | Factual retention | "What was the error?" |
| Artifact | File tracking | "Which files modified?" |
| Continuation | Task planning | "What next?" |
| Decision | Reasoning chains | "Why chose X?" |

## Six Evaluation Dimensions

1. **Accuracy** - Technical correctness
2. **Context Awareness** - Conversation state
3. **Artifact Trail** - File tracking (universally weak)
4. **Completeness** - Coverage depth
5. **Continuity** - Work continuation
6. **Instruction Following** - Constraints

## Guidelines

1. Use anchored iterative for best quality/compression
2. Maintain explicit artifact tracking section
3. Trigger compression at 70% utilization
4. Merge into sections, don't regenerate
5. Evaluate with probes, not lexical metrics

## Related

- [Context Optimization](./context-optimization.md)
- [Evaluation](./evaluation.md)


### context degradation

# Context Degradation Patterns

Predictable degradation as context grows. Not binary - a continuum.

## Degradation Patterns

| Pattern | Cause | Detection |
|---------|-------|-----------|
| **Lost-in-Middle** | U-shaped attention | Critical info recall drops 10-40% |
| **Context Poisoning** | Errors compound via reference | Persistent hallucinations despite correction |
| **Context Distraction** | Irrelevant info overwhelms | Single distractor degrades performance |
| **Context Confusion** | Multiple tasks mix | Wrong tool calls, mixed requirements |
| **Context Clash** | Contradictory info | Conflicting outputs, inconsistent reasoning |

## Lost-in-Middle Phenomenon

- Information in middle gets 10-40% lower recall
- Models allocate massive attention to first token (BOS sink)
- As context grows, middle tokens fail to get sufficient attention
- **Mitigation**: Place critical info at beginning/end

```markdown
[CURRENT TASK]              # Beginning - high attention
- Critical requirements

[DETAILED CONTEXT]          # Middle - lower attention
- Supporting details

[KEY FINDINGS]              # End - high attention
- Important conclusions
```

## Context Poisoning

**Entry points**:
1. Tool outputs with errors/unexpected formats
2. Retrieved docs with incorrect/outdated info
3. Model-generated summaries with hallucinations

**Detection symptoms**:
- Degraded quality on previously successful tasks
- Tool misalignment (wrong tools/parameters)
- Persistent hallucinations

**Recovery**:
- Truncate to before poisoning point
- Explicit note + re-evaluation request
- Restart with clean context, preserve only verified info

## Model Degradation Thresholds

| Model | Degradation Onset | Severe Degradation |
|-------|-------------------|-------------------|
| GPT-5.2 | ~64K tokens | ~200K tokens |
| Claude Opus 4.5 | ~100K tokens | ~180K tokens |
| Claude Sonnet 4.5 | ~80K tokens | ~150K tokens |
| Gemini 3 Pro | ~500K tokens | ~800K tokens |

## Four-Bucket Mitigation

1. **Write**: Save externally (scratchpads, files)
2. **Select**: Pull only relevant (retrieval, filtering)
3. **Compress**: Reduce tokens (summarization)
4. **Isolate**: Split across sub-agents (partitioning)

## Detection Heuristics

```python
def calculate_health(utilization, degradation_risk, poisoning_risk):
    """Health score: 1.0 = healthy, 0.0 = critical"""
    score = 1.0
    score -= utilization * 0.5 if utilization > 0.7 else 0
    score -= degradation_risk * 0.3
    score -= poisoning_risk * 0.2
    return max(0, score)

# Thresholds: healthy >0.8, warning >0.6, degraded >0.4, critical <=0.4
```

## Guidelines

1. Monitor context length vs performance correlation
2. Place critical info at beginning/end
3. Implement compaction before degradation
4. Validate retrieved docs before adding
5. Use versioning to prevent outdated clash
6. Segment tasks to prevent confusion
7. Design for graceful degradation

## Related Topics

- [Context Optimization](./context-optimization.md) - Mitigation techniques
- [Multi-Agent Patterns](./multi-agent-patterns.md) - Isolation strategies


### context fundamentals

# Context Fundamentals

Context = all input provided to LLM for task completion.

## Anatomy of Context

| Component | Purpose | Token Impact |
|-----------|---------|--------------|
| System Prompt | Identity, constraints, guidelines | Stable, cacheable |
| Tool Definitions | Action specs with params/returns | Grows with capabilities |
| Retrieved Docs | Domain knowledge, just-in-time | Variable, selective |
| Message History | Conversation state, task progress | Accumulates over time |
| Tool Outputs | Results from actions | 83.9% of typical context |

## Attention Mechanics

- **U-shaped curve**: Beginning/end get more attention than middle
- **Attention budget**: n^2 relationships for n tokens depletes with growth
- **Position encoding**: Interpolation allows longer sequences with degradation
- **First-token sink**: BOS token absorbs large attention budget

## System Prompt Structure

```xml
<BACKGROUND_INFORMATION>Domain knowledge, role definition</BACKGROUND_INFORMATION>
<INSTRUCTIONS>Step-by-step procedures</INSTRUCTIONS>
<TOOL_GUIDANCE>When/how to use tools</TOOL_GUIDANCE>
<OUTPUT_DESCRIPTION>Format requirements</OUTPUT_DESCRIPTION>
```

## Progressive Disclosure Levels

1. **Metadata** (~100 words) - Always in context
2. **SKILL.md body** (<5k words) - When skill triggers
3. **Bundled resources** (Unlimited) - As needed

## Token Budget Allocation

| Component | Typical Range | Notes |
|-----------|---------------|-------|
| System Prompt | 500-2000 | Stable, optimize once |
| Tool Definitions | 100-500 per tool | Keep under 20 tools |
| Retrieved Docs | 1000-5000 | Selective loading |
| Message History | Variable | Summarize at 70% |
| Reserved Buffer | 10-20% | For responses |

## Document Management

**Strong identifiers**: `customer_pricing_rates.json` not `data/file1.json`
**Chunk at semantic boundaries**: Paragraphs, sections, not arbitrary lengths
**Include metadata**: Source, date, relevance score

## Message History Pattern

```python
# Summary injection every 20 messages
if len(messages) % 20 == 0:
    summary = summarize_conversation(messages[-20:])
    messages.append({"role": "system", "content": f"Summary: {summary}"})
```

## Guidelines

1. Treat context as finite with diminishing returns
2. Place critical info at attention-favored positions
3. Use file-system-based access for large documents
4. Pre-load stable content, just-in-time load dynamic
5. Design with explicit token budgets
6. Monitor usage, implement compaction triggers at 70-80%

## Related Topics

- [Context Degradation](./context-degradation.md) - Failure patterns
- [Context Optimization](./context-optimization.md) - Efficiency techniques
- [Memory Systems](./memory-systems.md) - External storage


### context optimization

# Context Optimization

Extend effective context capacity through strategic techniques.

## Four Core Strategies

| Strategy | Target | Reduction | When to Use |
|----------|--------|-----------|-------------|
| **Compaction** | Full context | 50-70% | Approaching limits |
| **Observation Masking** | Tool outputs | 60-80% | Verbose outputs >80% |
| **KV-Cache Optimization** | Repeated prefixes | 70%+ hit | Stable prompts |
| **Context Partitioning** | Work distribution | N/A | Parallelizable tasks |

## Compaction

Summarize context when approaching limits.

**Priority**: Tool outputs → Old turns → Retrieved docs → Never: System prompt

```python
if context_tokens / context_limit > 0.8:
    context = compact_context(context)
```

**Preserve**: Key findings, decisions, commitments (remove supporting details)

## Observation Masking

Replace verbose tool outputs with compact references.

```python
if len(observation) > max_length:
    ref_id = store_observation(observation)
    return f"[Obs:{ref_id}. Key: {extract_key(observation)}]"
```

**Never mask**: Current task critical, most recent turn, active reasoning
**Always mask**: Repeated outputs, boilerplate, already summarized

## KV-Cache Optimization

Reuse cached Key/Value tensors for identical prefixes.

```python
# Cache-friendly ordering (stable first)
context = [system_prompt, tool_definitions]  # Cacheable
context += [unique_content]                   # Variable last
```

**Tips**: Avoid timestamps in stable sections, consistent formatting, stable structure

## Context Partitioning

Split work across sub-agents with isolated contexts.

```python
result = await sub_agent.process(subtask, clean_context=True)
coordinator.receive(result.summary)  # Only essentials
```

## Decision Framework

| Dominant Component | Apply |
|-------------------|-------|
| Tool outputs | Observation masking |
| Retrieved docs | Summarization or partitioning |
| Message history | Compaction + summarization |
| Multiple | Combine strategies |

## Guidelines

1. Measure before optimizing
2. Apply compaction before masking
3. Design for cache stability
4. Partition before context problematic
5. Monitor effectiveness over time
6. Balance savings vs quality

## Related

- [Context Compression](./context-compression.md)
- [Memory Systems](./memory-systems.md)


### evaluation

# Evaluation

Systematically assess agent performance and context engineering choices.

## Key Finding: 95% Performance Variance

- **Token usage**: 80% of variance
- **Tool calls**: ~10% of variance
- **Model choice**: ~5% of variance

**Implication**: Token budgets matter more than model upgrades.

## Multi-Dimensional Rubric

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Factual Accuracy | 30% | Ground truth verification |
| Completeness | 25% | Coverage of requirements |
| Tool Efficiency | 20% | Appropriate tool usage |
| Citation Accuracy | 15% | Sources match claims |
| Source Quality | 10% | Authority/credibility |

## Evaluation Methods

### LLM-as-Judge

Beware biases:
- **Position**: First position preferred
- **Length**: Longer = higher score
- **Self-enhancement**: Rating own outputs higher
- **Verbosity**: Detailed = better

**Mitigation**: Position swapping, anti-bias prompting

### Pairwise Comparison

```python
score_ab = judge.compare(output_a, output_b)
score_ba = judge.compare(output_b, output_a)
consistent = (score_ab > 0.5) != (score_ba > 0.5)
```

### Probe-Based Testing

| Probe | Tests | Example |
|-------|-------|---------|
| Recall | Facts | "What was the error?" |
| Artifact | Files | "Which files modified?" |
| Continuation | Planning | "What's next?" |
| Decision | Reasoning | "Why chose X?" |

## Test Set Design

```python
class TestSet:
    def sample_stratified(self, n):
        per_level = n // 3
        return (
            sample(self.simple, per_level) +
            sample(self.medium, per_level) +
            sample(self.complex, per_level)
        )
```

## Production Monitoring

```python
class Monitor:
    sample_rate = 0.01  # 1% sampling
    alert_threshold = 0.85

    def check(self, scores):
        if avg(scores) < self.alert_threshold:
            self.alert(f"Quality degraded: {avg(scores):.2f}")
```

## Guidelines

1. Start with outcome evaluation, not step-by-step
2. Use multi-dimensional rubrics
3. Mitigate LLM-as-Judge biases
4. Test with stratified complexity
5. Implement continuous monitoring
6. Focus on token efficiency (80% variance)

## Related

- [Context Compression](./context-compression.md)
- [Tool Design](./tool-design.md)


### memory systems

# Memory Systems

Architectures for persistent context beyond the window.

## Memory Layer Architecture

| Layer | Scope | Persistence | Use Case |
|-------|-------|-------------|----------|
| L1: Working | Current window | None | Active reasoning |
| L2: Short-Term | Session | Session | Task continuity |
| L3: Long-Term | Cross-session | Persistent | User preferences |
| L4: Entity | Per-entity | Persistent | Consistency |
| L5: Temporal Graph | Time-aware | Persistent | Evolving facts |

## Benchmark Performance (DMR Accuracy)

| System | Accuracy | Approach |
|--------|----------|----------|
| Zep | 94.8% | Temporal knowledge graphs |
| MemGPT | 93.4% | Hierarchical memory |
| GraphRAG | 75-85% | Knowledge graphs |
| Vector RAG | 60-70% | Embedding similarity |

## Vector Store with Metadata

```python
class MetadataVectorStore:
    def add(self, text, embedding, metadata):
        doc = {
            "text": text, "embedding": embedding,
            "entities": metadata.get("entities", []),
            "timestamp": metadata.get("timestamp")
        }
        self.index_by_entity(doc)

    def search_by_entity(self, entity, k=5):
        return self.entity_index.get(entity, [])[:k]
```

## Temporal Knowledge Graph

```python
class TemporalKnowledgeGraph:
    def add_fact(self, subject, predicate, obj, valid_from, valid_to=None):
        self.facts.append({
            "triple": (subject, predicate, obj),
            "valid_from": valid_from,
            "valid_to": valid_to or "current"
        })

    def query_at_time(self, subject, predicate, timestamp):
        for fact in self.facts:
            if (fact["triple"][0] == subject and
                fact["valid_from"] <= timestamp <= fact["valid_to"]):
                return fact["triple"][2]
```

## Memory Retrieval Patterns

| Pattern | Query | Use Case |
|---------|-------|----------|
| Semantic | "Similar to X" | General recall |
| Entity-based | "About user John" | Consistency |
| Temporal | "Valid on date" | Evolving facts |
| Hybrid | Combine above | Production |

## File-System-as-Memory

```
memory/
├── sessions/{id}/summary.md
├── entities/{id}.json
└── facts/{timestamp}_{id}.json
```

## Guidelines

1. Start with file-system-as-memory (simplest)
2. Add vector search for scale
3. Use entity indexing for consistency
4. Add temporal awareness for evolving facts
5. Implement consolidation for health
6. Measure retrieval accuracy

## Related

- [Context Fundamentals](./context-fundamentals.md)
- [Multi-Agent Patterns](./multi-agent-patterns.md)


### multi agent patterns

# Multi-Agent Patterns

Distribute work across multiple context windows for isolation and scale.

## Core Insight

Sub-agents exist to **isolate context**, not anthropomorphize roles.

## Token Economics

| Architecture | Multiplier | Use Case |
|--------------|------------|----------|
| Single agent | 1x | Simple tasks |
| Single + tools | ~4x | Moderate complexity |
| Multi-agent | ~15x | Context isolation needed |

**Key**: Token usage explains 80% of performance variance.

## Patterns

### Supervisor/Orchestrator

```python
class Supervisor:
    def process(self, task):
        subtasks = self.decompose(task)
        results = [worker.execute(st, clean_context=True) for st in subtasks]
        return self.aggregate(results)
```

**Pros**: Control, human-in-loop | **Cons**: Bottleneck, telephone game

### Peer-to-Peer/Swarm

```python
def process_with_handoff(agent, task):
    result = agent.process(task)
    if "handoff" in result:
        return process_with_handoff(select_agent(result["to"]), result["state"])
    return result
```

**Pros**: No SPOF, scales | **Cons**: Complex coordination

### Hierarchical

Strategy → Planning → Execution layers
**Pros**: Separation of concerns | **Cons**: Coordination overhead

## Context Isolation Patterns

| Pattern | Isolation | Use Case |
|---------|-----------|----------|
| Full delegation | None | Max capability |
| Instruction passing | High | Simple tasks |
| File coordination | Medium | Shared state |

## Consensus Mechanisms

```python
def weighted_consensus(responses):
    scores = {}
    for r in responses:
        weight = r["confidence"] * r["expertise"]
        scores[r["answer"]] = scores.get(r["answer"], 0) + weight
    return max(scores, key=scores.get)
```

## Failure Recovery

| Failure | Mitigation |
|---------|------------|
| Bottleneck | Output schemas, checkpointing |
| Overhead | Clear handoffs, batching |
| Divergence | Boundaries, convergence checks |
| Errors | Validation, circuit breakers |

## Guidelines

1. Use multi-agent for context isolation, not role-play
2. Accept ~15x token cost for benefits
3. Implement circuit breakers
4. Use files for shared state
5. Design clear handoffs
6. Validate between agents

## Related

- [Context Optimization](./context-optimization.md)
- [Evaluation](./evaluation.md)


### project development

# Project Development

Design and build LLM-powered projects from ideation to deployment.

## Task-Model Fit

**LLM-Suited**: Synthesis, subjective judgment, NL output, error-tolerant batches
**LLM-Unsuited**: Precise computation, real-time, perfect accuracy, deterministic output

## Manual Prototype First

Test one example with target model before automation.

## Pipeline Architecture

```
acquire → prepare → process → parse → render
 (fetch)  (prompt)   (LLM)   (extract) (output)
```

Stages 1,2,4,5: Deterministic, cheap | Stage 3: Non-deterministic, expensive

## File System as State

```
data/{id}/
├── raw.json      # acquire done
├── prompt.md     # prepare done
├── response.md   # process done
└── parsed.json   # parse done
```

```python
def get_stage(id):
    if exists(f"{id}/parsed.json"): return "render"
    if exists(f"{id}/response.md"): return "parse"
    # ... check backwards
```

**Benefits**: Idempotent, resumable, debuggable

## Structured Output

```markdown
## SUMMARY
[Overview]

## KEY_FINDINGS
- Finding 1

## SCORE
[1-5]
```

```python
def parse(response):
    return {
        "summary": extract_section(response, "SUMMARY"),
        "findings": extract_list(response, "KEY_FINDINGS"),
        "score": extract_int(response, "SCORE")
    }
```

## Cost Estimation

```python
def estimate(items, tokens_per, price_per_1k):
    return len(items) * tokens_per / 1000 * price_per_1k * 1.1  # 10% buffer
# 1000 items × 2000 tokens × $0.01/1k = $22
```

## Case Studies

**Karpathy HN**: 930 items, $58, 1hr, 15 workers
**Vercel d0**: 17→2 tools, 80%→100% success, 3.5x faster

## Single vs Multi-Agent

| Factor | Single | Multi |
|--------|--------|-------|
| Context | Fits window | Exceeds |
| Tasks | Sequential | Parallel |
| Tokens | Limited | 15x OK |

## Guidelines

1. Validate manually before automating
2. Use 5-stage pipeline
3. Track state via files
4. Design structured output
5. Estimate costs first
6. Start single, add multi when needed

## Related

- [Context Optimization](./context-optimization.md)
- [Multi-Agent Patterns](./multi-agent-patterns.md)


### runtime awareness

# Runtime Awareness

Monitor usage limits and context window utilization in real-time to optimize Claude Code sessions.

## Overview

Runtime awareness provides visibility into two critical metrics:
1. **Usage Limits** - API quota consumption (5-hour and 7-day rolling windows)
2. **Context Window** - Current token utilization within the 200K context limit

## Architecture

```
┌─────────────────┐    ┌──────────────────────────┐
│  statusline.cjs │───▶│  /tmp/ck-context-*.json  │
│  (writes data)  │    │  (context window data)   │
└─────────────────┘    └────────────┬─────────────┘
                                    │
                       ┌────────────▼─────────────┐
                       │  usage-context-hook.cjs  │◀── PostToolUse
                       │  - Reads context file    │
                       │  - Fetches usage limits  │
                       │  - Injects awareness     │
                       └──────────────────────────┘
```

## Usage Limits API

### Endpoint

```
GET https://api.anthropic.com/api/oauth/usage
```

### Authentication

Requires OAuth Bearer token with `anthropic-beta: oauth-2025-04-20` header.

### Credential Locations

| Platform | Method | Location |
|----------|--------|----------|
| macOS | Keychain | `Claude Code-credentials` |
| Windows | File | `%USERPROFILE%\.claude\.credentials.json` |
| Linux | File | `~/.claude/.credentials.json` |

### Response Structure

```json
{
  "five_hour": {
    "utilization": 45,
    "resets_at": "2025-01-15T18:00:00Z"
  },
  "seven_day": {
    "utilization": 32,
    "resets_at": "2025-01-22T00:00:00Z"
  },
  "seven_day_sonnet": {
    "utilization": 11,
    "resets_at": "2025-01-15T09:00:00Z"
  }
}
```

- `utilization`: Already a percentage (0-100), NOT a decimal
- `resets_at`: ISO 8601 timestamp when quota resets
- `seven_day_sonnet`: Model-specific limit (may be null)

## Context Window Data

### Source

Statusline writes context data to `/tmp/ck-context-{session_id}.json`:

```json
{
  "percent": 67,
  "tokens": 134000,
  "size": 200000,
  "usage": {
    "input_tokens": 80000,
    "cache_creation_input_tokens": 30000,
    "cache_read_input_tokens": 24000
  },
  "timestamp": 1705312000000
}
```

### Token Calculation

```
total = input_tokens + cache_creation_input_tokens + cache_read_input_tokens
percent = (total + AUTOCOMPACT_BUFFER) / context_window_size * 100
```

Where `AUTOCOMPACT_BUFFER = 45000` (22.5% reserved).

## Hook Output

The PostToolUse hook injects awareness data every 5 minutes:

```xml
<usage-awareness>
Limits: 5h=45%, 7d=32%
Context: 67%
</usage-awareness>
```

### Warning Indicators

| Level | Threshold | Indicator |
|-------|-----------|-----------|
| Normal | < 70% | Plain percentage |
| Warning | 70-89% | `[WARNING]` |
| Critical | ≥ 90% | `[CRITICAL]` |

### Examples

Normal state:
```xml
<usage-awareness>
Limits: 5h=45%, 7d=32%
Context: 67%
</usage-awareness>
```

Warning state:
```xml
<usage-awareness>
Limits: 5h=75% [WARNING], 7d=32%
Context: 78% [WARNING - consider compaction]
</usage-awareness>
```

Critical state:
```xml
<usage-awareness>
Limits: 5h=92% [CRITICAL], 7d=65%
Context: 91% [CRITICAL - compaction needed]
</usage-awareness>
```

## Recommendations by Threshold

### Context Window

| Utilization | Action |
|-------------|--------|
| < 70% | Continue normally |
| 70-80% | Plan compaction strategy |
| 80-90% | Execute compaction |
| > 90% | Immediate compaction or session reset |

### Usage Limits

| 5-Hour | Action |
|--------|--------|
| < 70% | Normal usage |
| 70-90% | Reduce parallelization, delegate to subagents |
| > 90% | Wait for reset or use lower-tier models |

| 7-Day | Action |
|-------|--------|
| < 70% | Normal usage |
| 70-90% | Monitor daily consumption |
| > 90% | Limit usage to essential tasks |

## Configuration

### Hook Settings (`.claude/settings.json`)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [{
          "type": "command",
          "command": "node .claude/hooks/usage-context-awareness.cjs"
        }]
      }
    ]
  }
}
```

### Throttling

- **Injection interval**: 5 minutes (300,000ms)
- **API cache TTL**: 60 seconds
- **Context data freshness**: 30 seconds

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| No usage limits shown | No OAuth token | Run `claude login` |
| Stale context data | Statusline not updating | Check statusline config |
| 401 Unauthorized | Expired token | Re-authenticate |
| Hook not firing | Settings misconfigured | Verify PostToolUse matcher |


### tool design

# Tool Design

Design effective tools for agent systems.

## Consolidation Principle

Single comprehensive tools > multiple narrow tools. **Target**: 10-20 tools max.

## Architectural Reduction Evidence

| Metric | 17 Tools | 2 Tools | Improvement |
|--------|----------|---------|-------------|
| Time | 274.8s | 77.4s | 3.5x faster |
| Success | 80% | 100% | +20% |
| Tokens | 102k | 61k | 37% fewer |

**Key**: Good documentation replaces tool sophistication.

## When Reduction Works

**Prerequisites**: High docs quality, capable model, navigable problem
**Avoid when**: Messy systems, specialized domain, safety-critical

## Description Engineering

Answer four questions:
1. **What** does the tool do?
2. **When** should it be used?
3. **What inputs** does it accept?
4. **What** does it return?

### Good Example

```json
{
  "name": "get_customer",
  "description": "Retrieve customer profile by ID. Use for order processing, support. Returns 404 if not found.",
  "parameters": {
    "customer_id": {"type": "string", "pattern": "^CUST-[0-9]{6}$"},
    "format": {"enum": ["concise", "detailed"]}
  }
}
```

### Poor Example

```json
{"name": "search", "description": "Search for things", "parameters": {"q": {}}}
```

## Error Messages

```python
def format_error(code, message, resolution):
    return {
        "error": {"code": code, "message": message,
                  "resolution": resolution, "retryable": code in RETRYABLE}
    }
# "Use YYYY-MM-DD format, e.g., '2024-01-05'"
```

## Response Formats

Offer concise vs detailed:

```python
def get_data(id, format="concise"):
    if format == "concise":
        return {"name": data.name}
    return data.full()  # Detailed
```

## Guidelines

1. Consolidate tools (target 10-20)
2. Answer all four questions
3. Use full parameter names
4. Design errors for recovery
5. Offer concise/detailed formats
6. Test with agents before deploy
7. Start minimal, add when proven

## Related

- [Context Fundamentals](./context-fundamentals.md)
- [Multi-Agent Patterns](./multi-agent-patterns.md)




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
