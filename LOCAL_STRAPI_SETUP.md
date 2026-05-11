# Local Strapi Backend Setup for ConnectTroca

## Purpose

This document explains the recommended local setup for the ConnectTroca backend using Docker Compose.

## Project location

Use this repository root as the backend workspace:

```text
backend_conectra/connectroca-back-end-system
```

On this machine:

```powershell
cd "C:\Users\vasil\Documents\Aulas\projeto integrado 2\backend_conectra\connectroca-back-end-system"
```

## Runtime model

The standard local runtime is Docker Compose with:

- PostgreSQL
- Strapi

The backend is configured to:

- install dependencies with `npm ci`
- run in development mode inside container
- expose health endpoint at `/api/health`
- expose Swagger/OpenAPI UI at `/documentation`

## Prerequisites

- Docker Desktop
- PowerShell
- Git
- Node `20+` only if you need host-machine `npm` commands

## First-time setup

### 1) Enter project folder

```powershell
cd "C:\Users\vasil\Documents\Aulas\projeto integrado 2\backend_conectra\connectroca-back-end-system"
```

### 2) Create local environment file

```powershell
Copy-Item .env.example .env
```

### 3) Start stack

```powershell
docker compose up --build -d
```

### 4) Validate backend

```powershell
curl http://localhost:1337/api/health
curl http://localhost:1337/documentation
```

Expected:

- `/api/health` -> `200`
- `/documentation` -> `200`

### 5) Open interfaces

- Admin: `http://localhost:1337/admin`
- API docs (Swagger): `http://localhost:1337/documentation`

## Day-to-day commands

Start:

```powershell
docker compose up -d
```

Stop:

```powershell
docker compose down
```

Inspect:

```powershell
docker compose ps
docker compose logs -f strapi
docker compose logs -f postgres
```

Rebuild after dependency/schema changes:

```powershell
docker compose up --build -d
```

Reset local state (destructive):

```powershell
docker compose down -v
docker compose up --build -d
```

## Host-machine commands (optional)

```powershell
npm ci
npm run typecheck
npm run build
npm run develop
```

## May 2026 relation and access updates

The backend now enforces stronger relation integrity and user visibility boundaries:

- relation mapping corrections (`mappedBy` / `inversedBy`) across core collections
- reverse relation fields on `plugin::users-permissions.user`
- scoped reads for protected collections (`profiles`, `group-members`, `user-areas`)
- ownership checks for update/delete operations
- duplicate prevention for relation tables (`group-members`, `user-areas`, `likes`)
- one-target validation rules for `comments` and `likes`

## Development rules

1. Do not edit `types/generated/*` manually.
2. Keep schema changes in `src/api/<name>/content-types/<name>/schema.json`.
3. Keep access/business checks in controllers or services.
4. After relation/schema changes, restart backend and validate endpoints.

## Main code locations

- Schemas: `src/api/*/content-types/*/schema.json`
- Controllers: `src/api/*/controllers/*.ts`
- Routes: `src/api/*/routes/*.ts`
- Startup automation and permissions: `src/index.ts`
- Swagger plugin config: `config/plugins.ts`
- Relation helper utilities: `src/utils/relationPayload.ts`

## Documentation map

1. `README.md`
2. `STUDENT_GUIDE.md`
3. `LOCAL_STRAPI_SETUP.md`
4. `DEPLOYMENT_ENVIRONMENT.md`
5. `docs/*`
