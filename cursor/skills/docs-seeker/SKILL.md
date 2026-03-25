---
name: ck:docs-seeker
description: Search library/framework documentation via llms.txt (context7.com). Use for API docs, GitHub repository analysis, technical documentation lookup, latest library features.
version: 3.1.0
argument-hint: "[library-name] [topic]"
---

# Documentation Discovery via Scripts

## Overview

**Script-first** documentation discovery using llms.txt standard.

Execute scripts to handle entire workflow - no manual URL construction needed.

## Primary Workflow

**ALWAYS execute scripts in this order:**

```bash
# 1. DETECT query type (topic-specific vs general)
node scripts/detect-topic.js "<user query>"

# 2. FETCH documentation using script output
node scripts/fetch-docs.js "<user query>"

# 3. ANALYZE results (if multiple URLs returned)
cat llms.txt | node scripts/analyze-llms-txt.js -
```

Scripts handle URL construction, fallback chains, and error handling automatically.

## Scripts

**`detect-topic.js`** - Classify query type
- Identifies topic-specific vs general queries
- Extracts library name + topic keyword
- Returns JSON: `{topic, library, isTopicSpecific}`
- Zero-token execution

**`fetch-docs.js`** - Retrieve documentation
- Constructs context7.com URLs automatically
- Handles fallback: topic → general → error
- Outputs llms.txt content or error message
- Zero-token execution

**`analyze-llms-txt.js`** - Process llms.txt
- Categorizes URLs (critical/important/supplementary)
- Recommends agent distribution (1 agent, 3 agents, 7 agents, phased)
- Returns JSON with strategy
- Zero-token execution

## Workflow References

**[Topic-Specific Search](./workflows/topic-search.md)** - Fastest path (10-15s)

**[General Library Search](./workflows/library-search.md)** - Comprehensive coverage (30-60s)

**[Repository Analysis](./workflows/repo-analysis.md)** - Fallback strategy

## References

**[context7-patterns.md](./references/context7-patterns.md)** - URL patterns, known repositories

**[errors.md](./references/errors.md)** - Error handling, fallback strategies

**[advanced.md](./references/advanced.md)** - Edge cases, versioning, multi-language

## Execution Principles

1. **Scripts first** - Execute scripts instead of manual URL construction
2. **Zero-token overhead** - Scripts run without context loading
3. **Automatic fallback** - Scripts handle topic → general → error chains
4. **Progressive disclosure** - Load workflows/references only when needed
5. **Agent distribution** - Scripts recommend parallel agent strategy

## Quick Start

**Topic query:** "How do I use date picker in shadcn?"
```bash
node scripts/detect-topic.js "<query>"  # → {topic, library, isTopicSpecific}
node scripts/fetch-docs.js "<query>"    # → 2-3 URLs
# Read URLs with WebFetch
```

**General query:** "Documentation for Next.js"
```bash
node scripts/detect-topic.js "<query>"         # → {isTopicSpecific: false}
node scripts/fetch-docs.js "<query>"           # → 8+ URLs
cat llms.txt | node scripts/analyze-llms-txt.js -  # → {totalUrls, distribution}
# Deploy agents per recommendation
```

## Environment

Scripts load `.env`: `process.env` > `.claude/skills/docs-seeker/.env` > `.claude/skills/.env` > `.claude/.env`

See `.env.example` for configuration options.


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### advanced

# Advanced Scenarios & Edge Cases

## Multi-Language Documentation

**Challenge:** Docs in multiple languages

**Approach:**
1. Identify target language from user
2. Search for language-specific llms.txt
   - `llms-es.txt`, `llms-ja.txt`
3. Fallback to English if not found
4. Note language limitations in report

## Version-Specific Documentation

**Latest (default):**
- Use base llms.txt URL
- No version specifier needed

**Specific version:**
```
WebSearch: "[library] v[version] llms.txt"
Check paths:
- /v2/llms.txt
- /docs/v2/llms.txt
- /{version}/llms.txt

For repos:
git checkout v[version] or tags/[version]
```

## Framework with Plugins

**Challenge:** Core framework + 50 plugins

**Strategy:**
1. Focus on core framework first
2. Ask user which plugins needed
3. Launch targeted search for specific plugins
4. Note available plugins in report
5. Don't document everything upfront

## Documentation Under Construction

**Signs:**
- New release with incomplete docs
- Many "Coming soon" pages
- GitHub issues requesting docs

**Approach:**
1. Note status upfront in report
2. Combine available docs + repo analysis
3. Check tests/ and examples/ directories
4. Clearly mark "inferred from code"
5. Link to GitHub issues for updates

## Conflicting Information

**When sources disagree:**
1. Identify primary official source
2. Note version differences
3. Present both approaches with context
4. Recommend official/latest
5. Explain why conflict exists

**Priority order:**
1. Official docs (latest version)
2. Official docs (versioned)
3. GitHub README
4. Community tutorials
5. Stack Overflow

## Rate Limiting

**If hitting API limits:**
- Use CONTEXT7_API_KEY from .env
- Implement exponential backoff
- Cache results in session
- Batch requests where possible


### context7 patterns

# context7.com URL Patterns

## Topic-Specific URLs (Priority #1)

**Pattern:** `https://context7.com/{path}/llms.txt?topic={keyword}`

**When to use:** User asks about specific feature/component

**Examples:**
```
shadcn/ui date picker
→ https://context7.com/shadcn-ui/ui/llms.txt?topic=date

Next.js caching
→ https://context7.com/vercel/next.js/llms.txt?topic=cache

Better Auth OAuth
→ https://context7.com/better-auth/better-auth/llms.txt?topic=oauth

FFmpeg compression
→ https://context7.com/websites/ffmpeg_doxygen_8_0/llms.txt?topic=compress
```

**Benefits:** Returns ONLY relevant docs, 10x faster, minimal tokens

## General Library URLs (Priority #2)

**GitHub repos:** `https://context7.com/{org}/{repo}/llms.txt`

**Websites:** `https://context7.com/websites/{normalized-path}/llms.txt`

## Known Repository Mappings

```
next.js → vercel/next.js
nextjs → vercel/next.js
astro → withastro/astro
remix → remix-run/remix
shadcn → shadcn-ui/ui
shadcn/ui → shadcn-ui/ui
better-auth → better-auth/better-auth
```

## Official Site Fallbacks

Use ONLY if context7.com unavailable:
```
Astro: https://docs.astro.build/llms.txt
Next.js: https://nextjs.org/llms.txt
Remix: https://remix.run/llms.txt
SvelteKit: https://kit.svelte.dev/llms.txt
```

## Topic Keyword Normalization

**Rules:**
- Lowercase
- Remove special chars
- Use first word for multi-word topics
- Max 20 chars

**Examples:**
```
"date picker" → "date"
"OAuth" → "oauth"
"Server-Side" → "server"
"caching strategies" → "caching"
```


### errors

# Error Handling & Fallback Strategies

## Error Codes

**404 Not Found**
- Topic-specific URL not available
- Library not on context7.com
- llms.txt doesn't exist

**Timeout**
- Network issues
- Large repository clone
- Slow API response

**Invalid Response**
- Malformed llms.txt
- Empty content
- Invalid URLs

## Fallback Chain

### For Topic-Specific Queries

```
1. Try topic-specific URL
   https://context7.com/{library}/llms.txt?topic={keyword}
   ↓ 404
2. Try general library URL
   https://context7.com/{library}/llms.txt
   ↓ 404
3. WebSearch for llms.txt
   "[library] llms.txt site:[official domain]"
   ↓ Not found
4. Repository analysis
   Use Repomix on GitHub repo
```

### For General Library Queries

```
1. Try context7.com
   https://context7.com/{library}/llms.txt
   ↓ 404
2. WebSearch for llms.txt
   "[library] llms.txt"
   ↓ Not found
3. Repository analysis
   Clone + Repomix
   ↓ No repo
4. Research agents
   Deploy multiple Researcher agents
```

## Timeout Handling

**Set limits:**
- WebFetch: 60s
- Repository clone: 5min
- Repomix: 10min

**Fail fast:** Don't retry failed methods

## Empty Results

**If llms.txt has 0 URLs:**
→ Note in report
→ Try repository analysis
→ Check official website manually




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
