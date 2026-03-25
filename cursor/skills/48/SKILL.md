---
name: ck:sequential-thinking
description: Apply step-by-step analysis for complex problems with revision capability. Use for multi-step reasoning, hypothesis verification, adaptive planning, problem decomposition, course correction.
version: 1.0.0
license: MIT
argument-hint: "[problem to analyze step-by-step]"
---

# Sequential Thinking

Structured problem-solving via manageable, reflective thought sequences with dynamic adjustment.

## When to Apply

- Complex problem decomposition
- Adaptive planning with revision capability
- Analysis needing course correction
- Problems with unclear/emerging scope
- Multi-step solutions requiring context maintenance
- Hypothesis-driven investigation/debugging

## Core Process

### 1. Start with Loose Estimate
```
Thought 1/5: [Initial analysis]
```
Adjust dynamically as understanding evolves.

### 2. Structure Each Thought
- Build on previous context explicitly
- Address one aspect per thought
- State assumptions, uncertainties, realizations
- Signal what next thought should address

### 3. Apply Dynamic Adjustment
- **Expand**: More complexity discovered → increase total
- **Contract**: Simpler than expected → decrease total
- **Revise**: New insight invalidates previous → mark revision
- **Branch**: Multiple approaches → explore alternatives

### 4. Use Revision When Needed
```
Thought 5/8 [REVISION of Thought 2]: [Corrected understanding]
- Original: [What was stated]
- Why revised: [New insight]
- Impact: [What changes]
```

### 5. Branch for Alternatives
```
Thought 4/7 [BRANCH A from Thought 2]: [Approach A]
Thought 4/7 [BRANCH B from Thought 2]: [Approach B]
```
Compare explicitly, converge with decision rationale.

### 6. Generate & Verify Hypotheses
```
Thought 6/9 [HYPOTHESIS]: [Proposed solution]
Thought 7/9 [VERIFICATION]: [Test results]
```
Iterate until hypothesis verified.

### 7. Complete Only When Ready
Mark final: `Thought N/N [FINAL]`

Complete when:
- Solution verified
- All critical aspects addressed
- Confidence achieved
- No outstanding uncertainties

## Application Modes

**Explicit**: Use visible thought markers when complexity warrants visible reasoning or user requests breakdown.

**Implicit**: Apply methodology internally for routine problem-solving where thinking aids accuracy without cluttering response.

## Scripts (Optional)

Optional scripts for deterministic validation/tracking:
- `scripts/process-thought.js` - Validate & track thoughts with history
- `scripts/format-thought.js` - Format for display (box/markdown/simple)

See README.md for usage examples. Use when validation/persistence needed; otherwise apply methodology directly.

## References

Load when deeper understanding needed:
- `references/core-patterns.md` - Revision & branching patterns
- `references/examples-api.md` - API design example
- `references/examples-debug.md` - Debugging example
- `references/examples-architecture.md` - Architecture decision example
- `references/advanced-techniques.md` - Spiral refinement, hypothesis testing, convergence
- `references/advanced-strategies.md` - Uncertainty, revision cascades, meta-thinking


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### advanced strategies

# Advanced Sequential Thinking Strategies

Additional sophisticated patterns for complex scenarios.

## Uncertainty Management

Handle incomplete information systematically.

```
Thought 2/7: Need to decide X
Thought 3/7: Insufficient data—two scenarios possible
Thought 4/7 [SCENARIO A if P true]: Analysis for A
Thought 4/7 [SCENARIO B if P false]: Analysis for B
Thought 5/7: Decision that works for both scenarios
Thought 6/7: Or determine critical info needed
Thought 7/7 [FINAL]: Robust solution or clear info requirement
```

**Use for**: Decisions under uncertainty, incomplete requirements.

**Strategies**:
- Find solution robust to uncertainty
- Identify minimal info needed to resolve
- Make safe assumptions with clear documentation

## Revision Cascade Management

Handle revisions that invalidate multiple subsequent thoughts.

```
Thought 1/8: Foundation assumption
Thought 2/8: Build on Thought 1
Thought 3/8: Further build
Thought 4/8: Discover Thought 1 invalid
Thought 5/8 [REVISION of Thought 1]: Corrected foundation
Thought 6/8 [REASSESSMENT]: Which of 2-3 still valid?
  - Thought 2: Partially valid, needs adjustment
  - Thought 3: Completely invalid
Thought 7/8: Rebuild from corrected Thought 5
Thought 8/8 [FINAL]: Solution on correct foundation
```

**Key**: After major revision, explicitly assess downstream impact.

## Meta-Thinking Calibration

Monitor and adjust thinking process itself.

```
Thought 5/9: [Regular thought]
Thought 6/9 [META]: Past 3 thoughts circling without progress
  Analysis: Missing key information
  Adjustment: Need to research X before continuing
Thought 7/9: Research findings on X
Thought 8/9: Now can proceed with informed decision
Thought 9/9: [Resume productive path]
```

**Use when**: Stuck, circling, or unproductive pattern noticed.
**Action**: Pause, identify issue, adjust strategy.

## Parallel Constraint Satisfaction

Handle multiple independent constraints simultaneously.

```
Thought 2/10: Solution must satisfy A, B, C
Thought 3/10 [CONSTRAINT A]: Solutions satisfying A: {X, Y, Z}
Thought 4/10 [CONSTRAINT B]: Solutions satisfying B: {Y, Z, W}
Thought 5/10 [CONSTRAINT C]: Solutions satisfying C: {X, Z}
Thought 6/10 [INTERSECTION]: Z satisfies all
Thought 7/10: Verify Z feasible
Thought 8/10 [BRANCH if infeasible]: Relax which constraint?
Thought 9/10: Decision on constraint relaxation if needed
Thought 10/10 [FINAL]: Optimal solution given constraints
```

**Use for**: Optimization problems, multi-criteria decisions.
**Pattern**: Analyze independently → Find intersection → Verify feasibility.


### advanced techniques

# Advanced Sequential Thinking Techniques

Complex problem-solving patterns.

## Spiral Refinement

Return to concepts with progressively deeper understanding.

```
Thought 1/7: Initial design (surface)
Thought 2/7: Discover constraint A
Thought 3/7: Refine for A
Thought 4/7: Discover constraint B
Thought 5/7: Refine for both A and B
Thought 6/7: Integration reveals edge case
Thought 7/7: Final design addressing all constraints
```

**Use for**: Complex systems where constraints emerge iteratively.
**Key**: Each return is refinement, not restart.

## Hypothesis-Driven Investigation

Systematic hypothesis generation and testing.

```
Thought 1/6: Observe symptoms
Thought 2/6 [HYPOTHESIS]: Explanation X
Thought 3/6 [VERIFICATION]: Test X—partial match
Thought 4/6 [REFINED HYPOTHESIS]: Adjusted Y
Thought 5/6 [VERIFICATION]: Test Y—confirmed
Thought 6/6 [FINAL]: Solution based on verified Y
```

**Use for**: Debugging, root cause analysis, diagnostics.
**Pattern**: Generate → Test → Refine → Re-test loop.

## Multi-Branch Convergence

Explore alternatives, then synthesize best approach.

```
Thought 2/8: Multiple viable approaches
Thought 3/8 [BRANCH A]: Approach A benefits
Thought 4/8 [BRANCH A]: Approach A drawbacks
Thought 5/8 [BRANCH B]: Approach B benefits
Thought 6/8 [BRANCH B]: Approach B drawbacks
Thought 7/8 [CONVERGENCE]: Hybrid combining A's X with B's Y
Thought 8/8 [FINAL]: Hybrid superior to either alone
```

**Use for**: Complex decisions where neither option clearly best.
**Key**: Convergence often yields better solution than either branch.

## Progressive Context Deepening

Build understanding in layers from abstract to concrete.

```
Thought 1/9: High-level problem
Thought 2/9: Identify major components
Thought 3/9: Zoom into component A (detailed)
Thought 4/9: Zoom into component B (detailed)
Thought 5/9: Identify A-B interactions
Thought 6/9: Discover emergent constraint
Thought 7/9 [REVISION of 3-4]: Adjust for interaction
Thought 8/9: Verify complete system
Thought 9/9 [FINAL]: Integrated solution
```

**Use for**: System design, architecture, integration problems.
**Pattern**: Abstract → Components → Details → Interactions → Integration.

## Reference

See `advanced-strategies.md` for: Uncertainty Management, Revision Cascade Management, Meta-Thinking Calibration, Parallel Constraint Satisfaction.


### core patterns

# Core Sequential Thinking Patterns

Essential revision and branching patterns.

## Revision Patterns

### Assumption Challenge
Early assumption proves invalid with new data.
```
Thought 1/5: Assume X is bottleneck
Thought 4/5 [REVISION of Thought 1]: X adequate; Y is actual bottleneck
```

### Scope Expansion
Problem larger than initially understood.
```
Thought 1/4: Fix bug
Thought 4/5 [REVISION of scope]: Architectural redesign needed, not patch
```

### Approach Shift
Initial strategy inadequate for requirements.
```
Thought 2/6: Optimize query
Thought 5/6 [REVISION of Thought 2]: Optimization + cache layer required
```

### Understanding Deepening
Later insight fundamentally changes interpretation.
```
Thought 1/5: Feature broken
Thought 4/5 [REVISION of Thought 1]: Not bug—UX confusion issue
```

## Branching Patterns

### Trade-off Evaluation
Compare approaches with different trade-offs.
```
Thought 3/7: Choose between X and Y
Thought 4/7 [BRANCH A]: X—simpler, less scalable
Thought 4/7 [BRANCH B]: Y—complex, scales better
Thought 5/7: Choose Y for long-term needs
```

### Risk Mitigation
Prepare backup for high-risk primary approach.
```
Thought 2/6: Primary: API integration
Thought 3/6 [BRANCH A]: API details
Thought 3/6 [BRANCH B]: Fallback: webhook
Thought 4/6: Implement A with B contingency
```

### Parallel Exploration
Investigate independent concerns separately.
```
Thought 3/8: Two unknowns—DB schema & API design
Thought 4/8 [BRANCH DB]: DB options
Thought 4/8 [BRANCH API]: API patterns
Thought 5/8: Integrate findings
```

### Hypothesis Testing
Test multiple explanations systematically.
```
Thought 2/6: Could be A, B, or C
Thought 3/6 [BRANCH A]: Test A—not cause
Thought 3/6 [BRANCH B]: Test B—confirmed
Thought 4/6: Root cause via Branch B
```

## Adjustment Guidelines

**Expand when**: Complexity discovered, multiple aspects identified, verification needed, alternatives require exploration.

**Contract when**: Key insight solves earlier, problem simpler, steps merge naturally.

**Example**:
```
Thought 1/5: Initial
Thought 3/7: Complexity (5→7)
Thought 5/8: Another aspect (7→8)
Thought 8/8 [FINAL]: Complete
```

## Anti-Patterns

**Premature Completion**: Rushing without verification → Add verification thoughts.

**Revision Cascade**: Repeated revisions without understanding why → Identify root cause.

**Branching Explosion**: Too many branches → Limit to 2-3, converge before more.

**Context Loss**: Ignoring earlier insights → Reference previous thoughts explicitly.


### examples api

# Example: API Design with Sequential Thinking

**Problem**: Design authentication API for multi-tenant SaaS.

## Without Sequential Thinking
"Use JWT with OAuth2. Add tenant ID to claims. Implement refresh tokens."
(Misses edge cases, scaling, security)

## With Sequential Thinking

```
Thought 1/5: Requirements

Multi-tenant SaaS authentication needs:
- Tenant isolation (prevent cross-tenant access)
- Scalability (thousands of tenants)
- Security (industry standards)

Uncertainty: Session vs token? Stateful vs stateless?
Next: Evaluate approaches

Thought 2/6: Approach evaluation (adjusted)

Comparing session vs JWT:
- Session: Server state, easy revocation, harder scaling
- JWT: Stateless, scales well, complex revocation

Multi-tenancy complicates sessions (which DB?).
JWT better for distributed systems.
Next: JWT structure

Thought 3/6: JWT payload design

JWT includes: User ID, Tenant ID, Permissions, Expiration

Uncertainty: Where verify tenant? Gateway vs service?
Next: Token refresh

Thought 4/6 [REVISION of Thought 3]: Security fix

Original: Tenant ID in JWT claims.
Issue: Claims visible (base64), could read tenant IDs.

Corrected:
- Keep tenant ID (needed for routing)
- Add gateway verification
- Log access attempts

Impact: Need gateway security layer

Thought 5/7: Refresh strategy (adjusted)

Access: 15 min
Refresh: 7 days, rotate on use

Storage:
- Access: Client memory
- Refresh: HttpOnly cookie + DB revocation

Enables revocation + stateless benefits.

Thought 6/7: Gateway flow

1. Verify JWT signature
2. Extract tenant ID
3. Verify user belongs to tenant (cache + DB)
4. Forward with verified context

Addresses Thought 4 security concern.

Thought 7/7 [FINAL]: Complete solution

- JWT with refresh rotation
- Tenant ID + gateway verification
- 15-min access, 7-day refresh
- HttpOnly cookies + revocation DB
- Gateway enforces isolation

Confidence: High
Assumptions: Distributed, centralized gateway
Trade-offs: Slight latency vs security
```

## Key Outcomes

1. **Revision caught security issue**: Tenant ID visibility
2. **Dynamic adjustment**: 5→7 thoughts as complexity emerged
3. **Comprehensive**: Authentication, authorization, multi-tenancy, revocation


### examples architecture

# Example: Architecture Decision with Sequential Thinking

**Problem**: Choose state management for growing React app.

## Sequential Thinking Approach

```
Thought 1/4: Initial assessment

React app growing complex. useState scattered across components.
Need centralized state management.
Options: Redux, MobX, Zustand, Context API, Jotai.

Next: Define requirements

Thought 2/5: Requirements (adjusted up)

App needs:
- Real-time updates (WebSocket)
- Offline support
- Complex nested state
- Multiple devs (maintainability)
- TypeScript (type safety)

These eliminate simpler solutions.
Next: Evaluate remaining options

Thought 3/5 [REVISION of Thought 1]: Scope refinement

Original assumption: Need global state management.
Realization: Not all state needs centralization.

Better breakdown:
- Server state (API data): React Query
- UI state (modals, forms): Local useState
- Auth state: Context API
- App-wide settings: Simple global store

This reduces problem scope significantly.
Changes evaluation criteria.
Next: Re-evaluate with refined scope

Thought 4/6: Re-evaluation (adjusted)

Only need lightweight store for app-wide settings.
Zustand fits:
- Minimal boilerplate
- Excellent TypeScript support
- No provider wrapper
- ~1KB size

React Query handles server state (caching, refetch, offline).
Most state stays local.

Next: Verify this handles all requirements

Thought 5/6 [HYPOTHESIS]: Hybrid approach

Hypothesis: Zustand + React Query + local state solves needs.

- Zustand: Theme, user prefs, global UI flags
- React Query: All server data, caching, sync
- useState: Component-local UI

Benefits: Simple, performant, maintainable.
Uncertainty: Real-time updates?

Thought 6/6 [FINAL]: Verified solution

React Query supports WebSocket via custom hooks.
Zustand handles global UI simply.
Local state for component-specific needs.

Architecture decision:
- Zustand for global UI state
- React Query for all server interactions
- Local useState for component state

Confidence: High
Assumptions: Team comfortable with React Query patterns
Benefits: Simpler than Redux, more powerful than Context
Trade-offs: Learning curve for React Query (but worthwhile)
```

## Key Insights

1. **Scope revision crucial**: Original "need global state" reframed to specific state categories
2. **Separation of concerns**: Different state types need different solutions
3. **Hypothesis verification**: Confirmed WebSocket support before finalizing
4. **Simpler is better**: Avoided over-engineering with heavy Redux solution

## Impact of Revision

Without Thought 3 revision, might have chosen Redux for all state—significant over-engineering. Revision led to more appropriate, simpler solution.


### examples debug

# Example: Performance Debugging with Sequential Thinking

**Problem**: API endpoint slow (2-3s instead of <200ms).

## Sequential Thinking Approach

```
Thought 1/5: Initial investigation

Endpoint: GET /api/users/{id}/dashboard
Expected: <200ms
Actual: 2-3s

Need to identify bottleneck.
Next: Analyze endpoint logic

Thought 2/5: Endpoint analysis

Dashboard fetches:
- User profile
- Recent activities (last 50)
- Notifications (unread)
- Analytics summary

Each is separate DB query. Could be N+1 problem.
Next: Profile actual execution

Thought 3/6: Profiling results (adjusted up—more complex)

Profiling:
- User profile: 20ms
- Activities: 1800ms (!!)
- Notifications: 100ms
- Analytics: 80ms

Activities query is bottleneck (90% of time).
Need to examine that query.
Next: Investigate activities query

Thought 4/6 [BRANCH A]: Hypothesis - N+1 query

Activities table has user_id FK to users.
Query might fetch activities, then user for each (N+1).
Verification: Check if uses joins or loops.

Thought 4/6 [BRANCH B]: Hypothesis - Missing index

Activities table might lack index on user_id + created_at.
Without index, full table scan for user's activities.
Verification: Check table indexes.

Thought 5/6 [VERIFICATION]: Testing hypotheses

Query examination: Uses proper joins (not N+1).
Index check: user_id indexed, NOT created_at.
Query filters by user_id AND sorts by created_at.

Branch B confirmed: Missing composite index causes slow sort.
Branch A eliminated: No N+1 issue.

Root cause identified.
Next: Implement solution

Thought 6/6 [FINAL]: Solution and verification

Create composite index:
```sql
CREATE INDEX idx_activities_user_created
ON activities(user_id, created_at DESC);
```

Tested: Response time now 120ms (target met).

Confidence: High (verified with profiling)
Result: 95% performance improvement
```

## Key Techniques Demonstrated

1. **Branching for hypothesis testing**: Explored N+1 vs index hypotheses in parallel
2. **Verification before solution**: Tested both hypotheses systematically
3. **Data-driven decisions**: Used profiling data to guide investigation
4. **Dynamic adjustment**: Expanded thought count when complexity emerged
5. **Elimination method**: Ruled out N+1, confirmed index issue

## Comparison

**Without sequential thinking**: Might jump to N+1 conclusion (common issue), waste time optimizing wrong thing.

**With sequential thinking**: Systematically tested hypotheses, identified actual root cause, implemented correct fix.


