/* ==========================================================================
   data.js — every number and piece of content on the page lives here.
   Edit this file to update the site; script.js only renders it.

   Sources
   - "paper"  : Demirtürk & Harunoğlu (2025), Applied Sciences 15(11), 5879.
                Tables 3 (default), 6 (GA), 8 (Grid) — values read from the PDF
                and rounded to 4 decimals.
   - "ours"   : notebook_with_outputs.ipynb / project report Tables 1–3.
   - Paper has no CV table, so paper CV is not stored.
   ========================================================================== */

window.DATA = {

  models: ["DT", "RF", "KNN", "AdaBoost", "GBM", "ETR", "BR", "SVR", "HGBR", "XGBoost"],

  modelNames: {
    DT: "Decision Tree", RF: "Random Forest", KNN: "K-Nearest Neighbors", AdaBoost: "AdaBoost",
    GBM: "Gradient Boosting", ETR: "Extra Trees", BR: "Bagging Regressor", SVR: "Support Vector Regressor",
    HGBR: "HistGradientBoosting", XGBoost: "XGBoost"
  },

  cases: [
    { id: "default", label: "Default" },
    { id: "grid", label: "Grid Search" },
    { id: "ga", label: "Genetic Algorithm" }
  ],

  /* metrics[source][case][model] = { R2, MSE, RMSE, MAE, CV (ours only) } */
  metrics: {
 "paper": {
  "default": {
   "DT": {
    "R2": 0.8691,
    "MSE": 0.1083,
    "RMSE": 0.329,
    "MAE": 0.26
   },
   "RF": {
    "R2": 0.9287,
    "MSE": 0.059,
    "RMSE": 0.2428,
    "MAE": 0.188
   },
   "KNN": {
    "R2": 0.899,
    "MSE": 0.0835,
    "RMSE": 0.289,
    "MAE": 0.2268
   },
   "AdaBoost": {
    "R2": 0.9174,
    "MSE": 0.0683,
    "RMSE": 0.2613,
    "MAE": 0.2097
   },
   "GBM": {
    "R2": 0.9384,
    "MSE": 0.051,
    "RMSE": 0.2258,
    "MAE": 0.1793
   },
   "ETR": {
    "R2": 0.9265,
    "MSE": 0.0608,
    "RMSE": 0.2466,
    "MAE": 0.1948
   },
   "BR": {
    "R2": 0.9184,
    "MSE": 0.0674,
    "RMSE": 0.2597,
    "MAE": 0.203
   },
   "SVR": {
    "R2": 0.95,
    "MSE": 0.0413,
    "RMSE": 0.2032,
    "MAE": 0.1597
   },
   "HGBR": {
    "R2": 0.9408,
    "MSE": 0.049,
    "RMSE": 0.2213,
    "MAE": 0.1754
   },
   "XGBoost": {
    "R2": 0.9305,
    "MSE": 0.0575,
    "RMSE": 0.2398,
    "MAE": 0.1891
   }
  },
  "grid": {
   "DT": {
    "R2": 0.8906,
    "MSE": 0.0904,
    "RMSE": 0.3007,
    "MAE": 0.2389
   },
   "RF": {
    "R2": 0.9298,
    "MSE": 0.058,
    "RMSE": 0.2409,
    "MAE": 0.187
   },
   "KNN": {
    "R2": 0.9134,
    "MSE": 0.0717,
    "RMSE": 0.2677,
    "MAE": 0.211
   },
   "AdaBoost": {
    "R2": 0.9289,
    "MSE": 0.0588,
    "RMSE": 0.2424,
    "MAE": 0.1927
   },
   "GBM": {
    "R2": 0.947,
    "MSE": 0.0439,
    "RMSE": 0.2094,
    "MAE": 0.1646
   },
   "ETR": {
    "R2": 0.9296,
    "MSE": 0.0582,
    "RMSE": 0.2412,
    "MAE": 0.1884
   },
   "BR": {
    "R2": 0.1432,
    "MSE": 0.7085,
    "RMSE": 0.8417,
    "MAE": 0.7067
   },
   "SVR": {
    "R2": 0.9519,
    "MSE": 0.0398,
    "RMSE": 0.1994,
    "MAE": 0.1594
   },
   "HGBR": {
    "R2": 0.9451,
    "MSE": 0.0454,
    "RMSE": 0.213,
    "MAE": 0.1673
   },
   "XGBoost": {
    "R2": 0.9474,
    "MSE": 0.0435,
    "RMSE": 0.2085,
    "MAE": 0.1638
   }
  },
  "ga": {
   "DT": {
    "R2": 0.8963,
    "MSE": 0.0858,
    "RMSE": 0.2928,
    "MAE": 0.2327
   },
   "RF": {
    "R2": 0.9291,
    "MSE": 0.0586,
    "RMSE": 0.2421,
    "MAE": 0.1876
   },
   "KNN": {
    "R2": 0.9131,
    "MSE": 0.0719,
    "RMSE": 0.2681,
    "MAE": 0.2123
   },
   "AdaBoost": {
    "R2": 0.9289,
    "MSE": 0.0588,
    "RMSE": 0.2424,
    "MAE": 0.1936
   },
   "GBM": {
    "R2": 0.9441,
    "MSE": 0.0463,
    "RMSE": 0.2151,
    "MAE": 0.1681
   },
   "ETR": {
    "R2": 0.9246,
    "MSE": 0.0624,
    "RMSE": 0.2497,
    "MAE": 0.1957
   },
   "BR": {
    "R2": 0.1082,
    "MSE": 0.7374,
    "RMSE": 0.8587,
    "MAE": 0.721
   },
   "SVR": {
    "R2": 0.9355,
    "MSE": 0.0533,
    "RMSE": 0.2309,
    "MAE": 0.1827
   },
   "HGBR": {
    "R2": 0.748,
    "MSE": 0.2084,
    "RMSE": 0.4565,
    "MAE": 0.3586
   },
   "XGBoost": {
    "R2": 0.9449,
    "MSE": 0.0455,
    "RMSE": 0.2134,
    "MAE": 0.166
   }
  }
 },
 "ours": {
  "default": {
   "DT": {
    "R2": 0.8659,
    "MSE": 0.1109,
    "RMSE": 0.333,
    "MAE": 0.2646,
    "CV": 0.85
   },
   "RF": {
    "R2": 0.9268,
    "MSE": 0.0605,
    "RMSE": 0.246,
    "MAE": 0.1908,
    "CV": 0.9296
   },
   "KNN": {
    "R2": 0.899,
    "MSE": 0.0835,
    "RMSE": 0.289,
    "MAE": 0.2268,
    "CV": 0.8991
   },
   "AdaBoost": {
    "R2": 0.9166,
    "MSE": 0.069,
    "RMSE": 0.2626,
    "MAE": 0.2111,
    "CV": 0.9132
   },
   "GBM": {
    "R2": 0.9463,
    "MSE": 0.0444,
    "RMSE": 0.2107,
    "MAE": 0.1646,
    "CV": 0.947
   },
   "ETR": {
    "R2": 0.9271,
    "MSE": 0.0603,
    "RMSE": 0.2455,
    "MAE": 0.1918,
    "CV": 0.9296
   },
   "BR": {
    "R2": 0.9217,
    "MSE": 0.0648,
    "RMSE": 0.2545,
    "MAE": 0.1963,
    "CV": 0.9215
   },
   "SVR": {
    "R2": 0.95,
    "MSE": 0.0413,
    "RMSE": 0.2032,
    "MAE": 0.1597,
    "CV": 0.9496
   },
   "HGBR": {
    "R2": 0.9408,
    "MSE": 0.049,
    "RMSE": 0.2213,
    "MAE": 0.1754,
    "CV": 0.9417
   },
   "XGBoost": {
    "R2": 0.9344,
    "MSE": 0.0543,
    "RMSE": 0.2329,
    "MAE": 0.1878,
    "CV": 0.9304
   }
  },
  "grid": {
   "DT": {
    "R2": 0.8906,
    "MSE": 0.0904,
    "RMSE": 0.3007,
    "MAE": 0.2389,
    "CV": 0.8946
   },
   "RF": {
    "R2": 0.9298,
    "MSE": 0.058,
    "RMSE": 0.2409,
    "MAE": 0.187,
    "CV": 0.931
   },
   "KNN": {
    "R2": 0.9125,
    "MSE": 0.0723,
    "RMSE": 0.2689,
    "MAE": 0.2128,
    "CV": 0.916
   },
   "AdaBoost": {
    "R2": 0.9284,
    "MSE": 0.0592,
    "RMSE": 0.2432,
    "MAE": 0.1929,
    "CV": 0.9258
   },
   "GBM": {
    "R2": 0.947,
    "MSE": 0.0439,
    "RMSE": 0.2094,
    "MAE": 0.1641,
    "CV": 0.9476
   },
   "ETR": {
    "R2": 0.9295,
    "MSE": 0.0583,
    "RMSE": 0.2415,
    "MAE": 0.1886,
    "CV": 0.9332
   },
   "BR": {
    "R2": 0.929,
    "MSE": 0.0587,
    "RMSE": 0.2424,
    "MAE": 0.1877,
    "CV": 0.9315
   },
   "SVR": {
    "R2": 0.9528,
    "MSE": 0.039,
    "RMSE": 0.1975,
    "MAE": 0.156,
    "CV": 0.9529
   },
   "HGBR": {
    "R2": 0.9451,
    "MSE": 0.0454,
    "RMSE": 0.213,
    "MAE": 0.1673,
    "CV": 0.9476
   },
   "XGBoost": {
    "R2": 0.9475,
    "MSE": 0.0434,
    "RMSE": 0.2083,
    "MAE": 0.1639,
    "CV": 0.9477
   }
  },
  "ga": {
   "DT": {
    "R2": 0.8948,
    "MSE": 0.087,
    "RMSE": 0.295,
    "MAE": 0.2338,
    "CV": 0.8901
   },
   "RF": {
    "R2": 0.9299,
    "MSE": 0.058,
    "RMSE": 0.2408,
    "MAE": 0.187,
    "CV": 0.9309
   },
   "KNN": {
    "R2": 0.9134,
    "MSE": 0.0717,
    "RMSE": 0.2677,
    "MAE": 0.211,
    "CV": 0.9163
   },
   "AdaBoost": {
    "R2": 0.9287,
    "MSE": 0.0589,
    "RMSE": 0.2428,
    "MAE": 0.1927,
    "CV": 0.9255
   },
   "GBM": {
    "R2": 0.9329,
    "MSE": 0.0555,
    "RMSE": 0.2356,
    "MAE": 0.1855,
    "CV": 0.9363
   },
   "ETR": {
    "R2": 0.9296,
    "MSE": 0.0582,
    "RMSE": 0.2412,
    "MAE": 0.1878,
    "CV": 0.9335
   },
   "BR": {
    "R2": 0.9275,
    "MSE": 0.06,
    "RMSE": 0.2449,
    "MAE": 0.1893,
    "CV": 0.9292
   },
   "SVR": {
    "R2": 0.9509,
    "MSE": 0.0406,
    "RMSE": 0.2014,
    "MAE": 0.1582,
    "CV": 0.9496
   },
   "HGBR": {
    "R2": 0.9359,
    "MSE": 0.053,
    "RMSE": 0.2302,
    "MAE": 0.1839,
    "CV": 0.9376
   },
   "XGBoost": {
    "R2": 0.9375,
    "MSE": 0.0517,
    "RMSE": 0.2273,
    "MAE": 0.1792,
    "CV": 0.939
   }
  }
 }
},

  /* Numbers quoted in the brief — script.js recomputes the summary and warns in the
     console if it ever disagrees with these. */
  claimed: {
    pairs: 30, within016: 27, madWithin016: 0.0024, within005: 23, within0005: 12,
    large: ["BR|grid", "BR|ga", "HGBR|ga"]
  },

  /* Where the brief and the paper PDF disagree. The PDF wins in metrics above. */
  verificationNotes: [
    "AdaBoost, GA, paper R²: PDF Table 6 gives 0.928929 (= 0.9289); the brief and report print 0.9290. The page uses 0.9289.",
    "Ours GA SVR RMSE: notebook 0.2014; the brief rounds it to 0.201. The page uses 0.2014.",
    "Linear/Ridge/Lasso RMSE: notebook 0.1966 (Lasso 0.1967); the brief and report say 0.197 (rounded)."
  ],

  dataset: {
    students: 2392, columns: 15, train: 1913, test: 479, seed: 42,
    gpaMean: 1.91, gpaStd: 0.92, absencesCorr: -0.92
  },

  features: ["Age", "Gender", "Ethnicity", "ParentalEducation", "StudyTimeWeekly", "Absences",
            "Tutoring", "ParentalSupport", "Extracurricular", "Sports", "Music", "Volunteering"],

  best: { model: "SVR", case: "grid", r2: 0.9528, rmse: 0.1975, mae: 0.1560 },
  linearBaseline: { r2: 0.9532, rmse: 0.1966, mae: 0.1553 },

  gridSizes: { DT: 180, RF: 24, KNN: 120, AdaBoost: 36, GBM: 54, ETR: 24, BR: 48, SVR: 48, HGBR: 48, XGBoost: 81 },
  gaUniqueEvaluated: { DT: 60, RF: 52, KNN: 25, AdaBoost: 17, GBM: 51, ETR: 51, BR: 44, SVR: 68, HGBR: 55, XGBoost: 53 },

  /* Best hyperparameters. status: same (identical) | near (near-identical) | part (some values differ) | key (see 8e) | diff */
  hyper: {
    grid: [
      { m: "DT", paper: "criterion=poisson, max_depth=12, max_leaf_nodes=152, min_samples_leaf=8", ours: "identical", status: "same" },
      { m: "RF", paper: "n_estimators=300, criterion=poisson, max_depth=20, min_samples_leaf=2", ours: "identical", status: "same" },
      { m: "KNN", paper: "n_neighbors=15, weights=distance, metric=manhattan, leaf_size=10", ours: "n_neighbors=11, weights=distance, metric=manhattan, leaf_size=10", status: "part" },
      { m: "AdaBoost", paper: "n_estimators=1500, learning_rate=1.0, loss=square", ours: "n_estimators=500, learning_rate=1.0, loss=square", status: "part" },
      { m: "GBM", paper: "n_estimators=300, learning_rate=0.05, max_depth=3, objective=huber", ours: "n_estimators=300, learning_rate=0.05, max_depth=3, loss=squared_error", status: "near" },
      { m: "ETR", paper: "n_estimators=600, min_samples_leaf=2, min_samples_split=6, criterion=friedman_mse", ours: "n_estimators=300, min_samples_leaf=1, min_samples_split=6, criterion=friedman_mse", status: "part" },
      { m: "BR", paper: "n_estimators=300, max_samples=0.6, max_features=1, bootstrap=True, bootstrap_features=False", ours: "n_estimators=300, max_samples=0.6, max_features=1.0, bootstrap=True, bootstrap_features=False", status: "key" },
      { m: "SVR", paper: "kernel=rbf, C=10, epsilon=0.01, degree=3", ours: "kernel=linear, C=10, epsilon=0.1", status: "diff" },
      { m: "HGBR", paper: "learning_rate=0.1, loss=squared_error, max_depth=3, min_samples_leaf=10", ours: "identical", status: "same" },
      { m: "XGBoost", paper: "n_estimators=300, learning_rate=0.05, max_depth=3, c=10 (as listed)", ours: "n_estimators=300, learning_rate=0.05, max_depth=3, gamma=0", status: "near" }
    ],
    ga: [
      { m: "DT", paper: "criterion=absolute_error, max_depth=10, max_leaf_nodes=362, min_samples_leaf=7", ours: "criterion=poisson, max_depth=10, max_leaf_nodes=278, min_samples_leaf=6", status: "diff" },
      { m: "RF", paper: "n_estimators=600, criterion=squared_error, max_depth=95, min_samples_leaf=2", ours: "n_estimators=500, criterion=poisson, max_depth=30, min_samples_leaf=2", status: "diff" },
      { m: "KNN", paper: "n_neighbors=13, weights=uniform, metric=manhattan, leaf_size=90 (Table 5)", ours: "n_neighbors=15, weights=distance, metric=manhattan, leaf_size=80", status: "diff" },
      { m: "AdaBoost", paper: "n_estimators=601, learning_rate=0.9269, loss=square", ours: "n_estimators=400, learning_rate=1.0, loss=square", status: "diff" },
      { m: "GBM", paper: "n_estimators=400, learning_rate=0.05, max_depth=4, objective=regression_l1", ours: "n_estimators=500, learning_rate=0.01, max_depth=7, loss=absolute_error", status: "diff" },
      { m: "ETR", paper: "n_estimators=700, min_samples_leaf=5, min_samples_split=20, criterion=squared_error", ours: "n_estimators=400, min_samples_leaf=1, min_samples_split=8, criterion=squared_error", status: "diff" },
      { m: "BR", paper: "n_estimators=100, max_samples=0.9, max_features=1, bootstrap=True, bootstrap_features=False", ours: "n_estimators=500, max_samples=0.2, max_features=1.0, bootstrap=False, bootstrap_features=False", status: "key" },
      { m: "SVR", paper: "kernel=poly, C=10, epsilon=0.01, degree=3", ours: "kernel=rbf, C=10, epsilon=0.361, degree=5, max_iter=800", status: "diff" },
      { m: "HGBR", paper: "learning_rate=0.01, loss=absolute_error, max_depth=7, min_samples_leaf=10", ours: "learning_rate=0.231, loss=absolute_error, max_depth=23, min_samples_leaf=11", status: "diff" },
      { m: "XGBoost", paper: "n_estimators=1000, learning_rate=0.05, max_depth=3, gamma=0.1", ours: "n_estimators=500, learning_rate=0.01, max_depth=7, gamma=0.1", status: "diff" }
    ]
  },

  modelGroups: [
    { title: "Distance & kernel", blurb: "Predict by similarity or by fitting a smooth curve.", models: ["KNN", "SVR"] },
    { title: "Single tree", blurb: "One flowchart of yes/no questions.", models: ["DT"] },
    { title: "Bagging (voting)", blurb: "Many models trained independently; their answers are averaged.", models: ["RF", "ETR", "BR"] },
    { title: "Boosting (learn from mistakes)", blurb: "Models trained one after another, each fixing the last one's errors.", models: ["AdaBoost", "GBM", "HGBR", "XGBoost"] }
  ],

  modelPlain: {
    KNN: "Finds the most similar past students and averages their GPA.",
    SVR: "Fits a smooth curve that stays inside a narrow error band around the data.",
    DT: "A flowchart of yes/no questions that ends in a GPA guess.",
    RF: "Hundreds of different trees vote; the average is steadier than any single tree.",
    ETR: "Like a random forest, but the split points are chosen even more randomly.",
    BR: "Trains many trees on random samples of the students and averages them.",
    AdaBoost: "A chain of small models; each one focuses on students the last one got wrong.",
    GBM: "Each new tree corrects the leftover error of all the trees before it.",
    HGBR: "Gradient boosting made faster by sorting values into bins first.",
    XGBoost: "A fast, heavily engineered gradient booster with built-in guards against overfitting."
  },

  setupRows: [
    ["Dataset", "Kaggle student performance CSV, 2,392 students", "Same dataset"],
    ["Target / dropped columns", "GPA; GradeClass and StudentID removed", "Same"],
    ["Split", "80% train / 20% test", "Same (random_state=42): 1,913 train / 479 test"],
    ["Models", "10 regressors: KNN, SVR, DT, RF, AdaBoost, ETR, GBM, BR, HGBR, XGBoost", "Same 10"],
    ["Cases", "Default, Grid Search, Genetic Algorithm", "Same"],
    ["Metrics", "17 metrics reported for the test set", "Same 17 metrics, plus 10-fold CV R² reported per model"],
    ["Validation", "10-fold CV stated; no CV score table reported", "10-fold CV R² computed and tabulated for all 30 configurations"],
    ["Tuning objective", "Lowest error / best score via CV", "Highest mean CV R² on the training set only (5-fold during the search, 10-fold for the reported score)"],
    ["GA implementation", "DEAP library in Spyder; mutation 0.05, elitism 0.1", "Own custom GA; mutation 0.05, elitism 0.1, tournament selection, crossover"],
    ["GA budget", "Population 100 × 10 generations = 1,000 evaluations for most models (KNN: 20 × 10 = 200; AdaBoost: ~150)", "Population 20 × 5 generations (12 × 4 for KNN and AdaBoost); only 17–68 unique settings tested, for speed. Some search ranges were also trimmed (e.g. n_estimators 100–500)"],
    ["Grid size", "Not stated in the paper per model", "24–180 combinations per model"],
    ["Feature scaling", "Not mentioned", "None (matches paper; in a trial, scaling reduced KNN accuracy)"],
    ["Extra analysis", "None", "Linear/Ridge/Lasso baseline, GBM feature importance, Apriori association rules, GA convergence, 10-fold CV ranking"]
  ],

  bestPerCase: {
    default: { paper: { m: "SVR", r2: 0.9500 }, ours: { m: "SVR", r2: 0.9500 }, agree: true },
    grid:    { paper: { m: "SVR", r2: 0.9519 }, ours: { m: "SVR", r2: 0.9528 }, agree: true },
    ga:      { paper: { m: "XGBoost", r2: 0.9449, note: "SVR only 0.9355" }, ours: { m: "SVR", r2: 0.9509 }, agree: false,
               note: "Our GA budget was smaller, which hurt GBM, HGBR and XGBoost, while SVR found a good rbf setting." }
  },

  contributions: [
    { t: "Linear baseline", d: "Plain Linear, Ridge and Lasso regression reach R² = 0.9532, matching the best tuned model." },
    { t: "Feature importance", d: "GA-tuned GBM: Absences ≈ 0.54, StudyTimeWeekly ≈ 0.17, ParentalSupport ≈ 0.08.", fig: "fig-feature-importance.png", alt: "Bar chart of feature importance for the GA-tuned Gradient Boosting model. Absences is by far the largest at about 0.54, followed by StudyTimeWeekly at about 0.17 and ParentalSupport at about 0.08." },
    { t: "Apriori association rules", d: "Min support 0.08; 86 itemsets; 21 rules. Example: Absences=High, StudyTime=Low, Tutoring=No → Grade F (support 0.118, confidence 0.928, lift 1.832)." },
    { t: "10-fold CV R² for all 30 configurations", d: "The paper states 10-fold CV but reports no CV scores; we tabulate them.", fig: "fig-cv-ranking.png", alt: "Bar chart ranking the models by mean 10-fold cross-validation R²." },
    { t: "GA convergence plot", d: "Best cross-validated R² per generation for each model, showing how quickly the search settles.", fig: "fig-ga-convergence.png", alt: "Line chart of best cross-validated R-squared per generation for the genetic algorithm runs." },
    { t: "Explicit paper-vs-reproduction table", d: "All 30 paired R² values with the difference, plus hyperparameters side by side (sections above)." }
  ],

  notices: [
    "The RF GA best max_depth = 95 lies outside the stated search range (5–50).",
    "AdaBoost GA best n_estimators = 601 and learning_rate = 0.9269 do not fall on the stated grids (increments of 100; 10 learning-rate values). The text describes n_estimators as 20 values up to 2000, while Table 4 says “10 values … [100, 2000]”. The GA population for AdaBoost is given as both 15 and 20 (and 150 evaluations does not equal either population × 10).",
    "The KNN GA best parameters in the text (n_neighbors=15, distance, leaf_size=10) differ from Table 5 (13, uniform, leaf_size=90).",
    "Parameter names such as “objective = regression_l1” (GBM) and “c = 10” (XGBoost) are not standard scikit-learn / XGBoost regressor arguments.",
    "The text says highly correlated variables were removed, but Section 4 lists only GradeClass and StudentID as removed.",
    "10-fold CV is mentioned, but no CV result table is reported (we added one).",
    "The paper's data link points to a Kaggle dataset by a different uploader (tusharika802/student-performance-data-csv) than the one we used (rabieelkharoua/students-performance-dataset); we did not compare the two files, so this is only a pointer for anyone repeating the study."
  ],

  references: [
    { t: "Demirtürk, B.; Harunoğlu, T. (2025). A Comparative Analysis of Different Machine Learning Algorithms Developed with Hyperparameter Optimization in the Prediction of Student Academic Success. Applied Sciences, 15(11), 5879.", url: "https://doi.org/10.3390/app15115879", label: "doi:10.3390/app15115879" },
    { t: "El Kharoua, R. Students Performance Dataset. Kaggle.", url: "https://www.kaggle.com/datasets/rabieelkharoua/students-performance-dataset", label: "kaggle.com/datasets/rabieelkharoua/students-performance-dataset" },
    { t: "Chen, T.; Guestrin, C. (2016). XGBoost: A Scalable Tree Boosting System. Proc. 22nd ACM SIGKDD (KDD '16).", url: "https://doi.org/10.1145/2939672.2939785", label: "doi:10.1145/2939672.2939785" },
    { t: "Pedregosa, F. et al. (2011). Scikit-learn: Machine Learning in Python. Journal of Machine Learning Research, 12, 2825–2830.", url: "https://jmlr.org/papers/v12/pedregosa11a.html", label: "jmlr.org/papers/v12/pedregosa11a.html" },
    { t: "Fortin, F.-A. et al. (2012). DEAP: Evolutionary Algorithms Made Easy. JMLR, 13, 2171–2175. (Library used by the base paper for its GA.)", url: "https://jmlr.org/papers/v13/fortin12a.html", label: "jmlr.org/papers/v13/fortin12a.html" }
  ],

  links: { github: "https://github.com/nandeshkanagaraju/student-success-ml", kaggle: "#" }   // TODO: replace kaggle "#" with your Kaggle notebook URL
};
