# OILFLOW - Oil Investment Simulator

An educational, front-end demo of a premium fintech-style oil investment interface. Everything is simulated: there are no real deposits, withdrawals, brokerage orders or financial returns anywhere in this project.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Landing hero, featured packages, how-it-works, portfolio snapshot |
| `packages.html` | All six packages plus a sortable, filterable comparison table |
| `package.html?id=500` | Per-package simulation: progress, daily timeline, growth chart, bonus centre, withdrawal |
| `deposit.html?id=500` | Add Funds prototype: amount, four simulated payment methods, QR, receipt |
| `portfolio.html` | Portfolio stats, growth chart, holdings, demo ledger, simulated withdrawals |
| `market.html` | Simulated oil price line and the market-to-reward explanation |
| `learn.html` | Explainers on barrels, exposure, entry price, volatility, currency |
| `risk.html` | Risk and disclosure page |

The six packages share one page via a `?id=` query parameter, so there is a single file to maintain rather than six near-identical ones.

## Stack

Plain HTML, CSS and JavaScript. No build step, no framework, no external dependencies and no network calls. Shared code lives in `assets/css/style.css`, `assets/js/app.js` (data, calculations the demo state) and `assets/js/charts.js` (charts).

Demo state is stored in `localStorage` under `oilflow.demo.v1`, which is what lets separate pages behave like one product. It is browser-only and clears with the **Reset demo session** button on the portfolio page.

## Run locally

```bash
git clone <your-repo-url>
cd oilflow
python3 -m http.server 8000    # or just open index.html
```

Then visit http://localhost:8000

Opening the files directly from disk also works.

## Deploy to a domain

Static site, so any static host works - see `DEPLOY.md` for GitHub Pages and custom-domain steps.

## Adding a package

Edit the `tiers` array in `assets/js/app.js`:

```js
['Starter', 500, '#efc478']
```

Name, starting amount, accent colour. The daily reward (18% of the amount), bonus (20%) and 14-day duration are derived below that array - change them in one place and every page follows.

## Important limitation

Add Funds is a **non-functional interface prototype**. It has no payment gateway, no UPI integration, no bank connection and no card processing. The QR code is a visual placeholder that resolves to no payment address, so scanning it cannot create a payment. All balances, rewards, bonuses and withdrawals are hypothetical figures generated in the browser.

This project is for education and product-design demonstration only. It does not offer, broker or execute any investment, and nothing in it is financial advice.
