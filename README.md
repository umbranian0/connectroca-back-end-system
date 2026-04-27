# ConnectTroca Backend (Strapi 5) - Student + Deployment Guide

This repository is the backend API consumed by the ConnectTroca frontend.

## What this backend includes

- Strapi collections aligned with the ERD:
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
- Bootstrap automation on startup:
  - Role permission setup (public read + authenticated CRUD)
  - Demo data seeding for immediate frontend visualization

## Prerequisites (student machine)

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

## Heroku deployment (recommended for backend production)

Full variable checklist: `DEPLOYMENT_ENVIRONMENT.md`

This project is prepared for Heroku with:

- `Procfile` (`web: npm run start`)
- `heroku-postbuild` script in `package.json`
- `DATABASE_URL` support in `config/database.ts`
- Heroku env templates: `.env.heroku.example` and `.env.production.example`

### 1. Create Heroku app and Postgres add-on

```bash
heroku login
heroku create <your-backend-app-name>
heroku addons:create heroku-postgresql:essential-0 -a <your-backend-app-name>
```

### 2. Confirm Heroku provided `DATABASE_URL`

```bash
heroku config:get DATABASE_URL -a <your-backend-app-name>
```

Do not commit database credentials in git. Keep secrets only in Heroku config vars.

### 3. Set required backend config vars

```bash
heroku config:set \
  NODE_ENV=production \
  HOST=0.0.0.0 \
  IS_PROXIED=true \
  HEROKU_APP_NAME=<your-backend-app-name> \
  PUBLIC_URL=https://<your-backend-app-name>.herokuapp.com \
  ADMIN_URL=/admin \
  DATABASE_CLIENT=postgres \
  DATABASE_SSL=true \
  DATABASE_SSL_REJECT_UNAUTHORIZED=false \
  CORS_ORIGIN=https://connectroca-front-end-system.vercel.app,http://localhost:5173,http://127.0.0.1:5173 \
  FRONTEND_DEVELOP_URL=https://connectroca-front-end-system.vercel.app \
  CORS_ALLOW_VERCEL_PREVIEWS=true \
  STRAPI_TELEMETRY_DISABLED=true \
  -a <your-backend-app-name>
```

Set security secrets (generate strong random values):

```bash
heroku config:set \
  APP_KEYS="<k1>,<k2>,<k3>,<k4>" \
  API_TOKEN_SALT="<api-token-salt>" \
  ADMIN_JWT_SECRET="<admin-jwt-secret>" \
  TRANSFER_TOKEN_SALT="<transfer-token-salt>" \
  JWT_SECRET="<jwt-secret>" \
  ENCRYPTION_KEY="<encryption-key>" \
  -a <your-backend-app-name>
```

Important:

- If `DATABASE_URL` exists, the app uses it automatically.
- `DATABASE_SSL` defaults to `true` when `DATABASE_URL` is present.
- If you also want component-style DB vars (`DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`) synced in Heroku, run:

```bash
npm run heroku:sync-db-vars -- <your-backend-app-name>
```

### 4. Deploy to Heroku

```bash
git push heroku main
```

If your branch is `master`:

```bash
git push heroku master
```

### 5. Verify deployment

```bash
heroku open -a <your-backend-app-name>
heroku open -a <your-backend-app-name> --path /admin
curl https://<your-backend-app-name>.herokuapp.com/api/health
```

If admin is inaccessible, check logs:

```bash
heroku logs --tail -a <your-backend-app-name>
```

## Vercel frontend + Heroku backend

Recommended architecture:

- Frontend on Vercel
- Backend (Strapi) on Heroku

Set frontend variable (`connectroca-front-end-system`) to the backend URL:

- `VITE_STRAPI_URL=https://<your-backend-app-name>.herokuapp.com`

## CORS support

`config/middlewares.ts` supports both:

1. Explicit allowed origins through `CORS_ORIGIN`
2. Optional wildcard for Vercel preview domains through `CORS_ALLOW_VERCEL_PREVIEWS=true`

It also includes safe defaults for hybrid usage:

- Local frontend origins (`http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000`, `http://127.0.0.1:3000`)
- Develop frontend origin from `FRONTEND_DEVELOP_URL` (defaults to `https://connectroca-front-end-system.vercel.app`)

## Runtime modes (local, develop, cross)

1. Full local (`frontend local` + `backend local`):
   - Use `.env.example`
   - Keep `DATABASE_URL` empty and local Postgres settings
2. Full develop (`frontend Vercel` + `backend Heroku`):
   - Use Heroku config with `.env.heroku.example`
   - Set `PUBLIC_URL` to Heroku URL and keep `DATABASE_SSL=true`
3. Cross (`frontend local` -> `backend Heroku`):
   - Backend must allow local frontend origins in CORS
   - Keep `CORS_ORIGIN` including both `https://connectroca-front-end-system.vercel.app` and local origins
   - Keep `FRONTEND_DEVELOP_URL=https://connectroca-front-end-system.vercel.app`

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

1. Verify JWT-related env vars are present in Heroku.
2. Restart backend dyno (`heroku ps:restart -a <your-backend-app-name>`).
3. Retry login/register from frontend.




