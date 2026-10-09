# OILFLOW

An educational, front-end product prototype: a premium fintech-style interface for exploring how an oil-linked position behaves under a chosen scenario. Every figure is generated in the browser.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Landing hero, plan highlights, how-it-works, portfolio snapshot |
| `packages.html` | Six plans plus a sortable, filterable comparison table |
| `package.html?id=500` | Per-plan workspace: progress, daily timeline, growth chart, bonus section, withdrawal |
| `deposit.html?id=500` | Add funds prototype: amount, four payment methods, QR, receipt |
| `portfolio.html` | Portfolio stats, growth chart, holding, ledger, withdrawals |
| `market.html` | Simulated price line and the market-to-reward explanation |
| `learn.html` | Explainers on barrels, exposure, entry price, volatility, currency |
| `risk.html` | Risk and disclosure page |

The six plans share one page via a `?id=` query parameter, so there is a single file to maintain rather than six near-identical ones.

## Stack

Plain HTML, CSS and JavaScript. No build step, no framework, no external dependencies, no network calls. Shared code lives in `assets/css/style.css`, `assets/js/app.js` (data, calculations, session state) and `assets/js/charts.js`.

Session state is stored in `localStorage` under `oilflow.session.v1`, which is what lets separate pages behave like one product. It is browser-only and clears with **Reset demo session** on the portfolio page.

## Run locally

```bash
git clone <your-repo-url>
cd oilflow
python3 -m http.server 8000    # or just open index.html
```

## Adding a plan

Edit the `tiers` array in `assets/js/app.js`:

```js
['Starter', 500, '#efc478']
```

Name, starting amount, accent colour. Daily reward (18% of amount), bonus (20%) and the 14-day duration are derived just below, so one edit propagates to every page.

## What is and isn't real

The interface, layout, charts, navigation and interactions are fully functional. The **data is not**: price series are generated algorithmically, and Add Funds has no payment gateway, UPI integration, bank connection or card processing. Its QR code is a display placeholder that resolves to no payment address, so scanning it cannot create a payment.

This project is for education and product-design demonstration. It does not offer, broker or execute any investment.
