# DESIGN.md

> A control-room portfolio: deep black space where projects glow, scroll drives the story, and everything stays at 60fps.

## 1. Visual Theme & Atmosphere

**Style**: Dark Tech (Immersive)
**Keywords**: deep, luminous, precise, kinetic, cinematic, engineered, confident
**Tone**: Confident builder with a cinematic edge. NOT corporate, NOT playful, NOT cluttered neon.
**Feel**: A mission-control console at night: information glows out of the dark and responds to your hand.

**Interaction Tier**: L3 Immersive
**Dependencies**: GSAP + ScrollTrigger (cdnjs), Three.js (jsdelivr, one WebGL scene only). No Lenis (native scroll for reliability).

**Page narrative (one signature moment every 1-2 screens):**

| # | Section | Signature moment |
|---|---------|------------------|
| 1 | Hero | Card constellation floating in 3D depth + mouse parallax + clip-path mask-reveal H1 + aurora background (Burst 1) |
| 2 | Hero to About | Cards collapse into the About panel on scroll (converge transition) |
| 3 | Manifesto band | Giant marquee strip with outline/filled words (Burst 2) |
| 4 | About | Scroll-float H2, scramble labels, animated counters |
| 5 | WebGL scene | One glass torus-knot, rotates with scroll, particle dust (the only WebGL scene) |
| 6 | What I build | Pin-scrub, left title stays, right scene swaps across 4 areas |
| 7 | Projects | Unequal bento grid with spotlight-follow cards (Burst 3) |
| 8 | Contact | Magnetic CTA, click-to-copy email with spark burst, bottom-of-page surprise (the ingenious detail) |

## 2. Color Palette & Roles

```css
:root {
  /* Backgrounds */
  --bg: #0B0B0F;
  --surface: rgba(255, 255, 255, 0.03);
  --surface-alt: #111118;
  --surface-hover: rgba(255, 255, 255, 0.06);

  /* Borders */
  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(0, 212, 255, 0.45);

  /* Text */
  --text: #F0F0F0;
  --text-secondary: #8B8B8B;
  --text-tertiary: #747484;

  /* Accent */
  --accent: #00D4FF;
  --accent-hover: #5CE4FF;
  --accent-2: #8B5CF6;

  /* RGB helpers for rgba() */
  --bg-rgb: 11, 11, 15;
  --text-rgb: 240, 240, 240;
  --accent-rgb: 0, 212, 255;
  --accent-2-rgb: 139, 92, 246;

  /* Semantic */
  --success: #34D399;
  --error: #F87171;
  --warning: #FBBF24;

  /* Motion */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-cinema: cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Color Rules:**
- Every color is referenced through a CSS variable. No hard-coded hex in components.
- Cyan (`--accent`) is for actions, links and active states. Violet (`--accent-2`) only appears in gradients, glows and background art.
- Body copy uses `--text-secondary`; `--text-tertiary` is for non-essential labels only.
- Glow is created with `rgba(var(--accent-rgb), a)`, never a solid neon fill.

## 3. Typography Rules

**Font Stack:**
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600&family=Fira+Code:wght@400;500&display=swap');

:root {
  --font-heading: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'Fira Code', ui-monospace, 'SFMono-Regular', Menlo, monospace;
}
```

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | Space Grotesk | clamp(3rem, 9vw, 7.5rem) | 700 | 1.02 | -0.03em |
| Section H2 | Space Grotesk | clamp(2.2rem, 5vw, 4rem) | 700 | 1.1 | -0.02em |
| H3 | Space Grotesk | 1.25rem | 600 | 1.3 | -0.01em |
| Body | Inter | 1.0625rem | 400 | 1.7 | 0 |
| Label / eyebrow | Fira Code | 0.75rem | 500 | 1.4 | 0.14em (uppercase) |
| Mono / code | Fira Code | 0.875rem | 400 | 1.6 | 0 |

**Typography Rules:**
- Headings weight >= 600. Body never below 1rem on mobile.
- Max line length for body: 62ch.
- **NEVER use**: Arial, Times New Roman, Comic Sans, Roboto as display, any decorative script font.

**Text Decoration (per text-decoration-rules, Dark Tech):**
- Hero H1: gradient text (`--accent` to `--accent-2`) on the emphasized word only, plus subtle glow `text-shadow: 0 0 40px rgba(var(--accent-rgb), 0.4)`. Not both on the same glyphs: the gradient word has no shadow; the rest of the H1 is solid `--text`.
- Section H2: solid `--text`, no shadow. One highlighted keyword may use the gradient.
- Body paragraphs: no decoration, ever.

## 4. Component Stylings

### Buttons
```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  min-height: 48px; padding: 0 28px;
  font: 500 0.95rem var(--font-body);
  color: var(--text); background: var(--surface);
  border: 1px solid var(--border); border-radius: 999px;
  cursor: pointer;
  transition: transform 0.25s var(--ease-out), border-color 0.25s, background 0.25s, box-shadow 0.25s;
}
.btn:hover { border-color: var(--border-hover); background: var(--surface-hover); box-shadow: 0 0 28px rgba(var(--accent-rgb), 0.18); }
.btn:active { transform: scale(0.97); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.btn:disabled, .btn[aria-disabled="true"] { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

.btn-primary { color: var(--bg); background: var(--accent); border-color: var(--accent); font-weight: 600; }
.btn-primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); box-shadow: 0 0 36px rgba(var(--accent-rgb), 0.45); }
```

### Cards (spotlight)
```css
.card {
  position: relative; overflow: hidden;
  background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
  padding: 28px;
  transition: border-color 0.3s, background 0.3s, transform 0.3s var(--ease-out);
}
.card::before {
  content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0;
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(var(--accent-rgb), 0.14), transparent 60%);
  transition: opacity 0.3s;
}
.card:hover { border-color: var(--border-hover); background: var(--surface-hover); transform: translateY(-4px); }
.card:hover::before { opacity: 1; }
.card:focus-visible, .card:focus-within { outline: 2px solid var(--accent); outline-offset: 3px; }
```

### Navigation
```css
.nav {
  position: fixed; top: 0; inset-inline: 0; z-index: 50;
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px clamp(20px, 4vw, 48px);
  transition: background 0.3s, border-color 0.3s, padding 0.3s;
  border-bottom: 1px solid transparent;
}
.nav.scrolled {
  background: rgba(var(--bg-rgb), 0.72);
  backdrop-filter: blur(12px);
  border-bottom-color: var(--border);
  padding-block: 12px;
}
.nav a { color: var(--text-secondary); transition: color 0.2s; }
.nav a:hover, .nav a.active { color: var(--text); }
.nav a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; border-radius: 4px; }
```

### Links
```css
.link { color: var(--accent); background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat; transition: background-size 0.3s var(--ease-out), color 0.2s; }
.link:hover { background-size: 100% 1px; color: var(--accent-hover); }
.link:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
```

### Tags / Badges
```css
.tag {
  display: inline-block; padding: 4px 12px; border-radius: 999px;
  font: 500 0.72rem var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-secondary); border: 1px solid var(--border); background: var(--surface);
  transition: color 0.2s, border-color 0.2s;
}
.tag:hover { color: var(--accent); border-color: var(--border-hover); }
```

### Marquee band
```css
.marquee { overflow: hidden; border-block: 1px solid var(--border); padding-block: 28px; }
.marquee-track { display: flex; gap: 48px; width: max-content; animation: marquee 32s linear infinite; }
.marquee-track span { font: 700 clamp(2.5rem, 7vw, 5.5rem) var(--font-heading); white-space: nowrap; }
.marquee-track .outline { color: transparent; -webkit-text-stroke: 1px rgba(var(--text-rgb), 0.35); }
@keyframes marquee { to { transform: translateX(-50%); } }
```

## 5. Layout Principles

**Container:**
- Max width: 1200px (hero and WebGL stage run full-bleed)
- Padding: clamp(20px, 4vw, 48px)
- Narrow variant (About copy): 680px

**Spacing Scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
- Section padding: clamp(80px, 12vw, 160px) vertical
- Component gap: 20px
- Card internal padding: 28px

**Grid (bento, unequal):**
```css
.bento { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; }
.bento .span-lg { grid-column: span 4; }
.bento .span-md { grid-column: span 3; }
.bento .span-sm { grid-column: span 2; }
```

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | border only | Default cards, tags |
| Subtle | `0 8px 24px rgba(0,0,0,0.35)` | Constellation cards |
| Elevated | `0 20px 50px rgba(0,0,0,0.5)` | Hovered cards, pinned scenes |
| Glow | `0 0 36px rgba(var(--accent-rgb), 0.3)` | Primary CTA, focus moments |

Depth in the hero comes from scale + opacity per Z layer, never from blur on moving elements.

## 7. Animation & Interaction

**Motion Philosophy**: Cinematic but light: transform and opacity only, one WebGL scene, everything paused off-screen.
**Tier**: L3

### Dependencies
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script type="module"> /* import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'; */ </script>
```

### Base Setup
```js
gsap.registerPlugin(ScrollTrigger);
const perf = {
  isMobile: matchMedia('(max-width: 640px)').matches,
  lowCore: (navigator.hardwareConcurrency || 8) < 4,
  reduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
  canHover: matchMedia('(hover: hover)').matches,
};
const rich = !perf.reduce && !perf.lowCore;
```

### Entrance Animation
- Hero H1: line-by-line clip-path mask reveal (`clip-path: inset(0 0 100% 0)` to `inset(0)`), stagger 0.12s, 1s, `--ease-cinema`.
- Hero constellation cards: one-time GSAP timeline burst from center to positions (stagger 1.2s total), then released.
- Nav and CTAs fade up (y 16 to 0, 0.8s).

### Scroll Behavior (6 required signature classes, all present)
1. **Text, Hero H1**: mask reveal with gradient keyword.
2. **Text, Section H2**: ScrollFloat (chars rise from y:60 with stagger, scrub-free, once).
3. **Text, Label / body**: ScrambleText on mono eyebrow labels when entering viewport.
4. **Element**: Magnet on CTAs (pointer pulls button up to 12px, rAF-throttled, hover devices only) + ClickSpark on email copy.
5. **Component**: SpotlightCard (`--mx/--my` via rAF) on every bento card.
6. **Background**: CSS aurora (two slow-drifting radial gradients, transform-only) in the hero.

**L3 scroll-story patterns (4 of 4):**
- **Pin-scrub**: "What I build" section pinned for 400vh.
- **Left pin / right swap**: left title+body swap text, right side crossfades 4 scenes.
- **Converge transition**: hero cards fly to the About panel (`scrub: 1`, `from: 'random'` stagger).
- **WebGL signature**: one glass torus-knot (`MeshPhysicalMaterial`, transmission + iridescence), scroll-driven rotation, 120-particle dust. Rendering pauses when off-screen (IntersectionObserver).

### Hover & Focus States
```css
a, button, .card, .tag { -webkit-tap-highlight-color: transparent; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
```

### Special Effects
- **Ingenious detail**: clicking the email copies it with a spark burst and the label changes to "Copied"; reaching the very bottom of the page shows a small toast "You made it to the end. Thanks for scrolling."
- **No custom cursor** (this is a portfolio with content focus; native cursor keeps it fast and accessible).
- All pointer-move handlers run through `requestAnimationFrame`.

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
  .marquee-track { animation: none; }
}
```
JS: with `reduce`, skip pin-scrub (stack scenes vertically), skip WebGL (show static gradient orb), skip constellation timeline (cards shown in place).

## 8. Do's and Don'ts

### Do
- Keep every moving thing on `transform` and `opacity`.
- Pause the WebGL render loop and any infinite animation when off-screen.
- Use spacing from the scale and keep generous negative space between signature moments.
- Give every interactive element visible hover and focus-visible states.
- Keep copy short, concrete and in first person.
- Provide mobile fallbacks: constellation drops to 4 static cards, pin-swap becomes stacked scenes, WebGL becomes a static orb.

### Don't
- ❌ Don't put `filter: blur()` on moving elements (use opacity + scale for depth).
- ❌ Don't use more than one WebGL scene or more than 2 pinned sections.
- ❌ Don't hard-code hex colors in components; use variables.
- ❌ Don't apply gradient and glow to the same text.
- ❌ Don't use `backdrop-filter` blur above 14px or over large scrolling areas.
- ❌ Don't use Lenis or scroll-jacking; native scroll only.
- ❌ Don't use emoji as icons; use inline SVG.
- ❌ Don't use solid-color placeholder blocks for images.
- ❌ Don't leave three or more consecutive screens with only a fade-in.
- ❌ Don't run pointermove logic without rAF throttling.

## 9. Responsive Behavior

**Breakpoints:**
| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | > 1024px | Full constellation, 6-col bento, side-by-side pin-swap |
| Tablet | 641-1024px | 3-col bento, constellation reduced to 8 cards, pin-swap kept |
| Mobile | <= 640px | Single column, 4 static hero cards, scenes stacked, WebGL replaced by static orb |

**Touch Targets:** minimum 44x44px
**Collapsing Strategy:** nav links collapse into a toggle menu under 640px; bento spans reset to full width; marquee font scales with clamp.

```css
@media (max-width: 1024px) {
  .bento .span-lg { grid-column: span 6; }
  .bento .span-md, .bento .span-sm { grid-column: span 3; }
}
@media (max-width: 640px) {
  .bento .span-lg, .bento .span-md, .bento .span-sm { grid-column: span 6; }
  .pin-swap { height: auto; }
  .pin-swap-inner { position: static; height: auto; grid-template-columns: 1fr; }
  .scene { position: static; opacity: 1; margin-bottom: 24px; }
}
```
