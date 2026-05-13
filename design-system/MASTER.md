# Master Design System — Omer Ben Simon Portfolio

> Source of truth for visual, motion, and interaction decisions on this site.
> When building or editing any UI, read this file first. Page-level deviations live in `design-system/pages/<page>.md`.

---

## 1. Identity

- **Style:** Modern Dark (Cinema) + HUD/Sci-Fi accents + Interactive Cursor.
- **Voice:** Premium, technical, restrained. Implies depth without shouting. Cyan/violet gradient is the brand signature — earn it, don't spray it.
- **Mode:** Dark-only. No light mode. Do not introduce a toggle without scoping new tokens.
- **Audience:** Engineering managers, AI/security researchers, senior recruiters. They scan first, read second. Information density and clarity beat ornament.

**One-line test for new UI:** if it would feel at home next to a Linear, Vercel, or Anthropic console screenshot, it fits. If it leans cyberpunk-arcade or pastel-startup, it does not.

---

## 2. Color Tokens

All colors are declared in `styles.css :root`. Reference them via CSS variables, never raw hex inside components.

### Surfaces (deep navy ladder)

| Token | Value | Use |
|-------|-------|-----|
| `--bg-0` | `#07090f` | Deepest, page edges / outermost containers |
| `--bg-1` | `#0a0e1a` | Body background (the default surface) |
| `--bg-2` | `#0f1424` | Elevated surfaces (cards over body when needed) |
| `--bg-3` | `#141a2e` | Highest elevation (modals, popovers) |
| `--line` | `rgba(255,255,255,.08)` | Default 1px border / divider |
| `--line-2` | `rgba(255,255,255,.14)` | Hover / focused border |

### Text

| Token | Value | Use |
|-------|-------|-----|
| `--text` | `#e7ebf3` | Primary body & headings |
| `--text-2` | `#b9c1d4` | Secondary body, descriptions, nav inactive |
| `--muted` | `#7d869e` | Captions, stat labels, timestamps |

### Accents (the brand)

| Token | Value | Role |
|-------|-------|------|
| `--cyan` | `#4cc6ff` | Primary accent. Section numbers, links, focus, hover borders. |
| `--cyan-2` | `#00e0ff` | Vivid cyan. Glow shadows only (e.g. `rgba(0,212,255,.5)` for box-shadows). |
| `--violet` | `#a86bff` | Secondary accent. Gradient companion to cyan. |
| `--violet-2` | `#7c3aed` | Deep violet. Page-level glow halo. |
| `--pink` | `#ff7ad9` | Reserved. Currently unused — don't introduce without a reason. |

### Status colors (used inline, not yet tokenized)

| Use | Value | Notes |
|-----|-------|-------|
| Active / live | `#5af0a3` (mint) | Pulsing dot in hero tag, "Now" pill |
| Past / archive | `#c79bff` (light violet) | Past-role pill |

If you introduce a third status color, add it to `:root` with a `--status-*` name.

---

## 3. The Gradient Rule

The signature gradient is `linear-gradient(135deg, var(--cyan), var(--violet))`. It is a **finite resource** — overuse cheapens it.

**Approved uses (all currently in code):**
- Brand mark (the "O" tile)
- `btn-primary` background
- Hero title accent line (`.gradient`)
- `<em>` inside hero title
- Progress bar
- Timeline dot
- Card ::before (rotating conic-gradient border on hover)
- Card-icon background tint (low opacity)

**Do not use the gradient for:**
- Body text or paragraph color
- Section titles (use `.accent` cyan dot only)
- Full-card backgrounds
- Long horizontal strips (>40% of viewport width)
- Multiple elements stacked in the same viewport

**Companion gradient — white→cyan:** `linear-gradient(135deg, #fff, var(--cyan))`. Used for stat numbers. Reserve for hero-stat-style moments.

---

## 4. Typography

Three families, mapped to roles. Never introduce a fourth.

| Family | Token | Role | Where |
|--------|-------|------|-------|
| Space Grotesk | `--font-sans` | Display & section titles | h1–h3, brand name, stat numbers |
| Inter | `--font-body` | Body & paragraphs | `<body>` default |
| JetBrains Mono | `--font-mono` | Technical / labels / numbers | Section numbers, chips, hero tag, stat labels, timeline pills |

### Scale (fluid, clamp-based)

| Role | Value |
|------|-------|
| Hero title | `clamp(40px, 9vw, 96px)` / weight 700 / `line-height 1.02` / `letter-spacing -.035em` |
| Section title | `clamp(28px, 4.4vw, 44px)` / weight 700 / `letter-spacing -.02em` |
| Project title | `clamp(22px, 2.6vw, 30px)` / weight 600 |
| Card title | `19px` / weight 600 |
| Body | `16px` / weight 400 / `line-height 1.6` |
| Hero sub | `clamp(16px, 1.6vw, 19px)` |
| Small label | `13–14.5px` |
| Mono label | `11–14px` with `letter-spacing: .08em–.15em` |

### Rules

- Negative letter-spacing only on display sizes (>= 22px). Body text uses default tracking.
- Mono is always uppercased for pills, otherwise mixed case.
- Numbered nav items (`01 about`) keep the number in mono + cyan.

---

## 5. Spacing, Radius, Layout

| Token / Pattern | Value |
|-----------------|-------|
| `--max` (content width) | `1180px` |
| `--pad` (horizontal padding) | `clamp(20px, 4vw, 56px)` |
| Section top padding | `clamp(80px, 14vw, 160px)` |
| `--radius` (cards, sections) | `18px` |
| `--radius-sm` (small chips, icon tiles) | `12px` |
| Pill radius | `999px` (buttons, chips, hero-tag) |
| Card padding | `28px` (default), `22px` (stat), `26px 28px` (timeline) |
| Grid gap (cards) | `18px` |
| Grid gap (projects) | `clamp(40px, 6vw, 80px)` |

### Breakpoints

| Width | Behavior |
|-------|----------|
| `>= 1180px` | Full layout, max-width capped |
| `< 980px` | `.bg-cols` collapses to 2 columns |
| `< 880px` | Nav burger appears; `.project` and `.about-grid` collapse to 1 col |
| `< 640px` | Mono columns; timeline rail shrinks (`14px → 9px`) |

Stay mobile-first inside any new component. Verify at 375px before shipping.

---

## 6. Motion

### Timing tokens

| Token | Value | When |
|-------|-------|------|
| `--t-fast` | `.25s cubic-bezier(.4,.2,.2,1)` | Hover, color, border, small transforms |
| `--t-mid` | `.55s cubic-bezier(.4,.2,.2,1)` | Card lifts, conic-border fade-in |
| `--t-slow` | `1.1s cubic-bezier(.22,1,.36,1)` | Reveal-on-scroll, large entrances |

### Rules

- Hover transforms: `translateY(-2px)` for buttons, `translateY(-3px)` for stats, `translateY(-2px)` for timeline cards. Don't invent new lift amounts.
- Enter from below + fade — never from sides — for `.reveal` elements. Stagger via inline `--d` (e.g. `style="--d:.15s"`).
- Animate `transform` and `opacity` only. No animating width/height/top/left.
- `prefers-reduced-motion: reduce` is honored globally (see `styles.css:767`). Any new animation must respect this — if you add a keyframe, also disable it under that media query, or use a transition (already covered).

### Custom cursor

- Only active for `(hover: hover) and (pointer: fine)`. Touch / coarse pointer falls back to native cursor — do not break that fallback.
- The cursor uses `mix-blend-mode: difference`. Backgrounds should remain readable when the cursor passes over them.

---

## 7. Background Layers

The site is built in three z-layers under content. Don't add more without removing one.

| Layer | Purpose | Visual |
|-------|---------|--------|
| `body` radial-gradient | Soft ambient glow | Violet top-right + cyan top-left, very low opacity, on `--bg-1` |
| `.bg-glow` (fixed, `z:-1`) | Hero-area atmosphere | Two large blurred radial blobs (violet + cyan), `filter: blur(40px)`, masked to top |
| `.bg-grid` (fixed, `z:-2`) | Technical texture | 56×56px 1px grid lines at `rgba(255,255,255,.025)`, radially masked to fade out |

The hero adds a fourth: `<canvas id="net">` running a particle network (`main.js`). It is the only animated bg layer and is opacity .85 with a radial mask.

---

## 8. Components

### Buttons (pill, 12px·18px / 6px·12px for mini)

| Variant | Use | Background | Border | Text |
|---------|-----|------------|--------|------|
| `.btn-primary` | One per viewport (CTA) | Gradient cyan→violet | none | `#08091a` (dark on bright) |
| `.btn-ghost` | Secondary CTA | `rgba(255,255,255,.03)` + `backdrop-filter: blur(8px)` | `var(--line-2)` → cyan on hover | `var(--text)` |
| `.btn-mini` | Tertiary / chip-actions | `rgba(255,255,255,.02)` | `var(--line-2)` → cyan on hover | `var(--text-2)` mono |

Hover for primary/ghost: `translateY(-2px)`. Primary additionally shifts its dual box-shadow.

### Cards (`.card`)

- Radius `--radius` (18px), padding 28px, border `var(--line)`, faint white top-down gradient bg.
- On hover, a rotating conic-gradient (cyan→violet) appears as a 1px animated border via `::before` mask trick. Don't replicate this with a different gradient — it is the signature.
- `.card-icon` is a 48×48 rounded tile with a cyan/violet-tinted bg and a cyan icon. Use Lucide / Heroicons SVG — never emoji.

### Stats (`.stat`)

- Used in the About grid (2×2).
- Big number uses white→cyan gradient text. Label below in mono muted.

### Timeline (`.tl-*`)

- Single vertical rail with gradient dots; cards reveal a 3px cyan→violet left bar on hover.
- Pills use mint (`#5af0a3`) for current/live, light violet (`#c79bff`) for past.

### Chips (`.chips li`)

- Small mono pills, 4×10 padding, `--line-2` border, near-transparent fill. Used to list technologies under cards and projects.

### Hero tag (`.hero-tag`)

- Pill with pulsing mint dot + mono label. Use this pattern for any "status / now" indicator elsewhere — don't reinvent.

### Section head

- Three-column grid: `[section-num]  [section-title]  [rule]`.
- The "num" is in mono cyan, the title gets a cyan `.accent` dot at the end (e.g. `Experience.`).
- Always include this head; don't skip the number — it anchors the IA.

### Nav

- Fixed, semi-transparent (`rgba(10,14,26,.55)`) with `backdrop-filter: blur(14px)`.
- Adds a border-bottom and stronger bg when `.scrolled` (toggled by JS).
- Burger appears below 880px; opens a full-screen mobile menu.

---

## 9. Accessibility Floor (must-hold)

These are non-negotiable for any new component:

- **Text contrast:** `--text` (#e7ebf3) on `--bg-1` (#0a0e1a) passes AAA. `--text-2` on `--bg-1` passes AA. `--muted` on `--bg-1` passes AA for large text only — never use `--muted` for body copy under 16px.
- **Cyan text on dark:** `--cyan` (#4cc6ff) on `--bg-1` is AA for normal text. Use it for accents and links, not paragraphs.
- **Focus:** Default browser focus ring is currently inherited. If you remove an outline anywhere, you must replace it with a visible alternative (border color shift + box-shadow ring).
- **Reduced motion:** Honored. Don't write a keyframe animation without verifying the reduce-motion override.
- **Touch targets:** All interactive elements >= 44×44px. Current `.btn-mini` at 6×12 padding is borderline — verify hit area with `padding` not `font-size`.
- **No info via color alone:** Status pills carry both a color AND a text label. Keep this pattern.
- **No emoji as icons.** SVG only (Lucide / Heroicons / custom inline).

### Known gaps (move to audit pass, not for here)

- Custom cursor disables native cursor on `pointer:fine` devices, including keyboard users with a mouse. Verify focus rings remain unaffected.
- Dashed underline on `.hero-sub .hl` (cyan dashed) — verify contrast at 1.4:1; may need bolder color.

---

## 10. Effects vocabulary

When you need a visual lift, reach for these — in this order — before inventing something new:

1. Border color shift `--line` → `--line-2` (or `--accent`).
2. `translateY(-2px)` lift.
3. Faint inner gradient on bg `linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,0))`.
4. Backdrop blur (8–14px) for glass surfaces.
5. Outer glow `box-shadow` using cyan/violet at 0.2–0.35 opacity.
6. The rotating conic-border (reserved for primary cards).

**Don't:**
- Add new keyframes for ambient animation. The canvas + glow + reveal pattern is already busy.
- Use `filter: drop-shadow` on text — it pixelates. Use `text-shadow` if needed (rare).
- Use box-shadow for elevation — use border + bg gradient instead. Shadows on dark are weak; we lean on glow + line instead.

---

## 11. Anti-patterns (do not introduce)

| Anti-pattern | Why |
|--------------|-----|
| Light mode toggle | Tokens, gradients, and motion are tuned for dark. Would require a parallel token set. |
| Emoji icons (🚀 ⚡ ✅) | Inconsistent rendering; clashes with the SVG icon style. |
| Hover-only critical info | Touch + accessibility. Always provide a static affordance. |
| Solid bright backgrounds (cyan/violet fill) | Reserved for the brand mark and primary button only. Anywhere else reads as a misuse of the gradient. |
| Rounded-corner inconsistency | Use 12 / 18 / 999 only. No 4, 6, 8, 24, etc. |
| Random shadows | Use the tokens above. Box-shadow values not derived from cyan/violet rgba look foreign. |
| New display fonts | Three fonts is the cap. |
| Skeuomorphic or claymorphic surfaces | Wrong visual register for an AI/security identity. |
| Decorative-only animation | Every motion must convey state, hierarchy, or directional cause-effect. |

---

## 12. Adding new pages

If you add a route (e.g. `/case-study`, `/writing`, `/cv`):

1. Re-use the section-head pattern (num + title + rule).
2. Inherit all tokens from this file — start with no overrides.
3. If the page genuinely needs a deviation (e.g. a long-form reading layout might widen body to 720px and lengthen line-height to 1.75), create `design-system/pages/<page-name>.md` with only the deltas. Do not duplicate this whole file.
4. The hero canvas is hero-only. Don't add it to other pages.
