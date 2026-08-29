# RTPOS Restaurant Order — Frontend

React (Create React App) + Tailwind frontend for the restaurant order flow
that connects to the RTPOS system. This package is **frontend only** — point
it at your Node.js/Express + MSSQL backend once the endpoints below are
ready. Until then it runs fully on local mock data. Built with
`react-scripts` + `craco` (craco is only there so Tailwind's `postcss.config.js`
is picked up — no other build behaviour is changed).

## Run it

```bash
npm install
npm start
```

Opens at `http://localhost:3000`. Demo login (mock mode):

| Username   | Password |
|------------|----------|
| cashier01  | 1234     |
| cashier02  | 1234     |

## Configuration (`.env`)

| Variable | Purpose |
|---|---|
| `REACT_APP_API_BASE_URL` | Static IP/port of the RTPOS backend API |
| `REACT_APP_COMPANY_CODE`, `REACT_APP_UNIT_NO`, `REACT_APP_PRINTER_TYPE`, `REACT_APP_MEASUREMENT` | Shown on the order header, mirrors the POS terminal screen |
| `REACT_APP_USE_MOCK_DATA` | `true` to run against `src/data/mockData.js` instead of the API |

Switch `REACT_APP_USE_MOCK_DATA=false` once the backend is live — no other
code changes are needed, the service layer already targets the real
endpoints. Restart `npm start` after any `.env` change — CRA only reads
`.env` at startup.

## Expected backend endpoints

All service files under `src/services/` document the exact contract inline.
Summary:

| Method & path | Purpose |
|---|---|
| `POST /auth/login` | Body `{ username, password }`. Check against the POS cashier table (e.g. `tb_USERS`). Returns `{ token, cashier: { cashierCode, username, name } }`. |
| `GET /departments` | Restaurant departments configured on the POS. Returns `[{ id, code, name, icon }]`. |
| `GET /departments/:departmentId/categories` | Categories under a department (Rice, Kottu, Beverages…). Returns `[{ id, name }]`. |
| `GET /categories/:categoryId/products` | Products with images. Returns `[{ pCode, name, price, image }]`. |
| `GET /tables` | Dine-in tables. Returns `[{ number, capacity, status }]`. |
| `GET /invoices/next?unitNo=` | Next running invoice number. Returns `{ invoiceNo }`. |
| `POST /orders` | Submits the finished order — see `orderService.js` for the full payload shape. |

Auth: the frontend sends `Authorization: Bearer <token>` on every request once
logged in (see `src/config/api.js`).

## Project structure

```
src/
  components/
    Login/          — cashier sign-in screen
    Layout/          — top header (branding, cashier, clock, sign out)
    Menu/            — department → category → product browsing
    Order/           — order panel: info header, line items, totals,
                       Takeaway/Dine In toggle, table selector modal
    Common/          — ProtectedRoute
  context/
    AuthContext.jsx  — cashier session
    OrderContext.jsx — cart, order type, table, invoice no, totals
  services/          — API calls (auth, catalog, tables, orders)
  data/mockData.js   — demo data used when VITE_USE_MOCK_DATA=true
  utils/format.js    — currency/date formatting, totals math
  pages/POSPage.jsx  — combines browsing + order panel
```

## Notes on the flow

- Login checks the cashier against the POS cashier table.
- Main Menu shows departments fetched from the POS.
- Department → Categories → Products, with images on each product card.
- Tapping a product adds it to the order panel on the right, which mirrors
  the POS invoice screen: company code, cashier code, invoice no, date/time,
  line-items table, and totals (Total / Discount / Net Total / Balance).
- Takeaway / Dine In is available at every step (top of the order panel).
  Dine In opens a table picker; occupied tables are disabled.
- The breadcrumb (Main Menu / Department / Category) lets the cashier jump
  back to add more products without losing the current order.
