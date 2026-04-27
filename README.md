# ConnectTroca Backend (Strapi 5) - Student + Production Guide

This is the backend repository used by the frontend project.

## What this backend already includes

- Strapi collections matching the project ERD:
  - `profiles`
  - `areas`
  - `groups`
  - `group-members`
  - `user-areas`
  - `materials`
  - `topics`
  - `posts`
  - `comments`
  - `likes`
- Automatic bootstrap on startup:
  - Role permission setup (public read, authenticated CRUD)
  - Demo data seeding for immediate frontend visualization

## Prerequisites (each student machine)

1. Docker Desktop (running)
2. Git
3. Optional for host mode: Node.js 20+

## Local development setup

### 1. Open project folder

```powershell
cd "C:\Users\vasil\Documents\Aulas\projeto integrado 2\backend_conectra\connectroca-back-end-system"
```

### 2. Configure environment (first run only)

```powershell
Copy-Item .env.example .env
```

### 3. Start backend

```powershell
docker compose up --build -d
```

### 4. Validate health endpoint

```powershell
curl http://localhost:1337/api/health
```

### 5. Open Strapi admin

- `http://localhost:1337/admin`

## Demo credentials (seeded)

- Email: `integration.user@example.com`
- Password: `Integration123!`

## Vercel ecosystem preparation (important)

Strapi itself is not usually deployed on Vercel for production. Recommended architecture:

- Frontend on Vercel
- Strapi backend on a Node-friendly host (Render, Railway, Fly.io, VPS, etc.)

This repository is already prepared for that flow.

## Production env template

Use the file:

- `.env.production.example`

It includes production placeholders for:

- public backend URL
- database credentials
- JWT/app secrets
- CORS for Vercel domains

## CORS support for Vercel

`config/middlewares.ts` now supports both:

1. Explicit allowed origins via `CORS_ORIGIN`
2. Optional automatic allowance for `https://*.vercel.app` via:

```env
CORS_ALLOW_VERCEL_PREVIEWS=true
```

Recommended production setup:

- Add your production frontend domain(s) to `CORS_ORIGIN`
- Enable `CORS_ALLOW_VERCEL_PREVIEWS=true` for preview deployments

## Minimum production env values to set

- `NODE_ENV=production`
- `PUBLIC_URL=https://your-backend-domain`
- `APP_KEYS` (4 strong values)
- `JWT_SECRET`
- `ADMIN_JWT_SECRET`
- `API_TOKEN_SALT`
- `TRANSFER_TOKEN_SALT`
- `ENCRYPTION_KEY`
- `DATABASE_*` values
- `CORS_ORIGIN`
- `CORS_ALLOW_VERCEL_PREVIEWS`

## Daily usage commands

Start existing containers:

```powershell
docker compose up -d
```

Stop containers:

```powershell
docker compose down
```

Logs:

```powershell
docker compose logs -f strapi
```

## Full reset (destructive)

```powershell
docker compose down -v
docker compose up --build -d
```

## Host-machine mode (optional)

```powershell
npm ci
npm run develop
```

## Beginner safety rules

1. Do not edit `types/generated/*` manually.
2. Keep backend custom code inside `src/api/*` and `src/index.ts`.
3. After schema changes, restart backend and test endpoint responses.

## Where each type of change should go

- Schema: `src/api/<name>/content-types/<name>/schema.json`
- Controller: `src/api/<name>/controllers/<name>.ts`
- Routes: `src/api/<name>/routes/<name>.ts`
- Service logic: `src/api/<name>/services/<name>.ts`
- Startup automation (roles/seed): `src/index.ts`

## Troubleshooting quick checks

If frontend has no data:

1. Check `/api/health` returns `200`.
2. Check Strapi logs for bootstrap/CORS errors.
3. Validate at least one endpoint, e.g. `/api/topics?populate=*`.
4. Confirm frontend `VITE_STRAPI_URL` points to this backend.

If authentication fails:

1. Verify JWT-related env vars are present.
2. Restart backend service.
3. Retry with test credentials above.
