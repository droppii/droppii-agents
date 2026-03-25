---
name: ck:frontend-design
description: Create polished frontend interfaces from designs/screenshots/videos. Use for web components, 3D experiences, replicating UI designs, quick prototypes, immersive interfaces, avoiding AI slop.
license: Complete terms in LICENSE.txt
---

Create distinctive, production-grade frontend interfaces. Implement real working code with exceptional aesthetic attention.

## Workflow Selection

Choose workflow based on input type:

| Input | Workflow | Reference |
|-------|----------|-----------|
| Screenshot | Replicate exactly | `./references/workflow-screenshot.md` |
| Video | Replicate with animations | `./references/workflow-video.md` |
| Screenshot/Video (describe only) | Document for devs | `./references/workflow-describe.md` |
| 3D/WebGL request | Three.js immersive | `./references/workflow-3d.md` |
| Quick task | Rapid implementation | `./references/workflow-quick.md` |
| Complex/award-quality | Full immersive | `./references/workflow-immersive.md` |
| From scratch | Design Thinking below | - |

**All workflows**: Activate `ck:ui-ux-pro-max` skill FIRST for design intelligence.

## Screenshot/Video Replication (Quick Reference)

1. **Analyze** with `ck:ai-multimodal` skill - extract colors, fonts, spacing, effects
2. **Plan** with `ui-ux-designer` subagent - create phased implementation
3. **Implement** - match source precisely
4. **Verify** - compare to original
5. **Document** - update `./docs/design-guidelines.md` if approved

See specific workflow files for detailed steps.

## Design Thinking (From Scratch)

Before coding, commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Execute with precision. Bold maximalism and refined minimalism both work - intentionality is key.

## Aesthetics Guidelines

- **Typography**: Avoid Arial/Inter; use distinctive, characterful fonts. Pair display + body fonts.
- **Color**: Commit to cohesive palette. CSS variables. Dominant colors with sharp accents.
- **Motion**: CSS-first, anime.js for complex (`./references/animejs.md`). Orchestrated page loads > scattered micro-interactions.
- **Spatial**: Unexpected layouts. Asymmetry. Overlap. Negative space OR controlled density.
- **Backgrounds**: Atmosphere over solid colors. Gradients, noise, patterns, shadows, grain.
- **Assets**: Generate with `ck:ai-multimodal`, process with `ck:media-processing`

## Asset & Analysis References

| Task | Reference |
|------|-----------|
| Generate assets | `./references/asset-generation.md` |
| Analyze quality | `./references/visual-analysis-overview.md` |
| Extract guidelines | `./references/design-extraction-overview.md` |
| Optimization | `./references/technical-overview.md` |
| Animations | `./references/animejs.md` |

Quick start: `./references/ai-multimodal-overview.md`

## Anti-Patterns (AI Slop)

NEVER use:
- Overused fonts: Inter, Roboto, Arial, Space Grotesk
- Cliched colors: purple gradients on white
- Predictable layouts, cookie-cutter patterns

DO:
- Vary themes (light/dark), fonts, aesthetics per project
- Match complexity to vision (maximalist = elaborate; minimalist = precise)
- Make unexpected, context-specific choices

Remember: Claude is capable of extraordinary creative work. Commit fully to distinctive visions.


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### ai multimodal overview

# AI Multimodal Integration for Frontend Design

Entry point for using the `ck:ai-multimodal` skill to generate and analyze visual assets that align with frontend design thinking and aesthetic guidelines.

## When to Use

Use `ck:ai-multimodal` in frontend design when you need to:

**Asset Generation**:
- Generate hero images, background assets, decorative elements
- Create placeholder images with specific aesthetic qualities
- Produce marketing visuals that match UI design language
- Generate icon sets, illustrations, or graphic elements
- Create texture overlays, gradient meshes, or background patterns
- Prototype visual concepts before implementing in code

**Visual Analysis**:
- Analyze generated assets to verify they meet design standards
- Compare multiple variations objectively with ratings
- Extract exact color palettes with hex codes for implementation
- Test assets with UI overlays for readability and contrast

**Design Extraction**:
- Extract design guidelines from existing images or videos
- Analyze competitor designs to understand their approach
- Reverse-engineer design systems from inspiration screenshots
- Create documented guidelines based on visual analysis
- Establish consistent aesthetic direction from references

## Core Principles

### 1. Design-Driven Generation
**NEVER** generate generic AI imagery. Every asset must align with:
- The chosen aesthetic direction (brutalism, maximalism, retro-futurism, etc.)
- Typography system and visual hierarchy
- Color palette and theme consistency
- Overall design story and purpose

### 2. Contextual Asset Creation
Assets aren't standalone—they're part of a cohesive interface. Consider:
- **Purpose**: Hero image vs. background texture vs. decorative element
- **Integration**: How it interacts with overlaid text, buttons, forms
- **Technical constraints**: File size, aspect ratio, responsive behavior
- **Accessibility**: Color contrast, text readability, decorative vs. informative

### 3. Analysis is Mandatory
Never integrate assets without comprehensive analysis:
- Score quality objectively (1-10 scale, minimum 7/10)
- Extract specific values: hex codes, not "blue"; px sizes, not "large"
- Compare multiple variations before deciding
- Test with UI overlays, not in isolation

### 4. Learn from Excellence
Extract design systems systematically from high-quality references:
- Analyze 3-5 screens to identify patterns
- Document actionably with CSS variables and exact values
- Validate predictions (fonts, colors) manually
- Adapt principles contextually, don't copy blindly

## Workflow Quick Reference

### For Asset Generation
**See**: `asset-generation.md`

1. Define design context (aesthetic, colors, typography, tone)
2. Craft design-driven prompts (not generic)
3. Generate with appropriate Imagen 4 model
4. Analyze and verify quality (score ≥ 7/10)
5. Iterate or integrate based on results

**Models**: imagen-4.0-generate-001 (standard), imagen-4.0-ultra-generate-001 (production), imagen-4.0-fast-generate-001 (iteration)

### For Visual Analysis
**See**: `visual-analysis.md`

1. Define evaluation criteria (context-specific)
2. Run comprehensive analysis with structured prompts
3. Compare multiple variations objectively
4. Extract color palettes with hex codes
5. Test integration with UI elements

**Model**: gemini-2.5-flash (vision understanding)

### For Design Extraction
**See**: `design-extraction.md`

1. Capture high-quality reference screenshots
2. Extract comprehensive design elements systematically
3. Analyze multiple screens for consistent patterns
4. Extract motion guidelines from videos (if applicable)
5. Document actionably with CSS-ready specifications

**Model**: gemini-2.5-flash (vision understanding)

## Integration with Other Skills

### With `aesthetic` Skill
Use `aesthetic` for overall design system guidance and quality evaluation framework. Then use `ck:frontend-design` with `ck:ai-multimodal` for asset generation and analysis that follows those guidelines.

### With `ck:chrome-devtools` Skill
Use `ck:chrome-devtools` to capture full-screen screenshots from inspiration websites for design extraction. Capture at actual viewport size, not full-page scrolls.

### With `ui-styling` Skill
Generate and analyze assets first, then implement using shadcn/ui + Tailwind with colors/styles that complement the generated imagery.

### With `web-frameworks` Skill
Optimize generated assets for Next.js App Router: image optimization, responsive images, lazy loading.

### With `ck:media-processing` Skill
Post-process generated assets: resize, compress, add filters, create compositions using FFmpeg/ImageMagick.

## Navigation

**Detailed Workflows**:
- `asset-generation.md` - Complete generation workflow with prompt strategies
- `visual-analysis.md` - Analysis and verification workflow
- `design-extraction.md` - Extract guidelines from existing designs

**Additional Resources**:
- `technical-guide.md` - File optimization, examples, checklists, common pitfalls
- `animejs.md` - Animation implementation for frontend

## Quick Commands

**Generate asset**:
```bash
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "[design-driven prompt]" \
  --output docs/assets/[name] \
  --model imagen-4.0-generate-001 \
  --aspect-ratio 16:9
```

**Analyze asset**:
```bash
python scripts/gemini_batch_process.py \
  --files docs/assets/[image].png \
  --task analyze \
  --prompt "[evaluation criteria]" \
  --output docs/assets/analysis.md \
  --model gemini-2.5-flash
```

**Extract design guidelines**:
```bash
python scripts/gemini_batch_process.py \
  --files docs/inspiration/[reference].png \
  --task analyze \
  --prompt "[extraction criteria from design-extraction.md]" \
  --output docs/design-guidelines/extracted.md \
  --model gemini-2.5-flash
```

## Remember

1. **Design First, Generate Second**: Start with design thinking, not generation capabilities
2. **Context is King**: Every asset serves the interface, not itself
3. **Iterate Ruthlessly**: First generation is rarely final—evaluate and refine
4. **Analysis is Mandatory**: Never integrate without comprehensive verification (≥7/10)
5. **Demand Specifics**: Hex codes not "blue", px not "large", ms not "fast"
6. **Learn from Excellence**: Extract design systems from high-quality references systematically
7. **Adapt, Don't Copy**: Understand principles, apply contextually to your unique design

Generate assets that elevate frontend design, maintain aesthetic consistency, and serve user experience—never generic, always contextual.


### analysis best practices

# Analysis Best Practices

Quality guidelines and common pitfalls.

## Analysis Best Practices

### 1. Be Specific
❌ Generic: "Is this image good?"
✓ Specific: "Does this align with brutalist aesthetic? Rate text overlay suitability."

### 2. Use Structured Prompts
Format analysis requests with numbered criteria for actionable feedback:
```
1. [Criterion A]
2. [Criterion B]
3. [Criterion C]
Overall Rating: X/10
```

### 3. Request Hex Codes
❌ Accept: "The image uses blue tones"
✓ Demand: "Extract hex codes: #1E40AF, #3B82F6, #60A5FA"

### 4. Compare Variations
Never settle for the first generation without comparison:
- Generate 3+ variations
- Analyze comparatively
- Select objectively based on scores

### 5. Test Integration Context
Analyze assets *with* UI elements overlaid, not in isolation:
- Mock up text overlays
- Test with actual buttons and CTAs
- Evaluate in responsive contexts

### 6. Document Decisions
Save analysis reports for design system documentation:
```
docs/
  assets/
    hero-image.png
    hero-analysis.md       # Analysis report
    hero-color-palette.md  # Extracted colors
  design-guidelines/
    asset-usage.md         # Guidelines derived from analysis
```

## Common Analysis Pitfalls

### ❌ Vague Feedback
Analysis returns: "Colors are nice"
**Fix**: Request specific hex codes and harmony evaluation

### ❌ No Numeric Rating
Analysis returns: "Pretty good quality"
**Fix**: Always request 1-10 rating with justification

### ❌ Missing Context
Analyzing asset without specifying intended use
**Fix**: Include context in prompt (hero section, background, marketing, etc.)

### ❌ Single Analysis Point
Only checking aesthetic, ignoring technical or integration concerns
**Fix**: Use comprehensive evaluation template covering all dimensions

## Evaluation Criteria

### Core Evaluation Points
- Visual coherence with chosen aesthetic direction
- Color harmony and palette consistency
- Composition balance and focal points
- Typography compatibility (if text overlay needed)
- Professional quality rating (1-10 scale)
- Technical suitability (aspect ratio, resolution, file characteristics)

### Context-Specific Points
- **For hero sections**: Suitability for text overlay, visual hierarchy support
- **For backgrounds**: Subtlety, pattern repetition quality, texture detail
- **For marketing**: Brand alignment, emotional impact, attention-grabbing power
- **For decorative elements**: Integration potential, visual weight, uniqueness


### analysis prompts

# Analysis Prompt Templates

Complete prompt templates for visual analysis and verification.

## Comprehensive Analysis Prompt

```
Analyze this design asset comprehensively:

## Design Alignment
- Aesthetic Direction: [e.g., brutalist/minimalist/maximalist]
- Expected Style: [describe target aesthetic]
- Color Palette Target: [list expected colors]

## Evaluation Criteria
1. Visual Coherence: Does it match the intended aesthetic direction?
2. Color Analysis: List dominant colors (hex codes). Evaluate harmony and mood.
3. Composition: Analyze balance, focal points, negative space, visual flow.
4. Typography Compatibility: Rate suitability for overlaying text (consider contrast, busy areas).
5. Professional Quality: Rate 1-10 with justification.
6. Technical Assessment: Resolution quality, compression artifacts, aspect ratio correctness.

## Specific Feedback
- What works well?
- What specific elements need improvement?
- What would elevate this to 9/10 quality?

## Overall Rating: X/10
Provide final score with clear reasoning.
```

## Comparison Analysis Prompt

```
Compare these 3 design variations:

For each image, evaluate:
1. Aesthetic alignment with [design direction]
2. Color effectiveness
3. Composition strength
4. Text overlay suitability
5. Professional quality rating (1-10)

Then provide:
- Ranking: Best to worst with justification
- Recommendation: Which to use and why
- Hybrid suggestion: Best elements from each to combine
```

## Color Extraction Prompt

```
Extract the complete color palette from this image:

1. Identify 5-8 dominant colors with hex codes
2. Classify each: primary, accent, neutral, or background
3. Suggest CSS variable names (e.g., --color-primary-500)
4. Evaluate color accessibility (WCAG contrast ratios)
5. Recommend which colors work for text, backgrounds, accents

Provide as structured data for easy CSS implementation.
```

## Integration Testing Prompt

```
Analyze this design asset with UI elements overlaid:

1. Text Readability: Can all text be read clearly?
2. Contrast Issues: Identify any WCAG violations
3. Visual Hierarchy: Do buttons and CTAs stand out?
4. Spacing Problems: Any crowding or poor breathing room?
5. Responsive Concerns: Will this work on mobile at 9:16?

Provide specific recommendations for adjustments.
```

## A/B Testing Prompt

```
A/B test analysis:

Design A: [minimalist approach]
Design B: [maximalist approach]

Compare for:
1. User attention capture (first 3 seconds)
2. Information hierarchy clarity
3. Emotional impact and brand perception
4. Conversion optimization potential
5. Target audience alignment ([describe audience])

Recommend which to A/B test in production and why.
```

## Quick Quality Check Template

```
Rate this asset 1-10 for:
1. Aesthetic quality
2. Color harmony
3. Composition balance
4. Professional polish

Overall: X/10. Brief justification.
```

## Comprehensive Evaluation Template

```
Comprehensive design asset evaluation:

## Aesthetic Alignment
- Target style: [describe]
- Actual style: [analyze]
- Match quality: [1-10]

## Technical Quality
- Resolution: [assess]
- Compression: [check artifacts]
- Aspect ratio: [verify]

## Color Analysis
- Dominant colors: [list hex codes]
- Harmony: [evaluate]
- Mood: [describe]

## Composition
- Balance: [analyze]
- Focal points: [identify]
- Negative space: [evaluate]

## Integration Readiness
- Text overlay: [rate 1-10]
- UI compatibility: [assess]
- Responsive suitability: [evaluate]

Overall Score: X/10
Key Strengths: [list]
Improvements Needed: [list]
```


### analysis techniques

# Advanced Analysis Techniques

Advanced strategies for visual analysis and testing.

## Batch Analysis for Rapid Iteration

Analyze multiple generations simultaneously:

```bash
# Generate 3 variations with fast model
for i in {1..3}; do
  python scripts/gemini_batch_process.py \
    --task generate \
    --prompt "[prompt with variation-$i twist]" \
    --output docs/assets/var-$i \
    --model imagen-4.0-fast-generate-001 \
    --aspect-ratio 16:9
done

# Batch analyze all variations
python scripts/gemini_batch_process.py \
  --files docs/assets/var-*.png \
  --task analyze \
  --prompt "Rank these variations 1-3 with scores. Identify winner." \
  --output docs/assets/batch-analysis.md \
  --model gemini-2.5-flash
```

## Contextual Testing

Test assets in actual UI context:

1. **Mock up UI overlay** (use design tool or code)
2. **Capture screenshot** of asset with real UI elements
3. **Analyze integrated version** for readability, hierarchy, contrast

```bash
# After creating mockup with UI overlay
python scripts/gemini_batch_process.py \
  --files docs/assets/hero-mockup-with-ui.png \
  --task analyze \
  --prompt "Evaluate this hero section with actual UI:
1. Headline readability over image
2. CTA button visibility and contrast
3. Navigation bar integration
4. Overall visual hierarchy effectiveness
Provide WCAG contrast ratio estimates." \
  --output docs/assets/ui-integration-test.md \
  --model gemini-2.5-flash
```

## A/B Testing Analysis

Compare design directions objectively:

```bash
python scripts/gemini_batch_process.py \
  --files docs/assets/design-a.png docs/assets/design-b.png \
  --task analyze \
  --prompt "A/B test analysis:

Design A: [minimalist approach]
Design B: [maximalist approach]

Compare for:
1. User attention capture (first 3 seconds)
2. Information hierarchy clarity
3. Emotional impact and brand perception
4. Conversion optimization potential
5. Target audience alignment ([describe audience])

Recommend which to A/B test in production and why." \
  --output docs/assets/ab-test-analysis.md \
  --model gemini-2.5-flash
```

## Iteration Strategy

When score < 6/10:

1. **Identify top 3 weaknesses** from analysis
2. **Address each in refined prompt**
3. **Regenerate with fast model** first
4. **Re-analyze before committing** to standard model
5. **Iterate until score ≥ 7/10**

Example:
```bash
# First attempt scores 5/10 - "colors too muted, composition unbalanced"

# Refine prompt addressing specific issues
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "[original prompt] + vibrant saturated colors, dynamic diagonal composition" \
  --output docs/assets/hero-v2 \
  --model imagen-4.0-fast-generate-001

# Re-analyze
python scripts/gemini_batch_process.py \
  --files docs/assets/hero-v2.png \
  --task analyze \
  --prompt "[same evaluation criteria]" \
  --output docs/assets/analysis-v2.md
```

## Documentation Strategy

Save analysis reports for design system documentation:

```
docs/
  assets/
    hero-image.png
    hero-analysis.md       # Analysis report
    hero-color-palette.md  # Extracted colors
  design-guidelines/
    asset-usage.md         # Guidelines derived from analysis
```


### animejs

# Anime.js v4 Reference Guide for AI Assistants

## 🚨 CRITICAL: ALWAYS USE ANIME.JS V4 SYNTAX 🚨

**This project uses Anime.js v4.x.x - DO NOT use v3 syntax under any circumstances**

**If you're about to write `import anime from 'animejs'` - STOP!**
**That's v3. This project uses v4. Use the correct import below.**

## 🚀 Quick Start - Essential Setup

### 1. Correct v4 Import (REQUIRED)
```javascript
// ✅ CORRECT v4 imports
import { animate, createTimeline, stagger, utils, svg, eases, engine } from 'animejs';

// ❌ WRONG v3 import - NEVER USE THIS
// import anime from 'animejs';
```

### 2. Configure Time Units to Seconds (SET ONCE IN APP ENTRY POINT)
```javascript
// ⚠️ IMPORTANT: Set this ONLY ONCE in your app's main entry point
// For React: App.js/App.tsx or index.js/index.tsx
// For Vue: main.js/main.ts
// For vanilla JS: The main script file that loads first

import { engine } from 'animejs';

// Set ONLY in the app's entry point, NOT in components
engine.timeUnit = 's';

// Now ALL durations use seconds everywhere: 1 = 1 second, 0.5 = 500ms
// DO NOT set this in individual components - it's a global setting!
```

### 3. Single-Line Format for Simple Animations (REQUIRED)
```javascript
// ✅ GOOD - Clean, readable, one line for simple tweens
animate('.element', { x: 250, duration: 1, ease: 'outQuad' });

// ❌ BAD - Unnecessary multi-line for simple tweens
animate('.element', {
  x: 250,
  duration: 1,
  ease: 'outQuad'
});
```

## ✅ Quick Validation Checklist

Before generating anime.js code, verify:
- [ ] Using `import { animate, ... } from 'animejs'` NOT `import anime`
- [ ] Set `engine.timeUnit = 's'` ONLY ONCE in app entry point (NOT in components)
- [ ] Using seconds for all durations (1 = 1 second)
- [ ] Simple animations on ONE LINE
- [ ] Using `animate()` NOT `anime()`
- [ ] Using `createTimeline()` NOT `anime.timeline()`
- [ ] Using `ease:` NOT `easing:`
- [ ] Using `to:` for values, NOT `value:`
- [ ] Using `on` prefix for callbacks (onUpdate, onComplete)
- [ ] Using `loop` and `alternate` NOT `direction`
- [ ] Using correct v4 stagger syntax with `stagger()`
- [ ] Using shorthand properties (x, y, z) when possible

## 🎯 Core API - Most Common Patterns

### Basic Animation (single line for simple tweens)
```javascript
// Simple tween - ALWAYS one line
animate('.element', { x: 250, rotate: 180, duration: 0.8, ease: 'inOutQuad' });

// Fade in - one line
animate('.element', { opacity: [0, 1], y: [20, 0], duration: 0.6, ease: 'outQuad' });

// Scale bounce - one line
animate('.element', { scale: [0, 1], duration: 0.8, ease: 'outElastic(1, 0.5)' });

// Infinite loop - one line
animate('.element', { rotate: 360, duration: 2, loop: true, ease: 'linear' });
```

### Timeline Creation
```javascript
const tl = createTimeline({ defaults: { duration: 1, ease: 'outQuad' } });

tl.add('.element1', { x: 250 })
  .add('.element2', { y: 100 }, '+=0.2')  // 0.2s after previous
  .add('.element3', { rotate: 180 }, '<'); // at start of previous
```

### Stagger Animations (single line)
```javascript
animate('.elements', { x: 250, delay: stagger(0.1) });  // 0.1s between each
animate('.elements', { x: 250, delay: stagger(0.1, { from: 'center' }) });
```

## ❌ Common AI Mistakes to Avoid

### MISTAKE #1: Using v3 Import Pattern
```javascript
// ❌ WRONG - This is v3
import anime from 'animejs';
anime({ targets: '.element', translateX: 250 });

// ✅ CORRECT - Always use v4
import { animate } from 'animejs';
animate('.element', { x: 250 });
```

### MISTAKE #2: Using 'targets' Property
```javascript
// ❌ WRONG - 'targets' is v3
animate({ targets: '.element', translateX: 250 });

// ✅ CORRECT - First parameter is the target
animate('.element', { x: 250 });
```

### MISTAKE #3: Using 'easing' Instead of 'ease'
```javascript
// ❌ WRONG
animate('.element', { x: 250, easing: 'easeInOutQuad' });

// ✅ CORRECT
animate('.element', { x: 250, ease: 'inOutQuad' });
```

### MISTAKE #4: Using 'value' for Animation Values
```javascript
// ❌ WRONG - 'value' is v3
animate('.element', { x: { value: 250 } });

// ✅ CORRECT - Use 'to' for values
animate('.element', { x: { to: 250 } });
```

### MISTAKE #5: Wrong Timeline Syntax
```javascript
// ❌ WRONG - anime.timeline() is v3
const tl = anime.timeline();

// ✅ CORRECT - Use createTimeline
import { createTimeline } from 'animejs';
const tl = createTimeline();
```

## 📋 Property Syntax Reference (v3 → v4)

### Animation Values
```javascript
// ✅ v4: Use 'to' for target values
{ opacity: { to: 0.5 } }
{ x: { to: [0, 100] } }

// ❌ v3: DON'T use 'value'
// { opacity: { value: 0.5 } }
```

### Easing Functions
```javascript
// ✅ v4: Use 'ease' (no 'ease' prefix)
{ ease: 'inOutQuad' }
{ ease: 'outElastic(1, 0.5)' }
{ ease: 'cubicBezier(0.4, 0, 0.2, 1)' }

// ❌ v3: DON'T use 'easing' or 'ease' prefix
// { easing: 'easeInOutQuad' }
```

### Direction & Looping
```javascript
// ✅ v4
{
  loop: true,        // infinite loop
  loop: 3,          // loop 3 times
  alternate: true,   // alternate direction
  reversed: true     // play in reverse
}

// ❌ v3: DON'T use 'direction'
// { direction: 'alternate' }
```

### Transform Properties (Shorthand Preferred)
```javascript
// ✅ Both syntaxes work in v4:
animate('.element', { x: 100, y: 50, z: 25 });           // shorthand (preferred)
animate('.element', { translateX: 100, translateY: 50, translateZ: 25 }); // explicit
```

### Callbacks (ALL prefixed with 'on')
```javascript
// ✅ v4: Simple callback - keep on one line
animate('.element', { x: 250, duration: 1, onComplete: () => console.log('Done!') });

// ✅ v4: Multiple callbacks - use multi-line
animate('.element', {
  x: 250,
  duration: 1,
  onBegin: (anim) => console.log('Started'),
  onUpdate: (anim) => console.log('Progress:', anim.progress),
  onComplete: (anim) => console.log('Finished')
});

// ❌ v3: DON'T use unprefixed callbacks
// { update: () => {}, complete: () => {} }
```

## 📝 Code Formatting Guidelines

### ALWAYS Use Single-Line Format for Simple Animations
**This is mandatory for readability** - Use for animations with ≤4 properties:
```javascript
// ✅ GOOD - Clean, readable, one line
animate('.element', { x: 250, duration: 1, ease: 'outQuad' });
animate('.box', { opacity: 0.5, scale: 0.8, duration: 0.3 });

// ❌ BAD - Unnecessary multi-line for simple tweens
animate('.element', {
  x: 250,
  duration: 1,
  ease: 'outQuad'
});
```

### Multi-Line Format (Only for Complex Animations)
Use for animations with >4 properties or callbacks:
```javascript
// Complex animation with callbacks - multi-line is appropriate
animate('.element', {
  x: { to: [0, 100, 50], duration: 2 },
  y: { to: [0, -50, 0], duration: 2 },
  scale: [0, 1.2, 1],
  ease: 'outElastic(1, 0.5)',
  onComplete: () => console.log('Done!')
});
```

## 🎨 Common Animation Patterns

### Hover Animation (single line per animation)
```javascript
element.addEventListener('mouseenter', () => animate(element, { scale: 1.1, duration: 0.3, ease: 'outQuad' }));
element.addEventListener('mouseleave', () => animate(element, { scale: 1, duration: 0.3, ease: 'outQuad' }));
```

### Sequential Timeline
```javascript
const tl = createTimeline({ defaults: { duration: 0.5 } });
tl.add('.step1', { x: 100 })
  .add('.step2', { y: 100 })
  .add('.step3', { scale: 2 });
```

### Scroll-triggered Animation
```javascript
import { createScrollObserver } from 'animejs';

createScrollObserver({
  target: '.scroll-element',
  root: document.querySelector('.scroll-container'),
  play: () => animate('.element', { x: 250, duration: 1 }),
  visibility: 0.5
});
```

## 🔧 Advanced Features

### SVG Animations
```javascript
import { animate, svg } from 'animejs';

// Morph path (single line)
animate('#path1', { d: svg.morphTo('#path2'), duration: 1 });

// Draw SVG line
const drawable = svg.createDrawable('.svg-path');
animate(drawable, { draw: '0% 100%', duration: 2 });

// Motion path (single line for simple usage)
const motionPath = svg.createMotionPath('#motion-path');
animate('.element', { x: motionPath.translateX, y: motionPath.translateY, rotate: motionPath.rotate });
```

### Utility Functions
```javascript
import { utils } from 'animejs';

// DOM selection
const elements = utils.$('.elements');

// Get current value
const currentX = utils.get('.element', 'translateX');

// Set values immediately
utils.set('.element', { x: 100, opacity: 0.5 });

// Remove animations
utils.remove('.element');

// Math utilities
utils.random(0, 100);
utils.shuffle([1, 2, 3, 4]);
utils.lerp(0, 100, 0.5); // 50
utils.clamp(150, 0, 100); // 100
```

### TypeScript Support
```typescript
import { animate, createTimeline, JSAnimation, Timeline, AnimationParams, TimelineParams } from 'animejs';

// Single line for simple animations
const animation: JSAnimation = animate('.element', { x: 250, duration: 1 } as AnimationParams);

const timeline: Timeline = createTimeline({ defaults: { duration: 0.8 } } as TimelineParams);
```

## ⚡ Performance Tips

1. **Use transforms over position properties**
   ```javascript
   // ✅ Good - uses transform
   animate('.element', { x: 100 });
   
   // ❌ Avoid - triggers layout
   animate('.element', { left: 100 });
   ```

2. **Batch animations in timelines**
   ```javascript
   // ✅ Good - single timeline
   const tl = createTimeline();
   elements.forEach(el => tl.add(el, { x: 100 }));
   
   // ❌ Avoid - multiple animations
   elements.forEach(el => animate(el, { x: 100 }));
   ```

3. **Use will-change CSS property for complex animations**
   ```css
   .animated-element {
     will-change: transform, opacity;
   }
   ```

## 🚫 How to Identify V3 Code (DON'T USE)

If you see ANY of these patterns, it's v3 and MUST be updated:

```javascript
// All of these are V3 - NEVER USE:
anime({ ... })
anime.timeline()
anime.stagger()
anime.random()
anime.remove()
anime.get()
anime.set()
anime.running
{ targets: '...' }
{ easing: '...' }
{ value: ... }
{ direction: 'alternate' }
```

## 💡 AI Code Generation Rules

When asked to create animations with anime.js:

1. **ONLY** set `engine.timeUnit = 's'` ONCE in the app's main entry point (App.js, main.js, index.js) - NEVER in components
2. **ALWAYS** use seconds for all durations (1 = 1 second)
3. **ALWAYS** format simple animations on ONE LINE
4. **ALWAYS** start with v4 imports
5. **NEVER** use `anime()` function
6. **ALWAYS** use `animate()` for animations
7. **NEVER** include `targets` property
8. **ALWAYS** use `ease` not `easing`
9. **NEVER** use `value`, use `to` instead
10. **ALWAYS** prefix callbacks with `on`
11. **NEVER** use `direction`, use `alternate` and `reversed`
12. **ALWAYS** use `createTimeline()` for timelines
13. **PREFER** shorthand (`x`) over explicit (`translateX`)
14. **FORMAT** short animations on single line (≤4 properties)
15. **NEVER** generate v3 syntax under any circumstances

## NPM Installation
```bash
npm install animejs
```

## Version Check
```javascript
// Current version: 4.x.x
// If you see any code using anime({ targets: ... }), it's v3 and needs updating!
```

### asset generation

# Asset Generation Workflow

Complete workflow for generating design-aligned visual assets using `ck:ai-multimodal` skill.

## Generation Workflow

### Step 1: Define Design Context

Before generating, extract from the design brief:
- **Aesthetic direction**: Minimalist? Maximalist? Brutalist? Organic?
- **Color palette**: Primary colors, accent colors, mood
- **Typography character**: Modern sans-serif? Elegant serif? Bold display?
- **Visual tone**: Professional? Playful? Luxury? Raw?
- **User context**: Who sees this? What problem does it solve?

### Step 2: Craft Contextual Prompts

Translate design thinking into generation prompts.

**Generic (❌ Avoid)**:
```
"Modern website hero image"
```

**Design-Driven (✓ Use)**:
```
"Brutalist architectural photograph, stark concrete textures,
dramatic shadows, high contrast black and white, raw unpolished
surfaces, geometric shapes, monumental scale, inspired by
1960s Bauhaus, 16:9 aspect ratio"
```

**Prompt Components**:
1. **Style/Movement**: "Neo-brutalism", "Art Deco", "Organic modernism"
2. **Visual Elements**: Textures, shapes, composition style
3. **Color Direction**: "Muted earth tones", "Vibrant neon accents", "Monochromatic"
4. **Mood/Atmosphere**: "Serene", "Energetic", "Mysterious"
5. **Technical Specs**: Aspect ratio, composition focus
6. **References**: "Inspired by [artist/movement]"

### Step 3: Generate with Appropriate Model

Use `ck:ai-multimodal` skill's image generation capabilities:

```bash
# Standard quality (most cases)
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "[your design-driven prompt]" \
  --output docs/assets/hero-image \
  --model imagen-4.0-generate-001 \
  --aspect-ratio 16:9

# Ultra quality (production hero images, marketing)
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "[your design-driven prompt]" \
  --output docs/assets/hero-ultra \
  --model imagen-4.0-ultra-generate-001 \
  --size 2K

# Fast iteration (exploring concepts)
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "[your design-driven prompt]" \
  --output docs/assets/concept \
  --model imagen-4.0-fast-generate-001
```

**Model Selection**:
- **imagen-4.0-generate-001**: Default choice, balanced quality/speed
- **imagen-4.0-ultra-generate-001**: Final production assets, marketing materials
- **imagen-4.0-fast-generate-001**: Rapid prototyping, multiple variations

**Aspect Ratios**:
- **16:9**: Hero sections, wide banners
- **9:16**: Mobile-first, vertical content
- **1:1**: Square cards, social media
- **4:3**: Classic layouts, presentations
- **3:4**: Portrait orientations, mobile screens

### Step 4: Evaluate Against Design Standards

Use `ck:ai-multimodal` to analyze the generated asset (see `visual-analysis.md` for complete workflow):

```bash
python scripts/gemini_batch_process.py \
  --files docs/assets/hero-image.png \
  --task analyze \
  --prompt "Evaluate this image for:
1. Visual coherence with [aesthetic direction]
2. Color harmony and contrast
3. Composition and balance
4. Suitability for overlaying text
5. Professional quality (rate 1-10)
6. Specific weaknesses or improvements needed" \
  --output docs/assets/hero-evaluation.md \
  --model gemini-2.5-flash
```

### Step 5: Iterate or Integrate

**If evaluation score < 7/10 or doesn't meet standards**:
1. Identify specific issues (color, composition, mood, technical)
2. Refine prompt with improvements
3. Regenerate with adjusted parameters
4. Consider using `ck:media-processing` skill for post-generation adjustments

**If meets standards**:
1. Optimize for web (compress, format conversion)
2. Create responsive variants if needed
3. Document asset usage guidelines
4. Integrate into frontend implementation

## Design Pattern Examples

### Pattern 1: Minimalist Background Texture

**Design Context**: Clean, refined interface with generous white space

**Prompt Strategy**:
```
"Subtle paper texture, off-white color (#F8F8F8), barely visible
grain pattern, high-end stationery feel, minimal contrast,
professional and clean, 1:1 aspect ratio for tiling"
```

**Use Case**: Background for minimalist product pages, portfolio sites

### Pattern 2: Maximalist Hero Section

**Design Context**: Bold, energetic landing page with vibrant colors

**Prompt Strategy**:
```
"Explosive color gradients, neon pink to electric blue,
holographic reflections, dynamic diagonal composition,
retrofuturistic aesthetic, vaporwave influence, high energy,
layered transparency effects, 16:9 cinematic"
```

**Use Case**: Hero section for creative agencies, entertainment platforms

### Pattern 3: Brutalist Geometric Pattern

**Design Context**: Raw, bold interface with strong typography

**Prompt Strategy**:
```
"Monochromatic geometric pattern, overlapping rectangles,
stark black and white, high contrast, Swiss design influence,
grid-based composition, architectural precision, repeatable
pattern for backgrounds"
```

**Use Case**: Background pattern for design studios, architecture firms

### Pattern 4: Organic Natural Elements

**Design Context**: Wellness brand, calming user experience

**Prompt Strategy**:
```
"Soft botanical watercolor, sage green and cream tones,
gentle leaf shadows, natural light quality, serene atmosphere,
minimal detail for text overlay, 3:4 portrait orientation"
```

**Use Case**: Hero section for wellness brands, eco-friendly products

### Pattern 5: Retro-Futuristic

**Design Context**: Tech product with nostalgic twist

**Prompt Strategy**:
```
"80s computer graphics aesthetic, wireframe grids, cyan and magenta
gradients, digital sunrise, Tron-inspired, geometric precision,
nostalgic future vision, 16:9 widescreen"
```

**Use Case**: SaaS landing pages, tech conferences, gaming platforms

### Pattern 6: Editorial Magazine Style

**Design Context**: Content-heavy site with strong visual hierarchy

**Prompt Strategy**:
```
"High-contrast editorial photography, dramatic side lighting,
stark shadows, black and white, fashion magazine quality,
strong vertical composition, 3:4 portrait for text layout"
```

**Use Case**: Blog headers, news sites, content platforms

## Prompt Engineering Best Practices

### 1. Be Specific About Style
❌ "Modern design"
✓ "Bauhaus-inspired geometric abstraction with primary colors"

### 2. Define Color Precisely
❌ "Colorful"
✓ "Vibrant sunset palette: coral (#FF6B6B), amber (#FFB84D), violet (#A66FF0)"

### 3. Specify Composition
❌ "Nice layout"
✓ "Rule of thirds composition, subject left-aligned, negative space right for text overlay"

### 4. Reference Movements/Artists
❌ "Artistic"
✓ "Inspired by Bauhaus geometric abstraction and Swiss International Style"

### 5. Technical Requirements First
Always include: aspect ratio, resolution needs, intended use case

### 6. Iterate Strategically
- First generation: Broad aesthetic exploration
- Second generation: Refine color and composition
- Third generation: Fine-tune details and mood

## Common Pitfalls to Avoid

### ❌ Generic Stock Photo Aesthetics
Don't prompt: "Professional business team working together"
Instead: Design-specific, contextual imagery that serves the interface

### ❌ Overcomplex Generated Images
Generated assets that compete with UI elements create visual chaos
Keep backgrounds subtle enough for text/button overlay

### ❌ Inconsistent Visual Language
Each generated asset should feel part of the same design system
Maintain color palette, visual style, mood consistency

### ❌ Ignoring Integration Context
Assets aren't standalone—consider how they work with:
- Typography overlays
- Interactive elements (buttons, forms)
- Navigation and UI chrome
- Responsive behavior across devices

## Responsive Asset Strategy

### Desktop-First Approach
1. Generate primary asset at 16:9 (desktop hero)
2. Generate mobile variant at 9:16 with same prompt
3. Ensure focal point works in both orientations

### Mobile-First Approach
1. Generate primary asset at 9:16 (mobile hero)
2. Generate desktop variant at 16:9 with same prompt
3. Test that composition scales effectively

### Variant Generation
```bash
# Desktop (16:9)
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "[prompt]" \
  --output docs/assets/hero-desktop \
  --model imagen-4.0-generate-001 \
  --aspect-ratio 16:9

# Mobile (9:16)
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "[same prompt]" \
  --output docs/assets/hero-mobile \
  --model imagen-4.0-generate-001 \
  --aspect-ratio 9:16

# Square (1:1)
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "[same prompt]" \
  --output docs/assets/hero-square \
  --model imagen-4.0-generate-001 \
  --aspect-ratio 1:1
```

## Model Cost Optimization

**Imagen 4 Pricing** (as of 2024):
- Standard: ~$0.04 per image
- Ultra: ~$0.08 per image
- Fast: ~$0.02 per image

**Optimization Strategy**:
1. Use Fast model for exploration (3-5 variations)
2. Select best direction, generate with Standard model
3. Use Ultra only for final production assets
4. Batch generate variations in single session

## Complete Example Workflow

```bash
# 1. Fast exploration (3 variations)
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "Minimalist mountain landscape, muted blue-gray tones,
  fog layers, serene morning atmosphere, clean for text overlay, 16:9" \
  --output docs/assets/concept-1 \
  --model imagen-4.0-fast-generate-001 \
  --aspect-ratio 16:9

# 2. Analyze best variation
python scripts/gemini_batch_process.py \
  --files docs/assets/concept-1.png \
  --task analyze \
  --prompt "Rate 1-10 for aesthetic quality, color harmony, text overlay suitability" \
  --output docs/assets/analysis-1.md \
  --model gemini-2.5-flash

# 3. If score ≥ 7/10, generate production version
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "[refined prompt based on analysis]" \
  --output docs/assets/hero-final \
  --model imagen-4.0-generate-001 \
  --aspect-ratio 16:9

# 4. Generate mobile variant
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "[same refined prompt]" \
  --output docs/assets/hero-mobile \
  --model imagen-4.0-generate-001 \
  --aspect-ratio 9:16
```

## Next Steps

- **Verify quality**: See `visual-analysis.md` for comprehensive analysis workflow
- **Optimize assets**: See `technical-guide.md` for file optimization and integration
- **Extract inspiration**: See `design-extraction.md` to learn from existing designs


### design extraction overview

# Extract Design Guidelines from Existing Assets

Reverse-engineer design principles from existing images or videos to establish design guidelines.

## Purpose

- Analyze competitor designs to understand their approach
- Extract design systems from inspiration screenshots
- Learn from high-quality design examples
- Create documented guidelines based on visual analysis
- Establish consistent aesthetic direction from references

## Use Cases

- Analyzing competitor websites or apps
- Learning from inspiration galleries (Dribbble, Awwwards, Mobbin)
- Extracting design systems from brand materials
- Reverse-engineering successful interfaces
- Creating design documentation from visual references

## Quick Workflows

### Single Image Analysis
```bash
python scripts/gemini_batch_process.py \
  --files docs/inspiration/reference-design.png \
  --task analyze \
  --prompt "[see extraction-prompts.md for detailed prompt]" \
  --output docs/design-guidelines/extracted-design-system.md \
  --model gemini-2.5-flash
```

### Multi-Screen System Extraction
```bash
python scripts/gemini_batch_process.py \
  --files docs/inspiration/home.png docs/inspiration/about.png \
  --task analyze \
  --prompt "[see extraction-prompts.md for multi-screen prompt]" \
  --output docs/design-guidelines/complete-design-system.md \
  --model gemini-2.5-flash
```

### Video Motion Analysis
```bash
python scripts/gemini_batch_process.py \
  --files docs/inspiration/interaction-demo.mp4 \
  --task analyze \
  --prompt "[see extraction-prompts.md for motion prompt]" \
  --output docs/design-guidelines/motion-system.md \
  --model gemini-2.5-flash
```

### Competitive Analysis
```bash
python scripts/gemini_batch_process.py \
  --files competitor-a.png competitor-b.png competitor-c.png \
  --task analyze \
  --prompt "[see extraction-prompts.md for competitive prompt]" \
  --output docs/design-guidelines/competitive-analysis.md \
  --model gemini-2.5-flash
```

## Detailed References

- `extraction-prompts.md` - All extraction prompt templates
- `extraction-best-practices.md` - Capture quality, analysis tips
- `extraction-output-templates.md` - Documentation formats

## Integration

After extraction, use guidelines with `asset-generation.md` for generating design-aligned visual assets.


### extraction best practices

# Extraction Best Practices

Guidelines for capturing and analyzing design references effectively.

## Capture Quality Guidelines

### Screenshot Requirements
- High-resolution (minimum 1920px wide for desktop)
- Accurate color reproduction (disable browser extensions that alter colors)
- Actual viewport size, not full-page scrolls
- Device-specific resolutions (desktop 1920x1080, mobile 390x844)
- Multiple states: default, hover, active, responsive breakpoints

### Multiple Examples
- Analyze 3-5 screens minimum for pattern recognition
- Include different page types (home, product, about, contact)
- Single screenshots miss patterns
- Capture from same site to identify consistency

## Analysis Best Practices

### 1. Demand Specifics
❌ Accept: "Uses blue and gray colors"
✓ Demand: "Primary: #1E40AF, Secondary: #6B7280, Accent: #F59E0B"

❌ Accept: "Modern sans-serif font"
✓ Demand: "Inter, weight 600, 48px for h1, tracking -0.02em"

### 2. Document Rationale
Understand *why* design decisions work, not just *what* they are:
- Why does this color palette create trust?
- Why does this spacing scale improve readability?
- Why does this typography hierarchy guide user attention?

### 3. Create Actionable Guidelines
Output should be directly implementable in code:

```css
/* Immediately usable CSS from extraction */
:root {
  --font-display: 'Bebas Neue', sans-serif;
  --font-body: 'Inter', sans-serif;

  --color-primary-600: #1E40AF;
  --color-accent-500: #F59E0B;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;

  --radius-sm: 4px;
  --radius-md: 8px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
}
```

### 4. Cross-Reference
- Validate font predictions against Google Fonts library
- Use font identification tools (WhatFont, Font Ninja) for accuracy
- Manually verify extracted colors with eyedropper tools

### 5. Iterate Analysis
First pass may miss subtleties:
- Run initial comprehensive analysis
- Review output, identify gaps
- Run focused follow-up queries for specific elements

## Advanced Techniques

### Design System Mining
Extract complete design system from single brand (10+ screens):

```bash
python scripts/gemini_batch_process.py \
  --files docs/inspiration/brand/*.png \
  --task analyze \
  --prompt "Extract complete, production-ready design system:
- All color tokens (20+ colors)
- All typography specs (sizes, weights, line-heights)
- All spacing tokens
- All component variants
- All animation timings
Output as CSS variables ready for implementation." \
  --output docs/design-guidelines/brand-design-system.md \
  --model gemini-2.5-flash
```

### Trend Analysis
Analyze multiple top designs to identify current trends:

```bash
python scripts/gemini_batch_process.py \
  --files docs/inspiration/awwwards-*.png \
  --task analyze \
  --prompt "Trend analysis across 10 award-winning designs:
1. Dominant aesthetic movements
2. Common color strategies
3. Typography trends
4. Layout innovations
5. Animation patterns
Identify what's trending in 2024 web design." \
  --output docs/design-guidelines/trend-analysis.md \
  --model gemini-2.5-flash
```

### Historical Evolution
Track design evolution of single brand over time:

```bash
python scripts/gemini_batch_process.py \
  --files docs/inspiration/brand-2020.png docs/inspiration/brand-2024.png \
  --task analyze \
  --prompt "Compare 2020 vs 2024 design evolution:
1. What changed and why
2. What remained consistent (brand identity)
3. How trends influenced changes
4. Lessons for our design evolution" \
  --output docs/design-guidelines/evolution-analysis.md \
  --model gemini-2.5-flash
```

## Common Pitfalls

### ❌ Surface-Level Analysis
"Uses blue colors and sans-serif fonts"
**Fix**: Demand specifics—hex codes, font names, size values

### ❌ Missing Context
Extracting design without understanding target audience or purpose
**Fix**: Research brand context before analysis

### ❌ Blind Copying
Extracting and applying design 1:1 to your project
**Fix**: Extract principles, adapt to your unique context

### ❌ Single Source
Learning from one example only
**Fix**: Analyze 3-5 examples to identify patterns vs. anomalies


### extraction output templates

# Extraction Output Templates

Documentation format templates for extracted design guidelines.

## Template 1: Complete Design System

```markdown
# [Project/Competitor] Design System

## Aesthetic Direction
- **Style**: Neo-brutalism with organic elements
- **Mood**: Bold, confident, approachable
- **Differentiation**: High contrast typography with soft color accents

## Typography
### Display Font
- Family: Archivo Black (Google Fonts)
- Sizes: h1: 72px, h2: 48px, h3: 36px
- Weights: 400 (regular)
- Line Height: 1.1
- Letter Spacing: -0.02em

### Body Font
- Family: Inter (Google Fonts)
- Sizes: body: 16px, small: 14px
- Weights: 400, 500, 600
- Line Height: 1.6
- Letter Spacing: 0

## Color Palette
\```css
:root {
  /* Primary Colors */
  --color-primary-900: #0A1628;
  --color-primary-600: #1E40AF;
  --color-primary-400: #60A5FA;

  /* Accent Colors */
  --color-accent-500: #F59E0B;
  --color-accent-300: #FCD34D;

  /* Neutral Colors */
  --color-neutral-900: #111827;
  --color-neutral-700: #374151;
  --color-neutral-500: #6B7280;
  --color-neutral-300: #D1D5DB;
  --color-neutral-100: #F3F4F6;

  /* Background */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F9FAFB;
}
\```

## Spacing System
- Base: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Usage: Consistent 8px rhythm for most components

## Component Specifications

### Button (Primary)
\```css
.button-primary {
  background: var(--color-primary-600);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: background 200ms ease-out;
}
.button-primary:hover {
  background: var(--color-primary-900);
}
\```

### Card
\```css
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: box-shadow 200ms ease-out;
}
.card:hover {
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}
\```

## Motion Guidelines
- Transition timing: 200ms for micro-interactions, 400ms for page transitions
- Easing: ease-out for entrances, ease-in for exits
- Stagger delay: 50ms between sequential elements
```

## Template 2: Competitive Analysis

```markdown
# Competitive Design Analysis

## Competitors Analyzed
1. Competitor A - [URL]
2. Competitor B - [URL]
3. Competitor C - [URL]

## Comparative Summary

| Aspect | Competitor A | Competitor B | Competitor C |
|--------|--------------|--------------|--------------|
| Aesthetic | Minimalist | Maximalist | Editorial |
| Primary Color | #1E40AF | #7C3AED | #DC2626 |
| Typography | Inter | Poppins | Playfair Display |
| Layout | Grid-based | Asymmetric | Magazine |

## Common Patterns (Industry Standard)
- All use sans-serif for body text
- All prioritize mobile-first responsive design
- All use card-based layouts for content
- All feature hero sections with large imagery

## Differentiation Opportunities
1. **Color Strategy**: Competitors use saturated colors; opportunity for muted, sophisticated palette
2. **Typography**: No one uses display serifs; opportunity for elegant, high-end feel
3. **Layout**: All symmetric; opportunity for asymmetric, dynamic composition

## Recommendations
Based on analysis, recommend:
- Aesthetic: Refined minimalism with editorial typography
- Color: Muted earth tones with one bold accent
- Layout: Asymmetric grid with generous white space
- Differentiation: Unexpected typography hierarchy, subtle animations
```

## Integration Workflow

### After Extraction

1. **Review & Validate**
   - Manually verify color codes with eyedropper tool
   - Cross-reference font predictions against Google Fonts
   - Check spacing values against browser dev tools

2. **Adapt & Customize**
   - Don't copy—adapt principles to your unique context
   - Maintain underlying logic, change expression
   - Example: Extract "generous white space" principle, apply with your colors

3. **Document Decisions**
   - Save extracted guidelines in project `docs/design-guidelines/`
   - Create design system spec from extraction
   - Reference when generating new assets

4. **Reference in Implementation**
   - Use extracted tokens when generating new assets with `asset-generation.md`
   - Apply extracted principles when analyzing your own designs with `visual-analysis.md`
   - Maintain consistency between inspiration and implementation

5. **Iterate & Refine**
   - Update guidelines as design evolves
   - Extract from multiple sources, synthesize learnings
   - Create your own unique voice from combined insights


### extraction prompts

# Extraction Prompt Templates

Complete prompt templates for design guideline extraction.

## Comprehensive Design Analysis Prompt

```
Extract comprehensive design guidelines from this interface:

## Aesthetic Identification
- Design Style: Identify the aesthetic movement (minimalism, brutalism, maximalism, glassmorphism, neo-brutalism, organic, luxury, editorial, etc.)
- Overall Mood: Professional, playful, serious, energetic, calm, bold, refined
- Differentiation Factor: What makes this design memorable and distinctive?

## Typography System
- Display Font: Predict font family (favor Google Fonts: Playfair Display, Bebas Neue, DM Serif, Archivo Black, etc.). Provide 2-3 alternatives if uncertain.
- Body Font: Identify or suggest similar alternatives
- Font Sizes: Estimate in px for h1, h2, h3, body, small text
- Font Weights: Used weights (300, 400, 500, 600, 700)
- Line Heights: Estimate leading ratios
- Letter Spacing: Tight, normal, or wide tracking

## Color System (CRITICAL)
- Extract 8-12 distinct colors with accurate hex codes
- Classify: Primary (1-2), Secondary (1-2), Accent (2-3), Neutral/Gray (3-5), Background (1-2)
- Note color relationships and usage patterns
- Identify gradients (provide start/end hex codes and direction)

## Spatial Composition
- Layout Type: Grid-based, asymmetric, centered, multi-column, magazine-style
- Grid System: Estimate column count and gutter widths
- Spacing Scale: Identify spacing rhythm (4px, 8px, 16px, 24px, etc.)
- White Space Strategy: Generous, tight, varied
- Section Hierarchy: How content is organized and prioritized

## Visual Elements
- Border Styles: Radius values (sharp, subtle rounded, fully rounded)
- Shadows: Box-shadow characteristics (elevation, spread, blur)
- Backgrounds: Solid, gradients, patterns, textures, images
- Effects: Blur, overlays, transparency, grain, noise
- Decorative Elements: Lines, shapes, illustrations, icons

## Component Patterns
- Button Styles: Shape, size, states, hover effects
- Card Design: Borders, shadows, padding, content structure
- Navigation: Style, position, behavior
- Forms: Input styles, validation, spacing
- Interactive Elements: Hover states, transitions

## Motion & Animation (if video)
- Transition Timing: Fast (100-200ms), medium (200-400ms), slow (400-600ms+)
- Easing Functions: Linear, ease-out, ease-in, cubic-bezier specifics
- Animation Types: Fade, slide, scale, rotate, stagger
- Scroll Interactions: Parallax, reveal-on-scroll, sticky elements

## Accessibility Considerations
- Color Contrast: Evaluate text/background combinations
- Font Sizes: Minimum sizes used
- Interactive Targets: Button/link sizes
- Visual Hierarchy: Clear content prioritization

## Design Highlights
- Top 3 standout design decisions
- What makes this design effective
- Potential improvements or considerations

Output as structured markdown for easy reference.
```

## Multi-Screen System Extraction Prompt

```
Analyze these multiple screens to extract the consistent design system:

For each screen:
1. Identify consistent design tokens (colors, typography, spacing)
2. Note variations and their rationale
3. Extract reusable component patterns

Then synthesize:
- Core design system: Consistent colors, fonts, spacing scales
- Component library: Buttons, cards, navigation, forms
- Layout patterns: Grid systems, responsive behavior
- Visual language: Shared aesthetic principles
- Design tokens: Create CSS variable recommendations

Provide as a unified design system specification.
```

## Motion Design Extraction Prompt

```
Analyze this video to extract motion design guidelines:

1. Transition Timing: Measure duration of key animations (in ms)
2. Easing Curves: Describe acceleration/deceleration (ease-in, ease-out, spring)
3. Animation Types: List all animation styles used
4. Micro-interactions: Button hovers, form focus states, feedback
5. Page Transitions: How screens change
6. Scroll Interactions: Parallax, sticky headers, reveal animations
7. Loading States: Skeleton screens, spinners, progressive reveals
8. Stagger Effects: Sequential animation delays and patterns

Provide implementable specifications with timing values.
```

## Competitive Analysis Prompt

```
Comparative design analysis of 3 competitors:

For each competitor:
1. Design style and aesthetic approach
2. Color strategy and brand perception
3. Typography choices and hierarchy
4. Layout and information architecture
5. Unique design elements
6. Strengths and weaknesses

Synthesis:
- Common industry patterns (what everyone does)
- Differentiation opportunities (gaps to exploit)
- Best practices observed (proven approaches)
- Design recommendations (how to stand out)

Provide strategic design direction based on analysis.
```


### technical accessibility

# Accessibility Checks

WCAG compliance and accessibility guidelines for generated assets.

## Text Overlay Readability

### Color Contrast Ratios
- **WCAG AA**: 4.5:1 for normal text, 3:1 for large text
- **WCAG AAA**: 7:1 for normal text, 4.5:1 for large text

### Testing Requirements
- Test across image variations
- Consider adding gradient overlays in code
- Add text shadows for increased legibility

### Alt Text Guidelines
- Describe the asset's purpose and mood
- Don't repeat visible text
- Keep concise (150 characters max)

## CSS Techniques for Accessibility

### Gradient Overlay for Text Readability
```css
.hero {
  position: relative;
  background-image: url('hero.webp');
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.3) 0%,
    rgba(0,0,0,0.6) 100%
  );
}
```

### Text Shadow for Contrast
```css
.hero-text {
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}
```

### Ensure Minimum Contrast
```css
.hero-cta {
  background: var(--color-primary-600);
  color: white; /* Ensure 4.5:1 contrast */
}
```

## Integration Testing Analysis

Analyze how asset works with UI elements:

```bash
python scripts/gemini_batch_process.py \
  --files docs/assets/hero-with-text-overlay.png \
  --task analyze \
  --prompt "Analyze this design asset with UI elements overlaid:

1. Text Readability: Can all text be read clearly?
2. Contrast Issues: Identify any WCAG violations
3. Visual Hierarchy: Do buttons and CTAs stand out?
4. Spacing Problems: Any crowding or poor breathing room?
5. Responsive Concerns: Will this work on mobile at 9:16?

Provide specific recommendations for adjustments." \
  --output docs/assets/integration-analysis.md \
  --model gemini-2.5-flash
```

## Next.js Integration Example

```tsx
// app/components/Hero.tsx
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative h-screen">
      {/* Background image with optimization */}
      <Image
        src="/assets/hero-desktop.webp"
        alt="Minimalist desert landscape"
        fill
        priority
        quality={85}
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <h1 className="text-6xl font-bold text-white drop-shadow-lg">
          Your Headline
        </h1>
      </div>
    </section>
  )
}
```

## Common Issues

### Issue: Poor Text Overlay Readability
**Symptoms**: Text hard to read over generated background
**Solutions**:
- Add CSS gradient overlay (see above)
- Regenerate with "clean composition for text overlay" in prompt
- Use darker/lighter areas strategically
- Add text shadows or backdrop-blur


### technical best practices

# Best Practices Checklists

Quality gates and checklists for asset generation workflows.

## Asset Generation Workflow

### Before Generating Assets
- [ ] Defined clear aesthetic direction from design brief
- [ ] Extracted color palette and typography character
- [ ] Identified asset purpose and integration context
- [ ] Considered accessibility and text overlay needs

### During Generation
- [ ] Crafted design-driven, contextual prompt
- [ ] Selected appropriate model and quality level
- [ ] Specified correct aspect ratio for use case
- [ ] Generated multiple variations if exploring

### After Generation
- [ ] Ran comprehensive visual analysis (score ≥ 7/10)
- [ ] Extracted exact color palette with hex codes
- [ ] Compared multiple variations and selected best
- [ ] Tested with overlaid text/UI elements
- [ ] Optimized file size for web performance
- [ ] Created responsive variants if needed
- [ ] Documented asset usage and guidelines

## Design Guideline Extraction Workflow

### When Analyzing Existing Designs
- [ ] Captured high-quality reference screenshots
- [ ] Ran comprehensive design analysis with structured prompts
- [ ] Extracted specific values (hex codes, px sizes, ms timings)
- [ ] Analyzed multiple screens for pattern consistency
- [ ] Validated font predictions against Google Fonts
- [ ] Documented findings in actionable format
- [ ] Created CSS variable specifications
- [ ] Saved extracted guidelines in project docs/

## Quality Gates

### Never Proceed to Integration Without
- [ ] Visual analysis score ≥ 7/10
- [ ] Extracted color palette documented
- [ ] Accessibility contrast checks passed
- [ ] Responsive variants generated
- [ ] File optimization completed
- [ ] Asset usage guidelines documented

## Final Checklist

Before considering any asset "done":
- [ ] Generated with design-driven prompt (not generic)
- [ ] Analyzed and scored ≥ 7/10
- [ ] Extracted color palette for CSS implementation
- [ ] Tested with UI overlays for readability
- [ ] Optimized for web (WebP/JPEG)
- [ ] Created responsive variants
- [ ] Documented usage guidelines
- [ ] Accessibility checks passed (contrast, alt text)
- [ ] Integrated into frontend with proper optimization

## Common Issues & Solutions

### Issue 1: Generated Asset Too Generic
**Symptoms**: Asset looks like stock photography, lacks design character
**Solution**:
- Refine prompt with specific aesthetic movements
- Reference artists/designers/styles explicitly
- Use more distinctive color directions
- Add contextual details that make it unique

### Issue 2: Inconsistent Design Language
**Symptoms**: Each generated asset feels unrelated
**Solution**:
- Extract and document design system from first successful generation
- Reuse color palette keywords in all subsequent prompts
- Maintain consistent aesthetic direction across generations
- Reference previous successful assets in new prompts

### Issue 3: Low Analysis Scores
**Symptoms**: Consistently getting scores < 7/10
**Solutions**:
- Review evaluation criteria—are they realistic?
- Study high-scoring designs for patterns
- Use design extraction on inspiration to learn what works
- Iterate prompt with specific improvements from analysis

### Issue 4: Slow Generation Times
**Symptoms**: Waiting too long for results
**Solutions**:
- Use fast model for exploration phase
- Generate in batches rather than sequentially
- Reserve ultra model only for final production assets
- Run analysis while next generation processes

**Remember**: Design first, generate second. Context is king. Iterate ruthlessly. Analysis is mandatory. Demand specifics, not generalities.


### technical optimization

# Cost & Performance Optimization

Model selection strategies and budget guidelines.

## Model Selection Strategy

### 1. Exploration Phase
Use fast model (3-5 variations):
- **Cost**: ~$0.02 per image
- **Speed**: ~5-10 seconds per generation
- **Use for**: Rapid iteration, aesthetic exploration

### 2. Refinement Phase
Use standard model (1-2 variations):
- **Cost**: ~$0.04 per image
- **Speed**: ~10-20 seconds per generation
- **Use for**: Production-ready assets

### 3. Final Polish
Use ultra model (1 generation):
- **Cost**: ~$0.08 per image
- **Speed**: ~20-30 seconds per generation
- **Use for**: Hero images, marketing materials, critical assets

## Analysis Model Strategy

- Use gemini-2.5-flash for all analysis (vision understanding)
- **Cost**: ~$0.001 per analysis
- **Speed**: ~2-5 seconds per analysis
- **Token-efficient**: Images count as ~258-1548 tokens

## Budget Guidelines

- **Small project**: 10-20 images, ~$2-5 total
- **Medium project**: 50-100 images, ~$10-20 total
- **Large project**: 200+ images, ~$50+ total

## Optimization Tips

1. **Use fast model first**: Explore variations cheaply before committing to production quality
2. **Batch analyze**: Analyze multiple variations simultaneously to save time
3. **Reuse successful prompts**: Once you find a working prompt, reuse it with variations
4. **Generate responsive variants separately**: Only create mobile versions for assets that need them
5. **Skip ultra model unless critical**: Standard quality often sufficient for most assets


### technical overview

# Technical Guide Overview

Technical considerations and best practices for AI multimodal integration in frontend design.

## Quick Reference

### File Optimization
```bash
python scripts/media_optimizer.py \
  --input docs/assets/hero-image.png \
  --output docs/assets/hero-optimized.webp \
  --quality 85
```

### Format Selection
- **WebP**: Best for web, 25-35% smaller than PNG, wide browser support
- **AVIF**: Cutting edge, 50% smaller than WebP, limited support
- **PNG**: Lossless, large file size, use for transparency
- **JPEG**: Lossy, smaller than PNG, photos without transparency

### Responsive Variants
```bash
# Desktop hero (16:9)
--aspect-ratio 16:9

# Mobile hero (9:16 or 3:4)
--aspect-ratio 9:16

# Square cards (1:1)
--aspect-ratio 1:1
```

## Detailed References

- `technical-accessibility.md` - WCAG compliance, contrast checks, alt text
- `technical-workflows.md` - Complete pipeline examples
- `technical-best-practices.md` - Checklists, quality gates
- `technical-optimization.md` - Cost strategies, model selection

## Quick Commands

```bash
# Generate (standard quality)
python scripts/gemini_batch_process.py --task generate \
  --prompt "[design-driven prompt]" \
  --output docs/assets/[name] \
  --model imagen-4.0-generate-001 \
  --aspect-ratio 16:9

# Analyze
python scripts/gemini_batch_process.py --files docs/assets/[image].png \
  --task analyze \
  --prompt "[evaluation criteria]" \
  --output docs/assets/analysis.md \
  --model gemini-2.5-flash

# Optimize
python scripts/media_optimizer.py \
  --input docs/assets/[image].png \
  --output docs/assets/[image].webp \
  --quality 85

# Extract colors
python scripts/gemini_batch_process.py --files docs/assets/[image].png \
  --task analyze \
  --prompt "Extract 5-8 dominant colors with hex codes. Classify as primary/accent/neutral." \
  --output docs/assets/color-palette.md \
  --model gemini-2.5-flash
```

## Responsive Image Strategies

**Art Direction (different crops)**:
```html
<picture>
  <source media="(min-width: 768px)" srcset="hero-desktop.webp">
  <source media="(max-width: 767px)" srcset="hero-mobile.webp">
  <img src="hero-desktop.jpg" alt="Hero image">
</picture>
```

**Resolution Switching (same crop, different sizes)**:
```html
<img
  srcset="hero-400w.webp 400w, hero-800w.webp 800w, hero-1200w.webp 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  src="hero-800w.jpg"
  alt="Hero image"
/>
```


### technical workflows

# Complete Workflow Examples

End-to-end pipeline examples for asset generation and analysis.

## Example 1: Hero Section (Complete Pipeline)

```bash
# 1. Generate hero image with design context
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "Minimalist desert landscape, warm beige sand dunes,
  soft morning light, serene and spacious, muted earth tones
  (tan, cream, soft ochre), clean composition for text overlay,
  sophisticated travel aesthetic, 16:9 cinematic" \
  --output docs/assets/hero-desert \
  --model imagen-4.0-generate-001 \
  --aspect-ratio 16:9

# 2. Evaluate aesthetic quality
python scripts/gemini_batch_process.py \
  --files docs/assets/hero-desert.png \
  --task analyze \
  --prompt "Rate this image 1-10 for: visual appeal, color harmony,
  suitability for overlaying white text, professional quality.
  List any improvements needed." \
  --output docs/assets/hero-evaluation.md \
  --model gemini-2.5-flash

# 3. If score ≥ 7/10, optimize for web
python scripts/media_optimizer.py \
  --input docs/assets/hero-desert.png \
  --output docs/assets/hero-desktop.webp \
  --quality 85

# 4. Generate mobile variant (9:16)
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "Minimalist desert landscape, warm beige sand dunes,
  soft morning light, serene and spacious, muted earth tones
  (tan, cream, soft ochre), clean composition for text overlay,
  sophisticated travel aesthetic, 9:16 portrait" \
  --output docs/assets/hero-mobile \
  --model imagen-4.0-generate-001 \
  --aspect-ratio 9:16

# 5. Optimize mobile variant
python scripts/media_optimizer.py \
  --input docs/assets/hero-mobile.png \
  --output docs/assets/hero-mobile.webp \
  --quality 85
```

## Example 2: Extract, Generate, Analyze Loop

```bash
# 1. Extract design guidelines from inspiration
python scripts/gemini_batch_process.py \
  --files docs/inspiration/competitor-hero.png \
  --task analyze \
  --prompt "[use extraction prompt from extraction-prompts.md]" \
  --output docs/design-guidelines/competitor-analysis.md \
  --model gemini-2.5-flash

# 2. Generate asset based on extracted guidelines
# (Review competitor-analysis.md for color palette, aesthetic)
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "[craft prompt using extracted aesthetic and colors]" \
  --output docs/assets/our-hero \
  --model imagen-4.0-generate-001 \
  --aspect-ratio 16:9

# 3. Analyze our generated asset
python scripts/gemini_batch_process.py \
  --files docs/assets/our-hero.png \
  --task analyze \
  --prompt "Compare to competitor design. Rate differentiation (1-10).
  Are we too similar or successfully distinct?" \
  --output docs/assets/differentiation-analysis.md \
  --model gemini-2.5-flash

# 4. Extract colors from our final asset for CSS
python scripts/gemini_batch_process.py \
  --files docs/assets/our-hero.png \
  --task analyze \
  --prompt "[use color extraction prompt from visual-analysis-overview.md]" \
  --output docs/assets/color-palette.md \
  --model gemini-2.5-flash
```

## Example 3: A/B Test Assets

```bash
# Generate 2 design directions
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "Minimalist approach: [prompt]" \
  --output docs/assets/variant-a \
  --model imagen-4.0-fast-generate-001 \
  --aspect-ratio 16:9

python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "Bold approach: [prompt]" \
  --output docs/assets/variant-b \
  --model imagen-4.0-fast-generate-001 \
  --aspect-ratio 16:9

# Compare variants
python scripts/gemini_batch_process.py \
  --files docs/assets/variant-a.png docs/assets/variant-b.png \
  --task analyze \
  --prompt "A/B comparison for [target audience]:
  1. Attention capture
  2. Brand alignment
  3. Conversion potential
  Recommend which to test." \
  --output docs/assets/ab-comparison.md \
  --model gemini-2.5-flash

# Generate production version of winner
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "[winning approach prompt]" \
  --output docs/assets/final-hero \
  --model imagen-4.0-generate-001 \
  --aspect-ratio 16:9
```

## Batch Analysis for Rapid Iteration

```bash
# Generate 3 variations with fast model
for i in {1..3}; do
  python scripts/gemini_batch_process.py \
    --task generate \
    --prompt "[prompt with variation-$i twist]" \
    --output docs/assets/var-$i \
    --model imagen-4.0-fast-generate-001 \
    --aspect-ratio 16:9
done

# Batch analyze all variations
python scripts/gemini_batch_process.py \
  --files docs/assets/var-*.png \
  --task analyze \
  --prompt "Rank these variations 1-3 with scores. Identify winner." \
  --output docs/assets/batch-analysis.md \
  --model gemini-2.5-flash
```


### visual analysis overview

# Visual Analysis Overview

Use AI multimodal vision to analyze generated assets and verify design standards.

## Purpose

- Verify generated assets align with aesthetic direction
- Ensure professional quality before integration
- Identify specific improvements needed for iteration
- Make objective design decisions based on analysis
- Extract actionable data (hex codes, composition insights)

## Quick Start

### Comprehensive Analysis
```bash
python scripts/gemini_batch_process.py \
  --files docs/assets/generated-hero.png \
  --task analyze \
  --prompt "[see analysis-prompts.md for detailed prompt]" \
  --output docs/assets/analysis-report.md \
  --model gemini-2.5-flash
```

### Compare Multiple Variations
```bash
python scripts/gemini_batch_process.py \
  --files docs/assets/option-1.png docs/assets/option-2.png docs/assets/option-3.png \
  --task analyze \
  --prompt "[see analysis-prompts.md for comparison prompt]" \
  --output docs/assets/comparison-analysis.md \
  --model gemini-2.5-flash
```

### Extract Color Palette
```bash
python scripts/gemini_batch_process.py \
  --files docs/assets/final-asset.png \
  --task analyze \
  --prompt "Extract 5-8 dominant colors with hex codes. Classify as primary/accent/neutral. Suggest CSS variable names." \
  --output docs/assets/color-palette.md \
  --model gemini-2.5-flash
```

## Decision Framework

### Score ≥ 8/10: Proceed to Integration
**Actions**:
- Optimize for web delivery
- Create responsive variants
- Document implementation guidelines
- Extract color palette for CSS variables

### Score 6-7/10: Minor Refinements Needed
**Actions**:
- Use `ck:media-processing` skill for adjustments (brightness/contrast/saturation)
- Consider selective regeneration of problem areas
- May proceed with caution if time-constrained

### Score < 6/10: Major Iteration Required
**Actions**:
- Analyze specific failure points from report
- Refine generation prompt substantially
- Regenerate with corrected parameters
- Consider alternative aesthetic approach

## Detailed References

- `analysis-prompts.md` - All analysis prompt templates
- `analysis-techniques.md` - Advanced analysis strategies
- `analysis-best-practices.md` - Quality guidelines and pitfalls

## Example Color Extraction Output

```css
/* Extracted Color Palette */
:root {
  /* Primary Colors */
  --color-primary-600: #2C5F7D;  /* Dark teal - headers, CTAs */
  --color-primary-400: #4A90B8;  /* Medium teal - links, accents */

  /* Accent Colors */
  --color-accent-500: #E8B44F;   /* Warm gold - highlights */

  /* Neutral Colors */
  --color-neutral-900: #1A1A1A;  /* Near black - body text */
  --color-neutral-100: #F5F5F5;  /* Light gray - backgrounds */

  /* Semantic Usage */
  --color-text-primary: var(--color-neutral-900);
  --color-text-on-primary: #FFFFFF;
  --color-background: var(--color-neutral-100);
  --color-cta: var(--color-primary-600);
}
```


### workflow 3d

# 3D Design Workflow

Create immersive interactive 3D designs with Three.js.

## Prerequisites
- Activate `ck:ui-ux-pro-max` skill first
- Activate `ck:threejs` skill for 3D and WebGL expertise
- Have `ck:ai-multimodal` skill ready for asset generation

## Initial Research
Run `ck:ui-ux-pro-max` searches:
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<product-type>" --domain product
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "immersive 3d" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "animation" --domain ux
```

## Workflow Steps

### 1. Create Implementation Plan
Use `ui-ux-designer` + `researcher` subagents:
- Create plan directory (use `## Naming` pattern)
- Write `plan.md` (<80 lines overview)
- Add `phase-XX-name.md` files
- Keep research reports under 150 lines

### 2. Implement with Three.js
Use `ui-ux-designer` subagent to build:
- Three.js scene setup
- Custom GLSL shaders
- GPU particle systems
- Cinematic camera controls
- Post-processing effects
- Interactive elements

### 3. Generate 3D Assets
Use `ck:ai-multimodal` skill for:
- Textures and materials
- Skyboxes and environment maps
- Particle sprites
- Video backgrounds

Use `ck:media-processing` skill for:
- Texture optimization for WebGL
- Normal/height map generation
- Sprite sheet creation
- Background removal
- Asset optimization

### 4. Verify & Report
- Test across devices
- Optimize for 60fps
- Report to user
- Request approval

### 5. Document
Update `./docs/design-guidelines.md` with:
- 3D design patterns
- Shader libraries
- Reusable components

## Technical Requirements

### Three.js Implementation
- Proper scene optimization
- Efficient draw calls
- LOD (Level of Detail) where needed
- Responsive canvas behavior
- Memory management

### Shader Development
- Custom vertex shaders
- Custom fragment shaders
- Uniform management
- Performance optimization

### Particle Systems
- GPU-accelerated rendering
- Efficient buffer geometry
- Point sprite optimization

### Post-Processing
- Render pipeline setup
- Effect composition
- Performance budgeting

## Implementation Stack
- Three.js - 3D rendering
- GLSL - Custom shaders
- HTML/CSS/JS - UI integration
- WebGL - GPU graphics

## Performance Targets
- 60fps minimum
- < 100ms initial load
- Responsive to viewport
- Mobile-friendly fallbacks

## Related
- `animejs.md` - UI animation patterns
- `technical-optimization.md` - Performance tips
- `asset-generation.md` - Asset creation


### workflow describe

# Design Description Workflow

Create detailed design documentation from screenshot/video for developer implementation.

## Prerequisites
- Activate `ck:ui-ux-pro-max` skill first
- Have `ck:ai-multimodal` skill ready

## Workflow Steps

### 1. Comprehensive Visual Analysis
Use `ck:ai-multimodal` skill to describe exhaustively:

**Layout & Structure**
- Element positions (absolute coords or relative)
- Container hierarchy
- Grid/flexbox patterns
- Responsive breakpoints visible

**Visual Properties**
- Design style and aesthetic trend
- Every color with hex codes
- Every border (width, style, radius)
- Every icon (describe or identify)
- Font names (predict Google Fonts), sizes, weights
- Line heights, letter spacing

**Spacing System**
- Padding values
- Margin values
- Gap between elements
- Section spacing

**Visual Effects**
- Shapes and geometry
- Textures and materials
- Lighting direction
- Shadows (offset, blur, spread, color)
- Reflections and refractions
- Blur effects (backdrop, gaussian)
- Glow effects
- Background transparency
- Image treatments

**Interactions (if video)**
- Animation sequences
- Transition types and timing
- Hover/focus states
- Scroll behaviors

**Font Prediction**: Match actual fonts, avoid Inter/Poppins defaults.

### 2. Create Implementation Plan
Use `ui-ux-designer` subagent:
- Create plan directory (use `## Naming` pattern)
- Write `plan.md` overview (<80 lines)
- Add detailed `phase-XX-name.md` files

### 3. Report to User
Provide implementation-ready documentation:
- Summary of design system
- Component breakdown
- Technical specifications
- Suggested implementation approach

## Output Format

```markdown
# Design Analysis: [Name]

## Design System
- **Style**: [aesthetic direction]
- **Colors**: [palette with hex]
- **Typography**: [fonts, sizes, weights]
- **Spacing Scale**: [values]

## Component Breakdown
1. [Component] - [specs]
2. [Component] - [specs]

## Implementation Notes
- [Technical considerations]
```

## Related
- `extraction-prompts.md` - Detailed prompts
- `extraction-output-templates.md` - Output formats


### workflow immersive

# Immersive Design Workflow

Create award-quality designs with storytelling, 3D experiences, and micro-interactions.

## Prerequisites
- Activate `ck:ui-ux-pro-max` skill first

## Initial Research
Run `ck:ui-ux-pro-max` searches:
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<product-type>" --domain product
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<style-keywords>" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<mood>" --domain typography
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<industry>" --domain color
```

## Workflow Steps

### 1. Research Phase
Use `researcher` subagent to investigate:
- Design style and current trends
- Font combinations and typography
- Color theory for the context
- Border and spacing patterns
- Element positioning principles
- Animation and interaction patterns

### 2. Design Implementation
Use `ui-ux-designer` subagent:
- Build step by step from research
- Create plan with `## Naming` pattern
- Default to HTML/CSS/JS if unspecified

### 3. Storytelling Elements
Incorporate:
- Narrative flow through scroll
- Emotional pacing
- Visual hierarchy for story beats
- Progressive disclosure of content

### 4. 3D Experiences
If applicable, integrate:
- Three.js scenes
- Interactive 3D elements
- Parallax depth effects
- WebGL enhancements

### 5. Micro-interactions
Add polish:
- Button feedback
- Form interactions
- Loading states
- Hover effects
- Scroll responses

### 6. Asset Generation
Use `ck:ai-multimodal` skill:
- Generate high-quality visuals
- Create unique imagery
- Verify asset quality
- Remove backgrounds as needed

### 7. Verify & Report
- Review against inspiration
- Report to user
- Request approval
- Update `./docs/design-guidelines.md`

## Quality Standards
Match award-winning sites:
- Dribbble top shots
- Behance featured
- Awwwards winners
- Mobbin patterns
- TheFWA selections

## Design Principles
- **Bold aesthetic choices**: Commit fully to direction
- **Attention to detail**: Every pixel matters
- **Cohesive experience**: All elements work together
- **Memorable moments**: Create surprise and delight
- **Technical excellence**: Performance + polish

## Related
- `workflow-3d.md` - 3D implementation details
- `animejs.md` - Animation patterns
- `technical-best-practices.md` - Quality guidelines


### workflow quick

# Quick Design Workflow

Rapid design creation with minimal planning overhead.

## Prerequisites
- Activate `ck:ui-ux-pro-max` skill first

## Initial Research
Run `ck:ui-ux-pro-max` searches:
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<product-type>" --domain product
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<style-keywords>" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<mood>" --domain typography
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<industry>" --domain color
```

## Workflow Steps

### 1. Start Design Process
Use `ui-ux-designer` subagent directly:
- Skip extensive planning
- Move to implementation quickly
- Make design decisions on-the-fly

### 2. Implement
- Default to HTML/CSS/JS if unspecified
- Focus on core functionality
- Maintain quality despite speed

### 3. Generate Assets
Use `ck:ai-multimodal` skill:
- Generate required visuals
- Verify quality quickly
- Use `ck:media-processing` for adjustments

### 4. Report & Approve
- Summarize changes briefly
- Request user approval
- Update `./docs/design-guidelines.md` if approved

## When to Use
- Simple components
- Prototypes and MVPs
- Time-constrained projects
- Iterative exploration
- Single-page designs

## Quality Shortcuts
While moving fast, maintain:
- Semantic HTML
- CSS variables for consistency
- Basic accessibility
- Clean code structure

## Related
- `workflow-immersive.md` - For comprehensive designs
- `technical-overview.md` - Quick reference


### workflow screenshot

# Screenshot Replication Workflow

Replicate a design exactly from a provided screenshot.

## Prerequisites
- Activate `ck:ui-ux-pro-max` skill first for design intelligence
- Have `ck:ai-multimodal` skill ready for visual analysis

## Workflow Steps

### 1. Analyze Screenshot Details
Use `ck:ai-multimodal` skill to extract:
- Design style and visual trends
- Font names (predict Google Fonts), sizes, weights
- Color palette with exact hex codes
- Border radius, spacing patterns
- Element positions, sizes, shapes
- Textures, materials, lighting
- Shadows, reflections, blur, glow effects
- Background transparency, transitions
- Image treatments and effects

**Font Prediction**: Avoid defaulting to Inter/Poppins. Match actual fonts visible.

### 2. Create Implementation Plan
Use `ui-ux-designer` subagent:
- Create plan directory (use `## Naming` pattern from hooks)
- Write `plan.md` (<80 lines, generic overview)
- Add `phase-XX-name.md` files with:
  - Context links, Overview, Key Insights
  - Requirements, Architecture, Related files
  - Implementation Steps, Todo list
  - Success Criteria, Risk Assessment

### 3. Implement
- Follow plan step by step
- Default to HTML/CSS/JS if no framework specified
- Match screenshot precisely

### 4. Generate Assets
Use `ck:ai-multimodal` skill:
- Generate images, icons, backgrounds
- Verify generated assets match design
- Remove backgrounds if needed with `ck:media-processing`

### 5. Verify & Report
- Compare implementation to screenshot
- Report changes summary to user
- Request approval

### 6. Document
If approved, update `./docs/design-guidelines.md`

## Quality Standards
- Match screenshot at pixel level where possible
- Preserve all visual hierarchy
- Maintain exact spacing and proportions
- Replicate animations if visible in source

## Related
- `design-extraction-overview.md` - Extract design guidelines
- `extraction-prompts.md` - Detailed analysis prompts
- `visual-analysis-overview.md` - Verify quality


### workflow video

# Video Replication Workflow

Replicate a design including animations/interactions from a provided video.

## Prerequisites
- Activate `ck:ui-ux-pro-max` skill first
- Have `ck:ai-multimodal` skill ready for video analysis

## Workflow Steps

### 1. Analyze Video Details
Use `ck:ai-multimodal` skill to describe:
- Every visible element and its properties
- All interactions and user flows
- Animation timing, easing, duration
- Transitions between states/pages
- Color palette with hex codes
- Typography (predict Google Fonts)
- Borders, spacing, sizing
- Textures, materials, lighting
- Shadows, reflections, blur, glow
- Background effects

**Font Prediction**: Avoid defaulting to Inter/Poppins.

### 2. Create Implementation Plan
Use `ui-ux-designer` subagent:
- Create plan directory (use `## Naming` pattern)
- Write `plan.md` (<80 lines overview)
- Add `phase-XX-name.md` files with full sections
- Keep research reports under 150 lines

### 3. Implement
- Follow plan step by step
- Default to HTML/CSS/JS if unspecified
- Prioritize animation accuracy

### 4. Animation Implementation
Focus on:
- Timing functions matching video
- State transitions
- Micro-interactions
- Scroll-triggered effects
- Hover/focus states
- Loading animations

Use `animejs.md` reference for animation patterns.

### 5. Generate Assets
Use `ck:ai-multimodal` skill:
- Generate static assets
- Create animated sprites if needed
- Verify quality matches video
- Use `ck:media-processing` for processing

### 6. Verify & Report
- Compare implementation to video
- Test all interactions
- Report summary to user
- Request approval

### 7. Document
If approved, update `./docs/design-guidelines.md`

## Quality Standards
- Frame-accurate animation timing
- Smooth 60fps performance
- Responsive behavior preserved
- All interactions functional

## Related
- `animejs.md` - Animation library reference
- `design-extraction-overview.md` - Guidelines extraction
- `technical-optimization.md` - Performance tips




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
