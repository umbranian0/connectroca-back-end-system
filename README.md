# ConnectTroca Backend (Strapi 5) - Student + Deployment Guide

This repository is the backend API used by the ConnectTroca frontend.

Student quick guide: `STUDENT_GUIDE.md`

## May 2026 update summary

- Relations were aligned with the project ERD (`mappedBy` / `inversedBy` fixes).
- User-scoped access rules were added to prevent cross-user data exposure.
- Public role access was reduced to safe read-only collections.
- Swagger/OpenAPI documentation is now enabled at `/documentation`.

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
  - Role and permission setup
  - Demo data seeding for frontend integration

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

### 4. Validate endpoints

```powershell
curl http://localhost:1337/api/health
curl http://localhost:1337/documentation
```

Expected status:

- `/api/health` -> `200`
- `/documentation` -> `200`

### 5. Open Strapi admin and API docs

- Admin: `http://localhost:1337/admin`
- Swagger UI: `http://localhost:1337/documentation`

## Demo credentials (seeded)

- Email: `integration.user@example.com`
- Password: `Integration123!`

## Current API visibility rules (important for students)

Public users can only read:

- `areas`
- `groups`
- `materials`
- `topics`
- `posts`
- `comments`
- `likes`

`profiles`, `group-members`, and `user-areas` are no longer public and are scoped by authenticated user logic.

For authenticated users, update/delete on user-owned collections are protected by ownership checks (for example: profile owner, post author, group creator).

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

Run local checks:

```powershell
npm run typecheck
npm run build
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

## Where each type of change should go

- Schema: `src/api/<name>/content-types/<name>/schema.json`
- Controller: `src/api/<name>/controllers/<name>.ts`
- Routes: `src/api/<name>/routes/<name>.ts`
- Service logic: `src/api/<name>/services/<name>.ts`
- Startup automation (roles/seed): `src/index.ts`
- Swagger config: `config/plugins.ts`

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

### 4. Deploy to Heroku

```bash
git push heroku main
```

### 5. Verify deployment

```bash
heroku open -a <your-backend-app-name>
heroku open -a <your-backend-app-name> --path /admin
curl https://<your-backend-app-name>.herokuapp.com/api/health
curl https://<your-backend-app-name>.herokuapp.com/documentation
```

If admin is inaccessible, check logs:

```bash
heroku logs --tail -a <your-backend-app-name>
```




