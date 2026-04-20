# Local Strapi Backend Setup for ConnectTroca

## Objective

This guide defines the local development workflow for the ConnectTroca backend using Strapi and PostgreSQL in Docker. The goal is to give the frontend and backend teams a predictable environment for API development and integration.

## Why this setup exists

The `backend_conectra` repository is the upstream Strapi monorepo. That repository is not an application-level backend for the project. To avoid coupling day-to-day API development to the internal Strapi monorepo workspace, the local project backend lives in:

`local-dev/connecttroca-api`

This directory is a standalone Strapi application configured for Docker-based development.

## Prerequisites

- Docker Desktop running locally
- Port `1337` available for Strapi
- Port `5432` available for PostgreSQL
- Optional: Node.js 20 if you also want to run Strapi outside Docker

## Step-by-step startup

1. Open a terminal in:

```powershell
cd "C:\Users\vasil\Documents\Aulas\projeto integrado 2\backend_conectra\local-dev\connecttroca-api"
```

2. Create the local environment file:

```powershell
Copy-Item .env.example .env
```

3. Start the full backend stack:

```powershell
docker compose up --build
```

This starts two containers:

- `connecttroca-postgres`
- `connecttroca-strapi`

4. Wait until the Strapi logs indicate that the application is running.

5. Open the Strapi admin panel:

```text
http://localhost:1337/admin
```

6. Create the first administrator user when prompted.

7. Validate the backend API with the included health endpoint:

```text
http://localhost:1337/api/health
```

A successful response should contain a JSON payload with `status: ok`.

## Day-to-day commands

From `local-dev/connecttroca-api`:

```powershell
docker compose up --build
docker compose down
docker compose down -v
```

Package scripts are also available:

```powershell
npm run docker:up
npm run docker:down
npm run docker:reset
```

## Database persistence and reset

PostgreSQL data is stored in the named volume `postgres-data`.

If you need a clean reset of the backend and database state:

```powershell
docker compose down -v
```

This removes the PostgreSQL volume and all local Strapi build/cache volumes for this workspace.

## Where to build APIs

Custom APIs should be developed inside:

```text
src/api
```

The workspace already includes a simple public route:

- `GET /api/health`

This endpoint is intended only to confirm that the backend stack is reachable.

## Frontend integration reference

The frontend built earlier should use the following backend base URL in local development:

```text
http://localhost:1337
```

The included CORS configuration already allows common local frontend origins, including:

- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

## Optional non-Docker workflow

If you want to run Strapi directly on the host machine instead of Docker:

1. Install dependencies:

```powershell
npm install
```

2. Start PostgreSQL separately, or keep using the compose PostgreSQL service.

3. Run Strapi in development mode:

```powershell
npm run develop
```

This approach is useful for debugging, but the Docker workflow should remain the default team setup because it standardises the runtime and database environment.

## Recommended next backend steps

1. Define the initial content types required by the frontend screens.
2. Implement authentication and role rules with `users-permissions`.
3. Create collection types for forum topics, messages, resources, groups, and profiles.
4. Seed development data once the first API contracts are stable.
5. Publish an `.env` contract for the frontend team with the backend base URL and any public keys.