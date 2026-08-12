// ============================================================
// Error isolation: every section renders inside safe(), so one
// broken chart (e.g. a CDN that failed to load) can never blank
// out the rest of the dashboard the way it did before.
// ============================================================
function safe(label, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[dashboard] "${label}" failed to render:`, err);
    const target = document.querySelector(`[data-section="${label}"]`) || document.getElementById(label);
    if (target) {
      target.innerHTML = `<p class="render-error">This section couldn't render (${err.message}). Everything else on the page is unaffected — check the browser console for details.</p>`;
    }
  }
}

const MATURITY_LEVEL_HEX = { "Best Practice": "#3E7C59", "Advanced": "#C98A2D", "Developing": "#B54A2A", "Emerging": "#7A1F2B" };
function severityColor(level) {
  return { "Best Practice": "var(--ok)", "Advanced": "var(--warn)", "Developing": "var(--high)", "Emerging": "var(--crit)" }[level] || "var(--warn)";
}

// ============================================================
// Modal (defined early — many sections open it)
// ============================================================
const modalBackdrop = document.getElementById("modal-backdrop");
const modalContent = document.getElementById("modal-content");

function renderModal(html) {
  modalContent.innerHTML = `<button class="modal-close" id="modal-close" aria-label="Close">&times;</button>` + html;
  modalBackdrop.classList.add("open");
  document.getElementById("modal-close").addEventListener("click", closeModal);
}
function closeModal() { modalBackdrop.classList.remove("open"); }
modalBackdrop.addEventListener("click", e => { if (e.target === modalBackdrop) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

function openCompanyModal(company) {
  const f = company.financials;
  const financialsHtml = f.disclosed ? `
    <div class="modal-financials">
      <div class="mf-item"><label>Revenue</label><span>${f.revenue}</span></div>
      <div class="mf-item"><label>Profitability</label><span>${f.profitability}</span></div>
      <div class="mf-item"><label>Leverage / Liquidity</label><span>${f.leverage}</span></div>
      <div class="mf-item"><label>Distributions</label><span>${f.dividends}</span></div>
    </div>` : `<p class="na">Publicly available financial data is limited — this company is privately held.</p>`;

  renderModal(`
    <h3>${company.name}</h3>
    <p class="modal-tagline">${company.tagline} · ${company.country}</p>
    <div class="modal-section"><label>Ownership</label><p>${company.ownership}</p></div>
    <div class="modal-section"><label>Financial issue</label><p>${company.issue}</p></div>
    <div class="modal-section"><label>Governance mechanism</label><p>${company.mechanism}</p></div>
    <div class="modal-section"><label>Financial implication</label><p>${company.implication}</p></div>
    <div class="modal-section"><label>Contribution to the study</label><p>${company.contribution}</p></div>
    <div class="modal-section"><label>Governance maturity</label><p><span class="level-pill" style="background:${severityColor(company.maturity.level)}">${company.maturity.level}</span> &nbsp; ${company.maturity.score}/30 — ${company.maturity.note}</p></div>
    <div class="modal-section"><label>FY2024 financials</label>${financialsHtml}</div>
  `);
}

function openHeatCellModal(company, area, severity) {
  renderModal(`
    <h3>${company.name} — ${area.label}</h3>
    <p class="modal-tagline">Rated <span class="level-pill" style="background:${SEVERITY_COLOR[severity]}">${severity}</span></p>
    <div class="modal-section"><label>Financial issue</label><p>${company.issue}</p></div>
    <div class="modal-section"><label>Governance mechanism</label><p>${company.mechanism}</p></div>
    <div class="modal-section"><label>Financial implication</label><p>${company.implication}</p></div>
    <p class="footnote" style="margin-top:14px;">Rating is the researcher's qualitative assessment (Table 4.3), anchored in the documented evidence above.</p>
  `);
}

function openSeverityModal(severity) {
  const rows = [];
  COMPANIES.forEach(c => CONFLICT_AREAS.forEach(a => {
    if (c.heat[a.key] === severity) rows.push(`<li><strong>${c.name}</strong> — ${a.label}</li>`);
  }));
  renderModal(`
    <h3>${severity} conflict ratings</h3>
    <p class="modal-tagline">${rows.length} of 48 total ratings across the 8 cases</p>
    <div class="modal-section"><ul class="modal-list">${rows.join("")}</ul></div>
  `);
}

function openCountryModal(row) {
  const gdp = COUNTRY_GDP.find(g => g.country === row.country);
  renderModal(`
    <h3>${row.country}</h3>
    <p class="modal-tagline">${row.region} · avg. governance maturity ${row.avgMaturity}/30</p>
    <div class="modal-financials">
      <div class="mf-item"><label>Nominal GDP (2026)</label><span>$${gdp ? gdp.gdpUsdTn : "—"} trillion</span></div>
      <div class="mf-item"><label>Case(s) in this study</label><span>${row.companies.join(", ")}</span></div>
    </div>
    <p class="footnote" style="margin-top:14px;">GDP: IMF World Economic Outlook, April 2026 vintage.</p>
  `);
}

// ============================================================
// Tab navigation (scroll-spy + click)
// ============================================================
safe("nav", () => {
  const tabs = document.querySelectorAll(".tab");
  const sections = [...tabs].map(t => document.getElementById(t.dataset.target)).filter(Boolean);
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const el = document.getElementById(tab.dataset.target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  });
  const spy = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) tabs.forEach(t => t.classList.toggle("active", t.dataset.target === entry.target.id));
    }),
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach(s => spy.observe(s));
});

// ============================================================
// Plotly theme helpers
// ============================================================
const FONT = { family: "Inter, sans-serif", color: "#221F1A", size: 12 };
const basePlotlyLayout = { paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)", font: FONT, margin: { l: 10, r: 10, t: 10, b: 30 }, showlegend: false };
const plotlyConfig = { displayModeBar: false, responsive: true };
function requirePlotly() { if (typeof Plotly === "undefined") throw new Error("Plotly failed to load from CDN"); }

// ============================================================
// KPI row
// ============================================================
safe("kpi-row", () => {
  const kpiRow = document.getElementById("kpi-row");
  const totals = {};
  CONFLICT_AREAS.forEach(a => totals[a.key] = 0);
  COMPANIES.forEach(c => CONFLICT_AREAS.forEach(a => totals[a.key] += SEVERITY_WEIGHT[c.heat[a.key]]));
  const topKey = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
  const highestConflictArea = CONFLICT_AREAS.find(a => a.key === topKey).label;

  kpiRow.innerHTML = `
    <div class="kpi-card"><div class="kpi-value">8</div><div class="kpi-label">Family enterprises studied</div></div>
    <div class="kpi-card"><div class="kpi-value">${(COMPANIES.reduce((s, c) => s + c.maturity.score, 0) / COMPANIES.length).toFixed(1)}/30</div><div class="kpi-label">Average governance maturity</div></div>
    <div class="kpi-card"><div class="kpi-value">${MATURITY_TALLY["Best Practice"]}/8</div><div class="kpi-label">Cases rated Best Practice</div></div>
    <div class="kpi-card"><div class="kpi-value">${highestConflictArea}</div><div class="kpi-label">Highest-exposure conflict area</div></div>
    <div class="kpi-card"><div class="kpi-value">r = ${MATURITY_CONFLICT_R.toFixed(2)}</div><div class="kpi-label">Maturity ↔ conflict-exposure correlation</div></div>
  `;
});

// ============================================================
// World map
// ============================================================
safe("chart-map", () => {
  requirePlotly();
  const el = document.getElementById("chart-map");
  Plotly.newPlot(el, [{
    type: "choropleth",
    locationmode: "country names",
    locations: COUNTRY_ROLLUP.map(c => c.country),
    z: COUNTRY_ROLLUP.map(c => c.avgMaturity),
    customdata: COUNTRY_ROLLUP.map(c => [c.companies.join(", "), c.gdpUsdTn, c.region]),
    text: COUNTRY_ROLLUP.map(c => c.country),
    hovertemplate: "<b>%{text}</b><br>Case(s): %{customdata[0]}<br>Avg. maturity: %{z}/30<br>GDP (2026): $%{customdata[1]}tn<extra></extra>",
    colorscale: [[0, "#EEE9DB"], [0.5, "#C98A2D"], [1, "#1B2A4A"]],
    zmin: 0, zmax: 30,
    marker: { line: { color: "#F5F2E9", width: 1.2 } },
    colorbar: { thickness: 12, len: 0.7, tickfont: { family: "IBM Plex Mono", size: 10 }, title: { text: "Maturity", font: { size: 10 } } },
  }], {
    ...basePlotlyLayout,
    margin: { l: 0, r: 0, t: 0, b: 0 },
    geo: {
      showframe: false, showcoastlines: false, projection: { type: "natural earth" },
      bgcolor: "rgba(0,0,0,0)", landcolor: "#EEE9DB", showcountries: true, countrycolor: "#DBD4C0",
      lataxis: { range: [10, 65] }, lonaxis: { range: [-20, 65] },
    },
  }, plotlyConfig);
  el.on("plotly_click", data => {
    const idx = data.points[0].pointIndex;
    openCountryModal(COUNTRY_ROLLUP[idx]);
  });
});

// ============================================================
// Region / maturity / severity pies
// ============================================================
safe("chart-region", () => {
  requirePlotly();
  const el = document.getElementById("chart-region");
  Plotly.newPlot(el, [{
    type: "pie", labels: ["Europe", "UAE"], values: [REGION_TALLY.Europe, REGION_TALLY.UAE],
    marker: { colors: ["#2f5d4f", "#a9642c"] }, hole: 0.55,
    textinfo: "label+value", textfont: { family: "Inter", size: 12, color: "#fff" }, hoverinfo: "label+percent",
  }], { ...basePlotlyLayout, margin: { l: 10, r: 10, t: 10, b: 10 } }, plotlyConfig);
  el.on("plotly_click", data => {
    const region = data.points[0].label;
    const names = COMPANIES.filter(c => c.region === region).map(c => c.name).join(", ");
    renderModal(`<h3>${region} cases</h3><p class="modal-tagline">${data.points[0].value} of 8 companies</p><div class="modal-section"><p>${names}</p></div>`);
  });
});

safe("chart-maturity-pie", () => {
  requirePlotly();
  const el = document.getElementById("chart-maturity-pie");
  const levels = Object.keys(MATURITY_TALLY).filter(k => MATURITY_TALLY[k] > 0);
  Plotly.newPlot(el, [{
    type: "pie", labels: levels, values: levels.map(k => MATURITY_TALLY[k]),
    marker: { colors: levels.map(k => MATURITY_LEVEL_HEX[k]) }, hole: 0.55,
    textinfo: "label+value", textfont: { family: "Inter", size: 11.5, color: "#fff" }, hoverinfo: "label+percent",
  }], { ...basePlotlyLayout, margin: { l: 10, r: 10, t: 10, b: 10 } }, plotlyConfig);
  el.on("plotly_click", data => {
    const level = data.points[0].label;
    const names = COMPANIES.filter(c => c.maturity.level === level).map(c => c.name).join(", ");
    renderModal(`<h3>${level}</h3><p class="modal-tagline">${data.points[0].value} of 8 companies</p><div class="modal-section"><p>${names}</p></div>`);
  });
});

safe("chart-severity-pie", () => {
  requirePlotly();
  const el = document.getElementById("chart-severity-pie");
  Plotly.newPlot(el, [{
    type: "pie", labels: Object.keys(SEVERITY_TALLY), values: Object.values(SEVERITY_TALLY),
    marker: { colors: Object.keys(SEVERITY_TALLY).map(k => SEVERITY_COLOR[k]) }, hole: 0.55,
    textinfo: "value", textfont: { family: "IBM Plex Mono", size: 12, color: "#fff" }, hoverinfo: "label+percent+value",
  }], { ...basePlotlyLayout, margin: { l: 10, r: 10, t: 10, b: 10 } }, plotlyConfig);
  el.on("plotly_click", data => openSeverityModal(data.points[0].label));
});

// ============================================================
// Revenue / margin / ownership / maturity bars
// ============================================================
safe("chart-revenue", () => {
  requirePlotly();
  const el = document.getElementById("chart-revenue");
  Plotly.newPlot(el, [{
    type: "bar", x: REVENUE_DATA.map(d => d.name), y: REVENUE_DATA.map(d => d.value),
    marker: { color: "#1B2A4A" }, text: REVENUE_DATA.map(d => `€${d.value}bn`), textposition: "outside",
    textfont: { family: "IBM Plex Mono", size: 10.5 }, hoverinfo: "x+text",
  }], { ...basePlotlyLayout, margin: { l: 34, r: 10, t: 20, b: 60 }, xaxis: { tickfont: { size: 10.5 }, tickangle: -20 }, yaxis: { title: { text: "€ billion", font: { size: 10.5 } }, gridcolor: "#E7E1D2" } }, plotlyConfig);
  el.on("plotly_click", data => {
    const c = COMPANIES.find(c => c.name === data.points[0].x);
    if (c) openCompanyModal(c);
  });
});

safe("chart-margin", () => {
  requirePlotly();
  const el = document.getElementById("chart-margin");
  Plotly.newPlot(el, [{
    type: "bar", x: MARGIN_DATA.map(d => d.name), y: MARGIN_DATA.map(d => d.value),
    marker: { color: "#B08A3E" }, text: MARGIN_DATA.map(d => `${d.value}%`), textposition: "outside",
    textfont: { family: "IBM Plex Mono", size: 10.5 }, customdata: MARGIN_DATA.map(d => d.basis),
    hovertemplate: "%{x}: %{y}%<br>%{customdata}<extra></extra>",
  }], { ...basePlotlyLayout, margin: { l: 34, r: 10, t: 20, b: 60 }, xaxis: { tickfont: { size: 10.5 }, tickangle: -20 }, yaxis: { title: { text: "% margin", font: { size: 10.5 } }, gridcolor: "#E7E1D2" } }, plotlyConfig);
  el.on("plotly_click", data => {
    const c = COMPANIES.find(c => c.name === data.points[0].x);
    if (c) openCompanyModal(c);
  });
});

safe("chart-ownership", () => {
  requirePlotly();
  const el = document.getElementById("chart-ownership");
  Plotly.newPlot(el, [
    { type: "bar", name: "Capital", x: OWNERSHIP_DATA.map(d => d.name), y: OWNERSHIP_DATA.map(d => d.capital), marker: { color: "#1B2A4A" } },
    { type: "bar", name: "Voting rights", x: OWNERSHIP_DATA.map(d => d.name), y: OWNERSHIP_DATA.map(d => d.voting), marker: { color: "#B08A3E" } },
  ], { ...basePlotlyLayout, barmode: "group", showlegend: true, legend: { orientation: "h", y: -0.25, font: { size: 10.5 } }, margin: { l: 34, r: 10, t: 10, b: 60 }, xaxis: { tickfont: { size: 10.5 }, tickangle: -20 }, yaxis: { title: { text: "% held by family", font: { size: 10.5 } }, gridcolor: "#E7E1D2", range: [0, 105] } }, plotlyConfig);
});

safe("chart-maturity-bar", () => {
  requirePlotly();
  const el = document.getElementById("chart-maturity-bar");
  const sorted = [...COMPANIES].sort((a, b) => b.maturity.score - a.maturity.score);
  Plotly.newPlot(el, [{
    type: "bar", x: sorted.map(c => c.name), y: sorted.map(c => c.maturity.score),
    marker: { color: sorted.map(c => SEVERITY_COLOR[c.maturity.level === "Best Practice" ? "Low" : c.maturity.level === "Advanced" ? "Moderate" : c.maturity.level === "Developing" ? "High" : "Critical"]) },
    text: sorted.map(c => c.maturity.score), textposition: "outside", textfont: { family: "IBM Plex Mono", size: 11 },
    customdata: sorted.map(c => c.maturity.level), hovertemplate: "%{x}: %{y}/30 — %{customdata}<extra></extra>",
  }], { ...basePlotlyLayout, margin: { l: 34, r: 10, t: 20, b: 50 }, xaxis: { tickfont: { size: 11 } }, yaxis: { range: [0, 32], gridcolor: "#E7E1D2", title: { text: "score / 30", font: { size: 10.5 } } } }, plotlyConfig);
  el.on("plotly_click", data => {
    const c = sorted[data.points[0].pointIndex];
    if (c) openCompanyModal(c);
  });
});

// ============================================================
// Global & Regional Context
// ============================================================
safe("global-context-cards", () => {
  document.getElementById("global-context-cards").innerHTML = GLOBAL_CONTEXT.map(g => `
    <div class="context-card">
      <div class="context-stat">${g.stat}</div>
      <div class="context-label">${g.label}</div>
      <div class="context-source">${g.source}</div>
    </div>
  `).join("");
});

safe("chart-gdp", () => {
  requirePlotly();
  const el = document.getElementById("chart-gdp");
  const sorted = [...COUNTRY_GDP].sort((a, b) => b.gdpUsdTn - a.gdpUsdTn);
  Plotly.newPlot(el, [{
    type: "bar", x: sorted.map(d => d.country), y: sorted.map(d => d.gdpUsdTn),
    marker: { color: sorted.map(d => d.country === "United Arab Emirates" ? "#a9642c" : "#2f5d4f") },
    text: sorted.map(d => `$${d.gdpUsdTn}tn`), textposition: "outside", textfont: { family: "IBM Plex Mono", size: 10.5 },
    customdata: sorted.map(d => d.company), hovertemplate: "%{x}: $%{y}tn GDP<br>Case: %{customdata}<extra></extra>",
  }], { ...basePlotlyLayout, margin: { l: 46, r: 10, t: 20, b: 70 }, xaxis: { tickfont: { size: 10.5 }, tickangle: -20 }, yaxis: { title: { text: "Nominal GDP, US$ trillion (2026)", font: { size: 10.5 } }, gridcolor: "#E7E1D2", type: "log" } }, plotlyConfig);
});

// ============================================================
// Industry benchmarking
// ============================================================
safe("chart-benchmark", () => {
  requirePlotly();
  const el = document.getElementById("chart-benchmark");
  Plotly.newPlot(el, [
    { type: "bar", name: "Case company", x: INDUSTRY_BENCHMARKS.map(d => d.company), y: INDUSTRY_BENCHMARKS.map(d => d.companyMargin), marker: { color: "#1B2A4A" }, text: INDUSTRY_BENCHMARKS.map(d => `${d.companyMargin}%`), textposition: "outside", textfont: { family: "IBM Plex Mono", size: 10.5 } },
    { type: "bar", name: "Sector benchmark", x: INDUSTRY_BENCHMARKS.map(d => d.company), y: INDUSTRY_BENCHMARKS.map(d => d.benchmarkMargin), marker: { color: "#C98A2D" }, text: INDUSTRY_BENCHMARKS.map(d => `${d.benchmarkMargin}%`), textposition: "outside", textfont: { family: "IBM Plex Mono", size: 10.5 } },
  ], { ...basePlotlyLayout, barmode: "group", showlegend: true, legend: { orientation: "h", y: -0.2, font: { size: 11 } }, margin: { l: 40, r: 10, t: 20, b: 50 }, xaxis: { tickfont: { size: 11.5 } }, yaxis: { title: { text: "Margin %", font: { size: 10.5 } }, gridcolor: "#E7E1D2" } }, plotlyConfig);

  document.getElementById("benchmark-detail").innerHTML = INDUSTRY_BENCHMARKS.map(d => `
    <div class="benchmark-row">
      <strong>${d.company}</strong> (${d.sector}) — ${d.companyMetric}: <span class="mono">${d.companyMargin}%</span>
      vs. ${d.benchmarkLabel} <span class="mono">${d.benchmarkMargin}%</span>.
      <span class="footnote-inline">Source: ${d.source}</span>
    </div>
  `).join("");
});

// ============================================================
// Correlation analysis
// ============================================================
safe("chart-correlation", () => {
  requirePlotly();
  const el = document.getElementById("chart-correlation");
  const europePoints = CORRELATION_DATA.filter(d => d.region === "Europe");
  const uaePoints = CORRELATION_DATA.filter(d => d.region === "UAE");

  // simple least-squares trendline
  const xs = CORRELATION_DATA.map(d => d.maturity), ys = CORRELATION_DATA.map(d => d.exposure);
  const n = xs.length, sx = xs.reduce((a, b) => a + b, 0), sy = ys.reduce((a, b) => a + b, 0);
  const sxy = xs.reduce((a, x, i) => a + x * ys[i], 0), sx2 = xs.reduce((a, x) => a + x * x, 0);
  const slope = (n * sxy - sx * sy) / (n * sx2 - sx * sx);
  const intercept = (sy - slope * sx) / n;
  const xRange = [Math.min(...xs) - 1, Math.max(...xs) + 1];

  Plotly.newPlot(el, [
    { type: "scatter", mode: "markers+text", name: "Europe", x: europePoints.map(d => d.maturity), y: europePoints.map(d => d.exposure), text: europePoints.map(d => d.name), textposition: "top center", textfont: { size: 10.5, family: "Inter" }, marker: { color: "#2f5d4f", size: 12 } },
    { type: "scatter", mode: "markers+text", name: "UAE", x: uaePoints.map(d => d.maturity), y: uaePoints.map(d => d.exposure), text: uaePoints.map(d => d.name), textposition: "top center", textfont: { size: 10.5, family: "Inter" }, marker: { color: "#a9642c", size: 12 } },
    { type: "scatter", mode: "lines", name: "Trend", x: xRange, y: xRange.map(x => slope * x + intercept), line: { color: "#B08A3E", dash: "dot", width: 2 }, hoverinfo: "skip" },
  ], {
    ...basePlotlyLayout, showlegend: true, legend: { orientation: "h", y: -0.2, font: { size: 11 } },
    margin: { l: 46, r: 20, t: 10, b: 50 },
    xaxis: { title: { text: "Governance maturity score (/30)", font: { size: 11 } }, gridcolor: "#E7E1D2", range: [22, 32] },
    yaxis: { title: { text: "Conflict exposure index (0–18)", font: { size: 11 } }, gridcolor: "#E7E1D2" },
  }, plotlyConfig);
  el.on("plotly_click", data => {
    const point = data.points[0];
    if (point.data.name === "Trend") return;
    const c = COMPANIES.find(c => c.name === point.text);
    if (c) openCompanyModal(c);
  });
});

// ============================================================
// Risk register (bubble chart, feeds the Recommendations section)
// ============================================================
safe("chart-risk-register", () => {
  requirePlotly();
  const el = document.getElementById("chart-risk-register");
  Plotly.newPlot(el, [{
    type: "scatter", mode: "markers+text",
    x: RISK_REGISTER.map(r => r.atRiskCount),
    y: RISK_REGISTER.map(r => r.avgSeverity),
    text: RISK_REGISTER.map(r => r.area.replace(" / ", "/\n")),
    textposition: "top center", textfont: { size: 10, family: "Inter" },
    marker: {
      size: RISK_REGISTER.map(r => 24 + r.avgSeverity * 14),
      color: RISK_REGISTER.map(r => r.avgSeverity),
      colorscale: [[0, "#3E7C59"], [0.5, "#C98A2D"], [1, "#7A1F2B"]],
      cmin: 0, cmax: 2, line: { color: "#fff", width: 1.5 },
    },
    hovertemplate: "%{text}<br>%{x} of 8 cases at risk<br>avg. severity %{y}<extra></extra>",
  }], {
    ...basePlotlyLayout, margin: { l: 46, r: 20, t: 10, b: 50 },
    xaxis: { title: { text: "Cases affected (of 8)", font: { size: 11 } }, gridcolor: "#E7E1D2", range: [-0.5, 8.5] },
    yaxis: { title: { text: "Average severity (0 Low – 3 Critical)", font: { size: 11 } }, gridcolor: "#E7E1D2", range: [-0.3, 1.8] },
  }, plotlyConfig);
});

// ============================================================
// F.A.M.I.L.Y dimensions strip
// ============================================================
safe("dimensions-grid", () => {
  document.getElementById("dimensions-grid").innerHTML = FAMILY_DIMENSIONS.map(d => `
    <div class="dim-cell">
      <div class="dim-letter">${d.letter}</div>
      <div class="dim-name">${d.name}</div>
      <div class="dim-detail">${d.detail}</div>
    </div>
  `).join("");
});

// ============================================================
// Case cards
// ============================================================
safe("case-grid", () => {
  const caseGrid = document.getElementById("case-grid");
  caseGrid.innerHTML = COMPANIES.map(c => `
    <button class="case-card" data-region="${c.region}" data-id="${c.id}">
      <div class="case-name">${c.name}</div>
      <div class="case-tagline">${c.tagline}</div>
      <div class="case-meta">
        <span class="case-country">${c.country} · ${c.sector}</span>
        <span class="case-score" style="background:${severityColor(c.maturity.level)}">${c.maturity.score}/30</span>
      </div>
    </button>
  `).join("");
  caseGrid.addEventListener("click", e => {
    const card = e.target.closest(".case-card");
    if (!card) return;
    const company = COMPANIES.find(c => c.id === card.dataset.id);
    if (company) openCompanyModal(company);
  });
});

// ============================================================
// Financial indicators table
// ============================================================
safe("indicator-table", () => {
  document.getElementById("indicator-table").innerHTML = `
    <thead><tr><th>Company</th><th>Revenue</th><th>Profitability</th><th>Leverage / Liquidity</th><th>Distributions</th></tr></thead>
    <tbody>
      ${COMPANIES.map(c => c.financials.disclosed ? `
        <tr><td>${c.name}</td><td>${c.financials.revenue}</td><td>${c.financials.profitability}</td><td>${c.financials.leverage}</td><td>${c.financials.dividends}</td></tr>
      ` : `<tr><td>${c.name}</td><td colspan="4" class="na">Not publicly disclosed — privately held</td></tr>`).join("")}
    </tbody>
  `;
});

// ============================================================
// Heat map / registry
// ============================================================
safe("heatmap-grid", () => {
  const heatmapGrid = document.getElementById("heatmap-grid");
  let hmHtml = `<div class="hm-cell head">Conflict area</div>`;
  COMPANIES.forEach(c => { hmHtml += `<div class="hm-cell head">${c.name}</div>`; });
  CONFLICT_AREAS.forEach(area => {
    hmHtml += `<div class="hm-cell rowlabel">${area.label}</div>`;
    COMPANIES.forEach(c => {
      const sev = c.heat[area.key];
      hmHtml += `<div class="hm-cell"><div class="hm-stamp" data-company="${c.id}" data-area="${area.key}"><span class="stamp" style="background:${SEVERITY_COLOR[sev]}">${sev}</span></div></div>`;
    });
  });
  heatmapGrid.innerHTML = hmHtml;
  heatmapGrid.addEventListener("click", e => {
    const stamp = e.target.closest(".hm-stamp");
    if (!stamp) return;
    const company = COMPANIES.find(c => c.id === stamp.dataset.company);
    const area = CONFLICT_AREAS.find(a => a.key === stamp.dataset.area);
    if (company && area) openHeatCellModal(company, area, company.heat[area.key]);
  });

  document.getElementById("severity-key").innerHTML = SEVERITY_ORDER.map(s => `
    <div class="key-item"><span class="swatch" style="background:${SEVERITY_COLOR[s]}"></span>${s}</div>
  `).join("");
});

// ============================================================
// Maturity chart (Chart.js) + scale + table
// ============================================================
safe("maturity-chart", () => {
  if (typeof Chart === "undefined") throw new Error("Chart.js failed to load from CDN");
  const maturitySorted = [...COMPANIES].sort((a, b) => b.maturity.score - a.maturity.score);
  new Chart(document.getElementById("maturity-chart"), {
    type: "bar",
    data: {
      labels: maturitySorted.map(c => c.name),
      datasets: [{
        data: maturitySorted.map(c => c.maturity.score),
        backgroundColor: maturitySorted.map(c => SEVERITY_COLOR[c.maturity.level === "Best Practice" ? "Low" : c.maturity.level === "Advanced" ? "Moderate" : c.maturity.level === "Developing" ? "High" : "Critical"]),
        borderRadius: 2, barThickness: 26,
      }]
    },
    options: {
      indexAxis: "y", responsive: true,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.x} / 30` } } },
      scales: {
        x: { min: 0, max: 30, grid: { color: "#DBD4C0" }, ticks: { font: { family: "IBM Plex Mono", size: 11 } } },
        y: { grid: { display: false }, ticks: { font: { family: "Inter", size: 12.5, weight: 600 }, color: "#1B2A4A" } }
      }
    }
  });
});

safe("maturity-scale", () => {
  document.getElementById("maturity-scale").innerHTML = MATURITY_SCALE.map(m => `
    <div class="scale-row"><span class="scale-dot" style="background:${m.color}"></span><span class="scale-text"><strong>${m.level}</strong><span>${m.range} pts</span></span></div>
  `).join("");
});

safe("maturity-table", () => {
  const maturitySorted = [...COMPANIES].sort((a, b) => b.maturity.score - a.maturity.score);
  document.getElementById("maturity-table").innerHTML = `
    <thead><tr><th>Company</th><th>Score / 30</th><th>Maturity level</th><th>Decisive strength / constraint</th></tr></thead>
    <tbody>
      ${maturitySorted.map(c => `
        <tr><td>${c.name}</td><td style="font-family:var(--mono); font-weight:600;">${c.maturity.score}</td>
        <td><span class="level-pill" style="background:${severityColor(c.maturity.level)}">${c.maturity.level}</span></td>
        <td>${c.maturity.note}</td></tr>
      `).join("")}
    </tbody>
  `;
});

// ============================================================
// Recommendations (accordion) — each now cross-links to the
// companies that exemplify it, computed from the case data.
// ============================================================
safe("findings-list", () => {
  const keywordMap = {
    F1: c => c.issue.toLowerCase().includes("stake") || c.issue.toLowerCase().includes("dilution") || c.id === "hermes" || c.id === "puig",
    F2: c => c.heat.succession === "High" || c.heat.succession === "Critical",
    F3: c => c.financials.disclosed && (c.financials.leverage.toLowerCase().includes("net cash") || c.financials.leverage.toLowerCase().includes("ceiling")),
    "F2/F3": c => c.id === "haniel",
    F4: c => c.maturity.level === "Best Practice",
    F5: c => c.id === "alfuttaim" || c.id === "alghurair",
  };
  const findingsList = document.getElementById("findings-list");
  findingsList.innerHTML = FINDINGS.map((f, i) => {
    const matcher = keywordMap[f.id];
    const examples = matcher ? COMPANIES.filter(matcher).map(c => c.name) : [];
    return `
    <div class="finding${i === 0 ? " open" : ""}" data-idx="${i}">
      <div class="finding-head">
        <span class="finding-id">${f.id}</span>
        <span class="finding-title">${f.title}</span>
        <span class="finding-chevron">▾</span>
      </div>
      <div class="finding-body">
        <div class="finding-col"><label>Financial risk</label><p>${f.risk}</p></div>
        <div class="finding-col"><label>Recommendation</label><p>${f.recommendation}</p></div>
        <div class="finding-col"><label>Expected outcome</label><p>${f.outcome}</p></div>
        ${examples.length ? `<div class="finding-col finding-examples"><label>Seen in</label><p>${examples.map(n => `<button class="example-chip" data-name="${n}">${n}</button>`).join(" ")}</p></div>` : ""}
      </div>
    </div>`;
  }).join("");

  findingsList.addEventListener("click", e => {
    const chip = e.target.closest(".example-chip");
    if (chip) {
      const c = COMPANIES.find(c => c.name === chip.dataset.name);
      if (c) openCompanyModal(c);
      return;
    }
    const head = e.target.closest(".finding-head");
    if (head) head.parentElement.classList.toggle("open");
  });
});

// ============================================================
// Roadmap
// ============================================================
safe("roadmap-track", () => {
  document.getElementById("roadmap-track").innerHTML = ROADMAP.map(r => `
    <div class="roadmap-step">
      <div class="roadmap-num">${r.phase}</div>
      <div class="roadmap-tool">${r.tool}</div>
      <div class="roadmap-focus">${r.focus}</div>
      <div class="roadmap-deliverable">${r.deliverable}</div>
    </div>
  `).join("");
});

// ============================================================
// Resize handling for all Plotly charts
// ============================================================
window.addEventListener("resize", () => {
  ["chart-map", "chart-region", "chart-maturity-pie", "chart-severity-pie", "chart-revenue", "chart-margin", "chart-ownership", "chart-maturity-bar", "chart-gdp", "chart-benchmark", "chart-correlation", "chart-risk-register"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (el && typeof Plotly !== "undefined") { try { Plotly.Plots.resize(el); } catch (e) {} }
    });
});
