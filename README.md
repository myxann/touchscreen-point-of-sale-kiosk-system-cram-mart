# CRAM MART

A touchscreen-oriented React/Vite POS for academic emergencies.

## Setup

1. Run `npm install` and then `npm run dev`.
2. Create a Supabase project and open its SQL Editor.
3. Run [`supabase/schema.sql`](supabase/schema.sql).
4. Copy `.env.example` to `.env.local`, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the project settings.
5. Restart the Vite server after adding environment variables.

Use `npm run build` for a production build and `npm run preview` to preview it.

Without Supabase configuration, the seeded product fallback keeps the practical transaction flow usable locally; completed orders are not persisted remotely. With environment variables configured, active products load from Supabase and successful orders/items are saved after payment.

## Technology and flow

React + Vite, JavaScript, plain CSS, and `@supabase/supabase-js`. One state-based app implements Item Selection → Order Summary → Payment Method → Payment Processing → Payment Successful → Receipt → New Transaction. No real payment gateway is used.
