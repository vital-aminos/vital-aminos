# Vital Aminos — site

Research-peptide storefront. Next.js 16 (App Router) + TypeScript + Tailwind v4,
Neon Postgres via Prisma 7 (`pg` driver adapter), Google sign-in via Auth.js v5.

Visitors can browse and place orders once signed in. **Payment is not wired up yet** —
placing an order just records it as `PENDING_PAYMENT`; there's no charge. The admin
panel lets the site owner add/edit/hide items without touching code.

## Stack
- Next.js 16 / React 19 / TypeScript / Tailwind v4
- Prisma 7 + `@prisma/adapter-pg` against **Neon Postgres**
- Auth.js v5 (`next-auth`) with the **Google** provider, database-backed sessions
- Zod for form validation

`legacy-static/` holds the original static HTML/CSS/JS page this was rebuilt from —
kept only as a design reference, not part of the app.

## One-time setup

### 1. Neon database (DONE ALREADY)
1. Create a project at [neon.tech](https://neon.tech).
2. Copy the **pooled** connection string into `DATABASE_URL`, and the **direct**
   (non-pooled) connection string into `DIRECT_URL`, in `.env`.

### 2. Google OAuth (MOSTLY DONE ALREADY) 
1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
   create an OAuth 2.0 Client ID (Web application).
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` ( (((((((((((((((((((((((((MAKE SURE TO ADD ACTUAL DOMAIN AT SOME POINT)
   (add the production equivalent, e.g. `https://yourdomain.com/api/auth/callback/google`,
   once deployed).
3. Put the client ID/secret into `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` in `.env`.
4. **OAuth consent screen must be Published (Production), not "Testing"** — Testing mode
   only allows pre-approved test-user emails to sign in.

### 3. Env vars
Copy `.env.example` → `.env` (already done in this repo) and fill in real values:
- `DATABASE_URL`, `DIRECT_URL` — from Neon
- `AUTH_SECRET` — generate with `npx auth secret`
- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` — from Google Cloud Console
- `NEXTAUTH_URL` — `http://localhost:3000` locally; the live domain in production
- `ADMIN_EMAILS` — comma-separated Google emails to auto-promote to admin on sign-in
  (e.g. the client's own email). Whoever signs in with one of these emails becomes an
  admin automatically; you can also flip `isAdmin` on a `User` row directly via
  `npm run db:studio`.

### 4. Install, migrate, seed
```bash
npm install
npm run db:migrate    # creates tables in Neon
npm run db:seed       # optional: loads the original 6 example products
```

### 5. Run
```bash
npm run dev
```
Open http://localhost:3000. Sign in with an email listed in `ADMIN_EMAILS` to see
the **Admin** link in the header (or go straight to `/admin`).

## Admin panel
`/admin` — visible only to admins:
- **Items** (`/admin`) — table of all products, with show/hide and delete
- **Add item** (`/admin/items/new`) — name, slug, price, short note, description, image URL
- **Edit item** (`/admin/items/[id]/edit`) — same form, pre-filled

Hidden items stay in the database and are reachable by direct admin link, but don't
show in the shop grid or to non-admins.

## Orders
Signed-in users can add items to a cart (stored client-side) and place an order from
`/cart`. This creates an `Order` + `OrderItem` rows priced from the live database (not
from stale client data) with status `PENDING_PAYMENT`. `/orders` shows a user's own
order history. There's no admin order-management UI yet and no payment collection —
add both once a payment processor is chosen.

## Access gate
Before anything else loads, visitors confirm a research role and a 21+/research-use
affirmation (`src/components/AccessGate.tsx`) — unchanged in spirit from the original
static page, just ported to React. "Remember me for 5 days" stores the grant in
`localStorage` (`va_access_grant`).

## Deploying
Not deployed yet. When ready, Vercel is the recommended target (matches the Prisma 7
driver-adapter setup): connect the repo, set the same env vars in the Vercel project
settings (with `NEXTAUTH_URL` set to the real domain), and add the production OAuth
redirect URI in Google Cloud Console. `postinstall` already runs `prisma generate`
automatically on deploy.
