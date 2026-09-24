# Product Admin Dashboard

A small admin dashboard for managing products from the [DummyJSON](https://dummyjson.com) API.
Built with Next.js (App Router), React, TypeScript, Tailwind CSS and Axios.

**Live demo:** https://nexgensis-phi.vercel.app
**Login:** `emilys` / `emilyspass`

## Setup

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build: `npm run build && npm start`

## What's finished

- [x] Login (`POST /auth/login`) with error messages, a protected `/products` area and a logout button
- [x] Product list: image, title, category, price, rating and stock (table on desktop, cards on mobile)
- [x] Server-side pagination with `limit`/`skip`, page numbers, Previous/Next, page size 10/20/50 and "Showing 21–40 of 194"
- [x] Debounced search (`/products/search?q=`), which goes back to page 1 when the search changes
- [x] Category filter (`/products/categories`) and sort by title, price or rating
- [x] Product details at `/products/[id]` with images, description, price and reviews, plus a "not found" page
- [x] Add and edit form with validation, and a confirm popup before deleting
- [x] Loading, empty and error states (with Retry)
- [x] One shared Axios instance: adds the token to every request and handles errors in one place
- [x] Page, page size, search, category and sort are all kept in the URL
- [x] Old search results never replace newer ones (the old request is aborted and its response ignored)
- [x] Bad URL values (`?page=abc`, `?page=999`, `?limit=7`) fall back to safe values
- [x] Login, Save and Delete can't be sent twice by fast clicking

Not done: automated tests.

**About the UI:** the design is kept simple on purpose. With two days available, I focused on the parts the brief stresses: correct data handling, URL state, race conditions, edge cases and clean code structure. The layout is still responsive and usable.

## Project structure

```
src/
  lib/         axios.ts (shared instance), auth.ts, urlState.ts, pagination.ts, overrides.ts, productForm.ts
  api/         auth.api.ts, products.api.ts  (all API calls live here)
  hooks/       useProductList, useProduct, useCategories, useListUrlState, useDebounce, useLocalOverrides, ...
  components/  small UI components (table, cards, pagination, search, form, dialogs, state views)
  app/         routes: /login, /products, /products/[id]
```

To test the search race condition, open `/products?delay=2000` (the app passes `delay` on to DummyJSON) and type quickly.

See [NOTES.md](NOTES.md) for the reasons behind the main decisions.
