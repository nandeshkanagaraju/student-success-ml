# Predicting Student Success: Paper vs My Implementation

A single-page, fully static showcase for the CSE425 project *Comparative Analysis of ML Algorithms with Hyperparameter Optimization for Predicting Student Academic Success* (K Nandesh, SASTRA). It reproduces Demirtürk & Harunoğlu (2025), *Applied Sciences* 15(11), 5879, <https://doi.org/10.3390/app15115879>.

No backend, no build step, no npm.

## Open it

Double-click `index.html`. It works from `file://`.

Chart.js (cdnjs, pinned to 4.4.1 with an SRI hash) and the Google Fonts load from the internet. Offline, the fonts fall back to system fonts and the chart shows a notice, but every number is still in the sortable table.

## Deploy to GitHub Pages

1. Create a repo and push these files to the root: `index.html`, `style.css`, `script.js`, `data.js`, `assets/`, `README.md`.
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Choose branch `main`, folder `/ (root)`, and save.
4. After about a minute the site is at `https://<user>.github.io/<repo>/`.

## Update numbers or text

Everything lives in **`data.js`**; `script.js` only renders it.

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
assets/      figures extracted from the report (docx) and notebook outputs
```
