/* Shared session registry — single source of truth for the nav bar and the
   index landing page. Edit here once; every page picks it up. */
window.MFML_GROUPS = {
  la:   "Linear Algebra",
  calc: "Calculus",
  prob: "Probability & Statistics",
  info: "Information Theory",
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
  ["calc","10","10_chain_rule_backprop","Chain rule & backprop","How gradients flow backward through a neural network.",false],
  ["calc","11","11_gradient_descent","Gradient descent","The optimization loop at the heart of training (plus convexity & Lagrange).",false],
  ["prob","12","12_probability_bayes","Probability & Bayes","Reasoning under uncertainty; updating beliefs with evidence.",false],
  ["prob","13","13_distributions","Distributions","Normal, Bernoulli, and the multivariate Gaussian.",false],
  ["prob","14","14_expectation_covariance","Expectation, variance & covariance","Summarizing randomness; the covariance matrix.",false],
  ["prob","15","15_sampling_clt","Sampling & the CLT","Why averages are well-behaved even when data isn't.",false],
  ["prob","16","16_inference","Inference & hypothesis testing","Confidence intervals, p-values, and A/B tests.",false],
  ["prob","17","17_mle_cross_entropy","MLE & cross-entropy","Where loss functions actually come from.",false],
  ["info","18","18_information_theory","Information theory","Entropy, cross-entropy, and KL divergence.",false],
].map(([group,num,slug,title,desc,ready])=>({group,num,slug,title,desc,ready}));
