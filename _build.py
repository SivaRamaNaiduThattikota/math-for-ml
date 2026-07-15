#!/usr/bin/env python3
"""
Math for ML — static site generator.

Single source of truth for the shared "chrome" (head, fonts, KaTeX, fixed UI,
hero, scripts) so every one of the 16 sessions is visually identical.

Per session you provide:
  - a config entry in SESSIONS below (number, slug, title, lede, meta, TOC links)
  - <slug>/_content.html   the article inner HTML (sections, figures, exercises...)
  - <slug>/_extra.js        (optional) session-specific JS (canvas, sliders, ...)

Shared, edited once, applied everywhere:
  - assets/theory.css       the full design system (light + dark)
  - assets/common.js        progress bar, dark-mode toggle, TOC scrollspy,
                            scroll buttons, copy buttons, self-check quizzes

Run:  python _build.py         # builds every session that has a _content.html
      python _build.py 01      # build only sessions whose slug starts with "01"
"""
import os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))

# ── curriculum: the 16 sessions (slug order defines the site) ──────────────
SESSIONS = [
    dict(num="01", slug="01_vectors", title="Vectors",
         lede="A row in your table is a point in space. Once you truly believe that "
              "sentence, the rest of machine learning is geometry.",
         meta=["~18 min read", "NumPy paired notebook", "Prereq: none"],
         toc=[("s1","1 · Three views"),("s2","2 · Components"),("s3","3 · Operations"),
              ("s4","4 · Norms"),("s5","5 · Distance"),("s6","6 · NumPy"),
              ("s7","7 · Feature scaling"),("s8","8 · Dimensions"),
              ("ref","Rules & traps"),("exercises","Exercises"),
              ("interview","Interview"),("summary","Summary")]),
    dict(num="02", slug="02_dot_product", title="Dot product & similarity",
         lede="One number that measures how much two vectors agree — the operation behind "
              "cosine similarity, embedding search, and transformer attention.",
         meta=["~20 min read", "NumPy paired notebook", "Prereq: Vectors"],
         toc=[("s1","1 · One number"),("s2","2 · Geometric meaning"),("s3","3 · Projection"),
              ("s4","4 · Cosine similarity"),("s5","5 · Length = a·a"),("s6","6 · NumPy"),
              ("s7","7 · Inside ML"),("ref","Rules & traps"),("exercises","Exercises"),
              ("interview","Interview"),("summary","Summary")]),
    dict(num="03", slug="03_matrices", title="Matrices as transformations",
         lede="A matrix isn't a spreadsheet — it's a machine that moves space. Rotations, "
              "stretches, and projections are all one grid of numbers doing its job.",
         meta=["~20 min read", "NumPy paired notebook", "Prereq: Vectors, Dot product"],
         toc=[("s1","1 · Machine that moves space"),("s2","2 · Columns = basis images"),
              ("s3","3 · Matrix × vector"),("s4","4 · Transformation zoo"),
              ("s5","5 · What makes it linear"),("s6","6 · Determinant"),
              ("s7","7 · NumPy & ML"),("ref","Rules & traps"),("exercises","Exercises"),
              ("interview","Interview"),("summary","Summary")]),
    dict(num="04", slug="04_matrix_multiplication", title="Matrix multiplication",
         lede="Multiplying two matrices means doing one transformation after another. The "
              "row-times-column rule is just the bookkeeping of composition.",
         meta=["~20 min read", "NumPy paired notebook", "Prereq: Matrices, Dot product"],
         toc=[("s1","1 · Multiplication = composition"),("s2","2 · The row·column rule"),
              ("s3","3 · Order matters"),("s4","4 · Shapes & associativity"),
              ("s5","5 · NumPy"),("s6","6 · Inside ML"),("ref","Rules & traps"),
              ("exercises","Exercises"),("interview","Interview"),("summary","Summary")]),
    dict(num="05", slug="05_span_basis_rank", title="Span, basis, rank & independence",
         lede="How much space can a set of vectors reach — and is any of them redundant? "
              "The ideas behind collinear features, dimensionality, and invertibility.",
         meta=["~20 min read", "NumPy paired notebook", "Prereq: Matrices"],
         toc=[("s1","1 · Combinations & span"),("s2","2 · Linear independence"),
              ("s3","3 · Basis & dimension"),("s4","4 · Rank"),("s5","5 · NumPy"),
              ("s6","6 · Inside ML"),("ref","Rules & traps"),("exercises","Exercises"),
              ("interview","Interview"),("summary","Summary")]),
    dict(num="06", slug="06_eigenvalues", title="Eigenvalues & eigenvectors",
         lede="Some directions a matrix only stretches, never turns — its eigenvectors. "
              "Find them and you find what the transformation really does.",
         meta=["~20 min read", "NumPy paired notebook", "Prereq: Matrices, Rank"],
         toc=[("s1","1 · The eigen equation"),("s2","2 · Eigenvalue = stretch"),
              ("s3","3 · Finding them"),("s4","4 · Special cases"),("s5","5 · NumPy"),
              ("s6","6 · Inside ML"),("ref","Rules & traps"),("exercises","Exercises"),
              ("interview","Interview"),("summary","Summary")]),
    dict(num="07", slug="07_svd_pca", title="SVD, PCA & low-rank",
         lede="Every matrix is a rotation, a stretch, and a rotation. That one fact powers "
              "PCA, compression, recommenders, and LoRA.",
         meta=["~22 min read", "NumPy paired notebook", "Prereq: Eigenvalues, Rank"],
         toc=[("s1","1 · Rotate–stretch–rotate"),("s2","2 · Singular values"),
              ("s3","3 · Low-rank approximation"),("s4","4 · PCA"),("s5","5 · NumPy"),
              ("s6","6 · Inside ML"),("ref","Rules & traps"),("exercises","Exercises"),
              ("interview","Interview"),("summary","Summary")]),
    dict(num="08", slug="08_derivatives", title="Derivatives & gradients",
         lede="The slope tells you which way is downhill. The derivative is how a function "
              "changes when you nudge its input — the engine of every training loop.",
         meta=["~18 min read", "NumPy paired notebook", "Prereq: none (calculus start)"],
         toc=[("s1","1 · Derivative = slope"),("s2","2 · Reading it"),
              ("s3","3 · The rules"),("s4","4 · Derivative → gradient"),("s5","5 · NumPy"),
              ("s6","6 · Inside ML"),("ref","Rules & traps"),("exercises","Exercises"),
              ("interview","Interview"),("summary","Summary")]),
    dict(num="09", slug="09_partial_derivatives", title="Partial derivatives & the Jacobian",
         lede="A loss has many inputs. Vary one and freeze the rest — that's a partial. "
              "Stack them into the gradient, and into the Jacobian for vector outputs.",
         meta=["~20 min read", "NumPy paired notebook", "Prereq: Derivatives, Dot product"],
         toc=[("s1","1 · Partial derivatives"),("s2","2 · The gradient"),
              ("s3","3 · Directional derivative"),("s4","4 · The Jacobian"),("s5","5 · NumPy"),
              ("s6","6 · Inside ML"),("ref","Rules & traps"),("exercises","Exercises"),
              ("interview","Interview"),("summary","Summary")]),
    dict(num="10", slug="10_chain_rule_backprop", title="Chain rule & backprop",
         lede="Networks are functions inside functions. The chain rule differentiates them; "
              "run it backward through the layers and you get backpropagation.",
         meta=["~22 min read", "NumPy paired notebook", "Prereq: Derivatives, Jacobian"],
         toc=[("s1","1 · The chain rule"),("s2","2 · Computational graph"),
              ("s3","3 · Backprop"),("s4","4 · Why reverse mode"),("s5","5 · NumPy"),
              ("s6","6 · Inside ML"),("ref","Rules & traps"),("exercises","Exercises"),
              ("interview","Interview"),("summary","Summary")]),
    dict(num="11", slug="11_gradient_descent", title="Gradient descent",
         lede="Step opposite the gradient, repeat. The learning rate sets the step, momentum "
              "smooths the path — the optimization loop that turns gradients into a model.",
         meta=["~22 min read", "NumPy paired notebook", "Prereq: Derivatives, Backprop"],
         toc=[("s1","1 · The update rule"),("s2","2 · The learning rate"),
              ("s3","3 · Batch / SGD / mini-batch"),("s4","4 · Momentum & Adam"),
              ("s5","5 · Convexity & Lagrange"),("s6","6 · NumPy & ML"),("ref","Rules & traps"),
              ("exercises","Exercises"),("interview","Interview"),("summary","Summary")]),
    dict(num="12", slug="12_probability_bayes", title="Probability & Bayes",
         lede="Reasoning under uncertainty. The sum and product rules, and Bayes' theorem — "
              "posterior ∝ likelihood × prior — the engine of updating beliefs.",
         meta=["~20 min read", "NumPy paired notebook", "Prereq: none (probability start)"],
         toc=[("s1","1 · Probability basics"),("s2","2 · Joint/marginal/conditional"),
              ("s3","3 · Independence"),("s4","4 · Bayes' theorem"),("s5","5 · The base rate"),
              ("s6","6 · NumPy & ML"),("ref","Rules & traps"),("exercises","Exercises"),
              ("interview","Interview"),("summary","Summary")]),
    dict(num="13", slug="13_distributions", title="Distributions",
         lede="How probability spreads over values. Bernoulli, binomial, and the Gaussian — "
              "plus the multivariate Gaussian that powers so much of ML.",
         meta=["~20 min read", "NumPy paired notebook", "Prereq: Probability & Bayes"],
         toc=[("s1","1 · Random variables"),("s2","2 · Bernoulli & binomial"),
              ("s3","3 · The Gaussian"),("s4","4 · Multivariate Gaussian"),("s5","5 · NumPy"),
              ("s6","6 · Inside ML"),("ref","Rules & traps"),("exercises","Exercises"),
              ("interview","Interview"),("summary","Summary")]),
    # Sessions 14–18 get appended here as each _content.html is authored.
]

GROUP = {  # eyebrow label per session range
    **{f"{i:02d}": "Linear Algebra" for i in range(1, 8)},
    **{f"{i:02d}": "Calculus" for i in range(8, 12)},
    **{f"{i:02d}": "Probability & Statistics" for i in range(12, 18)},
    "18": "Information Theory",
}

PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>try{{var _t=localStorage.getItem('mfml-theme')||'glass';if(_t!=='light')document.documentElement.setAttribute('data-theme',_t);}}catch(e){{}}</script>
<title>{title} · Math for ML</title>
<meta name="description" content="{lede}">
<meta property="og:type" content="article">
<meta property="og:title" content="{title} · Math for ML">
<meta property="og:description" content="{lede}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%235A4FCF'/%3E%3Cpath d='M9 22 L20 10' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Ccircle cx='20' cy='10' r='2.6' fill='white'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/vendor/katex/katex.min.css">
<script defer src="../assets/vendor/katex/katex.min.js"></script>
<script defer src="../assets/vendor/katex/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body,{{delimiters:[{{left:'$$',right:'$$',display:true}},{{left:'$',right:'$',display:false}}]}});"></script>
<link rel="stylesheet" href="../assets/theory.css">
</head>
<body data-slug="{slug}">
<div id="progress"></div>

<nav id="toc" aria-label="Table of contents">
  <div class="cap">On this page</div>
{toc_links}
</nav>

<div class="scrollbtns">
  <button id="goTop" aria-label="Scroll to top">↑</button>
  <button id="goBottom" aria-label="Scroll to bottom">↓</button>
</div>

<header class="hero">
  <div class="page"><div class="hero-inner">
    <div class="eyebrow">Math for ML · {group} · {num}</div>
    <h1>{title}</h1>
    <p class="lede">{lede}</p>
    <div class="meta">{meta}</div>
  </div></div>
</header>

<div class="page">
<article>
{content}
</article>
</div>

<script src="../assets/sessions.js"></script>
<script src="../assets/common.js"></script>
<script>
{extra}
</script>
</body>
</html>
"""

def build(session):
    slug = session["slug"]
    d = os.path.join(ROOT, slug)
    content_path = os.path.join(d, "_content.html")
    if not os.path.exists(content_path):
        print(f"  skip {slug} (no _content.html yet)")
        return False
    content = open(content_path, encoding="utf-8").read().strip()
    extra_path = os.path.join(d, "_extra.js")
    extra = open(extra_path, encoding="utf-8").read().strip() if os.path.exists(extra_path) else ""

    toc_links = "\n".join(
        f'  <a href="#{href}">{label}</a>' for href, label in session["toc"]
    )
    meta = "".join(
        (f'<span class="dot"></span>' if i else "") + f"<span>{m}</span>"
        for i, m in enumerate(session["meta"])
    )
    html = PAGE.format(
        title=session["title"], num=session["num"], slug=slug,
        group=GROUP.get(session["num"], "Math for ML"),
        lede=session["lede"], meta=meta, toc_links=toc_links,
        content=content, extra=extra,
    )
    out = os.path.join(d, "theory.html")
    open(out, "w", encoding="utf-8").write(html)
    print(f"  built {slug}/theory.html  ({len(html):,} bytes)")
    return True

def main():
    flt = sys.argv[1] if len(sys.argv) > 1 else ""
    print("Math for ML — building sessions")
    n = 0
    for s in SESSIONS:
        if flt and not s["slug"].startswith(flt):
            continue
        n += build(s)
    print(f"done · {n} page(s) built")

if __name__ == "__main__":
    main()
