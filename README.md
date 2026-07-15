# Math for ML

An interactive, browser-based track covering the **linear algebra, calculus, and probability an ML engineer actually uses** — taught concept-first, with draggable diagrams, self-hosted LaTeX (KaTeX), and a NumPy notebook for every idea.

Built for a learner moving from a **Power BI + SQL** background into **ML / GenAI**, so every concept carries a familiar analogy and an ML + interview payoff.

## Highlights

- **18 sessions** across four pillars — Linear Algebra → Calculus → Probability → Information Theory.
- **Interactive figures** — drag vectors, morph L1↔L2 norms, watch space transform under a matrix.
- **Three themes** — Light, Dark, and an iOS-26 **Liquid Glass** theme (frosted panels, refraction, gyroscope specular, gel-press) — with a bubble page transition.
- **Progress tracking**, keyboard shortcuts, print stylesheet, and full `prefers-reduced-motion` support.
- **Companion to *Mathematics for Machine Learning*** (Deisenroth, Faisal & Ong) — every session maps to the book's sections with optional "Going deeper" proofs.

## The curriculum

| Pillar | Sessions |
|---|---|
| Linear Algebra | 01 Vectors · 02 Dot product · 03 Matrices · 04 Matrix mult. · 05 Span/basis/rank · 06 Eigenvalues · 07 SVD & PCA |
| Calculus | 08 Derivatives · 09 Partial derivatives · 10 Chain rule & backprop · 11 Gradient descent |
| Probability | 12 Bayes · 13 Distributions · 14 Covariance · 15 Sampling & CLT · 16 Inference · 17 MLE & cross-entropy |
| Information | 18 Entropy, cross-entropy & KL |

*Currently published: Sessions 01–03.*

## Structure

```
index.html          landing page (progress ring, session cards, MML map)
_build.py           static-site generator (one source of truth for page chrome)
ARCHITECTURE.md     the full spec: curriculum, design system, conventions
assets/
  sessions.js       the session registry
  theory.css        the design system (light + dark + glass)
  common.js         nav, themes, progress, transitions, interactions
  vendor/katex/     self-hosted KaTeX (offline math)
NN_slug/
  _content.html     the lesson body (authored)
  _extra.js         session-specific interactive JS
  theory.html       generated page (do not hand-edit)
  practice.ipynb    NumPy re-derivation
```

## Build

Author `_content.html` (+ optional `_extra.js`) for a session, register it in `_build.py`
and `assets/sessions.js`, then:

```bash
python _build.py        # regenerate every session's theory.html
python _build.py 03     # or just one
```

## Attribution

This is an original work that serves as an interactive companion to
[*Mathematics for Machine Learning*](https://mml-book.com) by Marc Peter Deisenroth,
A. Aldo Faisal, and Cheng Soon Ong (© Cambridge University Press). It references and links
to that text; it does not reproduce its content, and is not affiliated with or endorsed by
the authors or publisher.
