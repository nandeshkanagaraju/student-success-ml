# Predicting Student Success: Paper vs My Implementation

A single-page research showcase with an interactive browser-based product demo for the CSE425 project *Comparative Analysis of ML Algorithms with Hyperparameter Optimization for Predicting Student Academic Success* (K Nandesh, SASTRA). It reproduces Demirtürk & Harunoğlu (2025), *Applied Sciences* 15(11), 5879, <https://doi.org/10.3390/app15115879>.

No backend, no build step, no npm.

## Open it

Double-click `index.html`. It works from `file://`.

Chart.js (cdnjs, pinned to 4.4.1 with an SRI hash) and the Google Fonts load from the internet. Offline, the fonts fall back to system fonts and the chart shows a notice, but every number is still in the sortable table.

## Interactive demo for the panel

Open `index.html` and select **Try the demo**. No backend or installation is needed.

1. **Load example data**, or **Upload CSV** using the original Kaggle dataset.
2. Select KNN (5 neighbors, unscaled Euclidean distance) or the linear baseline, then **Train & evaluate**.
3. Set a hypothetical student profile and **Predict GPA**.
4. **Keep as baseline**, change absences or study time, and predict again to compare.
5. **Download prediction** exports inputs, source, estimate, baseline and test metrics as JSON.

Example data contains 320 invented rows generated deterministically for teaching. It is **not** the Kaggle dataset and its scores are not the study's results. Uploaded data stays in memory in the current tab; no student data is sent to a server. The original page still fetches fonts and Chart.js from their existing CDNs.

CSV requires all 12 feature columns from the notebook and `GPA`. `StudentID`, `GradeClass`, and extra columns are ignored. Accepted ranges match the project's dataset (age 15–18, absences 0–29, study hours 0–20, GPA 0–4); 30–5,000 rows, up to 2 MB. Missing, nonnumeric and out-of-range values are rejected.

The demo genuinely fits and evaluates models locally on a deterministic 80/20 split. Its seed-42 shuffle is not scikit-learn's implementation, so scores will differ from the notebook. The linear baseline uses a tiny 1e-6 regularizer for numerical stability. No saved SVR model, grid search, GA or CV is executed by the demo. Test metrics use raw predictions; displayed student GPA is clipped to 0–4. Scenario differences are associations learned by the model, not causal intervention effects.

Run the calculation and CSV validation checks with `node tests/demo-engine.test.js`.

## Deploy to GitHub Pages

1. Create a repo and push these files to the root: `index.html`, `style.css`, `script.js`, `data.js`, `assets/`, `demo-engine.js`, `demo.js`, `README.md`.
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Choose branch `main`, folder `/ (root)`, and save.
4. After about a minute the site is at `https://<user>.github.io/<repo>/`.

## Update numbers or text

Research numbers live in **`data.js`**; `script.js` renders them. Demo calculations live in `demo-engine.js`; `demo.js` manages the trial interface.

| What | Where in `data.js` |
|---|---|
| Test R², MSE, RMSE, MAE (paper and ours) and our 10-fold CV R² | `metrics` |
| Hyperparameters (Grid and GA, paper and ours) | `hyper` |
| Setup table in 8a | `setupRows` |
| "Things we noticed" list | `notices` |
| GitHub / Kaggle links | `links` (currently `"#"` placeholders) |

Section 8b statistics, the "best per case" cards and the hero numbers are recomputed in the browser. If they ever disagree with the `claimed` block in `data.js`, the browser console prints a warning.

## Provenance of the numbers

- **Paper**: read from the PDF, Tables 3 (default), 6 (GA) and 8 (Grid), rounded to 4 decimals.
- **Ours**: the project report, Tables 1–3, cross-checked against `notebook_with_outputs.ipynb`.
- The paper reports no cross-validation scores, so the CV column is ours only.
- The 8e explanations are labelled as hypotheses, not facts.

## Files

```
index.html   page structure and prose
style.css    design tokens, light/dark themes, layout
script.js    rendering, chart, tabs, tables, self-check
data.js      every number and piece of content
demo-engine.js  browser regression, CSV validation and held-out evaluation
demo.js      interactive training and prediction interface
tests/       dependency-free engine checks
assets/      figures extracted from the report (docx) and notebook outputs
```
