# Math for ML — Architecture & Teaching System

> The canonical reference for **how this track is built and how it functions** — the
> curriculum spine, the lesson template, the design system, the three themes, the
> interactive-figure conventions, and the build pipeline. Read this before authoring or
> editing any session so every page stays consistent.

---

## 1. Purpose & audience

An interactive, browser-based track that teaches the **linear algebra, calculus, and
probability an ML engineer actually uses** — for a learner coming from a **Power BI + SQL
background** moving into ML/GenAI. Two commitments shape everything:

- **Concept first, mechanics second** — build the mental model, then the syntax.
- **Anchored to what the learner knows** — a Power BI / SQL bridge in the theory, and an
  ML + interview payoff on every concept (fraud/churn/OpsRAG projects are the recurring anchors).

Delivery is **HTML** (not notebooks) because math needs LaTeX rendering + interactive,
draggable diagrams. Each session pairs an `theory.html` (delivered lesson) with a
`practice.ipynb` (NumPy re-derivation — mistakes are the point).

---

## 2. The curriculum spine (dependency-ordered, not a topic list)

> **Data becomes vectors → linear algebra moves & compares them → calculus measures how a
> loss changes → gradient descent minimizes it → probability quantifies the uncertainty left over.**

```
Linear Algebra  01 Vectors → 02 Dot product & similarity → 03 Matrices as transformations
                → 04 Matrix multiplication → 05 Span, basis, rank & independence
                → 06 Eigenvalues & eigenvectors → 07 SVD, PCA & low-rank approximation
Calculus        08 Derivatives & gradients → 09 Partial derivatives & the Jacobian
                → 10 Chain rule & backprop → 11 Gradient descent (+ convexity/Lagrange)
Probability     12 Probability & Bayes → 13 Distributions (+ multivariate Gaussian)
                → 14 Expectation, variance & covariance → 15 Sampling & CLT
                → 16 Inference & hypothesis testing → 17 MLE & cross-entropy
Info theory     18 Entropy, cross-entropy, KL divergence
```

**18 sessions.** SVD is first-class (07) for its GenAI relevance (PCA, recommenders, **LoRA**);
span/basis/rank (05) supplies the "shape of a vector space" layer. Lagrange/convexity (11),
the Jacobian (09), and the multivariate Gaussian/covariance matrix (13–14) live as
**"Going deeper"** blocks, not separate pillars. The probability + info-theory tail is kept
richer than MML on purpose — sampling/CLT, A-B testing, and cross-entropy/KL are high job value.

Recurring threads to keep alive across sessions (author new lessons to thread these):
`‖v‖ = √(v·v)` (01→02) · dot product → matmul → attention (02→04) · new axes/basis →
PCA (01→05→07) · difference vector → gradient (01→11) · L1/L2 norm → Lasso/Ridge · cross-entropy
loss ← MLE ← probability (12→17→18).

---

## 3. The lesson template — the 9-beat arc (every session, in order)

1. **Theory** — concept first; the mental model; Power BI/SQL anchor in a `.callout.c-anchor`.
2. **Worked example** — by hand *and* verified NumPy (`pre.code` + `.out`).
3. **Edge cases & gotchas** — the sharp corners.
4. **Golden rules** — `ol.rules` (one per line, numbered badges).
5. **Common traps** — `.callout.c-trap`, named failure modes.
6. **Exercises** — hints only, each with an expandable `<details class="sol">` worked solution.
7. **ML real-world connection** — where the idea lives (features, embeddings, attention, loss…).
8. **Interview questions** — `.qa` blocks with real answers.
9. **Summary table** — `table.sum`: concept | why it matters in ML | interview frequency.

Plus per page: a **learning-objectives** box, a **section-nav** grid, a **notation
reference** `<details>`, at least one **interactive figure**, and a **next-session** card.

Depth bar: match Session 1 (Vectors). Develop each idea from multiple angles, show the
*why*, thread forward to later sessions. Not a card deck — a real explainer.

---

## 4. Repository layout & the build pipeline

```
Math for ML/
├── index.html                 landing page (hero, progress ring, 16 session cards)
├── _build.py                  generator: chrome templated once, per-session content injected
├── ARCHITECTURE.md            this file
├── assets/
│   ├── sessions.js            THE registry (nav bar + index read this) — mark ready:true on publish
│   ├── theory.css             the entire design system (light + dark + glass, nav, print, motion)
│   ├── common.js              nav bar, themes, progress, prev/next, TOC spy, copy, quiz,
│   │                          keyboard, scroll-reveal, iOS-26 flourishes, bubble transition
│   └── vendor/katex/          self-hosted KaTeX (offline math)
└── NN_slug/
    ├── _content.html          the article inner HTML (what you author per session)
    ├── _extra.js              session-specific JS (interactive canvas, sliders)
    ├── theory.html            GENERATED — do not hand-edit
    └── practice.ipynb         NumPy re-derivation
```

**Authoring a new session:**
1. Write `NN_slug/_content.html` (article inner, 9-beat arc + objectives/secnav/notation/next).
2. Write `NN_slug/_extra.js` for any interactive figure.
3. Add a config entry to `SESSIONS` in `_build.py` (num, slug, title, lede, meta, toc).
4. Flip `ready:true` for that slug in `assets/sessions.js`.
5. Run `python _build.py` (or `python _build.py NN`) → writes `theory.html`.
6. Write `practice.ipynb`.

Edit `assets/theory.css` once → all 16 pages restyle. Edit `assets/common.js` once → all
behaviors update everywhere. **Never hand-edit a generated `theory.html`.**

---

## 5. The design system

**Typography.** Display: **Fraunces** (serif). Body: **Inter**. Code/labels: **JetBrains
Mono**. Reading measure ~720px, body 19px / line-height 1.72. Editorial/Distill-style with
right-margin **sidenotes** (`aside.side`) for definitions and anchors.

**Palette (CSS variables, semantic).** `--accent` indigo `#5A4FCF`, `--teal`, `--amber`,
`--rose`; ink/paper/rule/muted/faint. Callout colors carry meaning: `c-anchor` (PBI/SQL
bridge, indigo) · `c-why` (why it matters) · `c-good` (verified) · `c-warn` (caution) ·
`c-trap` (danger). Section headers use `.num` eyebrow labels.

**Component classes** (defined in `theory.css`): `.mathband` (display equation card),
`.callout` variants, `pre.code` + `.out`, `figure.fig` (interactive) / `figure.diagram`
(static SVG), `.objectives`, `.secnav`, `details.notation`, `ol.rules`, `.ex` +
`details.sol`, `.qa`, `table.sum`, `.quiz`, `.next`, `.xref` (cross-session link).

---

## 6. Three themes (toggle cycles Light → Dark → Glass)

- **Light** (default) — warm paper editorial.
- **Dark** — deep ink; diagram/figure frames stay light so hand-drawn SVG palettes read.
- **Glass** — iOS-26 **Liquid Glass**: animated aurora background, frosted translucent
  panels with specular top-edge gloss, **SVG `feDisplacementMap` refraction** on the
  backdrop (Chromium, gated by `CSS.supports` → `.can-refract`), a **moving specular
  highlight** driven by pointer (desktop) / gyroscope (mobile), and **gel-press** squish.
  Body text and code stay solid for legibility (the deliberate design rule).

Theme is persisted (`localStorage['mfml-theme']`) and applied pre-paint by an inline head
script (no flash). All motion respects `prefers-reduced-motion`.

---

## 7. Interactions & niceties (all in common.js, inherited by every page)

- **Site nav bar** — brand + "Sessions ▾" dropdown (all 16, grouped, current highlighted) + theme toggle.
- **Bubble page transition** — click expands a circle from the click point; the destination
  reveals by the bubble contracting from the same spot (coords via `sessionStorage`).
- **Progress tracking** — "Mark complete" per lesson; ring + Done badges on the index.
- **Prev/Next footer**, **reading progress bar**, **sticky TOC scrollspy**, **scroll ↑/↓**,
  **copy buttons**, **self-check quizzes**, **scroll-reveal** entrances.
- **Keyboard**: `t` theme · `j`/`k` section · `←`/`→` session · `g`/`G` top/bottom · `?` help.

---

## 8. Interactive-figure conventions (`_extra.js`)

- Vanilla `<canvas>` (no libraries), light drawing surface, palette colors (indigo/teal/amber).
- Draggable handles (mouse **and** touch), 0.5-unit snapping, live readouts.
- A `base()` helper draws grid/axes; `draw()` redraws; expose animations on `window.__*`
  for buttons. Guard heavy animation with `window.MFML_REDUCED`.
- Prefer one interactive figure that *is* the lesson's core idea (drag → the concept moves),
  plus static SVG `figure.diagram` for fixed illustrations.

---

## 9. Teaching rules (locked in)

- All 9 beats, in order, every session. Concept before mechanics.
- Verify every NumPy output by running it; label verified.
- Power BI/SQL anchor in Theory; ML + interview payoff on every concept.
- Exercises are hints-only; worked solutions live in the `<details>` and the practice notebook.
- Never spoil an exercise with a verbatim theory example — make it a variation.
- No project branding beyond the learner's own (fraud/churn/OpsRAG) as anchors.
- Direct tone. Thread forward to later sessions with `.xref` links.

---

## 10. Rigorous backbone — the MML companion

The track is the **intuition-first front end** to *Mathematics for Machine Learning*
(Deisenroth, Faisal & Ong, Cambridge University Press, 2020) — the free standard reference
covering exactly our Part-I scope. Path: **intuition (us) → rigour (MML)**.

**Chapter mapping** (also shown on `index.html`):

| Our sessions | MML |
|---|---|
| 01 Vectors, 02 Dot product | Ch 2 Linear Algebra · Ch 3 Analytic Geometry (§3.1–3.4, 3.8) |
| 03 Matrices, 04 Matmul, 05 Span/basis/rank | Ch 2 (§2.2–2.7: mappings, independence, basis, rank) |
| 06 Eigenvalues, 07 SVD/PCA | Ch 4 Matrix Decompositions · Ch 10 PCA |
| 08–11 Calculus → Gradient descent | Ch 5 Vector Calculus · Ch 7 Continuous Optimization |
| 12–17 Probability → MLE | Ch 6 Probability & Distributions · Ch 9 Linear Regression |
| 18 Information theory | Beyond core (KL in Ch 6 & 8) |

**Conventions (apply to every session):**
- **`.mmlbar`** — reference bar after the objectives, naming the exact MML sections the session mirrors.
- **`a.mmlref`** — inline "📖 MML §X.Y" chip on section headings / asides mapping to a specific section.
- **`details.deeper`** ("⨏ Going deeper") — optional, collapsed proof/rigour block for the formal
  derivation (norm axioms §3.1, law of cosines §3.4, Cauchy–Schwarz §3.3, …), citing the MML section.
- Notation calibrated to MML (dot product named as the **standard inner product**; norms axiomatic).

**Copyright rule (non-negotiable).** The MML PDF is free for personal use but **© Cambridge University
Press — not an open license.** So: **no copying its text, figures, equations-as-images, or exercises
verbatim**, and never host/redistribute the PDF. We cite and *link* to it, map our curriculum to its
chapters, write **original** explanations informed by it, and create **original** MML-*inspired*
exercises. A footer disclaimer states we're original and unaffiliated.

---

## 11. Status

- ✅ **Session 01 — Vectors** (full 9-beat, interactive playground, MML §2.4/3.1/3.3 + norm-axioms deep-dive).
- ✅ **Session 02 — Dot product & similarity** (projection playground + 360° sweep, MML §3.2–3.4/3.8 + law-of-cosines & Cauchy–Schwarz deep-dives).
- ✅ **Session 03 — Matrices as transformations** (drag-the-basis transformation visualizer, MML §2.2/2.7/4.1 + linearity & det=0 deep-dives).
- ✅ **Session 04 — Matrix multiplication** (compose-two-transformations visualizer with order swap + play, MML §2.2/2.7 + row×col-is-composition & associativity deep-dives).
- ✅ **Session 05 — Span, basis, rank & independence** (drag-two-vectors span/rank visualizer with lattice collapse, MML §2.4/2.5/2.6 + independence-def & row=col-rank deep-dives).
- ✅ **Session 06 — Eigenvalues & eigenvectors** (drag-v-watch-Av eigenline finder with matrix presets incl. rotation, MML §4.2/4.4 + char-poly & diagonalization deep-dives).
- ✅ **Session 07 — SVD, PCA & low-rank** (drag-the-columns circle→ellipse SVD visualizer with singular axes, MML §4.5 + Ch 10 + PCA-via-SVD deep-dive). **Linear Algebra pillar complete (01–07).**
- ✅ **Session 08 — Derivatives & gradients** (drag-along-curve tangent-slope scrubber with function presets, MML §5.1 + differentiability deep-dive). **Calculus pillar begins.**
- ✅ **Session 09 — Partial derivatives & the Jacobian** (drag-a-point-on-a-landscape gradient heat-map, MML §5.2/5.3 + steepest-ascent & Jacobian-chain-rule deep-dives).
- ✅ **Session 10 — Chain rule & backprop** (single-neuron forward-pass + animated backprop sweep with weight slider, MML §5.2.2/5.6 + reverse-mode & vanishing-gradient deep-dive).
- ✅ **Session 11 — Gradient descent** (loss-landscape descent-trajectory animator with learning-rate slider + surface presets, MML §7.1/7.2/7.3 + Lagrange-multiplier deep-dive). **Calculus pillar complete (08–11).**
- ✅ **Session 12 — Probability & Bayes** (1,000-person base-rate icon-array with prevalence/sensitivity/specificity sliders, MML §6.1–6.4 + Bayes-derivation deep-dive). **Probability pillar begins.**
- ✅ **Session 13 — Distributions** (Gaussian PDF explorer with μ/σ sliders + 68-95-99.7 shaded bands, MML §6.2/6.5 + covariance-ellipse-is-PCA deep-dive).
- ✅ **Session 14 — Expectation, variance & covariance** (correlation scatter with live covariance ellipse, MML §6.4/6.5 + variance-of-a-sum & variances-add deep-dive).
- ✅ **Session 15 — Sampling & the CLT** (CLT demonstrator: non-Gaussian source + sample-size slider → bell emerges, extends MML §6.4 + exact-CLT-statement deep-dive).
- ✅ Design system, 3 themes, generator, landing page, all interactions — complete.
- ✅ MML companion layer — reference bars/chips, "Going deeper" proofs, index mapping table, attribution.
- ◻ Sessions 03–16 — authored one at a time against this spec (each with its MML mapping).
