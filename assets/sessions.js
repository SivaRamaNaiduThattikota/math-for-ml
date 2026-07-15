/* Shared session registry — single source of truth for the nav bar and the
   index landing page. Edit here once; every page picks it up. */
window.MFML_GROUPS = {
  la:   "Linear Algebra",
  calc: "Calculus",
  prob: "Probability & Statistics",
  info: "Information Theory",
  stats:"Applied Statistics",
  cap:  "Capstone",
};
window.MFML_SESSIONS = [
  ["la","01","01_vectors","Vectors","Data as points in space — the atom every other idea is built from.",true],
  ["la","02","02_dot_product","Dot product & similarity","Alignment between vectors — the math behind cosine similarity and attention.",true],
  ["la","03","03_matrices","Matrices as transformations","Grids of numbers that move, rotate, and stretch entire spaces.",true],
  ["la","04","04_matrix_multiplication","Matrix multiplication","Composing transformations — the single most-run operation in ML.",true],
  ["la","05","05_span_basis_rank","Span, basis, rank & independence","The shape of a vector space — why features are redundant, and what rank measures.",true],
  ["la","06","06_eigenvalues","Eigenvalues & eigenvectors","The directions a matrix only stretches — the axes it leaves alone.",true],
  ["la","07","07_svd_pca","SVD, PCA & low-rank","The master decomposition — behind PCA, recommenders, and LoRA.",true],
  ["calc","08","08_derivatives","Derivatives & gradients","How a function changes — the slope that learning follows.",true],
  ["calc","09","09_partial_derivatives","Partial derivatives & the Jacobian","Slopes in many directions at once; the gradient vector.",true],
  ["calc","10","10_chain_rule_backprop","Chain rule & backprop","How gradients flow backward through a neural network.",true],
  ["calc","11","11_gradient_descent","Gradient descent","The optimization loop at the heart of training (plus convexity & Lagrange).",true],
  ["prob","12","12_probability_bayes","Probability & Bayes","Reasoning under uncertainty; updating beliefs with evidence.",true],
  ["prob","13","13_distributions","Distributions","Normal, Bernoulli, and the multivariate Gaussian.",true],
  ["prob","14","14_expectation_covariance","Expectation, variance & covariance","Summarizing randomness; the covariance matrix.",true],
  ["prob","15","15_sampling_clt","Sampling & the CLT","Why averages are well-behaved even when data isn't.",true],
  ["prob","16","16_inference","Inference & hypothesis testing","Confidence intervals, p-values, and A/B tests.",true],
  ["prob","17","17_mle_cross_entropy","MLE & cross-entropy","Where loss functions actually come from.",true],
  ["info","18","18_information_theory","Information theory","Entropy, cross-entropy, and KL divergence.",true],
  ["stats","19","19_linear_regression","Linear regression & bias–variance","The template model: least squares, R², residuals, and under/overfitting.",true],
  ["stats","20","20_stat_tests","Statistical tests: t, χ² & ANOVA","The test toolbox — small samples, categorical data, and many groups.",true],
  ["stats","21","21_bayesian_inference","Bayesian inference & conjugate priors","Updating beliefs with data; Beta/Poisson/Gamma and the conjugacy shortcut.",true],
  ["cap","★","22_capstone","Capstone: the whole spine","How all sessions connect — one story, one worked example, an interview cheat-sheet.",true],
].map(([group,num,slug,title,desc,ready])=>({group,num,slug,title,desc,ready}));
