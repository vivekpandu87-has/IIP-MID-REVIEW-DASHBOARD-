# Financial Governance Dashboard

Interactive dashboard for *Financial Governance in Family Businesses* — built from
Chapters 3–5 of the mid-review report (F.A.M.I.L.Y. Framework, Financial Conflict
Heat Map, Governance Maturity Assessment, and the eight case studies: Hermès, Puig,
Haniel, Jerónimo Martins, Al Ghurair, Al Futtaim, Al Naboodah, Al Rostamani).

No build step, no dependencies to install — it's three plain files:

- `index.html` — structure
- `style.css` — the design system
- `data.js` — every figure, transcribed directly from the report's tables (4.2, 4.3, 4.4, 5.1, 5.2)
- `app.js` — renders everything from `data.js` and wires up the interactions

## View it locally

Open `index.html` directly in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy on GitHub Pages

1. Create a new repository (or use an existing one) and push these files to it,
   keeping `index.html` at the repo root (or in a `/docs` folder — your choice).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick the branch (e.g. `main`) and the folder (`/root` or `/docs`), then **Save**.
5. GitHub gives you a URL like `https://<your-username>.github.io/<repo-name>/`
   — it can take a minute or two to go live the first time.

That's it — no build pipeline, so every push to that branch updates the live site.

## Updating the data

Everything the dashboard shows lives in `data.js`. If a figure in the report
changes, edit the corresponding value there — the page re-renders itself,
nothing else needs touching.

## Data sources

**From the report** (Tables 3.2, 4.2, 4.3, 4.4, 5.1, 5.2 and Section 4.2 case narratives):
Sacristán-Navarro & Cabeza-García (2020); Rodríguez-García & Menéndez-Requejo (2023);
Hermès International (2025); Puig Brands (2024/2025); Franz Haniel & Cie. (2025);
Scope Ratings (2024); Jerónimo Martins (2025); Family Business Histories (2022/2024);
Al Ghurair Group, Al Futtaim, Al Naboodah Group, Al Rostamani Group (company sources, n.d.).

**Added from the web** for the Global Context and Benchmarking sections (Aug 2026):
- McKinsey & Company — global family-business share of GDP/employment (~70% / ~60%, widely cited estimate)
- EY & University of St. Gallen — *Global 500 Family Business Index*, 2025
- UAE Ministry of Economy & Tourism — official family-business GDP/employment figures, Nov 2025
- IMF World Economic Outlook, April 2026 — country GDP figures (France, Germany, Spain, Portugal, UAE)
- Bain & Company — *Global Luxury Market* report, 2025 (luxury sector operating margin)
- L'Oréal — 2025 Annual Results (beauty sector benchmark)
- McKinsey — *State of Grocery Retail Europe*, 2025 (grocery sector EBITDA margin)

The Correlation and Risk Register sections are original analysis: both are computed at
runtime, in the browser, directly from the report's own Table 4.3/4.4 data (see `data.js`,
`CORRELATION_DATA` and `RISK_REGISTER`) — nothing there is a separate claim.

