export type HelpMode = "hint" | "explain" | "debug" | "quiz";

export type Source = { title: string; location: string };
export type CoachAnswer = {
  topic: string;
  response: string;
  steps: string[];
  check: string;
  sources: Source[];
  matched: boolean;
};

type Topic = {
  name: string;
  keywords: string[];
  explanation: string;
  hints: string[];
  debug: string[];
  check: string;
  sources: Source[];
};

export const courseSources = [
  { title: "Course Syllabus & Expectations", type: "Course guide", module: "Module 1", status: "Active", detail: "Learning objectives, policies, assessment, and AI-use expectations." },
  { title: "Statistical Learning", type: "Lecture slides", module: "Module 2", status: "Active", detail: "Prediction, inference, bias–variance, train/test evaluation, and overfitting." },
  { title: "A/B Testing & Power", type: "Lecture slides", module: "Module 2", status: "Active", detail: "Designed experiments, resampling, ANOVA, multiple comparisons, power, and duration." },
  { title: "Linear Models I–II", type: "Lecture slides", module: "Module 3", status: "Active", detail: "OLS, matrix form, coefficient interpretation, diagnostics, and multicollinearity." },
  { title: "Insurance Modeling Notebook", type: "Notebook", module: "Module 3", status: "Active", detail: "Exploration, scikit-learn pipelines, one-hot encoding, transformations, and evaluation." },
  { title: "Lab 2: Inference & Prediction", type: "Assignment", module: "Module 3", status: "Active", detail: "Conceptual and coding practice with regression and preprocessing." },
];

const topics: Topic[] = [
  {
    name: "One-hot encoding and categorical predictors",
    keywords: ["one hot", "one-hot", "categorical", "dummy", "encode", "region", "sex", "smoker", "string"],
    explanation: "A categorical variable represents labels or groups, not measured amounts. Giving categories arbitrary numbers would invent an ordering and distance. One-hot encoding creates an indicator for each category so the model can estimate a separate shift relative to a reference group.",
    hints: ["Separate variables whose numeric differences are meaningful from variables that are labels.", "Ask whether averaging the values would make sense. An average age is meaningful; an average region is not.", "In the insurance data, region, sex, and smoker are categorical even if software happens to store them differently."],
    debug: ["Inspect X.dtypes and the exact column names.", "Confirm categorical columns are assigned to OneHotEncoder inside ColumnTransformer.", "Run preprocessor.fit_transform(X) separately. If strings remain, the intended columns did not pass through the encoder.", "Check handle_unknown='ignore' when prediction data may contain unseen categories."],
    check: "Why would coding southwest=1, southeast=2, northwest=3, and northeast=4 mislead a linear model?",
    sources: [{title:"Insurance Modeling Notebook",location:"Preprocessing pipeline"}, {title:"Linear Models II",location:"Categorical predictors, slides 18–22"}]
  },
  {
    name: "Multicollinearity and VIF",
    keywords: ["multicollinearity", "collinear", "vif", "correlated predictor", "correlated variables"],
    explanation: "Multicollinearity occurs when predictors carry overlapping linear information. The model may still predict well, but it becomes difficult to isolate each predictor’s unique contribution. Coefficients can change substantially across samples and their standard errors often grow.",
    hints: ["Separate the prediction question from the coefficient-interpretation question.", "Look for strongly related predictors and unstable coefficient signs or magnitudes.", "A high VIF is evidence to investigate, not an automatic command to delete a variable."],
    debug: ["Compute correlations for numeric predictors.", "Fit the model on bootstrap samples and inspect coefficient variability.", "Calculate VIF only after preprocessing and avoid a redundant full set of dummy variables plus an intercept.", "Compare predictive performance before removing a scientifically important variable."],
    check: "Why can a model have strong test-set predictions while individual coefficient estimates remain unstable?",
    sources: [{title:"Linear Models II",location:"Multicollinearity and VIF"}, {title:"Insurance Modeling Notebook",location:"Bootstrap coefficient stability"}]
  },
  {
    name: "Train/test evaluation and overfitting",
    keywords: ["train test", "test set", "split", "overfit", "overfitting", "generalize", "validation", "data leakage", "leakage"],
    explanation: "The training set is used to estimate the model; the test set approximates performance on future, unseen cases. Overfitting occurs when a model learns sample-specific noise, producing excellent training performance but weaker test performance. All learned preprocessing must be fit on training data only.",
    hints: ["Compare training and test error rather than looking at training performance alone.", "Ask whether any information from the test set influenced feature selection, scaling, or model tuning.", "Put learned preprocessing and the estimator in one pipeline."],
    debug: ["Split before fitting scalers, encoders, imputers, or transformations.", "Fit the complete pipeline on X_train only.", "Use cross-validation for tuning, then use the untouched test set once for final evaluation.", "Check for target-derived variables or future information in the predictors."],
    check: "Why does fitting a scaler on the entire dataset leak information even though the scaler never sees y?",
    sources: [{title:"Statistical Learning",location:"Generalization and resampling"}, {title:"Insurance Modeling Notebook",location:"Train/test pipeline"}]
  },
  {
    name: "OLS and coefficient interpretation",
    keywords: ["ols", "ordinary least", "coefficient", "intercept", "beta", "matrix", "least squares", "sse", "residual"],
    explanation: "Ordinary least squares chooses coefficients that minimize the sum of squared residuals. In multiple regression, a slope describes the expected change in the response for a one-unit increase in that predictor while holding the other included predictors constant.",
    hints: ["Begin with residual = observed − predicted.", "Squaring prevents positive and negative residuals from canceling.", "For interpretation, state the unit change, the response unit, and what is held constant."],
    debug: ["Confirm X and y have matching rows and no unintended missing values.", "Add an intercept explicitly when using matrix formulas or statsmodels.", "Check feature order before matching fitted coefficients to names.", "Use residual plots to inspect whether the linear structure is reasonable."],
    check: "How would you interpret an age coefficient of 250 when charges are measured in dollars?",
    sources: [{title:"Linear Models I",location:"OLS objective and matrix derivation"}, {title:"Linear Models II",location:"Multiple-regression interpretation"}]
  },
  {
    name: "Polynomial regression",
    keywords: ["polynomial", "quadratic", "x squared", "x^2", "nonlinear curve", "curved"],
    explanation: "Polynomial regression can produce a curved relationship in x while remaining a linear model because it is linear in the unknown coefficients. In y = β₀ + β₁x + β₂x² + ε, the parameters enter additively and are estimated with ordinary linear-regression machinery.",
    hints: ["Distinguish linear in x from linear in the parameters.", "Treat x and x² as two columns in the design matrix.", "Interpret lower-order terms together with the higher-order term."],
    debug: ["Generate polynomial features inside the pipeline.", "Avoid creating a second intercept when the estimator already fits one.", "Inspect train and test error as polynomial degree increases.", "Center x when high-order terms cause numerical instability."],
    check: "What exactly stays linear in a quadratic regression model?",
    sources: [{title:"Linear Models II",location:"Feature transformations"}, {title:"Insurance Modeling Notebook",location:"Polynomial features"}]
  },
  {
    name: "Model metrics: RMSE and R-squared",
    keywords: ["rmse", "mse", "mean squared", "r squared", "r2", "metric", "mae", "error"],
    explanation: "RMSE summarizes the typical prediction error in the response’s original units while penalizing large errors strongly. R² describes the fraction of response variation explained relative to predicting the mean. Neither metric alone establishes that a model is useful or causally valid.",
    hints: ["Choose a metric whose units and penalty match the decision problem.", "Compare metrics on held-out data.", "Always compare against a simple baseline."],
    debug: ["Make sure y_true and predictions refer to the same held-out rows.", "Check whether you accidentally report training metrics.", "Inspect the distribution of residuals instead of relying on one average.", "Use MAE alongside RMSE when large errors may dominate."],
    check: "Why might two models have similar R² values but meaningfully different RMSE values?",
    sources: [{title:"Statistical Learning",location:"Assessing model accuracy"}, {title:"Insurance Modeling Notebook",location:"Evaluation metrics"}]
  },
  {
    name: "A/B testing, ANOVA, and power",
    keywords: ["a/b", "ab test", "experiment", "anova", "power", "sample size", "promotion", "multiple comparison", "p-value"],
    explanation: "A designed experiment uses random assignment to make treatment groups comparable on average. ANOVA tests whether all group means can reasonably be treated as equal. If it rejects, planned or corrected pairwise comparisons identify where differences lie. Power depends on effect size, variability, sample size, and the significance threshold.",
    hints: ["State the experimental unit, treatment, outcome, and randomization mechanism.", "An omnibus ANOVA result does not identify which groups differ.", "Small effects and rare outcomes require larger samples."],
    debug: ["Verify each experimental unit appears in only one treatment group.", "Inspect group sizes and outcome distributions.", "Use multiplicity correction for several pairwise intervals or tests.", "Define the minimum detectable effect before choosing duration."],
    check: "If ANOVA rejects μ₁=μ₂=μ₃, what can you conclude—and what can you not yet conclude?",
    sources: [{title:"A/B Testing & Power",location:"Designed experiments and duration"}, {title:"Lab 1",location:"ANOVA and multiple comparisons"}]
  },
  {
    name: "Bias–variance tradeoff",
    keywords: ["bias variance", "bias-variance", "bias", "variance", "complexity", "underfit", "underfitting"],
    explanation: "Expected prediction error reflects irreducible noise plus error from bias and variance. Simple models can miss stable structure and have high bias; highly flexible models can react strongly to the particular training sample and have high variance. Test performance helps locate a useful balance.",
    hints: ["Think about how predictions would change if you collected a new training sample.", "Underfitting usually hurts both training and test performance.", "Overfitting creates a widening gap between training and test performance."],
    debug: ["Plot training and validation error across model complexity.", "Use cross-validation rather than choosing complexity from one split.", "Regularization can reduce variance by shrinking coefficients.", "Add flexibility only when validation performance improves."],
    check: "What training/test error pattern would suggest high variance rather than high bias?",
    sources: [{title:"Statistical Learning",location:"Bias–variance decomposition"}, {title:"Linear Models II",location:"Model complexity"}]
  }
];

function findTopic(question: string) {
  const q = question.toLowerCase().replace(/[–—]/g, "-");
  let best = topics[0];
  let score = 0;
  for (const topic of topics) {
    const topicScore = topic.keywords.reduce((sum, word) => sum + (q.includes(word) ? word.split(" ").length + 1 : 0), 0);
    if (topicScore > score) { best = topic; score = topicScore; }
  }
  return { topic: best, matched: score > 0 };
}

export function answerCourseQuestion(question: string, mode: HelpMode): CoachAnswer {
  const { topic, matched } = findTopic(question);
  if (!matched) {
    return {
      topic: "Clarify your course question",
      response: "I could not confidently match that question to the DS 6021 materials currently loaded. Add the concept, assignment section, variable name, or exact error message. I will avoid inventing a course-specific answer.",
      steps: ["Name the lecture, lab, or notebook you are using.", "Paste the smallest relevant code or error message.", "Say what you expected and what happened instead."],
      check: "Would you like to send this question to a TA with your context attached?",
      sources: [{title:"Course Syllabus & Expectations", location:"Getting help and escalation"}],
      matched: false
    };
  }
  const modeLead: Record<HelpMode,string> = {
    hint: topic.hints[0],
    explain: topic.explanation,
    debug: "Let’s isolate the problem before changing the model.",
    quiz: "Use the course idea below to reason through the question before checking your notes."
  };
  return {
    topic: topic.name,
    response: modeLead[mode],
    steps: mode === "debug" ? topic.debug : mode === "hint" ? topic.hints.slice(1) : mode === "quiz" ? [topic.check] : topic.hints,
    check: mode === "quiz" ? "Explain your reasoning in one or two sentences, and I’ll help you evaluate it." : topic.check,
    sources: topic.sources,
    matched
  };
}

const understandingSignals: Record<string, string[]> = {
  "One-hot encoding and categorical predictors": ["order", "distance", "indicator", "category", "label"],
  "Multicollinearity and VIF": ["unstable", "standard error", "prediction", "overlap", "correlated"],
  "Train/test evaluation and overfitting": ["unseen", "generalize", "training", "test", "leak"],
  "OLS and coefficient interpretation": ["holding", "constant", "change", "residual", "squared"],
  "Polynomial regression": ["parameter", "coefficient", "linear", "additive"],
  "Model metrics: RMSE and R-squared": ["units", "variation", "error", "baseline", "large"],
  "A/B testing, ANOVA, and power": ["means", "pairwise", "which", "random", "sample"],
  "Bias–variance tradeoff": ["training", "test", "flexible", "sample", "generalize"]
};

export function evaluateUnderstanding(response: string, prior: CoachAnswer): CoachAnswer {
  const normalized = response.toLowerCase();
  const signals = understandingSignals[prior.topic] || [];
  const hits = signals.filter(word => normalized.includes(word));
  const strong = response.trim().split(/\s+/).length >= 8 && hits.length >= 1;
  const nextChecks: Record<string,string> = {
    "One-hot encoding and categorical predictors": "Now apply the idea: should the integer-valued variable children be one-hot encoded in the insurance model? Explain your decision.",
    "Multicollinearity and VIF": "Suppose prediction is the only goal and test error is strong. What additional reason might still justify keeping both correlated predictors?",
    "Train/test evaluation and overfitting": "Where should cross-validation occur, and when should the untouched test set be used?",
    "OLS and coefficient interpretation": "What important phrase prevents a multiple-regression coefficient from being interpreted as a simple two-variable comparison?",
    "Polynomial regression": "If we add x³, what changes about the curve—and what remains linear?",
    "Model metrics: RMSE and R-squared": "Which metric would you present to a stakeholder who needs prediction error expressed in dollars, and why?",
    "A/B testing, ANOVA, and power": "After a significant three-group ANOVA, why should the three pairwise comparisons be multiplicity-adjusted?",
    "Bias–variance tradeoff": "How would regularization usually affect bias and variance?"
  };
  return {
    topic: prior.topic,
    response: strong
      ? "Yes—your explanation includes a key course idea" + (hits.length ? " about " + hits.slice(0,2).join(" and ") : "") + ". You are reasoning from the concept rather than repeating a definition."
      : "You are moving in the right direction, but the explanation needs one more explicit connection to the course concept. Name what changes, what stays fixed, or why the distinction matters for prediction or interpretation.",
    steps: strong
      ? ["Keep the same precision when you write your lab interpretation.", "Avoid turning an association or diagnostic into an automatic causal or variable-selection rule."]
      : ["Revisit this key idea: " + prior.response, "Answer in a complete sentence using the variables or setting in the question."],
    check: nextChecks[prior.topic] || "Can you give a concrete DS 6021 example that demonstrates the idea?",
    sources: prior.sources,
    matched: true
  };
}

export const suggestedQuestions = [
  "Why is polynomial regression still a linear model?",
  "How do I decide which variables need one-hot encoding?",
  "If VIF is high, must I remove the predictor?",
  "What is the difference between RMSE and R-squared?",
  "How can preprocessing create data leakage?",
  "What does a significant ANOVA result tell us?"
];
