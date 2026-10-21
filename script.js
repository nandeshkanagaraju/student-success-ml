/* script.js — renders everything from data.js. No build step, no dependencies except Chart.js. */
(function () {
  "use strict";
  const D = window.DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const f4 = (v) => v.toFixed(4);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const caseLabel = (id) => D.cases.find((c) => c.id === id).label;
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------- derived numbers (recomputed, never typed) ---------- */
  const pairs = [];
  D.cases.forEach((c) => D.models.forEach((m) => {
    const p = D.metrics.paper[c.id][m].R2, o = D.metrics.ours[c.id][m].R2;
    pairs.push({ m, c: c.id, p, o, d: Math.round((o - p) * 1e4) / 1e4 });
  }));
  const status = (d) => { const a = Math.abs(d); return a <= 0.005 ? "ok" : a <= 0.016 ? "warn" : "bad"; };
  const sgn = (d, n = 4) => (d > 0 ? "+" : d < 0 ? "−" : "") + Math.abs(d).toFixed(n);
  const agree = (() => {
    const small = pairs.filter((x) => Math.abs(x.d) <= 0.016);
    const large = pairs.filter((x) => Math.abs(x.d) > 0.016);
    return {
      n: pairs.length, small, large,
      within016: small.length,
      mad: small.reduce((s, x) => s + Math.abs(x.d), 0) / small.length,
      madAll: pairs.reduce((s, x) => s + Math.abs(x.d), 0) / pairs.length,
      within005: pairs.filter((x) => Math.abs(x.d) <= 0.005).length,
      within0005: pairs.filter((x) => Math.abs(x.d) <= 0.0005).length,
      biggestSmall: small.slice().sort((a, b) => Math.abs(b.d) - Math.abs(a.d)).slice(0, 4)
    };
  })();
  const best = (src, caseId, key = "R2") => {
    const rows = D.models.map((m) => [m, D.metrics[src][caseId][m][key]]);
    return rows.reduce((a, b) => (key === "R2" || key === "CV" ? (b[1] > a[1] ? b : a) : (b[1] < a[1] ? b : a)));
  };

  // self-check against the figures quoted in the brief (console only)
  (function selfCheck() {
    const C = D.claimed, bad = [];
    if (agree.n !== C.pairs) bad.push("pairs");
    if (agree.within016 !== C.within016) bad.push("within016 " + agree.within016);
    if (+agree.mad.toFixed(4) !== C.madWithin016) bad.push("mad " + agree.mad.toFixed(4));
    if (agree.within005 !== C.within005) bad.push("within005 " + agree.within005);
    if (agree.within0005 !== C.within0005) bad.push("within0005 " + agree.within0005);
    const lg = agree.large.map((x) => x.m + "|" + x.c).sort().join();
    if (lg !== C.large.slice().sort().join()) bad.push("large " + lg);
    D.cases.forEach((c) => {
      const bp = D.bestPerCase[c.id];
      if (best("paper", c.id)[0] !== bp.paper.m) bad.push("best paper " + c.id);
      if (best("ours", c.id)[0] !== bp.ours.m) bad.push("best ours " + c.id);
      if (+best("ours", c.id)[1].toFixed(4) !== bp.ours.r2) bad.push("best ours r2 " + c.id);
    });
    if (bad.length) console.warn("[data check] mismatches vs data.js claims:", bad);
    else console.info("[data check] all summary statistics match the brief.");
  })();

  /* ---------- theme, progress, nav, reveal ---------- */
  const root = document.documentElement;
  const isDark = () => root.getAttribute("data-theme") === "dark" ||
    (!root.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  $("#themeBtn").addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next); store.set("theme", next);
    document.dispatchEvent(new Event("themechange"));
  });

  const bar = $("#progressBar");
  const navLinks = $$("#navList a");
  const secs = navLinks.map((a) => $(a.getAttribute("href")));
  let tops = [], lastCur = -2, ticking = false;
  const measure = () => { tops = secs.map((s) => (s ? s.offsetTop : Infinity)); };
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
      let cur = -1; tops.forEach((t, i) => { if (t <= y + 120) cur = i; });
      if (cur !== lastCur) {
        lastCur = cur;
        navLinks.forEach((a, i) => {
          if (i === cur) {
            a.setAttribute("aria-current", "true");
            const ul = a.closest("ul"); ul.scrollTo({ left: a.offsetLeft - ul.clientWidth / 2 + a.clientWidth / 2, behavior: reduceMotion ? "auto" : "smooth" });
          } else a.removeAttribute("aria-current");
        });
      }
      ticking = false;
    });
  };
  measure();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { measure(); onScroll(); });
  window.addEventListener("load", () => { measure(); onScroll(); });
  onScroll();

  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    $$(".reveal").forEach((el) => io.observe(el));
  } else $$(".reveal").forEach((el) => el.classList.add("in"));

  /* ---------- generic accessible tabs / radio groups ---------- */
  function tablist(list, onSelect) {
    const tabs = $$('[role="tab"]', list);
    const select = (t, focus) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; const p = x.getAttribute("aria-controls") && document.getElementById(x.getAttribute("aria-controls")); if (p) p.hidden = !on; });
      if (focus) t.focus(); onSelect && onSelect(t);
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        const k = e.key; let n = null;
        if (k === "ArrowRight" || k === "ArrowDown") n = tabs[(i + 1) % tabs.length];
        else if (k === "ArrowLeft" || k === "ArrowUp") n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (k === "Home") n = tabs[0]; else if (k === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    return select;
  }
  function radios(container, items, initial, onChange) {
    container.innerHTML = "";
    const btns = items.map(([val, label]) => {
      const b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "radio");
      b.textContent = label; b.dataset.v = val; container.appendChild(b); return b;
    });
    let cur = initial;
    const set = (v, focus) => {
      cur = v; btns.forEach((b) => { const on = b.dataset.v === v; b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
      onChange(v);
    };
    btns.forEach((b, i) => {
      b.addEventListener("click", () => set(b.dataset.v));
      b.addEventListener("keydown", (e) => {
        let n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = btns[(i + 1) % btns.length];
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = btns[(i - 1 + btns.length) % btns.length];
        if (n) { e.preventDefault(); set(n.dataset.v, true); }
      });
    });
    set(initial);
    return { set, get: () => cur };
  }

  /* ---------- hero, problem, dataset ---------- */
  (function hero() {
    const b = D.best, n = D.models.length * D.cases.length;
    const cards = [
      [D.dataset.students.toLocaleString("en-US"), "students in the dataset", ""],
      [D.models.length + " × " + D.cases.length + " = " + n, "models × tuning methods = " + n + " experiments", ""],
      [f4(b.r2), "best R² (" + b.model + ", " + caseLabel(b.case) + ")", "best"],
      ["≈ " + (Math.round(b.rmse * 10) / 10).toFixed(1), "GPA points typical error (RMSE " + f4(b.rmse) + ")", ""]
    ];
    $("#heroStats").innerHTML = cards.map(([n, l, cl]) => '<div class="stat ' + cl + '"><div class="n">' + esc(n) + '</div><div class="l">' + esc(l) + "</div></div>").join("");
    $("#featureChips").innerHTML = D.features.map((x) => "<li>" + x + "</li>").join("");
    const kv = [["Students", D.dataset.students.toLocaleString("en-US")], ["Columns", D.dataset.columns], ["GPA mean", D.dataset.gpaMean.toFixed(2)], ["GPA std", D.dataset.gpaStd.toFixed(2)], ["GPA range", "0 – 4"], ["Absences ↔ GPA", D.dataset.absencesCorr.toFixed(2).replace("-", "−")]];
    $("#dataKV").innerHTML = kv.map(([k, v]) => "<div><dt>" + k + "</dt><dd>" + v + "</dd></div>").join("");
  })();

  /* ---------- pipeline ---------- */
  (function pipeline() {
    const d = D.dataset;
    const steps = [
      ["Load the data", d.students.toLocaleString("en-US") + " students × " + d.columns + " columns", "Open the spreadsheet of past students.", "Kaggle Students Performance CSV. No missing values and no duplicate rows."],
      ["Drop StudentID & GradeClass", "leaves 12 inputs + GPA target", "Remove the ID (meaningless) and the letter grade (it gives away the answer).", "X = df.drop(['StudentID','GradeClass','GPA']); y = df['GPA']. Prevents data leakage."],
      ["Split 80 / 20", d.train.toLocaleString("en-US") + " train · " + d.test + " test · seed " + d.seed, "Lock away a fifth of the students as a final exam nobody studies from.", "train_test_split(test_size=0.20, random_state=42). No feature scaling (as in the paper)."],
      ["Train 10 models × 3 cases", "30 experiments", "Every model is trained three times: factory settings, Grid Search, Genetic Algorithm.", "KNN, SVR, DT, RF, AdaBoost, ETR, GBM, BR, HGBR, XGBoost × {Default, Grid, GA}."],
      ["Tune with cross-validation", "training data only", "Practice exams <em>inside</em> the training set choose the settings, so the final exam stays unseen.", "Both searches maximise mean CV R² on the training set (5-fold while searching, for speed)."],
      ["Evaluate on the test set", "17 metrics + 10-fold CV R²", "Grade every model on the hidden students, in 17 different ways.", "R², MAE, MSE, RMSE, MSLE, MaxEr, ExVar, MedAE, MARE, MSRE, RMSRE, RRMSE, MBE, eMAX, SD, t-stat, U95, plus 10-fold CV R² (our addition)."],
      ["Compare with the paper", "30 paired R² values", "Put our score next to the paper’s for every model and case.", "Δ = Ours − Paper; summarised in section 8b."]
    ];
    const svg = $("#pipeSvg"), NS = "http://www.w3.org/2000/svg", H = 64, GAP = 16, X0 = 44;
    const mk = (n, a, p) => { const e = document.createElementNS(NS, n); Object.entries(a || {}).forEach(([k, v]) => e.setAttribute(k, v)); (p || svg).appendChild(e); return e; };
    const cy = (i) => 10 + i * (H + GAP) + H / 2;
    mk("line", { class: "rail", x1: 20, x2: 20, y1: cy(0), y2: cy(6) });
    mk("line", { class: "flow", x1: 20, x2: 20, y1: cy(0), y2: cy(6) });
    const nodes = steps.map((s, i) => {
      const g = mk("g", { class: "node", role: "button", tabindex: 0, "aria-pressed": "false", "aria-label": "Step " + (i + 1) + ": " + s[0] });
      mk("rect", { x: X0, y: 10 + i * (H + GAP), width: 360 - X0 - 4, height: H, rx: 12 }, g);
      mk("circle", { class: "dot", cx: 20, cy: cy(i), r: 12 }, g);
      mk("text", { class: "num", x: 20, y: cy(i) + 4, "text-anchor": "middle" }, g).textContent = i + 1;
      mk("text", { class: "t1", x: X0 + 14, y: cy(i) - 4 }, g).textContent = s[0];
      mk("text", { class: "t2", x: X0 + 14, y: cy(i) + 15 }, g).textContent = s[1];
      g.addEventListener("click", () => { stop(); show(i); });
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); stop(); show(i); } });
      return g;
    });
    const token = mk("circle", { class: "token", cx: 20, cy: cy(0), r: 6 });
    const det = $("#pipeDetail"); let cur = 0, timer = null;
    function show(i) {
      cur = i; nodes.forEach((n, k) => { n.classList.toggle("on", k === i); n.setAttribute("aria-pressed", k === i); });
      token.setAttribute("cy", cy(i));
      det.innerHTML = '<span class="pill">Step ' + (i + 1) + " of " + steps.length + "</span><h3 style=\"margin-top:10px\">" + esc(steps[i][0]) + "</h3><p>" + steps[i][2] + '</p><div class="tech"><b>Technical detail</b>' + esc(steps[i][3]) + "</div>";
    }
    const btn = $("#pipePlay");
    function stop() { clearInterval(timer); timer = null; btn.setAttribute("aria-pressed", "false"); btn.textContent = "▶ Play walkthrough"; btn.classList.add("primary"); }
    function play() { btn.setAttribute("aria-pressed", "true"); btn.textContent = "❚❚ Pause"; show(0); timer = setInterval(() => { if (cur >= steps.length - 1) { stop(); return; } show(cur + 1); }, 2200); }
    btn.addEventListener("click", () => (timer ? stop() : play()));
    show(0);
  })();

  /* ---------- model cards ---------- */
  (function models() {
    const wrap = $("#modelGroups"), hp = (list, m) => list.find((x) => x.m === m);
    const row = (label, cls, txt) => "<dt>" + label + '</dt><dd class="' + cls + '">' + esc(txt) + "</dd>";
    const block = (title, list, m) => {
      const h = hp(list, m);
      return "<h4>" + title + "</h4><dl class=\"hp\">" + row("Ours", "ours", h.ours === "identical" ? "same as paper → " + h.paper : h.ours) + row("Paper", "", h.paper) + "</dl>";
    };
    D.modelGroups.forEach((g) => {
      const sec = document.createElement("div"); sec.className = "mgroup";
      sec.innerHTML = "<h3>" + g.title + " <small>" + g.blurb + '</small></h3><div class="mcards"></div>';
      g.models.forEach((m) => {
        const c = document.createElement("div"); c.className = "mcard"; const id = "mc-" + m;
        const r2 = (src) => D.cases.map((k) => D.metrics[src][k.id][m].R2.toFixed(3)).join(" / ");
        c.innerHTML = '<button type="button" aria-expanded="false" aria-controls="' + id + '"><span class="nm">' + D.modelNames[m] + '</span><span class="abbr">' + m + "</span><p>" + D.modelPlain[m] + '</p></button><div class="more" id="' + id + '" role="region" aria-label="' + D.modelNames[m] + ' details">' +
          '<h4>Test R² · Default / Grid / GA</h4><dl class="hp"><dt>Ours</dt><dd class="ours">' + r2("ours") + '</dd><dt>Paper</dt><dd>' + r2("paper") + "</dd></dl>" +
          block("Best Grid Search", D.hyper.grid, m) + block("Best Genetic Algorithm", D.hyper.ga, m) + "</div>";
        const b = $("button", c);
        b.addEventListener("click", () => { const o = c.classList.toggle("open"); b.setAttribute("aria-expanded", o); });
        $(".mcards", sec).appendChild(c);
      });
      wrap.appendChild(sec);
    });
  })();

  /* ---------- results explorer ---------- */
  const state = { case: "grid", src: "both", metric: "R2", zoom: false, sortKey: "model", sortDir: 1 };
  const METRICS = { R2: "R²", RMSE: "RMSE", MAE: "MAE", MSE: "MSE" };
  const lowerBetter = (k) => k !== "R2" && k !== "CV";
  let chart = null;
  const horizMQ = window.matchMedia("(max-width: 640px)");

  function pattern(color, bg) {
    const c = document.createElement("canvas"); c.width = c.height = 10; const x = c.getContext("2d");
    x.fillStyle = bg; x.fillRect(0, 0, 10, 10); x.strokeStyle = color; x.lineWidth = 2.4;
    x.beginPath(); x.moveTo(-1, 11); x.lineTo(11, -1); x.moveTo(-1, 6); x.lineTo(6, -1); x.moveTo(4, 11); x.lineTo(11, 4); x.stroke();
    return c;
  }

  const labelPlugin = {
    id: "valueLabels",
    afterDatasetsDraw(ch) {
      const { ctx, scales } = ch, horiz = ch.options.indexAxis === "y", vs = horiz ? scales.x : scales.y;
      const multi = ch.data.datasets.length > 1, dig = ch.options.plugins.valueLabels.digits;
      ctx.save(); ctx.font = '500 ' + (multi && !horiz ? 10 : 11) + 'px "IBM Plex Mono", monospace'; ctx.fillStyle = css("--ink");
      ch.data.datasets.forEach((ds, di) => ch.getDatasetMeta(di).data.forEach((el, i) => {
        const v = ds.data[i]; if (v == null) return;
        const clipped = ch.options.plugins.valueLabels.zoomR2 && v < vs.min;
        let t = v.toFixed(dig); if (ds.bestIdx === i) t = "★ " + t;
        if (horiz && multi) t = (ds.tag === "Paper" ? "P " : "O ") + t;
        if (clipped) { t = "◂ off-scale: " + v.toFixed(dig) + (multi ? " (" + ds.tag + ")" : ""); ctx.fillStyle = css("--muted"); } else ctx.fillStyle = ds.bestIdx === i ? css("--accent") : css("--ink");
        const pos = clipped ? vs.getPixelForValue(vs.min) : (horiz ? el.x : el.y);
        if (clipped && !horiz && !multi) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText("◂ off-scale", el.x, pos - 20); ctx.fillText(v.toFixed(dig), el.x, pos - 6); }
        else if (horiz) { ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(t, pos + 5, el.y); }
        else if (multi) { ctx.save(); ctx.translate(el.x, pos - 5); ctx.rotate(-Math.PI / 2); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(t, 0, 0); ctx.restore(); }
        else { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(t, el.x, pos - 5); }
      }));
      ctx.restore();
    }
  };

  function drawChart() {
    const canvas = $("#mainChart");
    if (typeof Chart === "undefined") { $("#noChart").classList.add("show"); canvas.closest(".h").style.display = "none"; return; }
    const horiz = horizMQ.matches, m = state.metric, zoomOn = state.zoom && m === "R2";
    const colP = css("--paper"), colO = css("--ours"), colA = css("--accent"), surf = css("--surface");
    const srcs = state.src === "both" ? ["paper", "ours"] : [state.src];
    const sets = srcs.map((s) => {
      const vals = D.models.map((k) => D.metrics[s][state.case][k][m]);
      const bi = vals.indexOf(lowerBetter(m) ? Math.min(...vals) : Math.max(...vals));
      const base = s === "paper" ? colP : colO;
      const fill = (c) => (s === "paper" ? ctxPattern(c) : c);
      const ctxPattern = (c) => canvas.getContext("2d").createPattern(pattern(c, surf), "repeat");
      return {
        label: s === "paper" ? "Paper" : "Ours", tag: s === "paper" ? "Paper" : "Ours", data: vals, bestIdx: bi,
        backgroundColor: vals.map((_, i) => fill(i === bi ? colA : base)),
        borderColor: vals.map((_, i) => (i === bi ? colA : base)), borderWidth: 1.5, borderSkipped: false, borderRadius: 3,
        categoryPercentage: 0.82, barPercentage: 0.92
      };
    });
    const dig = m === "R2" ? 4 : 4, vAxis = { beginAtZero: !zoomOn, grid: { color: css("--line") }, ticks: { color: css("--muted"), font: { family: "IBM Plex Mono", size: 11 } }, title: { display: true, text: METRICS[m] + (lowerBetter(m) ? "  (lower is better)" : "  (higher is better)"), color: css("--muted") } };
    if (m === "R2") { vAxis.min = zoomOn ? 0.85 : 0; vAxis.max = zoomOn ? 0.96 : 1; if (zoomOn) vAxis.ticks.stepSize = 0.02; }
    const cAxis = { grid: { display: false }, ticks: { color: css("--ink"), font: { family: "IBM Plex Sans", size: 12, weight: 500 } } };
    if (chart) chart.destroy();
    chart = new Chart(canvas, {
      type: "bar", data: { labels: D.models, datasets: sets },
      options: {
        indexAxis: horiz ? "y" : "x", responsive: true, maintainAspectRatio: false, animation: reduceMotion ? false : { duration: 500 },
        layout: { padding: horiz ? { right: 96 } : { top: srcs.length > 1 ? 74 : 26 } },
        scales: horiz ? { x: vAxis, y: cAxis } : { x: cAxis, y: vAxis },
        plugins: {
          legend: { display: false },
          title: { display: true, text: METRICS[m] + " on the test set · " + caseLabel(state.case), color: css("--ink"), font: { family: "Fraunces", size: 15, weight: 600 }, padding: { bottom: 8 } },
          valueLabels: { digits: dig, zoomR2: zoomOn },
          tooltip: { callbacks: { title: (it) => D.modelNames[D.models[it[0].dataIndex]], label: (c) => c.dataset.label + ": " + c.parsed[horiz ? "x" : "y"].toFixed(4) + (c.dataset.bestIdx === c.dataIndex ? "  ★ best" : "") } }
        }
      },
      plugins: [labelPlugin]
    });
    // description for assistive tech + legend + clipped note
    const bits = sets.map((s) => s.label + " best: " + D.models[s.bestIdx] + " " + s.data[s.bestIdx].toFixed(4));
    canvas.setAttribute("aria-label", "Grouped bar chart of " + METRICS[m] + " for the ten models, " + caseLabel(state.case) + ". " + bits.join("; ") + ". The same data is in the table below.");
    $("#legend").innerHTML = (srcs.includes("paper") ? '<span><i class="sw paper"></i>Paper (hatched)</span>' : "") + (srcs.includes("ours") ? '<span><i class="sw ours"></i>Ours (solid)</span>' : "") + '<span><i class="sw best"></i>★ best in series</span>';
    const clipped = [];
    if (zoomOn) sets.forEach((s) => s.data.forEach((v, i) => { if (v < 0.85) clipped.push(s.label + " " + D.models[i] + " " + v.toFixed(4)); }));
    $("#chartNote").textContent = zoomOn ? (clipped.length ? "Axis zoomed to 0.85–0.96. Clipped, off-scale values: " + clipped.join(", ") + "." : "Axis zoomed to 0.85–0.96. No bars are clipped in this view.") : (m === "R2" ? "Tip: the paper’s collapsed Bagging and HGBR values squash the axis. Turn on “Zoom R² axis” to compare the rest." : "");
  }

  /* sortable table */
  function colsFor() {
    const showP = state.src !== "ours", showO = state.src !== "paper", c = [{ k: "model", l: "Model", num: false }];
    ["R2", "RMSE", "MAE"].forEach((m) => { if (showP) c.push({ k: m + "|paper", l: METRICS[m] + " (Paper)", cls: "srcP", m, s: "paper" }); if (showO) c.push({ k: m + "|ours", l: METRICS[m] + " (Ours)", cls: "srcO", m, s: "ours" }); });
    if (showO) c.push({ k: "CV|ours", l: "10-fold CV R² (Ours)", cls: "srcO", m: "CV", s: "ours" });
    return c;
  }
  function drawTable() {
    const cols = colsFor(), cs = state.case;
    if (!cols.some((c) => c.k === state.sortKey)) { state.sortKey = "model"; state.sortDir = 1; }
    const val = (m, c) => D.metrics[c.s][cs][m][c.m];
    let rows = D.models.slice();
    if (state.sortKey !== "model") { const c = cols.find((x) => x.k === state.sortKey); rows.sort((a, b) => (val(a, c) - val(b, c)) * state.sortDir); }
    else if (state.sortDir < 0) rows.reverse();
    $("#resCaption").textContent = caseLabel(cs) + " · test-set results for ten models (click a column header to sort). " + (state.src === "both" ? "Paper columns in blue-grey, ours in teal." : "");
    const bestOf = {}; cols.forEach((c) => { if (c.s) { const v = D.models.map((m) => val(m, c)); bestOf[c.k] = lowerBetter(c.m) ? Math.min(...v) : Math.max(...v); } });
    $("#resTable thead").innerHTML = "<tr>" + cols.map((c) => {
      const sorted = c.k === state.sortKey ? (state.sortDir > 0 ? "ascending" : "descending") : "none";
      return '<th scope="col" class="' + (c.s ? "num " + c.cls : "") + '" aria-sort="' + sorted + '"><button type="button" data-k="' + c.k + '">' + c.l + "</button></th>";
    }).join("") + "</tr>";
    $("#resTable tbody").innerHTML = rows.map((m) => "<tr><th scope=\"row\" title=\"" + D.modelNames[m] + "\">" + m + "</th>" + cols.slice(1).map((c) => {
      const v = val(m, c), isBest = v === bestOf[c.k], collapsed = c.s === "paper" && c.m === "R2" && v < 0.8;
      return '<td class="num' + (isBest ? " best" : "") + (collapsed ? " clip" : "") + '"' + (collapsed ? ' title="Paper result collapsed (see 8e)"' : "") + ">" + f4(v) + (collapsed ? '<span aria-hidden="true"> ⚠</span><span class="sr-only"> (collapsed result)</span>' : "") + "</td>";
    }).join("") + "</tr>").join("");
    $$("#resTable th button").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.k;
      if (state.sortKey === k) state.sortDir *= -1; else { state.sortKey = k; const c = cols.find((x) => x.k === k); state.sortDir = k === "model" ? 1 : (lowerBetter(c.m) ? 1 : -1); }
      drawTable();
      const nb = $('#resTable th button[data-k="' + k + '"]'); if (nb) nb.focus();
    }));
  }

  function refresh() { drawChart(); drawTable(); $("#zoom").disabled = state.metric !== "R2"; }
  radios($("#segCase"), D.cases.map((c) => [c.id, c.label]), state.case, (v) => { state.case = v; chart && refresh(); });
  radios($("#segSrc"), [["paper", "Paper"], ["ours", "Ours"], ["both", "Both side by side"]], state.src, (v) => { state.src = v; chart && refresh(); });
  radios($("#segMet"), Object.entries(METRICS), state.metric, (v) => { state.metric = v; chart && refresh(); });
  $("#zoom").addEventListener("change", (e) => { state.zoom = e.target.checked; refresh(); });
  horizMQ.addEventListener("change", () => refresh());
  document.addEventListener("themechange", () => refresh());
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => refresh());
  refresh();
  if (typeof Chart === "undefined") window.addEventListener("load", () => { if (typeof Chart !== "undefined") { $("#noChart").classList.remove("show"); $("#mainChart").closest(".h").style.display = ""; refresh(); } });

  /* ---------- section 8 ---------- */
  tablist($("#cmpTabs"));

  // 8a
  $("#setupTable tbody").innerHTML = D.setupRows.map((r) => "<tr><th scope=\"row\">" + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td><td>" + esc(r[2]) + "</td></tr>").join("");

  // 8b
  (function () {
    const A = agree, fmtL = A.large.map((x) => x.m + " " + (x.c === "ga" ? "GA" : caseLabel(x.c).split(" ")[0]) + " " + sgn(x.d, 3));
    $("#agreeStats").innerHTML = [
      [A.within016 + " / " + A.n, "pairs agree within 0.016 R²"],
      [A.mad.toFixed(4), "mean absolute difference over those " + A.within016 + " pairs (all " + A.n + " pairs: " + A.madAll.toFixed(3) + ")"],
      [A.within005 + " / " + A.n, "within 0.005 · " + A.within0005 + " pairs within 0.0005"],
      [String(A.large.length), "large gaps, all in the paper’s collapsed cases: " + fmtL.join(", ")]
    ].map(([n, l]) => '<div class="card"><div class="n">' + n + '</div><div class="l">' + esc(l) + "</div></div>").join("");
    const lab = { ok: "≈ equal", warn: "small", bad: "large" };
    $("#heatStrip").innerHTML = '<span></span>' + D.cases.map((c) => '<span class="h">' + (c.id === "ga" ? "GA" : c.label.split(" ")[0]) + "</span>").join("") +
      D.models.map((m) => '<span class="rl">' + m + "</span>" + D.cases.map((c) => { const x = pairs.find((p) => p.m === m && p.c === c.id); return '<span class="c ' + status(x.d) + '" title="' + m + ", " + c.label + ": " + sgn(x.d) + " (" + lab[status(x.d)] + ')">' + (Math.abs(x.d) < 0.0005 ? "≈ 0" : sgn(x.d, 3)) + "</span>"; }).join("")).join("");
    let sorted = false;
    const draw = () => {
      const rows = sorted ? pairs.slice().sort((a, b) => Math.abs(b.d) - Math.abs(a.d)) : pairs;
      $("#deltaTable tbody").innerHTML = rows.map((x) => { const s = status(x.d); return "<tr><th scope=\"row\">" + x.m + "</th><td>" + caseLabel(x.c) + '</td><td class="num">' + f4(x.p) + '</td><td class="num">' + f4(x.o) + '</td><td class="num">' + sgn(x.d) + '</td><td><span class="d-' + s + '">' + (s === "ok" ? "● " : s === "warn" ? "▲ " : "■ ") + lab[s] + "</span></td></tr>"; }).join("");
    };
    $("#sortDelta").addEventListener("click", (e) => { sorted = !sorted; e.currentTarget.setAttribute("aria-pressed", sorted); draw(); });
    draw();
    $("#agreeNote").textContent = "Biggest remaining small gaps: " + A.biggestSmall.map((x) => x.m + " " + (x.c === "default" ? "Default" : x.c === "ga" ? "GA" : "Grid") + " " + sgn(x.d)).join(" · ") + ". Paper values are from the PDF tables (rounded to 4 decimals); AdaBoost GA paper = 0.9289 per the PDF.";
  })();

  // 8c
  (function () {
    $("#bestGrid").innerHTML = D.cases.map((c) => {
      const b = D.bestPerCase[c.id], pp = best("paper", c.id), oo = best("ours", c.id);
      return '<article class="card bestcase"><h4>' + c.label + '</h4><div class="row"><span class="srcP">Paper</span><b>' + pp[0] + '</b><span class="v">' + f4(pp[1]) + '</span></div><div class="row"><span class="srcO">Ours</span><b>' + oo[0] + '</b><span class="v" style="color:var(--accent)">★ ' + f4(oo[1]) + "</span></div>" +
        '<p class="verdict"><span class="' + (b.agree ? "d-ok" : "d-warn") + '">' + (b.agree ? "● agree" : "▲ differs") + "</span> " + (b.paper.note ? "Paper: " + esc(b.paper.note) + ". " : "") + esc(b.note || "") + "</p></article>";
    }).join("");
    $("#svrRmse tbody").innerHTML = D.cases.map((c) => "<tr><th scope=\"row\">" + c.label + '</th><td class="num">' + f4(D.metrics.paper[c.id].SVR.RMSE) + '</td><td class="num">' + f4(D.metrics.ours[c.id].SVR.RMSE) + "</td></tr>").join("");
  })();

  // 8d
  (function () {
    const labels = { same: "Identical", near: "Near-identical", part: "Partly same", key: "Key difference ⚑", diff: "Different" };
    const caps = { grid: "Grid Search: paper Table 7 vs ours", ga: "Genetic Algorithm: paper Table 5 vs ours" };
    const notes = {
      grid: "<strong>Identical Grid Search optima for DT, RF and HGBR, and near-identical for GBM and XGBoost, suggest the reproduction followed the paper’s search design closely.</strong> ⚑ BR: the only change is <code>max_features</code> 1 (integer) vs 1.0 (decimal), the likely cause of the paper’s collapse (see 8e).",
      ga: "A GA is a random search and ours had a smaller budget (see 8a), so different optima are expected. Several GA settings also sit outside or between the paper’s own stated grids (see “Things we noticed” below). ⚑ BR again differs in <code>max_features</code> (1 vs 1.0)."
    };
    const draw = (k) => {
      $("#hyperCap").textContent = caps[k];
      $("#hyperTable tbody").innerHTML = D.hyper[k].map((h) => {
        const pt = h.paper.split(/,\s*/), set = new Set(pt);
        const ours = h.ours === "identical" ? '<span class="muted">identical to paper</span>' : h.ours.split(/,\s*/).map((t) => (set.has(t) ? esc(t) : "<b>" + esc(t) + "</b>")).join(", ");
        return "<tr><th scope=\"row\">" + h.m + '</th><td class="mono">' + esc(h.paper) + '</td><td class="mono">' + ours + '</td><td><span class="st-' + h.status + '">' + labels[h.status] + "</span></td></tr>";
      }).join("");
      $("#hyperNote").innerHTML = notes[k];
    };
    radios($("#segHyper"), [["grid", "Grid Search"], ["ga", "Genetic Algorithm"]], "grid", draw);
  })();

  // 8g
  $("#contribGrid").innerHTML = D.contributions.map((c) => '<article class="card contrib"><h4>' + esc(c.t) + "</h4><p style=\"margin:0\">" + esc(c.d) + "</p>" + (c.fig ? '<figure class="fig"><span class="imgbox"><img src="assets/' + c.fig + '" loading="lazy" alt="' + esc(c.alt) + '"></span></figure>' : "") + "</article>").join("");

  // 8h
  $("#noticeList").innerHTML = D.notices.map((n) => "<li>" + esc(n) + "</li>").join("");

  /* ---------- findings, refs ---------- */
  (function () {
    const g = (c) => best("ours", c)[1].toFixed(4);
    const F = [
      ["SVR is best in all three cases", "R² " + g("default") + " / " + g("grid") + " / " + g("ga") + " (Default / Grid / GA); lowest error too.", true],
      ["GBM, XGBoost and HGBR close behind", "All land around 0.94–0.95, which agrees with the paper.", false],
      ["Tuning helps weak models most", "DT +0.025–0.029, KNN +0.014, AdaBoost +0.012, XGBoost +0.013 (Grid). Strong models barely move.", false],
      ["GA doesn’t always beat Grid Search", "With our smaller budget the GA trailed Grid for GBM, HGBR and XGBoost.", false],
      ["The paper’s Bagging collapse didn’t reproduce", "We got ≈ 0.93 instead of ≈ 0.14 / 0.11; likely the max_features 1 vs 1.0 detail.", false],
      ["Absences dominates", "Correlation −0.92 with GPA and importance ≈ 0.54 in the tuned GBM.", false],
      ["A straight line matches the best tuned model", "Linear/Ridge/Lasso: R² " + f4(D.linearBaseline.r2) + " vs best tuned " + f4(D.best.r2) + ".", false]
    ];
    $("#findGrid").innerHTML = F.map((x, i) => '<article class="card finding' + (x[2] ? " key" : "") + '"><span class="no">0' + (i + 1) + "</span><h3>" + esc(x[0]) + "</h3><p>" + esc(x[1]) + "</p></article>").join("");
    $("#refList").innerHTML = D.references.map((r) => "<li>" + esc(r.t) + ' <a href="' + r.url + '" target="_blank" rel="noopener">' + esc(r.label) + "</a></li>").join("");
    [["#ghLink", D.links.github, "GitHub repository ↗"], ["#kgLink", D.links.kaggle, "Kaggle notebook ↗"]].forEach(([sel, u, label]) => {
      const a = $(sel);
      if (u && u !== "#") { a.href = u; a.target = "_blank"; a.textContent = label; a.removeAttribute("aria-disabled"); }
      else { a.setAttribute("aria-disabled", "true"); a.removeAttribute("href"); a.setAttribute("role", "link"); a.tabIndex = -1; }
    });
  })();
})();
