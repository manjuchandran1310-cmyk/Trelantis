# Trelantis — Figma Make Prompt (Final)

Build the marketing website for **Trelantis** — a commercial reasoning platform for professional services firms. Before a partner commits to a complex engagement, Trelantis identifies the handful of considerations — buried across hundreds of pages of obligations, dependencies, and ambiguities — that will disproportionately determine whether the engagement succeeds commercially, and explains why each one matters before the commitment is made.

Visual direction: institutional authority. The site should feel like it belongs in the same tier as Palantir, Ironclad, or Klarity. Dark navy primary, single amber accent per section used as a functional signal — never decoration. White surfaces, hairline borders, Geist typography throughout. No gradients on text. No illustrations. No emoji. Credibility through precision and restraint.

---

## COLOUR TOKENS

```
--ink:              #2A2B7C    /* Primary — nav, buttons, badges, headings */
--amber:            #E3AF65    /* Accent — ONE focal point per section only. If two ambers are visible, one is wrong. */
--graphite:         #161822    /* Body text, dark headings, footer surface */
--slate:            #5B6072    /* Secondary text, labels, body copy */
--mist:             #9AA0AE    /* Tertiary, placeholders, section indices */
--hairline:         #E4E6EC    /* All borders, dividers, rules */
--surface:          #FFFFFF    /* Page canvas */
--surface-subtle:   #F7F8FA    /* Card backgrounds, sidebar fills */
--surface-ink:      #2A2B7C    /* Navy fill sections */
--surface-dark:     #161822    /* Dark graphite sections */
--amber-glow:       rgba(227, 175, 101, 0.12)
--ink-glow:         rgba(42, 43, 124, 0.18)
```

---

## TYPOGRAPHY

**All type is set in Geist** — import from Google Fonts (`font-family: 'Geist', sans-serif`).
**Mono labels** use Geist Mono — import from Google Fonts (`font-family: 'Geist Mono', monospace`).

No other typefaces. No serif. No fallback to system-ui in the visual design.

### Type Scale

| Role | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Mono label | 11px | 500 | +0.08em | 1.5 |
| Body | 14px | 400 | normal | 1.6 |
| Body large | 16px | 400 | normal | 1.6 |
| UI label | 14px | 500 | normal | 1.4 |
| Card title | 18px | 600 | -0.01em | 1.3 |
| Subheading | 22px | 600 | -0.01em | 1.25 |
| Section heading | 40px | 600 | -0.02em | 1.1 |
| Display | 54px | 600 | -0.03em | 1.05 |
| Display XL | 64px | 600 | -0.04em | 1.0 |

Geist Mono is used **only** for: section index labels, tag pills, stat labels, badge text, and technical micro-copy. Never for body text or headings.

---

## SHAPE & SHADOW

```
--radius-full:    999px   /* buttons, tags, pills */
--radius-card:    12px    /* feature cards, pricing cards */
--radius-panel:   16px    /* large UI panels */
--radius-input:   8px     /* inputs, code blocks, inset extracts */

--shadow-card:    rgba(0,0,0,0.04) 0px 4px 24px 0px,
                  rgba(0,0,0,0.03) 0px 0px 0px 1px
--shadow-raised:  rgba(0,0,0,0.07) 0px 12px 48px -8px,
                  rgba(0,0,0,0.03) 0px 0px 0px 1px
--shadow-amber:   rgba(227,175,101,0.20) 0px 0px 0px 6px
--shadow-ink:     rgba(42,43,124,0.22) 0px 0px 0px 6px
```

Page max-width: 1200px. Section vertical padding: 96px. Card padding: 24px. Element gap: 12px. Base unit: 4px.

---

## SECTION 1 — NAVIGATION

Sticky. White background. 1px `--hairline` bottom border activates on scroll (transparent at top of page). Height: 60px. Transition: border-color 200ms ease.

**Left:** "Trelantis" wordmark — Geist 600 18px `--ink`. No logomark, no icon.

**Centre:** Nav links — "Platform · How It Works · For Firms · Pricing" — Geist 500 14px `--slate`. Hover: `--graphite`. No underlines by default. Active page: `--ink` with a 2px `--ink` underline.

**Right:**
- "Sign in" — ghost pill. Transparent background, 1px `--hairline` border, `--graphite` text, Geist 500 14px, 8px 16px padding, 999px radius.
- "Request Access" — filled pill. `--ink` background, white text, Geist 600 14px, 10px 22px padding, 999px radius. Hover: `--shadow-ink` box-shadow, 200ms ease.

---

## SECTION 2 — HERO

White. Min-height: 90vh. Flex column, vertically and horizontally centred.

**Pre-headline pill** (centred, above heading):
Geist Mono 10px `--mist` uppercase, letter-spacing +0.08em — text: "COMMERCIAL REASONING FOR PROFESSIONAL SERVICES". Background `--surface-subtle`, border 1px `--hairline`, radius 999px, padding 5px 16px.

**Headline** (centred, max-width 780px):
"The reasoning behind every commitment."
Geist 600 64px `--graphite`, letter-spacing -0.04em, line-height 1.0.
The word "reasoning" renders in `--ink`. Italic style on that word only (`font-style: italic`).

**Subheading** (centred, max-width 520px, margin-top 24px):
"Trelantis reads your engagement documents and allocates your attention to the considerations that will determine commercial outcome — before you sign."
Geist 400 17px `--slate`, line-height 1.6.

**CTA row** (centred, gap 12px, margin-top 40px):
1. "Request Early Access" — `--ink` filled pill, white Geist 600 14px, 12px 28px, 999px radius. Hover: `--shadow-ink`.
2. "See how it works →" — ghost pill, `--ink` text + 1px `--ink` border, same size. Hover: `--surface-subtle` fill.

**Microcopy** (centred, margin-top 16px):
Geist 12px `--mist` — "No NDAs required for a demo · Used at Magic Circle and AmLaw 100 firms"

---

### Hero UI Panel

A large rounded panel (radius 16px, border 1px `--hairline`, `--shadow-raised`, max-width 920px, margin: 64px auto 0) showing the Trelantis product interface. This must look like a real professional tool — not a wireframe. Use real matter names and real clause language.

**Top bar** (48px, `--surface-subtle` background, border-bottom 1px `--hairline`):
- Left: breadcrumb Geist 13px `--mist` — "Matters / Freshfields · Strategic Advisory Framework"
- Centre: Geist 500 14px `--graphite` — "Freshfields Bruckhaus Deringer · Framework Agreement 2024"
- Right: amber pill badge "5 findings" (Geist Mono 11px, `--amber` text, rgba(227,175,101,0.15) background, 1px rgba(227,175,101,0.3) border, 999px radius) + "Export ↓" ghost button (Geist 500 13px `--slate`, 1px `--hairline` border, 999px radius, 6px 14px padding).

**Left sidebar** (220px, `--surface-subtle`, right border 1px `--hairline`):
Header: "MATTERS" Geist Mono 10px `--mist` uppercase, padding 16px 16px 8px.
4 matter rows. Each: a 6px circle dot (ink or amber), Geist 500 14px `--graphite` matter name, Geist 400 12px `--mist` client name below. Active row: 3px `--ink` left border, white background.

**Main content** (flex-1, white, padding 24px):
Header row: Geist 600 16px `--graphite` — "Commercial Considerations" with Geist 400 13px `--mist` subtext — "5 identified · ranked by engagement exposure".

4 consideration rows, gap 12px. Each is a card (white, border 1px `--hairline`, radius 10px, padding 16px 20px, `--shadow-card`):
- Left: 20px ink circle badge (`--ink` fill, white Geist 600 12px number)
- Centre: Geist 600 15px `--graphite` consideration title. Below: 1.5 lines Geist 400 13px `--slate`.
- Right: tag pill — "COMMERCIAL" (amber 15% bg, `--amber` text) or "STRUCTURAL" (ink 8% bg, `--ink` text) — Geist Mono 10px, 999px radius, 3px 8px padding.
- Far right: chevron "›" Geist `--mist`.

Row 3 is expanded (background `--surface-subtle`). Below its explanation:
- "Source extract" — Geist Mono 10px `--mist` label. Below: inset block (white, 1px `--hairline` border, radius 8px, padding 12px 16px, Geist Mono 13px `--slate`). One key phrase within the quote has rgba(227,175,101,0.25) background highlight.
- "What to negotiate →" — Geist 500 13px `--ink`, margin-top 8px.

**Panel entrance:** fade in + translateY 32px → 0, 600ms ease-out, 200ms delay on page load.

---

## SECTION 3 — TRUSTED BY

White. Padding 48px 0.

**Label** (centred): Geist Mono 11px `--mist` uppercase — "BUILT FOR THE COMPLEXITY PROFESSIONAL SERVICES FIRMS LIVE IN"

**Firm-type pill row** (centred, gap 0, margin-top 24px):
5 pills in a connected horizontal row. Each: `--surface-subtle` background, 1px `--hairline` border, Geist 500 13px `--slate`, padding 10px 24px. Separated by visible 1px `--hairline` vertical dividers that form a continuous strip. No individual border-radius on inner pills — only first pill has radius-left 999px, last pill radius-right 999px.

Pills: "Magic Circle" · "AmLaw 100" · "Big 4 Advisory" · "Management Consulting" · "Boutique M&A"

Hover on each pill: background white, text `--graphite`.

**Stat strip** (max-width 800px, centred, border-top + border-bottom 1px `--hairline`, padding 40px 0, margin-top 48px):
3 stats, separated by 1px `--hairline` vertical rules. Equal-width columns.

- Stat 1: "3–5 days" — Geist 600 40px `--graphite`. Label below: Geist 400 13px `--mist` — "average partner review time per engagement"
- Stat 2: "8 minutes" — Geist 600 40px `--ink`. Label: "Trelantis analysis time". This stat has a 2px `--amber` underline beneath the number — the single amber focal point of this section.
- Stat 3: "4–8" — Geist 600 40px `--graphite`. Label: "considerations that change the outcome"

---

## SECTION 4 — HOW IT WORKS

Background: `--surface-subtle`. Padding 96px 0.

**Left column** (sticky, 40% width, padding-right 64px):
Section label: diamond bullet "◆" `--amber` 8px + Geist Mono 11px `--mist` uppercase — "THE PRODUCT". Margin-bottom 24px.

Heading:
"From documents to *decision*, in minutes."
Geist 600 52px `--graphite`, line-height 1.0, letter-spacing -0.03em.
"decision" is italic (`font-style: italic`) and coloured `--amber`.

Body (margin-top 24px):
"Trelantis is not another contract-review tool. It reasons across the entire engagement to allocate the partner's attention where it changes the outcome."
Geist 400 16px `--slate`, line-height 1.6.

**Right column** (60% width):
3 numbered steps connected by a continuous 1px `--hairline` vertical line running through the centre of each number badge.

Each step:
- Circle number badge: 40px, white background, 1px `--hairline` border, radius 999px, Geist 600 14px `--ink` number. Badge sits on the vertical line.
- Title: Geist 600 22px `--graphite`, margin-left 32px, margin-top 0 (vertically aligned with badge centre).
- Body: Geist 400 15px `--slate`, line-height 1.6, margin-left 32px, margin-top 8px. Margin-bottom 48px before next step.

Step 01 — **"Upload the engagement pack"**
"Drop in the RFP, proposal, engagement letter, and any side correspondence. No integration, no procurement approval, no seat licence."

Step 02 — **"Trelantis reasons across the documents"**
"It reads for scope, obligations, delivery dependencies, timing risk, staffing implications, and cross-document conflict — the way an experienced partner would."
Badge for step 02 has amber outer ring: `box-shadow: rgba(227,175,101,0.30) 0px 0px 0px 5px` — the focal amber for this section.

Step 03 — **"Receive your Commercial Commitment Briefing"**
"A prioritised, evidence-cited review of the considerations that deserve your attention before you sign. Fewer findings. Better-argued."

Bottom of right column, margin-top 8px:
A closing line in Geist 400 14px `--mist` italic — "The decision is always yours. Trelantis gives you the reasoning to make it well."

---

## SECTION 5 — FEATURES BENTO GRID

White. Padding 96px 0.

**Section header** (max-width 1200px, margin-bottom 48px):
Label: Geist Mono 11px `--mist` uppercase, 3px left border `--amber`, padding-left 12px — "PLATFORM"
Heading: "Every engagement, reasoned in full." — Geist 600 40px `--graphite`, max-width 560px, letter-spacing -0.02em.
Subheading: "Not a search. Not a summary. Trelantis works across the full obligation stack the way an experienced partner would." — Geist 400 16px `--slate`, max-width 480px, margin-top 12px.

**Bento grid** (CSS grid, 12 columns, max-width 1200px, gap 16px):

Every card: white background, border 1px `--hairline`, radius 16px, overflow hidden, `--shadow-card`.
Hover: translateY(-3px), shadow upgrades to `--shadow-raised`, 180ms ease.
**No card contains only text.** Every card has a live UI fragment or motion element in its upper zone.

---

### CARD A — Document Ingestion (7 cols wide, ~380px tall)

**Upper zone (visual, 55% of card height, background `--surface-subtle`, border-bottom 1px `--hairline`):**
A simulated document stack: 3 document rectangles layered slightly offset (like fanned pages). Each: white background, border 1px `--hairline`, radius 6px, inner content represented by 5–7 horizontal lines of varying widths (radius 2px, `--hairline` fill — simulating text lines).

An amber scan-line animates top-to-bottom across all three pages in a continuous loop: a 2px-tall horizontal band, rgba(227,175,101,0.18) fill, smooth ease-in-out, 2.5s per loop. The scan-line represents Trelantis reading. Animation pauses when the browser tab is hidden.

**Lower zone (padding 24px):**
Title: "Reads the full obligation stack" — Geist 600 18px `--graphite`.
Body: "MSAs, SOWs, framework agreements, side letters, redlines. Not just the headline clauses — the cross-document dependencies that shape delivery." — Geist 400 14px `--slate`, margin-top 8px.
Tag pill (margin-top 16px): "PDF · Word · Redline" — Geist Mono 11px `--mist`, `--surface-subtle` background, 1px `--hairline` border, 999px radius, 4px 12px padding.

---

### CARD B — Findings (5 cols wide, ~380px tall, same row as A)

**Upper zone (visual, 55% of card height, padding 20px, background `--surface-subtle`, border-bottom 1px `--hairline`):**
A vertical stack of 4 mini finding rows. Each: white background, radius 8px, border 1px `--hairline`, padding 10px 14px, gap 8px. Rows 1 and 3 have a 3px `--amber` left border. Rows 2 and 4 have a 3px `--ink` left border.

Each row: Geist 500 13px `--graphite` title (one line), Geist 400 12px `--mist` sub (one line). No real content needed — representative placeholder text only.

On card load: rows stagger-animate in from bottom, opacity 0→1 + translateY 8px→0, 60ms delay each, 300ms ease-out.

On card hover: rows re-highlight one at a time in sequence — background shifts to white and a soft amber glow appears behind each amber-bordered row (rgba(227,175,101,0.08) background), 400ms stagger, then resets.

**Lower zone (padding 24px):**
Title: "Surfaces what will change the outcome" — Geist 600 18px `--graphite`.
Body: "Trelantis identifies the 4–8 considerations with disproportionate commercial impact. Not an index of everything it found." — Geist 400 14px `--slate`, margin-top 8px.

---

### CARD C — Exposure Ranking (4 cols wide, ~320px tall, second row)

**Upper zone (visual, 55% of card height, padding 24px, background `--surface-subtle`, border-bottom 1px `--hairline`, display flex, align-items centre, justify-content centre):**
An SVG semicircle arc (180°). The arc is segmented into three zones: LOW (`--hairline`), MEDIUM (`--mist`), HIGH (`--amber`). Arc stroke-width: 10px. Total width ~180px.

A needle (thin line, 2px, `--ink`) rotates from the LOW position to 78% of the arc (pointing into the HIGH zone) on card scroll-into-view. Animation: rotate 0° → 140°, 1.2s ease-out with a slight 8° overshoot and return. Needle pivots from the arc centre point.

Three labels beneath the arc: "LOW · MEDIUM · HIGH" in Geist Mono 10px `--mist`, spaced to align with arc zones.

**Lower zone (padding 24px):**
Title: "Ranked by commercial exposure" — Geist 600 18px `--graphite`.
Body: "Not all findings carry equal weight. Each consideration is ranked by its expected impact on margin and delivery outcome." — Geist 400 14px `--slate`, margin-top 8px.

---

### CARD D — Source Tracing (8 cols wide, ~320px tall, second row)

**Upper zone (visual, 55% of card height, padding 24px, background `--surface-subtle`, border-bottom 1px `--hairline`):**
Left side: A simulated contract paragraph (Geist Mono 12px `--slate`, 4 lines). Two phrases within the paragraph have rgba(227,175,101,0.25) background highlight — simulating Trelantis flagging the relevant language.

A dashed SVG arrow connects from the highlighted text rightward to a callout box on the right side of the upper zone. Callout: white background, border 1px `--hairline`, radius 8px, shadow `--shadow-card`, padding 12px 16px. Content: Geist 600 13px `--graphite` finding title + "COMMERCIAL" amber badge pill below.

On card hover: the dashed arrow animates (stroke-dashoffset animation), 400ms ease. Callout box lifts: translateY -2px, shadow upgrades.

**Lower zone (padding 24px):**
Title: "Every finding traces to its source" — Geist 600 18px `--graphite`.
Body: "Each consideration links to the exact clause it came from. Partners can verify the reasoning, not just accept the output." — Geist 400 14px `--slate`, margin-top 8px.

---

### CARD E — Export (12 cols wide, ~200px tall, third row, horizontal layout)

**Layout:** Two columns side by side, 50/50, padding 32px.

**Left column:**
Title: "Exports a partner-ready briefing" — Geist 600 22px `--graphite`.
Body: "One structured document: findings, source extracts, commercial implications, negotiation flags. Ready before the kickoff call." — Geist 400 15px `--slate`, margin-top 8px.

**Right column (display flex, align-items centre, gap 12px):**
Three export format cards — each: white background, border 1px `--hairline`, radius 8px, padding 12px 20px, Geist 500 14px `--graphite`, small icon left in `--ink`. Cards: "PDF Brief" · "Word Document" · "Slack Summary".

Cards animate in from right on scroll: translateX 16px → 0, opacity 0 → 1, 80ms stagger, 350ms ease-out.

On hover of each card: a 3px `--amber` left border appears (transition 150ms ease). The amber border is the focal amber for this section.

---

## SECTION 6 — BEFORE & AFTER

Background: `--surface-dark` (#161822). Padding 96px 0.

**Section label:** Geist Mono 11px white 40% opacity, 3px left border `--amber`, padding-left 12px — "SEE IT WORK"

**Heading** (max-width 640px):
"The same engagement. Two different positions to negotiate from."
Geist 600 52px white, letter-spacing -0.03em, line-height 1.05.
"Two different" renders in `--amber`.

**Two panels side by side** (gap 24px, max-width 1100px, centred, margin-top 64px):

**LEFT — "Without Trelantis"** (white, radius 16px, padding 28px, `--shadow-raised`):
Label pill: "WITHOUT" — Geist Mono 10px `--mist`, `--surface-subtle` background, 1px `--hairline` border, 999px radius, 4px 12px padding.

Content: A simulated email thread. 4 email rows, each: sender Geist 500 13px `--graphite`, subject Geist 400 13px `--graphite`, preview Geist 400 13px `--mist`, date Geist 400 12px `--mist` right-aligned. Rows separated by 1px `--hairline`. Subject lines: "Re: Framework Agreement — please review" · "FW: Outstanding items — urgent" · "Scope clarification needed before sign-off" · "URGENT: pricing approval needed today".

Below email list: A note block (background #FFF8F0, border 1px rgba(227,175,101,0.3), radius 8px, padding 16px, margin-top 20px): Geist 400 13px `--slate` italic — "3 days of review. 6 email threads. The partner signed with unresolved capped-fee exposure."

**RIGHT — "With Trelantis"** (`--surface-ink` background #2A2B7C, radius 16px, padding 28px, shadow: rgba(42,43,124,0.30) 0 20px 60px -12px):
Label pill: "WITH TRELANTIS" — Geist Mono 10px white 60%, rgba(227,175,101,0.15) background, 1px rgba(227,175,101,0.25) border, 999px radius.

Content: 3 consideration cards (white, radius 10px, border 1px rgba(255,255,255,0.12), padding 14px 18px, gap 10px). Each: 3px `--amber` left border, Geist 600 14px white title, Geist 400 13px white 60% sub-line.

Below cards (margin-top 20px): A single amber stat pill — "8 minutes · 5 findings · ready to negotiate" — Geist Mono 11px `--amber`, rgba(227,175,101,0.12) background, 1px rgba(227,175,101,0.25) border, 999px radius, padding 8px 20px.

---

## SECTION 7 — PRICING

White. Padding 96px 0.

**Section label:** Geist Mono 11px `--mist`, 3px left border `--amber`, padding-left 12px — "PRICING"

**Heading:** "Access structured for how firms actually work." — Geist 600 40px `--graphite`, letter-spacing -0.02em.

**Subheading:** "Engagement-based. No seat licences. No procurement approval required." — Geist 400 16px `--slate`, max-width 520px, margin-top 12px.

**Toggle** (centred, margin-top 40px): Two connected pills — "Per Engagement" / "Annual Retainer". Active: `--ink` background, white Geist 500 14px. Inactive: `--surface-subtle`, `--slate` text. Container: 1px `--hairline` border, 999px radius. Switching animates with 200ms ease.

**Three pricing cards** (gap 24px, margin-top 48px):

---

**CARD 1 — Pilot** (`--surface-subtle` background, 1px `--hairline` border, radius 16px, padding 40px):
Label: "PILOT" — Geist Mono 11px `--mist` uppercase.
Price: "Custom" — Geist 600 40px `--graphite`.
Descriptor: Geist 400 14px `--slate` — "For firms evaluating Trelantis on live matters before wider rollout."
Divider: 1px `--hairline`, margin 24px 0.
5 feature rows, each: 6px `--ink` dot + Geist 400 14px `--graphite`:
· Up to 10 engagements
· Full consideration analysis
· PDF and Word export
· Dedicated onboarding session
· NDA-protected environment
CTA: "Talk to us" — ghost pill, full width, 1px `--ink` border, `--ink` text, Geist 600 14px, 14px padding, 999px radius.

---

**CARD 2 — Practice** (`--ink` #2A2B7C background, radius 16px, padding 40px, shadow: rgba(42,43,124,0.25) 0 20px 60px -8px):
Top-right corner: "MOST POPULAR" pill — rgba(227,175,101,0.20) background, `--amber` text Geist Mono 10px, 1px rgba(227,175,101,0.30) border, 999px radius.
Label: "PRACTICE" — Geist Mono 11px white 50% uppercase.
Price: "£2,400" — Geist 600 48px white. "/month" Geist 400 18px white 50% inline.
Descriptor: Geist 400 14px white 60% — "For active practices with a regular flow of complex fixed-fee or capped-fee matters."
Divider: 1px rgba(255,255,255,0.10), margin 24px 0.
5 feature rows — 6px white dot + Geist 400 14px white 80%:
· Unlimited engagements
· Priority analysis queue
· Slack and email delivery
· API access (beta)
· Dedicated client success manager
CTA: amber filled pill — `--amber` background, `--graphite` text, Geist 600 14px, full width, 999px radius, 14px padding. Hover: rgba(227,175,101,0.22) 0 0 0 6px box-shadow.
Card has ambient amber outer glow: rgba(227,175,101,0.12) 0 0 0 8px — the focal amber for this section.

---

**CARD 3 — Enterprise** (`--surface-subtle` background, 1px `--hairline` border, radius 16px, padding 40px):
Label: "ENTERPRISE" — Geist Mono 11px `--mist` uppercase.
Price: "Bespoke" — Geist 600 40px `--graphite`.
Descriptor: Geist 400 14px `--slate` — "For firm-wide deployment, DMS integration, and white-label delivery."
Divider: 1px `--hairline`, margin 24px 0.
5 features:
· Everything in Practice
· DMS integration (iManage, NetDocuments)
· Custom matter taxonomy
· On-premises deployment option
· Enterprise SLA and support
CTA: "Contact sales" — ghost pill, full width, 1px `--ink` border, `--ink` text.

---

**Below all cards** (centred, margin-top 32px):
Geist 13px `--mist` — "SOC 2 Type II · Data never used for model training · UK and EU data residency available"
Each item separated by a " · " in `--hairline`.

---

## SECTION 8 — TESTIMONIALS

Background: `--surface-subtle`. Padding 96px 0.

**Section label:** Geist Mono 11px `--mist`, 3px left border `--amber`, padding-left 12px — "FROM THE FIELD"

**Heading:** "What partners say after their first matter." — Geist 600 40px `--graphite`, letter-spacing -0.02em.

**Three testimonial cards** (gap 24px, margin-top 48px):
Each: white background, 1px `--hairline` border, radius 16px, padding 32px, `--shadow-card`.

Structure:
- Opening quote mark: Geist 600 64px `--amber`, line-height 0.5, display block, margin-bottom 20px. This is the only amber in this section.
- Quote: Geist 400 16px `--graphite`, line-height 1.6.
- Divider: 1px `--hairline`, margin 20px 0.
- Name: Geist 600 14px `--graphite`. Role + firm: Geist 400 13px `--mist` below.

**Card 1:** "We reduced pre-commitment review from four days to under an hour on a £6M capped-fee instruction. The considerations Trelantis surfaced were exactly the ones that would have affected us at month three." — Sarah Okonkwo, Partner, Commercial Disputes · Global 100 Firm

**Card 2:** "Every summarisation tool gives you a digest. Trelantis is the first product that tells you why something is commercially significant before you commit. That is a different category of tool." — James Whitfield, Managing Director · M&A Advisory Practice

**Card 3:** "We ran it on a framework agreement where we'd had two write-offs on the same client in three years. It found three considerations we'd missed both times. It is now mandatory before any fixed-fee commitment." — Priya Sharma, Director of Legal Operations · AmLaw 50 Firm

---

## SECTION 9 — CLOSING CTA BAND

Background: `--surface-ink` #2A2B7C. Full width. Padding 96px 0.

**Background texture:** A very faint dot grid (SVG pattern, 1px dots, rgba(255,255,255,0.04), 32px spacing) — adds depth without decoration.

**Content** (centred, max-width 640px):
Label: Geist Mono 11px white 40%, 3px left border `--amber`, padding-left 12px — "GET STARTED"

Heading:
"The decision is always yours."
Geist 600 52px white, letter-spacing -0.03em, line-height 1.0.
Second line: "Trelantis gives you the reasoning to make it well."
Geist 400 20px white 60%, line-height 1.5, margin-top 16px. Not a subheading — same visual weight as a large body line.

CTA (margin-top 40px): amber filled pill — "Request Early Access" — `--amber` background, `--graphite` text, Geist 600 14px, 12px 32px, 999px radius. Hover: rgba(227,175,101,0.22) 0 0 0 8px box-shadow, 200ms ease.

Below CTA (margin-top 20px): Geist 12px white 40% — "No NDAs required for a demo · Onboarded within one business day"

---

## SECTION 10 — FOOTER

Background: `--surface-dark` #161822. Padding 72px 0 40px.

**Top row:** Trelantis wordmark left (Geist 600 16px white). Tagline right: "Commercial reasoning for professional services." Geist 400 13px white 40%.

**Four-column link grid** (margin-top 48px, gap 48px):
Column headers: Geist Mono 11px white 30% uppercase, letter-spacing +0.06em.
Links: Geist 400 13px white 50%. Hover: white 90%, 150ms ease.

- **Platform:** How It Works · Features · Integrations · Security · Changelog
- **For Firms:** Magic Circle · AmLaw 100 · Big 4 Advisory · Boutique M&A
- **Company:** About · Careers · Blog · Press
- **Legal:** Privacy Policy · Terms of Service · DPA · Cookie Policy

**Bottom bar** (border-top 1px rgba(255,255,255,0.06), padding-top 24px, margin-top 48px, flex, space-between):
Left: Geist 400 12px white 30% — "© 2025 Trelantis Ltd · Registered in England & Wales"
Right: Geist Mono 11px white 30% — "SOC 2 · UK Data Residency · GDPR Compliant" with 4px dot separators.

---

## MOTION SYSTEM

**Principles:** Motion is purposeful, not decorative. No parallax on body content. No spring physics on enterprise UI. Reduced motion media query respected throughout — all animations collapse to opacity fade only.

**Global:**
- All hover transitions: 180ms ease
- All scroll-triggered entrances: 350–400ms ease-out
- Page load: nav fades in (opacity 0→1, translateY -8px→0, 300ms, 50ms stagger per item)

**Per section:**
1. **Hero panel:** fade in + translateY 32px → 0, 600ms ease-out, 200ms delay
2. **Stat strip numbers:** count up from 0 on scroll-enter, 800ms ease-out
3. **How It Works steps:** scale 0.85 → 1.0 + opacity 0 → 1 on scroll-enter, 120ms stagger per step
4. **Bento Card A scan-line:** continuous loop 2.5s ease-in-out, pauses on hidden tab
5. **Bento Card B findings:** stagger-in on mount, re-run with amber highlight on hover
6. **Bento Card C needle:** rotate 0° → 140° with 8° overshoot, 1.2s ease-out, on scroll-enter
7. **Bento Card D arrow:** stroke-dashoffset on hover, 400ms ease
8. **Bento Card E exports:** translateX 16px → 0 + opacity, 80ms stagger, on scroll-enter
9. **Pricing cards:** translateY 16px → 0 + opacity, 80ms stagger, on scroll-enter
10. **Testimonial cards:** translateY 16px → 0 + opacity, 80ms stagger, on scroll-enter

---

## COPY & TONE RULES

1. No section heading names a product feature or UI element. Every heading is a claim a partner can evaluate.
2. No marketing superlatives: no "seamless", "powerful", "game-changing", "cutting-edge", "robust", "innovative".
3. Trelantis augments partner judgment — it does not replace it. Copy never implies the team "missed" something. It frames the platform as giving partners the reasoning to commit with confidence.
4. Geist Mono is used only for structural UI: labels, indices, badges, tags, stat captions. Never for body copy or headings.
5. The amber (`--amber`) appears exactly once per section as a functional signal — on the most important element in that section. Never twice.
6. Amber in headings: one italic word only. Not a highlighted span. Not a gradient. One italic word in `--amber`.
7. Body copy is 14–16px. The design earns attention through precision, not font size.
