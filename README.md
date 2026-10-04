# BloomFlash

BloomFlash is a flower storefront built around a circular ritual: choose fresh flowers for daily worship, receive them at home, then return used blooms for a second life. This repository contains the storefront and API together as one project.

## Features

- Responsive flower, garland and daily-pack storefront with search and cart.
- Ritual Studio that suggests budget-aware flower plans from occasion, frequency and flower preferences.
- Demo account sign-in, checkout, order history, PhoolCoins, wallet credit and used-flower pickup flows.
- Local flower photography and a looping, locally bundled circular-economy hero animation.

## Technology

- Frontend: React, TypeScript and Vite.
- Backend: Node.js and Express.
- Demo persistence: local JSON file (`backend/db.json`). It is ignored by Git and starts empty when absent.

## Run locally

Use Node.js 20 or newer. Start the API and storefront in separate terminals from the repository root.

Terminal 1 — API:

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

Terminal 2 — storefront:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:8080`. Vite proxies `/api` requests to the local API. For a deployed API, configure `VITE_API_URL` using `frontend/.env.example`.

## Demo flow

1. Create an account with a valid email and a password of at least 8 characters.
2. Browse flowers, add items to the cart, and proceed through checkout.
3. View order history and wallet rewards, or schedule a used-flower pickup.
4. Open Ritual Studio to compose a plan for an occasion, budget, frequency and flower preference.

Available demo coupon codes: `NEWUSER50`, `RECYCLE20`, `PHOOL10`, and `TRAY5`. The API validates coupon eligibility and recalculates prices from its own catalog.

## Data and payment notes

This is a portfolio prototype. New demo accounts, orders and pickups are written to `backend/db.json` on the machine running the API. The current local demo data has been cleared. Do not commit this file or environment secrets. The sign-in implementation hashes passwords, but local JSON storage is for demonstration only; use a managed database, secure sessions, HTTPS and rate limiting before serving real customers.

Payment choices are interface prototypes and do not charge money; a payment provider is not configured. Delivery availability is illustrative and needs a real service integration before launch. Ritual Studio uses deterministic rules and does not call an external AI service.

## Repository layout

```text
backend/   Express API and demo data configuration
frontend/  React storefront, styles and bundled assets
```

The frontend and backend are intended to be published together in one **public** GitHub repository for the project submission. Keep `backend/db.json`, `.env` files, `node_modules` and build output out of the repository.
