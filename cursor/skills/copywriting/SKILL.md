---
name: ck:copywriting
description: Conversion copywriting formulas, headline templates, email copy patterns, landing page structures, CTA optimization, and writing style extraction. Activate for writing high-converting copy, crafting headlines, email campaigns, landing pages, or applying custom writing styles from assets/writing-styles/ directory.
license: MIT
argument-hint: "[copy-type] [context]"
---

# Copywriting

Formulas, templates, patterns, and writing styles for high-converting copy.

## When to Use

- Writing headlines/subject lines, landing page copy, email campaigns
- Social posts, product descriptions, CTA optimization, A/B variations
- Applying custom writing styles from user documents

## Writing Styles

Load: `references/writing-styles.md` | Full catalog: `assets/writing-styles/default.md` (50 styles)

**Extract styles from multi-format files:**
```bash
python .claude/skills/copywriting/scripts/extract-writing-styles.py --list        # List files
python .claude/skills/copywriting/scripts/extract-writing-styles.py --style <name> # Extract style
```

**Formats:** `.md` `.txt` `.pdf` `.docx` `.xlsx` `.pptx` `.jpg` `.png` `.mp4` (docs/media need `GEMINI_API_KEY`)

## Copy Formulas

Load: `references/copy-formulas.md`

| Formula | Structure | Best For |
|---------|-----------|----------|
| AIDA | Attention → Interest → Desire → Action | Landing pages, ads |
| PAS | Problem → Agitate → Solution | Email, sales pages |
| BAB | Before → After → Bridge | Testimonials, case studies |
| 4Ps | Promise → Picture → Proof → Push | Long-form sales |
| 4Us | Urgent + Unique + Useful + Ultra-specific | Headlines |
| FAB | Feature → Advantage → Benefit | Product descriptions |

## Headlines

Load: `references/headline-templates.md`

Patterns: "How to [X] without [Y]" • "[Number] ways to [benefit]" • "The secret to [outcome]" • "Why [belief] is wrong"

## Email Copy

Load: `references/email-copy.md`

Subject lines: Curiosity gap • Benefit-driven • Question • Urgency

## Landing Pages & CTAs

Load: `references/landing-page-copy.md` | `references/cta-patterns.md`

Hero: Headline (promise) → Subheadline (how) → CTA (action) → Social proof
CTAs: "Start [verb]ing" • "Get [benefit]" • "Yes, I want [benefit]"

## Workflows

| Workflow | Purpose | Use When |
|----------|---------|----------|
| `references/workflow-cro.md` | CRO optimization (25 principles) + plan creation workflow | Conversion optimization & CRO plan requests |
| `references/workflow-enhance.md` | Copy enhancement | Improving existing copy |
| `references/workflow-fast.md` | Quick copy generation | Simple, time-sensitive requests |
| `references/workflow-good.md` | Quality copy with research | High-stakes content |

## References

| File | Purpose |
|------|---------|
| `references/writing-styles.md` | 30 writing styles quick reference |
| `references/copy-formulas.md` | AIDA, PAS, BAB, 4Ps, FAB formulas |
| `references/headline-templates.md` | Headline patterns & templates |
| `references/email-copy.md` | Email copy patterns |
| `references/landing-page-copy.md` | Landing page structure |
| `references/cta-patterns.md` | CTA optimization |
| `references/power-words.md` | Power words by emotion |
| `references/social-media-copy.md` | Platform-specific copy |
| `scripts/extract-writing-styles.py` | Extract styles from multi-format files |
| `templates/copy-brief.md` | Creative brief template |

## Agent Integration

**Primary:** fullstack-developer | **Related:** brand-guidelines, content-marketing, email-marketing

## Best Practices

1. Lead with benefit, not feature | 2. One CTA per piece
3. Specificity > vague claims | 4. Read aloud—if awkward, rewrite
5. Test headlines first | 6. Match copy to awareness level


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### copy formulas

# Copy Formulas

Proven frameworks for persuasive writing.

## AIDA (Attention → Interest → Desire → Action)

The classic framework. Works for landing pages, ads, sales emails.

```
ATTENTION: Bold claim or pattern interrupt
INTEREST: Explain why this matters to them
DESIRE: Paint the picture of transformation
ACTION: Clear CTA with urgency
```

**Example:**
```
[A] Stop losing 80% of your leads.
[I] Most businesses capture emails but never convert them.
    The problem isn't your product—it's your follow-up.
[D] Imagine waking up to sales notifications while you sleep.
    Our automation sends the right message at the right time.
[A] Start your free trial → No credit card required.
```

## PAS (Problem → Agitate → Solution)

Dan Kennedy's "most reliable formula." Works for email, sales pages.

```
PROBLEM: Name the specific pain
AGITATE: Twist the knife (consequences, frustration)
SOLUTION: Present your offer as the answer
```

**Example:**
```
[P] You're posting on LinkedIn daily but getting zero leads.
[A] Hours of content creation. Crickets in your DMs.
    Meanwhile, competitors with worse products are
    booking calls. What do they know that you don't?
[S] Our LinkedIn system generates 15+ qualified leads/week
    using posts that take 10 minutes to write.
```

## BAB (Before → After → Bridge)

Best for testimonials, case studies, transformation stories.

```
BEFORE: Describe the painful current state
AFTER: Paint the desired future state
BRIDGE: Your product/service is the bridge
```

**Example:**
```
[B] Sarah spent 4 hours/day on customer support emails.
    Burnout was inevitable. Her team was drowning.
[A] Now she handles 3x the volume in 1 hour.
    Her team focuses on growth, not firefighting.
[BR] The bridge? Our AI support assistant that learns
     your voice and handles 80% of tickets automatically.
```

## 4Ps (Promise → Picture → Proof → Push)

Long-form sales pages, webinar pitches.

```
PROMISE: Bold outcome claim
PICTURE: Help them visualize having it
PROOF: Evidence it works (testimonials, data)
PUSH: Create urgency, clear CTA
```

## 4Us (Urgent + Unique + Useful + Ultra-specific)

Headlines, subject lines, hooks.

| U | Meaning | Example |
|---|---------|---------|
| Urgent | Time-sensitive | "24 hours left" |
| Unique | Different from competition | "The only..." |
| Useful | Clear benefit | "Save 10 hours/week" |
| Ultra-specific | Precise details | "47% increase in 30 days" |

**Example headline:**
"[24 hours] The only cold email template that books [23 calls/month]"

## FAB (Feature → Advantage → Benefit)

Product descriptions, feature announcements.

```
FEATURE: What it is
ADVANTAGE: What it does better
BENEFIT: Why they care
```

**Example:**
```
[F] One-click export to PDF
[A] No more screenshots or manual formatting
[B] Share professional reports in seconds, not hours
```

## ACCA (Awareness → Comprehension → Conviction → Action)

Educational content, complex products.

```
AWARENESS: Make them aware of the problem/opportunity
COMPREHENSION: Help them understand the solution
CONVICTION: Build belief with proof
ACTION: Direct next step
```

## The 1-2-3-4 Formula

Quick, punchy copy. Social posts, short emails.

```
1. What I've got for you
2. What it will do for you
3. Who am I? (credibility)
4. What you need to do next
```

## Star-Chain-Hook

Storytelling format for longer content.

```
STAR: Introduce the hero (reader or case study)
CHAIN: Series of facts, benefits, reasons
HOOK: Compelling CTA
```

## Formula Selection Guide

| Situation | Best Formula |
|-----------|--------------|
| Cold audience | AIDA, ACCA |
| Aware of problem | PAS |
| Testimonial | BAB |
| Product feature | FAB |
| Headline | 4Us |
| Sales page | 4Ps |
| Quick hook | 1-2-3-4 |


### cta patterns

# CTA Patterns

Button copy and calls-to-action that convert.

## CTA Formulas

### Action + Benefit
```
Start [benefit]ing
Get [outcome]
Unlock [benefit]
Claim [offer]
```

**Examples:**
- Start saving hours
- Get instant access
- Unlock your growth
- Claim your free trial

### First Person ("My")
```
Start my free trial
Get my copy
Build my [thing]
Show me how
Send me the guide
```

Outperforms generic "Get started" in many tests.

### Yes + Benefit
```
Yes, I want [benefit]
Yes, show me how
Yes, sign me up
Count me in
I'm ready to [benefit]
```

### Imperative Verbs
| Verb | Best For |
|------|----------|
| Get | Acquiring something |
| Start | Beginning a journey |
| Join | Community/membership |
| Discover | Learning/content |
| Build | Creation tools |
| Try | Low commitment |
| Book | Services/calls |
| Download | Content offers |
| Watch | Video content |

## CTA by Funnel Stage

### TOFU (Awareness)
```
Learn more
Read the guide
Watch the video
Get the checklist
See how it works
```

### MOFU (Consideration)
```
Start free trial
Schedule a demo
See pricing
Compare plans
Talk to sales
```

### BOFU (Decision)
```
Buy now
Get started
Subscribe
Upgrade today
Claim your spot
```

## Button Copy A/B Tests

Tests often show these winners:

| Lower Conversion | Higher Conversion |
|------------------|-------------------|
| Submit | Get My Free Guide |
| Click here | Start My Free Trial |
| Learn more | Show Me How |
| Sign up | Yes, I Want This |
| Download | Send Me the Checklist |

## Adding Urgency

```
[CTA] - Limited spots
[CTA] - Offer ends [date]
[CTA] (only [N] left)
[CTA] before [deadline]
```

## Adding Value

```
[CTA] — It's free
[CTA] (no credit card)
[CTA] — Cancel anytime
[CTA] — 30-second setup
[CTA] — Risk-free
```

## CTA Placement

### Landing Page
- Hero section (primary)
- After benefits section
- After testimonials
- Final section (full-width)

### Email
- After value proposition
- P.S. section
- Keep above scroll if possible

### Blog Post
- After introduction
- Mid-content (if natural)
- End of post

## Surrounding Copy

### Above CTA
```
Ready to [benefit]?
Join [number]+ [audience] who already [benefit]
Stop [pain]. Start [benefit].
```

### Below CTA (Microcopy)
```
Free forever. No credit card required.
30-day money-back guarantee
Setup takes 2 minutes
Cancel anytime. No questions asked.
```

## CTA Contrast

For multiple CTAs on page:

| Primary | Secondary |
|---------|-----------|
| Filled button | Ghost/outline button |
| Start Free Trial | See Pricing |
| Get Started | Watch Demo |
| Buy Now | Learn More |

## CTA Checklist

- [ ] Action verb starts the CTA?
- [ ] Benefit clear?
- [ ] Matches page intent?
- [ ] Contrasts visually?
- [ ] One primary CTA per section?
- [ ] Risk reducer nearby?
- [ ] Mobile tap-friendly size?


### email copy

# Email Copy

Subject lines, body copy, and CTAs that convert.

## Subject Line Formulas

### Curiosity Gap
```
The [thing] nobody talks about
I was wrong about [topic]
This changes everything
Quick question about [topic]
[Name], noticed something...
```

### Benefit-Driven
```
[Achieve X] in [timeframe]
How to [benefit] without [pain]
Get [result] starting today
Your [thing] is ready
```

### Question Format
```
Are you [doing thing]?
Can I ask you something?
Is [common belief] true?
What if [benefit]?
Quick question?
```

### Urgency
```
[X hours] left
Last chance: [benefit]
Closing tonight
Don't miss this
Final reminder
```

### Personal/Conversational
```
Just between us
I owe you an apology
Can we talk?
I noticed you [action]
Weird request
```

### Number-Based
```
[X] ways to [benefit]
[X]% off ends tonight
[X] people already joined
In [X] minutes, you could...
```

## Subject Line Power Tips

- **47%** of opens based on subject line alone
- Personalized = **26%** higher open rate
- Urgency = **22%** higher open rate
- Keep under **50 characters** for mobile
- Emojis: test, don't assume they work

## Preview Text

The text after subject line. Use it to:
- Extend the curiosity
- Add context
- Create contrast

**Example:**
```
Subject: Quick question?
Preview: (no, I'm not selling anything)
```

## Email Body Structure

### Short Email (50-100 words)
```
[Hook: 1 sentence that grabs attention]

[Value: 2-3 sentences explaining benefit]

[CTA: Single, clear action]

[Sign-off]
```

### Standard Email (100-200 words)
```
[Opening hook]

[Problem acknowledgment]

[Solution/Value introduction]

[Key benefit 1]
[Key benefit 2]

[Social proof if relevant]

[CTA]

[P.S. - reinforce CTA or add urgency]
```

### Story Email
```
[Start in the middle of action]

[Quick backstory]

[The turning point]

[The lesson/insight]

[How it applies to reader]

[CTA]
```

## Opening Lines (Never "Hi [Name]")

**Start with value or story:**
```
Ever notice how...
Here's what most people get wrong about...
I made a mistake yesterday.
3 minutes. That's all it took.
Let me tell you about [name]...
Quick story:
```

## Email CTAs

### Link CTAs
```
→ [Action verb] here
→ Get instant access
→ Start your free trial
→ Book your call now
→ Download the guide
```

### Button CTAs
```
Get Started Free
Claim Your Spot
Show Me How
Yes, I Want This
Try It Risk-Free
```

## P.S. Lines

The P.S. is often read first. Use for:

```
P.S. [Urgency reminder]
P.S. [Bonus mention]
P.S. [Risk reversal]
P.S. [Social proof]
```

**Examples:**
```
P.S. This offer expires at midnight.
P.S. Bonus: Get the swipe file free when you join today.
P.S. Remember, 100% money-back guarantee. Zero risk.
P.S. 2,847 people joined last week.
```

## Email Sequence Types

| Type | Emails | Goal |
|------|--------|------|
| Welcome | 3-5 | Introduce, value, soft CTA |
| Nurture | 5-7 | Educate, build trust |
| Launch | 5-10 | Urgency, overcome objections |
| Re-engagement | 2-3 | Win back inactive |
| Onboarding | 4-7 | Activate, reduce churn |

## Conversion Tips

1. One CTA per email
2. Write like you're emailing one person
3. Short paragraphs (1-2 sentences)
4. Use "you" more than "I" or "we"
5. Test subject lines before body


### headline templates

# Headline Templates

50+ proven headline patterns for high conversion.

## How-To Headlines

```
How to [achieve X] without [pain Y]
How to [achieve X] in [timeframe]
How to [achieve X] (even if [obstacle])
How [person/company] [achieved X]
How I [achieved X] in [timeframe]
```

**Examples:**
- How to write emails that get replies without being pushy
- How to lose 10 pounds in 30 days
- How to land clients (even if you have no portfolio)

## Number Headlines

```
[Number] ways to [achieve benefit]
[Number] [things] every [audience] should know
[Number] mistakes that [negative outcome]
[Number] secrets to [desired outcome]
The top [number] [things] for [outcome]
```

**Examples:**
- 7 ways to double your email open rates
- 5 mistakes that kill landing page conversions
- The top 10 tools for remote teams

## Question Headlines

```
Are you making this [type] mistake?
What if you could [benefit]?
Do you [common struggle]?
Why do [audience] [struggle with X]?
Is [common belief] holding you back?
```

**Examples:**
- Are you making this pricing mistake?
- What if you could write copy in half the time?
- Do you struggle to find clients?

## Secret/Revelation Headlines

```
The secret to [desired outcome]
The [surprising] truth about [topic]
What [experts] won't tell you about [topic]
[Number] little-known [things] that [benefit]
The hidden [thing] behind [outcome]
```

**Examples:**
- The secret to landing page conversions
- The surprising truth about cold email
- What gurus won't tell you about passive income

## Negative Headlines

```
Why [common approach] doesn't work
Stop [doing thing] (do this instead)
[Number] reasons your [thing] isn't working
The [thing] killing your [desired outcome]
Don't [do X] until you [read/see this]
```

**Examples:**
- Why discounting doesn't work
- Stop writing long emails (do this instead)
- 5 reasons your ads aren't converting

## Command Headlines

```
[Verb] your [noun] in [timeframe]
Get [benefit] without [pain]
Start [action] today
Discover the [thing] that [benefit]
Join [number] [people] who [benefit]
```

**Examples:**
- Double your revenue in 90 days
- Get more leads without cold calling
- Join 10,000+ marketers who save 5 hours/week

## Comparison Headlines

```
[X] vs [Y]: Which [outcome] faster?
Why [A] beats [B] for [benefit]
[Thing A] or [Thing B]? Here's the truth
The difference between [success] and [failure]
```

**Examples:**
- SEO vs Paid Ads: Which grows revenue faster?
- Why webinars beat ebooks for lead gen

## Guarantee Headlines

```
[Achieve X] or your money back
[Benefit] guaranteed in [timeframe]
The only [thing] that [guarantees outcome]
```

## Curiosity Gap Headlines

```
This [thing] changed everything for [audience]
I was wrong about [topic]
The [thing] nobody talks about
What happened when I [did X]
```

## Headline Power Words

**Urgency:** Now, Today, Immediately, Fast, Quick, Limited
**Exclusivity:** Secret, Hidden, Little-known, Insider
**Value:** Free, Bonus, Save, Discount, Proven
**Results:** Guaranteed, Tested, Works, Results, Success
**Emotion:** Amazing, Stunning, Incredible, Life-changing

## Headline Checklist

- [ ] Specific benefit clear?
- [ ] Audience identified?
- [ ] Urgency or curiosity?
- [ ] Power word included?
- [ ] Under 10 words ideal?
- [ ] Read aloud—flows naturally?


### landing page copy

# Landing Page Copy

Structure and templates for high-converting landing pages.

## Above The Fold (Hero Section)

The first screen matters most. Include:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Pre-headline - optional credibility]          │
│                                                 │
│  HEADLINE: Promise the outcome                  │
│                                                 │
│  Subheadline: How or why (supporting detail)    │
│                                                 │
│  [Hero image/video]       [Primary CTA button]  │
│                                                 │
│  [Social proof snippet: "Join 10,000+ users"]   │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Headline Formulas

```
[Achieve outcome] without [pain]
The [adjective] way to [benefit]
[Benefit] in [timeframe]
Get [result]. [Handle objection].
[Do X] like [aspirational group]
```

**Examples:**
- Write emails that convert without sounding salesy
- The fastest way to build landing pages
- Double your leads in 30 days
- Get more clients. Spend less time selling.

## Subheadline Formulas

```
[Product] helps [audience] [benefit] so they can [ultimate goal]
Even if [common objection]
Without [pain they expect]
The [only/first/fastest] [thing] that [benefit]
```

**Examples:**
- Our AI helps marketers write copy 10x faster so they can focus on strategy
- Even if you've never written a sales email before
- Without hiring expensive copywriters

## Social Proof Section

### Testimonials
```
"[Result achieved] in [timeframe]. [Emotional reaction]."
— [Name], [Title] at [Company]
```

### Stats Bar
```
[10,000+] customers | [4.9/5] rating | [50M+] emails sent
```

### Logo Cloud
```
"Trusted by teams at [Logo1] [Logo2] [Logo3]..."
```

## Benefits Section

Use this structure:
```
[Benefit headline]
[1-2 sentence explanation]
[Optional: icon or image]
```

**Write benefits, not features:**

| Feature | Benefit |
|---------|---------|
| "AI-powered" | "Writes copy in seconds" |
| "Cloud-based" | "Access from anywhere" |
| "Advanced analytics" | "Know exactly what's working" |

## How It Works Section

```
Step 1: [Action verb] → [Outcome]
Step 2: [Action verb] → [Outcome]
Step 3: [Action verb] → [Outcome]
```

**Example:**
```
Step 1: Connect your data → One-click setup
Step 2: Choose your template → AI writes your copy
Step 3: Launch your campaign → Start getting leads
```

## FAQ Section

Address objections disguised as questions:

```
"How long does it take to see results?"
→ Answer + success story reference

"What if it doesn't work for my industry?"
→ Answer + social proof from similar industry

"Is there a contract?"
→ Answer + risk reversal
```

## CTA Section Patterns

### Primary CTA
```
[Action verb] + [benefit]
Get Started Free
Start Your Free Trial
Build Your First [Thing]
```

### With Risk Reversal
```
[CTA button]
No credit card required. Cancel anytime.
30-day money-back guarantee.
```

### With Urgency
```
[CTA button]
Limited time: Save 40% (ends Friday)
Only 17 spots left this month
```

## Page Flow (Long-form)

```
1. Hero (problem → promise)
2. Pain points (agitate)
3. Solution intro
4. How it works
5. Benefits (3-5)
6. Social proof
7. Pricing/offer
8. FAQ (objections)
9. Final CTA
```

## Conversion Boosters

- **Specificity**: "47% increase" > "big increase"
- **Contrast**: Before/after comparisons
- **Scarcity**: Limited spots, time, quantity
- **Risk reversal**: Guarantees, free trials
- **Social proof**: Numbers, logos, testimonials

## Landing Page Checklist

- [ ] Headline promises clear outcome?
- [ ] Subheadline supports or explains?
- [ ] One primary CTA (repeated)?
- [ ] Benefits, not features?
- [ ] Social proof visible above fold?
- [ ] Objections addressed?
- [ ] Mobile-optimized?
- [ ] Page loads under 3 seconds?


### power words

# Power Words

Emotional triggers and action words for copy.

## Urgency Words

```
Now             Limited         Hurry
Today           Last chance     Deadline
Immediately     Expires         Running out
Instant         Quick           Fast
Before          Final           Closing
```

**Usage:**
```
"Get instant access now"
"Limited spots remaining"
"Offer expires tonight"
```

## Exclusivity Words

```
Secret          Insider         Members-only
Exclusive       Private         VIP
Hidden          Rare            Elite
Invitation      Access          Behind-the-scenes
```

**Usage:**
```
"Exclusive access for subscribers"
"The hidden strategy behind..."
"Insider secrets revealed"
```

## Value Words

```
Free            Bonus           Save
Discount        Deal            Value
Bargain         Reduced         Guarantee
Gift            Complimentary   No-cost
```

**Usage:**
```
"Free bonus included"
"Save 50% today only"
"Guaranteed results or money back"
```

## Trust Words

```
Proven          Tested          Verified
Certified       Authentic       Genuine
Official        Trusted         Reliable
Safe            Secure          Protected
```

**Usage:**
```
"Proven by 10,000+ users"
"Verified results"
"100% secure checkout"
```

## Results Words

```
Results         Success         Achieve
Transform       Breakthrough    Boost
Increase        Improve         Maximize
Double          Triple          Skyrocket
```

**Usage:**
```
"Double your conversions"
"Breakthrough strategy"
"Transform your business in 30 days"
```

## Emotion Words

### Positive
```
Amazing         Incredible      Stunning
Brilliant       Exciting        Delightful
Wonderful       Remarkable      Inspiring
```

### Negative (for pain points)
```
Frustrated      Overwhelmed     Struggling
Stuck           Stressed        Burned out
Worried         Confused        Lost
```

## Curiosity Words

```
Secret          Surprising      Unexpected
Little-known    Discover        Reveal
Uncover         Mystery         Behind
```

**Usage:**
```
"The surprising truth about..."
"Discover what most people miss"
"Little-known strategy that..."
```

## Authority Words

```
Expert          Professional    Research
Study           Data            Science
Backed          Endorsed        Recommended
Award-winning   Industry        Leading
```

## Simplicity Words

```
Easy            Simple          Effortless
Quick           Fast            Instant
Automatic       One-click       Seamless
Beginner        Step-by-step    Straightforward
```

**Usage:**
```
"Easy setup in 5 minutes"
"One-click automation"
"Simple step-by-step guide"
```

## Power Word Combinations

| Combo | Example |
|-------|---------|
| Urgency + Value | "Limited-time free access" |
| Exclusivity + Results | "Insider secrets to 2x growth" |
| Simplicity + Results | "Easy way to double leads" |
| Trust + Exclusivity | "Proven system used by top 1%" |

## Words to Avoid

### Vague/Weak
```
Nice            Good            Great (overused)
Very            Really          Actually
Things          Stuff           Interesting
```

### Corporate Speak
```
Synergy         Leverage        Holistic
Paradigm        Utilize         Optimize (overused)
Disrupt         Pivot           Solution (overused)
```

### Overused Marketing
```
Revolutionary   Cutting-edge    World-class
Best-in-class   Game-changing   Next-level
```

## Power Word Placement

| Location | Best Word Types |
|----------|----------------|
| Headlines | Curiosity, urgency, numbers |
| Subheadlines | Benefits, simplicity |
| CTAs | Action, value, urgency |
| Email subjects | Curiosity, urgency, personal |
| Body copy | Trust, results, emotion |

## Usage Tips

1. **Don't overuse** — 1-2 power words per headline
2. **Match context** — urgency for sales, curiosity for content
3. **A/B test** — what works for one audience may not for another
4. **Be authentic** — false urgency/exclusivity backfires
5. **Combine strategically** — pair urgency with value


### social media copy

# Social Media Copy

Platform-specific templates and patterns.

## Twitter/X

### Character Limits
- Tweet: 280 characters
- Preview shown: ~140 characters (critical)

### Thread Structure
```
Tweet 1 (Hook):
[Bold claim or curiosity gap]

Tweet 2-N (Body):
[Each tweet = one complete point]

Final Tweet (CTA):
[Action + reminder to follow/retweet]
```

### High-Performing Patterns

**Hot Take:**
```
Unpopular opinion: [contrarian view]

Here's why 👇
```

**Story Hook:**
```
I [did X] and [unexpected result].

Here's what happened:
```

**List Post:**
```
[Number] things I wish I knew about [topic]:

1. [Point]
2. [Point]
...
```

**Before/After:**
```
[Time] ago: [painful state]
Today: [successful state]

What changed:
```

### Twitter Tips
- First 140 characters = hook
- Line breaks = readability
- No hashtags (usually)
- Questions drive replies
- Controversy (tasteful) drives engagement

---

## LinkedIn

### Character Limits
- Post: 3,000 characters
- "See more" appears after ~210 characters

### Structure
```
[Hook line - must grab attention]
[Second hook line]

[Story or insight - keep paragraphs short]

[Lesson/takeaway]

[Question or CTA]

---
[Optional: hashtags at bottom, max 3-5]
```

### High-Performing Patterns

**Humble Brag:**
```
I almost didn't post this.

Last week, [achievement].

But here's what nobody talks about:
[The struggle behind it]

Key lesson: [insight]
```

**Contrarian:**
```
Stop saying [common advice].

Here's why it's wrong for most people:
[Explanation]
```

**Story:**
```
[Start with dramatic moment]

Let me back up.

[Context]

[What happened]

[The lesson]
```

### LinkedIn Tips
- First 2 lines = everything
- Stories outperform tips
- Personal > professional
- Avoid links in posts (kills reach)
- Engage in comments for 30 min after posting

---

## Instagram

### Caption Structure
```
[Hook - first line visible]
.
.
.
[Story/value]

[CTA: Comment, save, share]

.
.
.
[Hashtags - 15-30, relevant]
```

### Caption Hooks
```
Stop scrolling if you [pain point]
This changed everything for me
Nobody talks about this but...
The truth about [topic]
```

### Instagram Tips
- First line = hook (before "more")
- Use line breaks for readability
- CTA: Ask for saves, shares, comments
- Hashtags in caption or first comment

---

## TikTok/Reels

### Hook (First 1-3 seconds)
```
"Here's why you're [failing at X]"
"The [thing] nobody's talking about"
"I tested [X] for 30 days"
"Stop doing [X] immediately"
"This will change how you [X]"
```

### Script Structure (15-60 sec)
```
[0-3s] Hook
[3-20s] Problem/setup
[20-45s] Solution/reveal
[45-60s] CTA
```

### Overlay Text
```
[Attention-grabbing text on screen]
- Keep it short (2-5 words)
- High contrast colors
- Top 1/3 of frame
```

---

## Universal Social Patterns

### Engagement Drivers
- Questions that invite opinions
- Controversial (but defensible) takes
- Specific numbers and results
- Before/after transformations
- Behind-the-scenes content

### What to Avoid
- Generic motivational quotes
- Excessive hashtags
- Links in posts (except Twitter)
- All caps (looks spammy)
- Being salesy without value

### Content Ratio
```
80% value (teach, entertain, inspire)
20% promotion (offers, launches)
```

## Platform Comparison

| Platform | Tone | Length | Best For |
|----------|------|--------|----------|
| Twitter/X | Punchy, opinionated | Short threads | Hot takes, insights |
| LinkedIn | Professional, personal | Medium-long | Stories, credibility |
| Instagram | Visual, lifestyle | Medium | Community, brand |
| TikTok | Raw, fast, trendy | Short | Awareness, virality |


### workflow cro

# CRO (Conversion Rate Optimization) Workflow

Analyze content and optimize for conversion based on user-reported issues.

## Conversion Optimization Framework

25 principles for high-converting copy:

### Headlines & Value Prop
1. **4-U Headline Formula**: Useful, Unique, Urgent, Ultra-specific (80% won't read past headline)
2. **Above-Fold Value**: Customer problem focus, no company story, zero scroll required
3. **Benefit-First Language**: Features tell, benefits sell, transformations compel

### CTAs & Forms
4. **First-Person CTAs**: "Get MY Guide" vs "Get YOUR Guide" (90% more clicks)
5. **5-Field Max Forms**: Every field kills conversions, progressive profiling for rest
6. **Micro-Commitment Ladder**: Small yes → big yes, start email only

### Psychology & Trust
7. **Message Match**: Ad copy = landing headline, broken promises = bounce
8. **Social Proof Near CTAs**: Testimonials with faces/names/results at decision points
9. **Cognitive Bias Stack**: Loss aversion (fear), social proof (FOMO), anchoring (pricing)
10. **PAS Framework**: Problem → Agitate → Solve, emotion before logic

### Pricing & Urgency
11. **Genuine Urgency Only**: Real deadlines, actual limits—fake timers destroy trust
12. **Price Anchoring**: Show expensive option first, real price feels like relief
13. **Trust Signal Clustering**: Security badges, guarantees, policies visible together

### Layout & UX
14. **Visual Hierarchy F-Pattern**: Eyes scan F-shape, put conversions in path
15. **Lead Magnet Hierarchy**: Templates > Checklists > Guides (instant > delayed)
16. **Objection Preemption**: Address top 3 concerns before they think them, FAQ near CTA
17. **Mobile Thumb Zone**: CTAs where thumbs naturally rest
18. **White Space = Focus**: Empty space makes CTAs impossible to miss

### Testing & Optimization
19. **One-Variable Testing**: Change one thing, measure impact, compound wins
20. **Post-Conversion Momentum**: Thank you page sells next step while excitement peaks
21. **Cart Recovery Sequence**: Email 1hr, retarget 4hr, incentive 24hr

### Copy Quality
22. **Grade 6 Reading Level**: Smart people prefer simple, 11-word sentences, short paragraphs
23. **TOFU/MOFU/BOFU Logic**: Awareness ≠ decision content, match intent
24. **Specificity > Vague Claims**: Numbers, timeframes, concrete outcomes
25. **Weekly Optimization Ritual**: Review Monday, test Tuesday, iterate/scale

## Workflow Steps

1. **Screenshots provided** → Use `ck:ai-multimodal` skill to analyze conversion issues
2. **Videos provided** → Use `ck:ai-multimodal` video-analysis for bottleneck identification
3. **URL provided** → Use `web_fetch` tool to fetch and analyze current issues
4. **Scout codebase** → `/ck:scout ext` (preferred) or `/ck:scout` to find relevant files
5. **Implement** → Use `fullstack-developer` agent to write enhanced copy into code files

## CRO Plan Creation Workflow

Use when creating a structured CRO optimization plan (e.g., via `/ck:plan:cro`).

### Steps

1. **Analyze** → Gather issues from screenshots/videos/URLs using steps above
2. **Activate** `ck:plan` skill for plan structure
3. **Create plan directory** using naming pattern from `## Naming` section (hook-injected)
4. **Write `plan.md`** with required YAML frontmatter:
   ```yaml
   ---
   title: "{Brief title}"
   description: "{One sentence for card preview}"
   status: pending
   priority: P2
   effort: {sum of phases, e.g., 4h}
   branch: {current git branch}
   tags: [cro, conversion]
   created: {YYYY-MM-DD}
   ---
   ```
5. Keep `plan.md` generic, under 80 lines, list each phase with status/progress and links
6. **Create phase files** (`phase-XX-phase-name.md`) with sections: Context links, Overview (date/priority/statuses), Key Insights, Requirements, Architecture, Related code files, Implementation Steps, Todo list, Success Criteria, Risk Assessment, Security Considerations, Next steps
7. Keep research markdown reports ≤150 lines with citations
8. **Wait** for user approval before implementing

Sacrifice grammar for concision. List unresolved questions at end of reports.


### workflow enhance

# Copy Enhancement Workflow

Analyze existing copy issues and enhance for better performance.

## When to Use

- User reports copy problems (unclear messaging, low engagement, weak CTAs)
- Content needs polish without complete rewrite
- Quick improvements to existing marketing materials

## Workflow Steps

1. **Screenshots provided** → Use `ck:ai-multimodal` skill to analyze and describe issues in detail
2. **Videos provided** → Use `ck:ai-multimodal` video-analysis to extract relevant copy issues
3. **Scout codebase** → `/ck:scout ext` (preferred) or `/ck:scout` to find files needing enhancement
4. **Implement** → Use `fullstack-developer` agent to write enhanced copy into code files

## Enhancement Checklist

- [ ] Headlines grab attention (4-U formula)
- [ ] Benefits lead, features follow
- [ ] CTAs clear and action-oriented
- [ ] Social proof present
- [ ] Objections addressed
- [ ] Reading level appropriate (Grade 6-8)
- [ ] Mobile-friendly formatting

## Related References

- `workflow-cro.md` - Full CRO framework
- `copy-formulas.md` - AIDA, PAS, BAB structures
- `headline-templates.md` - Headline patterns


### workflow fast

# Fast Copy Workflow

Quick, creative copy generation with minimal research.

## When to Use

- Simple copy requests (social posts, short descriptions)
- Time-sensitive content needs
- Clear context already provided

## Workflow Steps

1. **Screenshots provided** → Use `ck:ai-multimodal` skill to analyze context
2. **Videos provided** → Use `ck:ai-multimodal` video-analysis for context
3. **Write** → Use `fullstack-developer` agent directly to produce copy

## Speed Optimization

- Skip research phase—use provided context
- Apply formulas from `copy-formulas.md` directly
- Single-pass writing, minimal revision

## Best For

- Social media posts
- Short product descriptions
- Quick email drafts
- Ad variations
- Micro-copy (buttons, labels, tooltips)


### workflow good

# Quality Copy Workflow

Thorough copy development with research, planning, and execution.

## When to Use

- High-stakes content (landing pages, sales pages, campaigns)
- Complex products/services requiring deep understanding
- Brand-critical messaging

## Workflow Steps

1. **Screenshots provided** → Use `ck:ai-multimodal` skill for detailed context analysis
2. **Videos provided** → Use `ck:ai-multimodal` video-analysis for comprehensive context
3. **Research** → Spawn multiple `researcher` agents in parallel:
   - Competitor messaging analysis
   - Target audience insights
   - Industry best practices
   - Product/service details
4. **Scout codebase** → `/ck:scout ext` (preferred) or `/ck:scout` to find relevant files
5. **Plan** → Use `planner` agent to outline copy structure and strategy
6. **Write** → Use `fullstack-developer` agent to execute plan

## Quality Checklist

- [ ] Research validates messaging direction
- [ ] Plan reviewed against user requirements
- [ ] Copy follows chosen formula (AIDA, PAS, etc.)
- [ ] Multiple headline options provided
- [ ] CTAs tested for clarity
- [ ] Social proof integrated
- [ ] Objections anticipated and addressed

## Related References

- `copy-formulas.md` - Core copywriting structures
- `headline-templates.md` - Headline variations
- `landing-page-copy.md` - Page structure
- `writing-styles.md` - Voice and tone options


### writing styles

# Writing Styles Guide

Define, extract, and apply consistent writing voices across content.

## Style Dimensions Framework

Every writing style can be mapped across these dimensions:

| Dimension | Spectrum | Description |
|-----------|----------|-------------|
| Tone | Formal ↔ Casual | How official or relaxed |
| Pace | Fast ↔ Measured | Sentence length, rhythm |
| Vocabulary | Simple ↔ Technical | Word complexity level |
| Emotion | Reserved ↔ Expressive | Emotional intensity |
| Humor | Serious ↔ Playful | Use of wit, jokes |
| Perspective | Third-person ↔ First-person | Pronoun usage |
| Authority | Peer ↔ Expert | Positioning relative to reader |

## Pre-Built Style Definitions

### Casual Conversational

**Best for:** Indie hackers, startups, personal brands

**Dimensions:**
- Tone: Casual
- Pace: Fast
- Vocabulary: Simple
- Emotion: Expressive
- Humor: Playful
- Perspective: First-person

**Characteristics:**
- Contractions ("you're", "isn't")
- Short sentences, fragments OK
- Personal pronouns ("I", "you")
- Informal transitions ("So here's the thing...")
- Emoji usage acceptable

**Example:**
> "Look, I get it. Marketing feels overwhelming. But here's what I learned after burning through $10k on ads that didn't work—it doesn't have to be complicated."

---

### Professional Authoritative

**Best for:** Enterprise SaaS, B2B, consulting

**Dimensions:**
- Tone: Formal
- Pace: Measured
- Vocabulary: Technical
- Emotion: Reserved
- Humor: Serious
- Perspective: Third-person / We

**Characteristics:**
- Complete sentences
- Industry terminology
- Data-driven claims
- Formal transitions
- No emoji

**Example:**
> "Organizations that implement structured content strategies outperform competitors by 3.5x in lead generation. This comprehensive guide examines the frameworks that drive measurable results."

---

### Edgy Provocative

**Best for:** Disruptor brands, hot takes, thought leadership

**Dimensions:**
- Tone: Casual-to-Formal (varies)
- Pace: Fast
- Vocabulary: Simple with punchy terms
- Emotion: Expressive
- Humor: Playful but sharp
- Perspective: First-person

**Characteristics:**
- Bold claims
- Contrarian positions
- Short, punchy sentences
- Pattern interrupts
- Strategic use of questions

**Example:**
> "Everything you know about content marketing is wrong. Seriously. The 'best practices' everyone follows? They're why you're invisible. Let me show you what actually works."

---

### Luxe Minimalist

**Best for:** Premium products, luxury brands, high-end services

**Dimensions:**
- Tone: Formal
- Pace: Measured, spacious
- Vocabulary: Elegant, selective
- Emotion: Reserved but refined
- Humor: Subtle or absent
- Perspective: Second-person

**Characteristics:**
- Fewer words, more impact
- White space between ideas
- Refined vocabulary
- Understated confidence
- No hard sell

**Example:**
> "Exceptional results require exceptional attention. We work with founders who understand that true growth cannot be rushed. By invitation only."

---

### Warm Supportive

**Best for:** Wellness, coaching, education, community

**Dimensions:**
- Tone: Casual
- Pace: Measured
- Vocabulary: Simple
- Emotion: Expressive
- Humor: Gentle
- Perspective: First-person plural ("we")

**Characteristics:**
- Empathetic language
- Inclusive pronouns
- Encouraging tone
- Validation before advice
- Gentle CTAs

**Example:**
> "It's okay if you're feeling stuck. We've all been there. The journey isn't always linear, and that's completely normal. Let's explore some gentle ways to move forward together."

---

### Technical Educator

**Best for:** Developer content, technical tutorials, documentation

**Dimensions:**
- Tone: Neutral-to-Casual
- Pace: Measured
- Vocabulary: Technical but explained
- Emotion: Reserved
- Humor: Dry/nerdy
- Perspective: Second-person

**Characteristics:**
- Code examples
- Step-by-step structure
- Precise terminology
- Assumes competence
- Occasional dry humor

**Example:**
> "Here's the thing about async/await—it's not magic, it's just syntactic sugar over Promises. Let's break down what's actually happening under the hood, and why your code isn't working the way you expect."

## Style Extraction Prompt

Use this prompt to analyze existing content and extract its style:

```
Analyze this content and extract the writing style:

[PASTE CONTENT]

Provide:
1. Tone (formal ↔ casual):
2. Pace (fast ↔ measured):
3. Vocabulary (simple ↔ technical):
4. Emotion (reserved ↔ expressive):
5. Humor (serious ↔ playful):
6. Perspective (pronoun usage):
7. Sentence structure patterns:
8. Signature phrases/patterns:
9. What to DO in this style:
10. What to AVOID in this style:
```

## Style Application Prompt

Use this prompt to write in a specific style:

```
Write [CONTENT TYPE] in the following style:

**Tone:** [casual/formal]
**Pace:** [fast/measured]
**Vocabulary:** [simple/technical]
**Emotion:** [reserved/expressive]
**Perspective:** [first/second/third person]

**DO:**
- [specific patterns to use]

**DON'T:**
- [patterns to avoid]

Topic: [TOPIC]
```

## Writing Style File Format

Store custom styles in `assets/writing-styles/`:

```yaml
# assets/writing-styles/indie-hacker.yaml
name: Indie Hacker
description: Authentic, scrappy, behind-the-scenes vibe

dimensions:
  tone: casual
  pace: fast
  vocabulary: simple
  emotion: expressive
  humor: self-deprecating
  perspective: first-person

patterns:
  - Short sentences
  - Fragments for emphasis
  - Numbers and specifics
  - "Here's what I learned"
  - Behind-the-scenes honesty

avoid:
  - Corporate speak
  - Passive voice
  - Vague claims
  - Salesy language

examples:
  - "Shipped v1 in 48 hours. It was broken. People loved it anyway."
  - "Revenue last month: $4,293. Not life-changing, but real."
```

## Integration

Use with:
- `brand-guidelines` skill - Align with brand voice
- `/youtube:blog` command - Apply style to video-to-article
- `/content:good` command - Style-aware content generation




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
