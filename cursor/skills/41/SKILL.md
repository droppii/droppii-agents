---
name: ck:problem-solving
description: Apply systematic problem-solving techniques when stuck. Use for complexity spirals, innovation blocks, recurring patterns, assumption constraints, simplification cascades, scale uncertainty.
version: 2.0.0
argument-hint: "[problem description]"
---

# Problem-Solving Techniques

Systematic approaches for different types of stuck-ness. Each technique targets specific problem patterns.

## When to Use

Apply when encountering:
- **Complexity spiraling** - Multiple implementations, growing special cases, excessive branching
- **Innovation blocks** - Conventional solutions inadequate, need breakthrough thinking
- **Recurring patterns** - Same issue across domains, reinventing solutions
- **Assumption constraints** - Forced into "only way", can't question premise
- **Scale uncertainty** - Production readiness unclear, edge cases unknown
- **General stuck-ness** - Unsure which technique applies

## Quick Dispatch

**Match symptom to technique:**

| Stuck Symptom | Technique | Reference |
|---------------|-----------|-----------|
| Same thing implemented 5+ ways, growing special cases | **Simplification Cascades** | `references/simplification-cascades.md` |
| Conventional solutions inadequate, need breakthrough | **Collision-Zone Thinking** | `references/collision-zone-thinking.md` |
| Same issue in different places, reinventing wheels | **Meta-Pattern Recognition** | `references/meta-pattern-recognition.md` |
| Solution feels forced, "must be done this way" | **Inversion Exercise** | `references/inversion-exercise.md` |
| Will this work at production? Edge cases unclear? | **Scale Game** | `references/scale-game.md` |
| Unsure which technique to use | **When Stuck** | `references/when-stuck.md` |

## Core Techniques

### 1. Simplification Cascades
Find one insight eliminating multiple components. "If this is true, we don't need X, Y, Z."

**Key insight:** Everything is a special case of one general pattern.

**Red flag:** "Just need to add one more case..." (repeating forever)

### 2. Collision-Zone Thinking
Force unrelated concepts together to discover emergent properties. "What if we treated X like Y?"

**Key insight:** Revolutionary ideas from deliberate metaphor-mixing.

**Red flag:** "I've tried everything in this domain"

### 3. Meta-Pattern Recognition
Spot patterns appearing in 3+ domains to find universal principles.

**Key insight:** Patterns in how patterns emerge reveal reusable abstractions.

**Red flag:** "This problem is unique" (probably not)

### 4. Inversion Exercise
Flip core assumptions to reveal hidden constraints. "What if the opposite were true?"

**Key insight:** Valid inversions reveal context-dependence of "rules."

**Red flag:** "There's only one way to do this"

### 5. Scale Game
Test at extremes (1000x bigger/smaller, instant/year-long) to expose fundamental truths.

**Key insight:** What works at one scale fails at another.

**Red flag:** "Should scale fine" (without testing)

## Application Process

1. **Identify stuck-type** - Match symptom to technique above
2. **Load detailed reference** - Read specific technique from `references/`
3. **Apply systematically** - Follow technique's process
4. **Document insights** - Record what worked/failed
5. **Combine if needed** - Some problems need multiple techniques

## Combining Techniques

Powerful combinations:
- **Simplification + Meta-pattern** - Find pattern, then simplify all instances
- **Collision + Inversion** - Force metaphor, then invert its assumptions
- **Scale + Simplification** - Extremes reveal what to eliminate
- **Meta-pattern + Scale** - Universal patterns tested at extremes

## References

Load detailed guides as needed:
- `references/when-stuck.md` - Dispatch flowchart and decision tree
- `references/simplification-cascades.md` - Cascade detection and extraction
- `references/collision-zone-thinking.md` - Metaphor collision process
- `references/meta-pattern-recognition.md` - Pattern abstraction techniques
- `references/inversion-exercise.md` - Assumption flipping methodology
- `references/scale-game.md` - Extreme testing procedures
- `references/attribution.md` - Source and adaptation notes


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### attribution

# Problem-Solving Skills - Attribution

These skills were derived from agent patterns in the Microsoft Amplifier project.

## Source Repository

- **Name:** Amplifier
- **URL:** https://github.com/microsoft/amplifier
- **Commit:** 2adb63f858e7d760e188197c8e8d4c1ef721e2a6
- **Date:** 2025-10-10

## Skills Derived from Amplifier Agents

### From insight-synthesizer agent:
- **simplification-cascades** - Finding insights that eliminate multiple components
- **collision-zone-thinking** - Forcing unrelated concepts together for breakthroughs
- **meta-pattern-recognition** - Spotting patterns across 3+ domains
- **inversion-exercise** - Flipping assumptions to reveal alternatives
- **scale-game** - Testing at extremes to expose fundamental truths

### From ambiguity-guardian agent:
- **preserving-productive-tensions** - Preserving multiple valid approaches (in architecture skill)

### From knowledge-archaeologist agent:
- **tracing-knowledge-lineages** - Understanding how ideas evolved (in research skill)

### Dispatch pattern:
- **when-stuck** - Maps stuck-symptoms to appropriate technique

## What Was Adapted

The Amplifier agents are specialized long-lived agents with structured JSON output. These skills extract the core problem-solving techniques and adapt them as:

- **Scannable quick-reference guides** (~60-80 lines each)
- **Symptom-based discovery** via when_to_use descriptions
- **Immediate application** without special tooling
- **Composable patterns** through dispatch system
- **Progressive disclosure** via SKILL.md + references structure

## Core Insight

Agent capabilities are domain-agnostic patterns. Whether packaged as "amplifier agent" or "problem-solving skill", the underlying technique is the same.

We extracted the techniques and made them:
- Portable across contexts
- Immediately applicable
- Token-efficient through progressive disclosure
- Discoverable through symptom-matching
- Combinable for complex problems

## License

Original Amplifier project uses MIT License. These adapted skills maintain attribution and follow the same open spirit.

## Adaptation Notes

**Changes from original:**
- Converted from long-lived agent to scannable reference
- Added symptom-based dispatch system
- Removed JSON output requirements
- Focused on immediate application
- Added concrete examples
- Structured for progressive disclosure

**Preserved from original:**
- Core problem-solving techniques
- Recognition patterns
- Application processes
- Fundamental insights


### collision zone thinking

# Collision-Zone Thinking

Force unrelated concepts together to discover emergent properties. "What if we treated X like Y?"

## Core Principle

Revolutionary insights from deliberate metaphor-mixing. Treat X like Y and see what emerges.

## When to Use

| Symptom | Action |
|---------|--------|
| Stuck in conventional thinking | Force wild domain collision |
| Solutions feel incremental | Need breakthrough, not optimization |
| "Tried everything in this domain" | Import concepts from elsewhere |
| Need innovation, not iteration | Deliberately mix unrelated ideas |

## Quick Reference Collisions

| Treat This | Like This | Discovers |
|------------|-----------|-----------|
| Code organization | DNA/genetics | Mutation testing, evolutionary algorithms |
| Service architecture | Lego bricks | Composable microservices, plug-and-play |
| Data management | Water flow | Streaming, data lakes, flow-based systems |
| Request handling | Postal mail | Message queues, async processing |
| Error handling | Circuit breakers | Fault isolation, graceful degradation |

## Process

1. **Pick two unrelated concepts** from different domains
2. **Force combination** - "What if we treated [A] like [B]?"
3. **Explore emergent properties** - What new capabilities appear?
4. **Test boundaries** - Where does the metaphor break?
5. **Extract insight** - What did we learn?

## Detailed Example

**Problem:** Complex distributed system with cascading failures

**Collision:** "What if we treated services like electrical circuits?"

**Emergent properties:**
- Circuit breakers (disconnect on overload)
- Fuses (one-time failure protection)
- Ground faults (error isolation)
- Load balancing (current distribution)
- Voltage regulation (rate limiting)

**Where it works:** Preventing cascade failures, fault isolation

**Where it breaks:** Circuits don't have retry logic, healing mechanisms

**Insight gained:** Failure isolation patterns from electrical engineering

## Best Source Domains

Rich domains for concept mining:
- **Physics** - Forces, thermodynamics, relativity
- **Biology** - Evolution, ecosystems, immune systems
- **Economics** - Markets, incentives, game theory
- **Psychology** - Cognition, behavior, motivation
- **Architecture** - Structure, flow, space utilization

## Red Flags

You need collision-zone thinking when:
- "I've tried everything in this domain"
- Solutions feel incremental, not breakthrough
- Stuck in conventional thinking
- Need innovation, not optimization
- "Standard approach isn't working"

## Remember

- Wild combinations often yield best insights
- Test metaphor boundaries rigorously
- Document even failed collisions (they teach)
- Breakthrough > incremental improvement
- Question: "What would [domain expert] do?"


### inversion exercise

# Inversion Exercise

Flip core assumptions to reveal hidden constraints and alternative approaches. "What if the opposite were true?"

## Core Principle

**Inversion exposes hidden assumptions.** Sometimes the opposite reveals the truth.

## When to Use

| Symptom | Action |
|---------|--------|
| "There's only one way" | Flip the assumption |
| Solution feels forced | Invert the constraints |
| Can't articulate why necessary | Question the "must" |
| "This is just how it's done" | Try the opposite |

## Quick Reference

| Normal Assumption | Inverted | What It Reveals |
|-------------------|----------|-----------------|
| Cache to reduce latency | Add latency to enable caching | Debouncing patterns |
| Pull data when needed | Push data before needed | Prefetching, eager loading |
| Handle errors when occur | Make errors impossible | Type systems, contracts |
| Build features users want | Remove features users don't need | Simplicity >> addition |
| Optimize for common case | Optimize for worst case | Resilience patterns |

## Process

1. **List core assumptions** - What "must" be true?
2. **Invert each systematically** - "What if opposite were true?"
3. **Explore implications** - What would we do differently?
4. **Find valid inversions** - Which actually work somewhere?
5. **Document insights** - What did we learn?

## Detailed Example

**Problem:** Users complain app is slow

**Normal approach:** Make everything faster
- Add caching
- Optimize queries
- Use CDN
- Reduce bundle size

**Inverted approach:** Make things intentionally slower in some places
- **Debounce search** - Add latency → enable better results (wait for full query)
- **Rate limit requests** - Add friction → prevent abuse, improve for others
- **Lazy load content** - Delay loading → reduce initial load time
- **Progressive rendering** - Show slower → perceived performance

**Insight:** Strategic slowness can improve UX

## Valid vs Invalid Inversions

**Valid inversion example:**
- Normal: "Store data in database"
- Inverted: "Derive data on-demand instead of storing"
- Valid when: Computation cheaper than storage, data changes frequently

**Invalid inversion example:**
- Normal: "Validate user input"
- Inverted: "Trust all user input"
- Invalid because: Security vulnerability, not context-dependent

**Test validity:** Does the inversion work in ANY context? If yes, it's valid somewhere.

## Common Inversions

- **Eager → Lazy** (or vice versa)
- **Push → Pull** (or vice versa)
- **Store → Compute** (or vice versa)
- **Optimize → Simplify** (or vice versa)
- **Add features → Remove features** (or vice versa)

## Red Flags

You need inversion exercise when:
- "There's only one way to do this"
- Forcing solution that feels wrong
- Can't articulate why approach is necessary
- "This is just how it's done"
- Stuck on unquestioned assumptions

## Remember

- Not all inversions work (test boundaries)
- Valid inversions reveal context-dependence
- Sometimes opposite is the answer
- Question "must be" statements
- Document both successful and failed inversions


### meta pattern recognition

# Meta-Pattern Recognition

Spot patterns appearing in 3+ domains to find universal principles.

## Core Principle

**Find patterns in how patterns emerge.** When the same pattern appears in 3+ domains, it's likely a universal principle worth extracting.

## When to Use

| Symptom | Action |
|---------|--------|
| Same issue in different places | Extract the abstract form |
| Déjà vu in problem-solving | Find the universal pattern |
| Reinventing wheels across domains | Identify the meta-pattern |
| "Haven't we done this before?" | Yes, find and reuse it |

## Quick Reference

| Pattern Appears In | Abstract Form | Where Else? |
|-------------------|---------------|-------------|
| CPU/DB/HTTP/DNS caching | Store frequently-accessed data closer | LLM prompt caching, CDN |
| Layering (network/storage/compute) | Separate concerns into abstraction levels | Architecture, org structure |
| Queuing (message/task/request) | Decouple producer from consumer with buffer | Event systems, async |
| Pooling (connection/thread/object) | Reuse expensive resources | Memory mgmt, governance |

## Process

1. **Spot repetition** - See same shape in 3+ places
2. **Extract abstract form** - Describe independent of any domain
3. **Identify variations** - How does it adapt per domain?
4. **Check applicability** - Where else might this help?
5. **Document pattern** - Make it reusable

## Detailed Example

**Pattern spotted:** Rate limiting appears in:
- API throttling (requests per minute)
- Traffic shaping (packets per second)
- Circuit breakers (failures per window)
- Admission control (concurrent connections)

**Abstract form:** Bound resource consumption to prevent exhaustion

**Variation points:**
- What resource (requests, packets, failures, connections)
- What limit (per time window, concurrent, cumulative)
- What happens when exceeded (reject, queue, degrade)

**New application:** LLM token budgets
- Same pattern: prevent context window exhaustion
- Resource: tokens
- Limit: context window size
- Action: truncate or reject

## 3+ Domain Rule

**Why 3 domains?**
- 1 occurrence = coincidence
- 2 occurrences = possible pattern
- 3+ occurrences = likely universal

**Domain independence test:**
Can you describe the pattern without mentioning specific domains?

## Red Flags

Signs you're missing meta-patterns:
- "This problem is unique" (probably not)
- Multiple teams solving "different" problems identically
- Reinventing wheels across domains
- "Haven't we done something like this?" (yes, find it)

## Benefits of Meta-Patterns

- **Battle-tested** - Proven across multiple domains
- **Reusable** - Apply to new situations
- **Universal** - Domain-independent solutions
- **Documented** - Known variations and trade-offs

## Remember

- 3+ domains = likely universal
- Abstract form reveals new applications
- Variations show adaptation points
- Universal patterns save time
- Document for future reuse


### scale game

# Scale Game

Test at extremes (1000x bigger/smaller, instant/year-long) to expose fundamental truths hidden at normal scales.

## Core Principle

**Extremes expose fundamentals.** What works at one scale fails at another.

## When to Use

| Symptom | Action |
|---------|--------|
| "Should scale fine" (without testing) | Test at extremes |
| Uncertain about production behavior | Scale up 1000x |
| Edge cases unclear | Test minimum and maximum |
| Architecture validation needed | Extreme testing |

## Quick Reference

| Scale Dimension | Test At Extremes | What It Reveals |
|-----------------|------------------|-----------------|
| **Volume** | 1 item vs 1B items | Algorithmic complexity limits |
| **Speed** | Instant vs 1 year | Async requirements, caching needs |
| **Users** | 1 user vs 1B users | Concurrency issues, resource limits |
| **Duration** | Milliseconds vs years | Memory leaks, state growth |
| **Failure rate** | Never fails vs always fails | Error handling adequacy |

## Process

1. **Pick dimension** - What could vary extremely?
2. **Test minimum** - What if 1000x smaller/faster/fewer?
3. **Test maximum** - What if 1000x bigger/slower/more?
4. **Note what breaks** - Where do limits appear?
5. **Note what survives** - What's fundamentally sound?
6. **Design for reality** - Use insights to validate architecture

## Detailed Examples

### Example 1: Error Handling
- **Normal scale:** "Handle errors when they occur" works fine
- **At 1B scale:** Error volume overwhelms logging, crashes system
- **Reveals:** Need to make errors impossible (type systems) or expect them (chaos engineering)
- **Action:** Design error handling for volume, not just occurrence

### Example 2: Synchronous APIs
- **Normal scale:** Direct function calls work, < 100ms latency
- **At global scale:** Network latency makes synchronous unusable (200-500ms)
- **Reveals:** Async/messaging becomes survival requirement, not optimization
- **Action:** Design async-first from start

### Example 3: In-Memory State
- **Normal duration:** Works for hours/days in development
- **At years:** Memory grows unbounded, eventual crash (weeks → months → years)
- **Reveals:** Need persistence or periodic cleanup, can't rely on memory forever
- **Action:** Design for stateless or externalized state

### Example 4: Single vs Million Users
- **Normal scale:** Session in memory works for 100 users
- **At 1M scale:** Memory exhausted, server crashes
- **Reveals:** Need distributed session store (Redis, database)
- **Action:** Design for horizontal scaling from start

## Both Directions Matter

**Test smaller too:**
- What if only 1 user? Does complexity make sense?
- What if only 10 items? Is optimization premature?
- What if instant response? What becomes unnecessary?

Often reveals over-engineering or premature optimization.

## Red Flags

You need scale game when:
- "It works in dev" (but will it work in production?)
- No idea where limits are
- "Should scale fine" (without evidence)
- Surprised by production behavior
- Architecture feels arbitrary

## Success Metrics

After scale game, you should know:
- Where system breaks (exact limits)
- What survives (fundamentally sound parts)
- What needs redesign (scale-dependent)
- Production readiness (validated architecture)

## Remember

- Extremes reveal fundamentals hidden at normal scales
- What works at one scale fails at another
- Test BOTH directions (bigger AND smaller)
- Use insights to validate architecture early
- Don't guess - test at extremes


### simplification cascades

# Simplification Cascades

Find one insight eliminating multiple components. "If this is true, we don't need X, Y, Z."

## Core Principle

**Everything is a special case of...** collapses complexity dramatically.

One powerful abstraction > ten clever hacks.

## When to Use

| Symptom | Action |
|---------|--------|
| Same thing implemented 5+ ways | Abstract the common pattern |
| Growing special case list | Find the general case |
| Complex rules with exceptions | Find rule with no exceptions |
| Excessive config options | Find defaults working for 95% |

## The Pattern

**Look for:**
- Multiple implementations of similar concepts
- Special case handling everywhere
- "We need to handle A, B, C, D differently..."
- Complex rules with many exceptions

**Ask:** "What if they're all the same thing underneath?"

## Examples

### Example 1: Stream Abstraction
- **Before:** Separate handlers for batch/real-time/file/network data
- **Insight:** "All inputs are streams - just different sources"
- **After:** One stream processor, multiple stream sources
- **Eliminated:** 4 separate implementations

### Example 2: Resource Governance
- **Before:** Session tracking, rate limiting, file validation, connection pooling (all separate)
- **Insight:** "All are per-entity resource limits"
- **After:** One ResourceGovernor with 4 resource types
- **Eliminated:** 4 custom enforcement systems

### Example 3: Immutability
- **Before:** Defensive copying, locking, cache invalidation, temporal coupling
- **Insight:** "Treat everything as immutable data + transformations"
- **After:** Functional programming patterns
- **Eliminated:** Entire classes of synchronization problems

## Process

1. **List variations** - What's implemented multiple ways?
2. **Find essence** - What's the same underneath?
3. **Extract abstraction** - What's the domain-independent pattern?
4. **Test fit** - Do all cases fit cleanly?
5. **Measure cascade** - How many things become unnecessary?

## Red Flags

Signs you're missing a cascade:
- "Just need to add one more case..." (repeating forever)
- "These are similar but different" (maybe they're the same?)
- Refactoring feels like whack-a-mole (fix one, break another)
- Growing configuration file
- "Don't touch that, it's complicated" (complexity hiding pattern)

## Success Metrics

- **10x wins, not 10% improvements**
- Measure in "how many things can we delete?"
- Lines of code removed > lines added
- Configuration options eliminated
- Special cases unified

## Remember

- The pattern is usually already there, just needs recognition
- Valid cascades feel obvious in retrospect
- Test with "can this handle all existing cases?"
- Document the insight for future reference


### when stuck

# When Stuck - Problem-Solving Dispatch

Different stuck-types need different techniques. Match stuck-symptom to technique.

## Dispatch Flowchart

```
YOU'RE STUCK
│
├─ Complexity spiraling? Same thing 5+ ways? Growing special cases?
│  └─→ USE: Simplification Cascades
│
├─ Can't find fitting approach? Conventional solutions inadequate?
│  └─→ USE: Collision-Zone Thinking
│
├─ Same issue different places? Reinventing wheels? Feels familiar?
│  └─→ USE: Meta-Pattern Recognition
│
├─ Solution feels forced? "Must be done this way"? Stuck on assumptions?
│  └─→ USE: Inversion Exercise
│
├─ Will this work at production? Edge cases unclear? Unsure of limits?
│  └─→ USE: Scale Game
│
└─ Code broken? Wrong behavior? Test failing?
   └─→ USE: Debugging skill (systematic-debugging)
```

## Stuck-Type → Technique Map

| How You're Stuck | Symptom Details | Use This |
|------------------|-----------------|----------|
| **Complexity spiraling** | Same thing 5+ ways, growing special cases, excessive if/else | simplification-cascades.md |
| **Need innovation** | Conventional inadequate, can't find fitting approach, need breakthrough | collision-zone-thinking.md |
| **Recurring patterns** | Same issue different places, reinventing wheels, déjà vu feeling | meta-pattern-recognition.md |
| **Forced by assumptions** | "Must be done this way", can't question premise, forced solution | inversion-exercise.md |
| **Scale uncertainty** | Production unclear, edge cases unknown, unsure of limits | scale-game.md |
| **Code broken** | Wrong behavior, test failing, unexpected output | debugging skill |

## Process

1. **Identify stuck-type** - What symptom matches above?
2. **Load that technique** - Read the specific reference file
3. **Apply technique** - Follow its process
4. **Document attempt** - What worked/failed?
5. **If still stuck** - Try different technique or combine

## Combining Techniques

Some problems need multiple techniques:

- **Simplification + Meta-pattern** - Find pattern → simplify all instances
- **Collision + Inversion** - Force metaphor → invert assumptions
- **Scale + Simplification** - Test extremes → reveal what to eliminate
- **Meta-pattern + Scale** - Universal pattern → test at extremes

## When Nothing Works

If no technique helps:
1. **Reframe problem** - Are you solving the right problem?
2. **Get fresh perspective** - Explain to someone else
3. **Take break** - Distance often reveals solution
4. **Simplify scope** - Solve smaller version first
5. **Question constraints** - Are they real or assumed?

## Remember

- Match symptom to technique
- One technique at a time
- Combine if first doesn't work
- Document what you tried
- Not stuck forever, just temporarily


