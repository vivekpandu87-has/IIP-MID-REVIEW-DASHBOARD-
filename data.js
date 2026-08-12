// All figures below are transcribed directly from the report
// "Financial Governance in Family Businesses" (Chapters 3-5).
// Nothing here is estimated or invented — where the report states
// data is unavailable (the four private UAE groups), that is shown
// as "Not publicly disclosed" rather than a guessed figure.

const REGIONS = {
  Europe: { label: "Europe", color: "#2f5d4f" },
  UAE: { label: "UAE", color: "#a9642c" },
};

const COMPANIES = [
  {
    id: "hermes",
    name: "Hermès",
    country: "France",
    region: "Europe",
    sector: "Luxury goods",
    tagline: "Control Without Capital",
    ownership: "Family ≈66.7% of capital, ≈78.6% of voting rights, via holding company H51 and Émile Hermès SAS (irremovable active partner under the SCA structure)",
    issue: "Between 2008–2010, LVMH built a hidden stake of up to ~23% of capital through cash-settled equity swaps — a direct threat of control dilution.",
    mechanism: "The family pooled a majority block into holding company H51 (2011) with lock-up and first-refusal provisions. The AMF fined LVMH €8m for disclosure breaches (2013); the 2014 settlement returned LVMH's stake to its own shareholders.",
    implication: "The defence required no leverage, no buy-back debt and no dilution.",
    contribution: "Isolates the purest form of the study's logic: ownership architecture, not financial engineering, decided the financial outcome.",
    financials: {
      revenue: "€15.2bn",
      profitability: "Recurring operating margin 40.5%; net margin 30.3%",
      leverage: "Net cash €11.6bn",
      dividends: "€1.4bn paid, 2024",
      disclosed: true,
    },
    maturity: { score: 28, level: "Best Practice", note: "Unassailable control architecture; succession depth the watchpoint" },
    heat: { succession: "High", ownership: "Low", dividend: "Low", compensation: "Low", investment: "Low", leverage: "Low" },
  },
  {
    id: "puig",
    name: "Puig",
    country: "Spain",
    region: "Europe",
    sector: "Beauty & fashion",
    tagline: "IPO as Financial-Governance Instrument",
    ownership: "Post-IPO (May 2024): family retains 71.7% of economic rights and 92.5% of voting rights through dual-class A shares",
    issue: "A decade of brand acquisitions (Charlotte Tilbury, Byredo, Dr. Barbara Sturm) accumulated €2.4bn of minority buy-out liabilities and acquisition debt.",
    mechanism: "The IPO raised ≈€2.6bn (≈€1.4bn primary), explicitly to refinance the Byredo and Charlotte Tilbury positions, under a stated ≤2.0x net-debt/adjusted-EBITDA ceiling.",
    implication: "Net debt fell €442m to €1,068m (1.1x) within the listing year; combination liabilities halved to ≈€1.1bn; a ~40% payout policy was institutionalised.",
    contribution: "Demonstrates that a public listing — normally the ultimate dilution event — can be engineered as a governance-preserving financial restructuring.",
    financials: {
      revenue: "€4.79bn",
      profitability: "Adj. EBITDA margin 20.2%; adj. net margin 11.5%",
      leverage: "Net debt €1.07bn (1.1x adj. EBITDA)",
      dividends: "€212m declared (≈40% payout)",
      disclosed: true,
    },
    maturity: { score: 30, level: "Best Practice", note: "IPO-institutionalised governance with retained family control" },
    heat: { succession: "Moderate", ownership: "Low", dividend: "Low", compensation: "Low", investment: "Moderate", leverage: "Moderate" },
  },
  {
    id: "haniel",
    name: "Haniel",
    country: "Germany",
    region: "Europe",
    sector: "Diversified investment holding",
    tagline: "Governing 750 Owners",
    ownership: "Franz Haniel & Cie. GmbH (founded 1756), a pure investment holding owned by 750+ family members, 100% private",
    issue: "Extreme ownership fragmentation converts every year into a negotiation between shareholder remuneration (€54–128m annually) and portfolio reinvestment, with no dominant owner to arbitrate.",
    mechanism: "Professional external management, a loan-to-value ceiling below 20% (actual ≈13.5%), and portfolio-logic capital allocation across CWS, TAKKT, BekaertDeslee, ROVEMA, Emma, BauWatch, and minority stakes in Ceconomy and Metro.",
    implication: "Despite a 5% revenue decline to €4,205m in 2024, operating profit rose 2% to €276m, operating free cash flow rose over 70% to €171m, and net debt fell for the first time since 2020.",
    contribution: "Shows governance substituting for ownership concentration: formal allocation discipline, not family authority, contains distribution conflict.",
    financials: {
      revenue: "€4.21bn",
      profitability: "Operating profit €276m; operating FCF €171m (+70%)",
      leverage: "LTV ≈13.5% (ceiling <20%); net debt reduced",
      dividends: "€54–128m p.a. shareholder remuneration",
      disclosed: true,
    },
    maturity: { score: 29, level: "Best Practice", note: "Allocation discipline across 750+ shareholders" },
    heat: { succession: "Moderate", ownership: "High", dividend: "Moderate", compensation: "Low", investment: "Moderate", leverage: "Low" },
  },
  {
    id: "jeronimo",
    name: "Jerónimo Martins",
    country: "Portugal",
    region: "Europe",
    sector: "Food retail & distribution",
    tagline: "Disciplined Returns Under Family Control",
    ownership: "Sociedade Francisco Manuel dos Santos holds 56.136% of the Euronext Lisbon-listed group",
    issue: "Funding aggressive store expansion (Biedronka ≈70% of sales, ≈80% of EBITDA; Colombia growth) while paying rising dividends.",
    mechanism: "A listed-company board with family-block control, executed generational leadership transitions, and a conservative financing policy including sustainability-linked facilities.",
    implication: "2024 sales of €33.5bn (+9.3%), EBITDA of €2.2bn (6.7% margin), pre-tax ROIC of 20%, net cash of €726m (ex-IFRS 16), and €412m of dividends paid.",
    contribution: "Evidences that family control plus listing discipline can deliver conservative leverage, high capital productivity, and generous distributions simultaneously.",
    financials: {
      revenue: "€33.5bn",
      profitability: "EBITDA margin 6.7%; pre-tax ROIC 20%",
      leverage: "Net cash €726m (ex-IFRS 16)",
      dividends: "€412m paid, 2024",
      disclosed: true,
    },
    maturity: { score: 30, level: "Best Practice", note: "Listed discipline + 56% family anchor; executed succession" },
    heat: { succession: "Low", ownership: "Low", dividend: "Low", compensation: "Low", investment: "Moderate", leverage: "Low" },
  },
  {
    id: "alghurair",
    name: "Al Ghurair",
    country: "UAE",
    region: "UAE",
    sector: "Diversified conglomerate",
    tagline: "Separation as Conflict Resolution",
    ownership: "Founded 1960 by Saif Ahmed Al Ghurair; privately held",
    issue: "Inter-branch differences over strategy and capital allocation within a rapidly diversifying conglomerate.",
    mechanism: "Structural separation into two family holdings in the 1990s, followed by self-funded industrial expansion (steel complex launched 2008) and selective external equity at subsidiary level (Nippon Steel's 20% stake in Al Ghurair Iron & Steel, 2011).",
    implication: "Publicly available financial data is limited (privately held). Observable pattern: crisis-resilient, internally financed capital allocation with minority equity raised only at asset level.",
    contribution: "The private-market analogue of a spin-off: resolving financial conflict by restructuring ownership boundaries rather than exiting.",
    financials: { revenue: null, profitability: null, leverage: null, dividends: null, disclosed: false },
    maturity: { score: 26, level: "Advanced", note: "Resolved branch structure; limited financial disclosure" },
    heat: { succession: "High", ownership: "Moderate", dividend: "Moderate", compensation: "Low", investment: "High", leverage: "Moderate" },
  },
  {
    id: "alfuttaim",
    name: "Al Futtaim",
    country: "UAE",
    region: "UAE",
    sector: "Diversified conglomerate (franchise & real estate)",
    tagline: "The Negotiated Division",
    ownership: "Founded 1930; formally divided in 2000 between cousins Abdulla and Majid Al Futtaim, arbitrated by Sheikh Mohammed bin Rashid",
    issue: "Irreconcilable differences over strategy and asset control between two family branches.",
    mechanism: "A binding, externally arbitrated division of assets, liabilities and business divisions, followed by professional (largely non-family) management of the retained group.",
    implication: "Publicly available financial data is limited (privately held). Durable value visible in the continuing strength of both successor groups — Toyota distribution (~70 years), IKEA franchise, and the Festival City real-estate platform.",
    contribution: "The region's clearest evidence that a formal, rule-bound ownership separation can permanently extinguish financial conflict rather than defer it.",
    financials: { revenue: null, profitability: null, leverage: null, dividends: null, disclosed: false },
    maturity: { score: 28, level: "Best Practice", note: "Rule-bound 2000 separation; professional management" },
    heat: { succession: "Moderate", ownership: "Moderate", dividend: "Moderate", compensation: "Low", investment: "Moderate", leverage: "Moderate" },
  },
  {
    id: "alnaboodah",
    name: "Al Naboodah",
    country: "UAE",
    region: "UAE",
    sector: "Construction & commercial",
    tagline: "Succession as Financial-Continuity Risk",
    ownership: "Founded 1958 by brothers Saeed and Mohammed Al Naboodah; chairmanship passed to 2nd generation in 1982, now 3rd generation",
    issue: "Maintaining financial continuity through generational transitions while exposed to the pronounced cyclicality of construction.",
    mechanism: "A holding company overseeing two arms — Al Naboodah Construction Group and Al Naboodah Commercial Group — separating cyclical contracting risk from steadier commercial cash flows.",
    implication: "Publicly available financial data is limited (privately held). The evidenced financial decision is diversification matched to transition periods.",
    contribution: "Isolates succession as the dominant financial risk of private groups — the risk the heat map rates highest.",
    financials: { revenue: null, profitability: null, leverage: null, dividends: null, disclosed: false },
    maturity: { score: 24, level: "Advanced", note: "Clear divisional structure; succession documentation gap" },
    heat: { succession: "Critical", ownership: "Moderate", dividend: "Moderate", compensation: "Low", investment: "Moderate", leverage: "Moderate" },
  },
  {
    id: "alrostamani",
    name: "Al Rostamani",
    country: "UAE",
    region: "UAE",
    sector: "Diversified investment (automotive, real estate, financial services, travel, tech)",
    tagline: "Modernisation Without Listing",
    ownership: "Founded early 1950s by Abdulla Hassan Al Rostamani; family-owned across 2nd and 3rd generations",
    issue: "Governing an increasingly diversified portfolio (9 companies, 34+ brands) without public-market discipline.",
    mechanism: "Progressive governance modernisation: professional executive structures, portfolio-level oversight, and brand-level accountability.",
    implication: "Publicly available financial data is limited (privately held). Evidenced pattern is steady diversification, including financial services via Al Rostamani International Exchange, funded without recourse to public equity.",
    contribution: "Governance modernisation functioning as a substitute for listing in disciplining capital allocation — the mirror image of Puig.",
    financials: { revenue: null, profitability: null, leverage: null, dividends: null, disclosed: false },
    maturity: { score: 26, level: "Advanced", note: "Modernising governance; transparency still developing" },
    heat: { succession: "Moderate", ownership: "Moderate", dividend: "Moderate", compensation: "Low", investment: "Moderate", leverage: "Moderate" },
  },
];

const CONFLICT_AREAS = [
  { key: "succession", label: "Succession-related disputes" },
  { key: "ownership", label: "Ownership alignment / dilution" },
  { key: "dividend", label: "Dividend / distribution policy" },
  { key: "compensation", label: "Executive compensation" },
  { key: "investment", label: "Investment / capital allocation" },
  { key: "leverage", label: "Capital structure / leverage" },
];

const SEVERITY_ORDER = ["Low", "Moderate", "High", "Critical"];
const SEVERITY_COLOR = {
  Low: "#3e7c59",
  Moderate: "#c98a2d",
  High: "#b54a2a",
  Critical: "#7a1f2b",
};

const MATURITY_SCALE = [
  { level: "Best Practice", range: "27–30", color: "#3e7c59" },
  { level: "Advanced", range: "23–26", color: "#c98a2d" },
  { level: "Developing", range: "18–22", color: "#b54a2a" },
  { level: "Emerging", range: "< 18", color: "#7a1f2b" },
];

const FAMILY_DIMENSIONS = [
  { letter: "F", name: "Financial Governance", detail: "Capital structure & leverage policy; dividend/distribution policy; debt management; capital-allocation discipline; financial transparency" },
  { letter: "A", name: "Alignment of Ownership", detail: "Ownership concentration; shareholder agreements; family holdings/constitutions; dilution protection" },
  { letter: "M", name: "Management Professionalisation", detail: "Board independence; professional executives; audit and remuneration committees" },
  { letter: "I", name: "Intergenerational Succession", detail: "Documented succession plans; successor development; executed transitions" },
  { letter: "L", name: "Leadership & Legacy", detail: "Stewardship culture; long-horizon strategy; family values in financial policy" },
  { letter: "Y", name: "Yield & Sustainable Growth", detail: "Profitability (margins, ROIC where disclosed); revenue growth; financial stability; resilience through cycles" },
];

const FINDINGS = [
  {
    id: "F1",
    title: "Control mechanisms decide whether concentration is stability or fragility.",
    risk: "Hostile capital, dilution, or blockholder abuse depending on design",
    recommendation: "Institutionalise ownership governance: family holding vehicles, shareholder agreements, lock-ups, and minority-protection counterweights",
    outcome: "Control architecture aligned with strategy; minority capital protected; takeover or leakage risk priced out",
  },
  {
    id: "F2",
    title: "Financial conflict concentrates in succession and capital allocation, not operations.",
    risk: "Leadership vacuum; contested asset claims; value destruction at transition",
    recommendation: "Adopt competence-based, documented succession plans with defined financial decision rights, reviewed before they are needed",
    outcome: "Continuity of capital allocation and credit standing across generations",
  },
  {
    id: "F3",
    title: "Family firms buy resilience with financial conservatism — but with a cost.",
    risk: "Under-investment or excess slack; slack turning into entrenchment",
    recommendation: "Set explicit capital-allocation discipline: leverage ceilings (e.g., <2.0x net debt/EBITDA), hurdle rates, and periodic portfolio review",
    outcome: "Prudent balance sheets without sacrificing growth optionality",
  },
  {
    id: "F2/F3",
    title: "Distribution pressure (the Haniel pattern).",
    risk: "Ad hoc dividends crowding out reinvestment; annual renegotiation conflict",
    recommendation: "Codify a formal dividend policy linked to cash flow and leverage, with a transparent shareholder-remuneration band",
    outcome: "Predictable distributions; reduced inter-branch friction; preserved reinvestment capacity",
  },
  {
    id: "F4",
    title: "Professionalisation, not ownership form, drives maturity.",
    risk: "Key-person dependence; weak financial controls; disclosure gaps",
    recommendation: "Professionalise boards and financial management: independent directors, CFO authority, audited reporting even when not legally required",
    outcome: "Higher maturity scores; lower conflict exposure; bankability and partner confidence",
  },
  {
    id: "F5",
    title: "Formal ownership events resolve conflict; informal drift multiplies it.",
    risk: "Latent inter-branch disputes compounding silently",
    recommendation: "Address ownership conflicts through binding, rule-bound restructuring (separation, buy-out, or holding-company reset) with external arbitration where needed",
    outcome: "Permanent conflict resolution; both successor entities able to fund and grow independently",
  },
];

// ============================================================
// External real-world data (web-sourced, Aug 2026) — used to give
// the study global/regional context. Each item is cited; nothing
// here is estimated by the dashboard itself.
// ============================================================

const GLOBAL_CONTEXT = [
  {
    stat: "≈70%",
    label: "of global GDP generated by family businesses",
    source: "McKinsey & Company, cited via UAE Ministry of Economy, 2025",
  },
  {
    stat: "≈60%",
    label: "of global employment provided by family businesses",
    source: "McKinsey & Company, 2025",
  },
  {
    stat: "$8.8T",
    label: "combined revenue of the world's 500 largest family businesses (+10% vs. 2023) — would rank as the world's 3rd-largest economy",
    source: "EY & University of St. Gallen Global 500 Family Business Index, 2025",
  },
  {
    stat: "50–60%",
    label: "of GDP generated by family businesses across Europe",
    source: "Multiple industry sources, 2025–26",
  },
  {
    stat: "60%",
    label: "of UAE GDP, 80%+ of employment, ~90% of private-sector firms are family-owned",
    source: "UAE Ministry of Economy & Tourism, Nov 2025",
  },
];

// Nominal GDP, 2026 estimates/projections — IMF World Economic Outlook (April 2026 vintage)
const COUNTRY_GDP = [
  { country: "France", gdpUsdTn: 3.66, company: "Hermès" },
  { country: "Germany", gdpUsdTn: 5.45, company: "Haniel" },
  { country: "Spain", gdpUsdTn: 2.042, company: "Puig" },
  { country: "Portugal", gdpUsdTn: 0.3806, company: "Jerónimo Martins" },
  { country: "United Arab Emirates", gdpUsdTn: 0.6216, company: "4 UAE cases" },
];

// Sector margin benchmarks the report's own disclosed companies can be checked against.
// Each benchmark is a real, currently-reported industry figure — sourced individually.
const INDUSTRY_BENCHMARKS = [
  {
    company: "Hermès",
    sector: "Personal luxury goods",
    companyMargin: 40.5,
    companyMetric: "Recurring operating margin, FY2024",
    benchmarkMargin: 15.5,
    benchmarkLabel: "Global luxury-sector operating margin (Bain & Co., 2025: ~15–16%)",
    source: "Bain & Company, Global Luxury Market report, 2025",
  },
  {
    company: "Puig",
    sector: "Prestige beauty & fashion",
    companyMargin: 20.2,
    companyMetric: "Adj. EBITDA margin, FY2024",
    benchmarkMargin: 20.2,
    benchmarkLabel: "L'Oréal (sector bellwether) operating margin, FY2025: 20.2%",
    source: "L'Oréal 2025 Annual Results",
  },
  {
    company: "Jerónimo Martins",
    sector: "Food retail (grocery)",
    companyMargin: 6.7,
    companyMetric: "EBITDA margin, FY2024",
    benchmarkMargin: 7.1,
    benchmarkLabel: "European grocery retail EBITDA margin, long-run average 2009–2023: ~7.1%",
    source: "McKinsey, State of Grocery Retail Europe, 2025",
  },
];

const ROADMAP = [
  { phase: 1, focus: "Diagnose baseline governance and financial position", tool: "F.A.M.I.L.Y. Framework", deliverable: "Dimension scores; gap register" },
  { phase: 2, focus: "Localise where financial conflict actually sits", tool: "Conflict Heat Map", deliverable: "Rated conflict map with evidence log" },
  { phase: 3, focus: "Position versus family-business peers", tool: "Maturity Assessment", deliverable: "Maturity level; peer comparison" },
  { phase: 4, focus: "Make governance measurable", tool: "Governance Dashboard", deliverable: "Live KPI set (leverage, independence, conflict, country benchmarks)" },
  { phase: 5, focus: "Structural and policy changes", tool: "Recommendations Matrix", deliverable: "Approved action plan with owners and review dates" },
];

// ============================================================
// Derived / aggregated real data (computed from COMPANIES + heat
// map above — every number here traces back to Tables 4.2–4.4,
// nothing is invented).
// ============================================================

// Country-level rollup for the world map. UAE is one country with
// four cases, so it's shown as the average of those four scores;
// the four European countries each map to their single case.
const COUNTRY_ROLLUP = [
  { country: "France", iso: "FRA", companies: ["Hermès"], avgMaturity: 28, region: "Europe", gdpUsdTn: 3.66 },
  { country: "Spain", iso: "ESP", companies: ["Puig"], avgMaturity: 30, region: "Europe", gdpUsdTn: 2.042 },
  { country: "Germany", iso: "DEU", companies: ["Haniel"], avgMaturity: 29, region: "Europe", gdpUsdTn: 5.45 },
  { country: "Portugal", iso: "PRT", companies: ["Jerónimo Martins"], avgMaturity: 30, region: "Europe", gdpUsdTn: 0.3806 },
  {
    country: "United Arab Emirates", iso: "ARE",
    companies: ["Al Ghurair", "Al Futtaim", "Al Naboodah", "Al Rostamani"],
    avgMaturity: +((26 + 28 + 24 + 26) / 4).toFixed(1),
    region: "UAE", gdpUsdTn: 0.6216,
  },
];

// Heat-map severity tally across all 8 companies x 6 conflict areas (48 ratings total)
const SEVERITY_TALLY = (() => {
  const tally = { Low: 0, Moderate: 0, High: 0, Critical: 0 };
  COMPANIES.forEach(c => Object.values(c.heat).forEach(v => tally[v]++));
  return tally;
})();

// Maturity level tally across the 8 companies
const MATURITY_TALLY = (() => {
  const tally = { "Best Practice": 0, "Advanced": 0, "Developing": 0, "Emerging": 0 };
  COMPANIES.forEach(c => tally[c.maturity.level]++);
  return tally;
})();

// Region split
const REGION_TALLY = { Europe: COMPANIES.filter(c => c.region === "Europe").length, UAE: COMPANIES.filter(c => c.region === "UAE").length };

// Ownership concentration — only companies where the report gives an explicit figure
const OWNERSHIP_DATA = [
  { name: "Hermès", capital: 66.7, voting: 78.6 },
  { name: "Puig", capital: 71.7, voting: 92.5 },
  { name: "Jerónimo Martins", capital: 56.136, voting: null },
  { name: "Haniel", capital: 100, voting: null },
];

// Revenue (FY2024, disclosed companies only), in EUR billions
const REVENUE_DATA = [
  { name: "Jerónimo Martins", value: 33.5 },
  { name: "Hermès", value: 15.2 },
  { name: "Puig", value: 4.79 },
  { name: "Haniel", value: 4.21 },
];

// Profitability — margin figures as stated/computed in the report.
// Hermès + Puig use the report's own margin %; Haniel's is computed
// from its disclosed operating profit ÷ revenue (276 / 4205); Jerónimo
// Martins uses its stated EBITDA margin. Bases differ (noted in the UI).
const MARGIN_DATA = [
  { name: "Hermès", value: 40.5, basis: "Recurring operating margin" },
  { name: "Puig", value: 20.2, basis: "Adj. EBITDA margin" },
  { name: "Jerónimo Martins", value: 6.7, basis: "EBITDA margin" },
  { name: "Haniel", value: +((276 / 4205) * 100).toFixed(1), basis: "Operating margin (computed: op. profit ÷ revenue)" },
];

// --- Governance maturity vs. conflict exposure (n=8) ---
// Conflict exposure = sum of severity weights (Low=0, Moderate=1, High=2,
// Critical=3) across all 6 conflict areas for each company. This is a
// direct numeric encoding of Table 4.3 — not a separate estimate.
const SEVERITY_WEIGHT = { Low: 0, Moderate: 1, High: 2, Critical: 3 };
const CORRELATION_DATA = COMPANIES.map(c => ({
  name: c.name,
  region: c.region,
  maturity: c.maturity.score,
  exposure: Object.values(c.heat).reduce((sum, sev) => sum + SEVERITY_WEIGHT[sev], 0),
}));

function pearsonR(pairs, keyX, keyY) {
  const n = pairs.length;
  const xs = pairs.map(p => p[keyX]);
  const ys = pairs.map(p => p[keyY]);
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx, dy = ys[i] - my;
    num += dx * dy; dx2 += dx * dx; dy2 += dy * dy;
  }
  return num / Math.sqrt(dx2 * dy2);
}
const MATURITY_CONFLICT_R = pearsonR(CORRELATION_DATA, "maturity", "exposure");

// --- Risk register: for each conflict area, how many of the 8 cases
// rate Moderate or worse, and the average severity weight. Derived
// directly from Table 4.3 — a genuinely new cut of the report's own data. ---
const RISK_REGISTER = CONFLICT_AREAS.map(area => {
  const weights = COMPANIES.map(c => SEVERITY_WEIGHT[c.heat[area.key]]);
  const atRiskCount = COMPANIES.filter(c => c.heat[area.key] !== "Low").length;
  const avgSeverity = weights.reduce((a, b) => a + b, 0) / weights.length;
  return { area: area.label, key: area.key, atRiskCount, avgSeverity: +avgSeverity.toFixed(2) };
});

