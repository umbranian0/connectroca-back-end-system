# Local Strapi Backend Setup for ConnectTroca

## Purpose of this document

This guide explains how to start, understand, and maintain the local ConnectTroca backend environment.
It is written for junior software engineers who need a reliable, step-by-step process to run the backend locally and integrate it with the frontend.

The backend stack uses:

- Strapi as the headless CMS and API framework
- PostgreSQL as the relational database
- Docker Compose to run both services locally

## Important context

The folder `backend_conectra` is the upstream Strapi monorepo.
That repository is useful as a source of Strapi code, but it is not the project backend that the team should work on every day.

For project development, the real local backend workspace is:

```text
local-dev/connecttroca-api
```

This workspace is intentionally isolated so that engineers can focus on building the project API instead of working inside Strapi's internal monorepo structure.

## How to get to the project

Use one of the following entry paths, depending on how you received the codebase.

### Option 1. You already have the local monorepo folder on your machine

Open PowerShell and run:

```powershell
cd "C:\Users\vasil\Documents\Aulas\projeto integrado 2\backend_conectra\local-dev\connecttroca-api"
```

### Option 2. You are starting from the published backend repository

Clone the repository and enter it:

```powershell
git clone https://github.com/umbranian0/connectroca-back-end-system.git
cd connectroca-back-end-system
```

In the published repository, the backend project is already at the repository root, so there is no additional `local-dev/connecttroca-api` level.

## What this local workspace contains

The local backend workspace includes the following main pieces:

- a standalone Strapi application
- a Docker Compose file that starts PostgreSQL and Strapi together
- an environment template in `.env.example`
- CORS configuration for the local frontend
- a sample public route at `GET /api/health`
- documentation for commands, structure, workflow, and troubleshooting

## Who should use this guide

Use this guide if you need to:

- run the backend for the first time
- understand which folder actually matters for project work
- create the first admin user in Strapi
- connect the frontend to a local backend
- reset the local database safely
- start building new APIs under `src/api`

## Prerequisites

Before running anything, make sure the following tools are available:

- Docker Desktop
- a terminal with PowerShell support
- optional: Node.js 20 if you want to run Strapi without Docker
- optional: Git if you need to clone the published repository

You also need these ports to be free on your machine:

- `1337` for Strapi
- `5432` for PostgreSQL

## First-time setup

### Step 1. Create the environment file

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Why this matters:

- `.env.example` is a template committed to version control
- `.env` is the local machine-specific file used at runtime
- `.env` should not be committed because it contains environment-specific settings and may later contain secrets

### Step 2. Start the containers

Run:

```powershell
docker compose up --build
```

What this command does:

- builds the Strapi container image from the local Dockerfile
- starts a PostgreSQL container
- starts a Strapi container
- mounts the local project directory into the container for live development
- creates Docker volumes for the database, uploads, cache, and node modules

The first run usually takes longer because dependencies and images may need to be downloaded.

### Step 3. Wait for Strapi to finish booting

Do not open the admin panel immediately.
Wait until the logs show that the application is ready.

What you are looking for conceptually:

- PostgreSQL is healthy
- Strapi has connected to the database
- Strapi has finished booting in development mode

### Step 4. Open the admin panel

Once the backend is running, open:

```text
http://localhost:1337/admin
```

On the first run, Strapi will ask you to create the first administrator account.
This account lets you manage content types, users, permissions, and data.

### Step 5. Confirm the public API is reachable

Open:

```text
http://localhost:1337/api/health
```

Expected result:

- a JSON response
- `status` should be `ok`

This endpoint is a simple connectivity check.
It proves that the backend container is up and that the API layer is reachable from the browser.

## Day-to-day commands

All commands below should be run from the backend project folder.
If you are inside the monorepo layout, that means `local-dev/connecttroca-api`.
If you are inside the published repository, that means the repository root.

### Main Docker commands

#### `docker compose up --build`

Purpose:

- builds the Strapi image if needed
- starts PostgreSQL and Strapi
- prepares the backend for daily development

Use this when:

- you are starting the backend for the day
- the Docker image changed
- package dependencies changed

#### `docker compose down`

Purpose:

- stops the containers
- keeps volumes and database data intact

Use this when:

- you want to stop working temporarily
- you want to free the ports
- you do not want to lose data

#### `docker compose down -v`

Purpose:

- stops the containers
- removes named volumes
- deletes local database state

Use this when:

- the local database is corrupted
- you want a completely clean environment
- you want to recreate the first admin user from scratch

#### `docker compose ps`

Purpose:

- lists the current status of the services

Use this when:

- you want to confirm whether `postgres` and `strapi` are running

#### `docker compose logs -f strapi`

Purpose:

- streams live Strapi logs

Use this when:

- Strapi does not start
- routes do not behave as expected
- you need to inspect runtime errors

#### `docker compose logs -f postgres`

Purpose:

- streams PostgreSQL logs

Use this when:

- Strapi cannot connect to the database
- you suspect database startup problems

### npm script commands

The following commands are defined in `package.json`.

#### `npm run docker:up`

Shortcut for:

```powershell
docker compose up --build
```

#### `npm run docker:down`

Shortcut for:

```powershell
docker compose down
```

#### `npm run docker:reset`

Shortcut for:

```powershell
docker compose down -v
```

#### `npm run develop`

Purpose:

- starts Strapi in development mode on the host machine instead of Docker

Use this when:

- you want host-machine debugging
- you already have PostgreSQL running and configured

#### `npm run dev`

Same as `npm run develop`.

#### `npm run build`

Purpose:

- builds the Strapi admin panel assets

Use this when:

- you want a production-oriented start sequence
- you want to validate that the admin build succeeds

#### `npm run start`

Purpose:

- starts Strapi in non-development mode after a build

Use this when:

- you want to simulate a more production-like runtime

#### `npm run strapi`

Purpose:

- runs the Strapi CLI directly

Examples:

```powershell
npm run strapi -- version
npm run strapi -- help
```

## How the local stack is structured

The Docker Compose setup contains two services.

### `postgres`

Responsibilities:

- stores relational data for Strapi
- persists data across container restarts through a named volume

Important notes:

- database name comes from `DATABASE_NAME`
- username comes from `DATABASE_USERNAME`
- password comes from `DATABASE_PASSWORD`

### `strapi`

Responsibilities:

- runs the backend API
- serves the admin panel
- serves public REST endpoints
- uses the PostgreSQL container as its database

Important notes:

- runs in development mode
- mounts the local project folder into the container
- installs dependencies in the container if they are not present yet

## Key files and why they matter

### `.env.example`

This file defines the environment variables needed to run the project.
It includes:

- server host and port
- Strapi secrets
- PostgreSQL connection settings
- allowed frontend origins for CORS

### `docker-compose.yml`

This file defines the full local runtime.
It tells Docker:

- which containers to start
- which ports to expose
- which folders and volumes to mount
- which service must wait for the database to become healthy

### `Dockerfile`

This file defines how the Strapi container is built.
It uses Node.js 20 and starts the app in development mode.

### `config/database.ts`

This file tells Strapi how to connect to PostgreSQL.
If the values in `.env` are wrong, Strapi will fail to start.

### `config/server.ts`

This file defines:

- host
- port
- public URL
- application keys used by Strapi

### `config/middlewares.ts`

This file is important for frontend integration.
It enables CORS for the local frontend origins so browser requests from the frontend are accepted by the backend.

### `src/api`

This folder is where project APIs should be created.
Each API feature typically has its own folder with routes, controllers, services, and schemas depending on how the feature is built.

### `src/api/health`

This is the sample API already included.
Use it as a very small reference for the route and controller structure.

## Where future development should happen

Future backend work should be concentrated in predictable places.

### Primary development area: `src/api`

This is where new project modules should be created.
The first likely modules are:

- `src/api/profiles`
- `src/api/groups`
- `src/api/forum-topics`
- `src/api/resources`
- `src/api/messages`

Use this area for:

- routes
- controllers
- services
- feature-specific schemas
- custom business logic

### Cross-cutting configuration area: `config`

Use this only when a change affects the whole backend.
Examples:

- CORS changes
- server URL changes
- database configuration changes
- API pagination defaults

### Admin configuration and content modeling: Strapi admin panel

Use the admin panel for:

- content type creation
- field changes
- role and permission settings
- content management

### Documentation area: `docs`

Update documentation whenever you add:

- a new command
- a new required environment variable
- a new setup step
- a new feature module that other engineers need to understand

## Frontend integration

The frontend should use this base URL locally:

```text
http://localhost:1337
```

If the frontend uses `fetch`, Axios, or another client, API calls should point to routes under this base URL.

Examples:

```text
http://localhost:1337/api/health
http://localhost:1337/api/groups
http://localhost:1337/api/resources
```

CORS is already configured for common local frontend origins, including:

- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

## Recommended development workflow

A junior engineer should follow this sequence:

1. Get to the backend project folder.
2. Start the backend with Docker.
3. Confirm `/api/health` works.
4. Open the admin panel.
5. Create or update content types.
6. Add routes and controllers under `src/api` if custom endpoints are needed.
7. Test the endpoint in the browser or Postman.
8. Connect the frontend to the endpoint.
9. Only reset the database if necessary.

## Common problems and what they usually mean

### Port `1337` is already in use

Meaning:

- another Strapi process is already running
- another application is using the port

Fix:

- stop the other process
- or change the `PORT` value in `.env`

### Port `5432` is already in use

Meaning:

- another PostgreSQL instance is already running locally

Fix:

- stop the other PostgreSQL process
- or map the compose port differently and update the relevant settings

### Strapi cannot connect to the database

Meaning:

- PostgreSQL is not healthy yet
- the credentials in `.env` do not match the container settings
- a stale volume may contain incompatible state

Fix:

1. check the container logs
2. confirm `.env` values
3. if needed, run `docker compose down -v` and start again

### The frontend gets CORS errors

Meaning:

- the frontend origin is not listed in `CORS_ORIGIN`

Fix:

- add the frontend origin to `.env`
- restart the backend after changing the environment file

## Optional host-machine workflow

You can run Strapi directly on the host machine instead of inside Docker.
This is useful for some debugging workflows, but it should not be the default team setup.

Basic sequence:

```powershell
npm install
npm run develop
```

If you use this path, you still need a running PostgreSQL database.
The safest approach is usually to keep PostgreSQL in Docker and run only Strapi on the host if needed.

## Recommended next implementation steps

1. Create the project content types needed by the frontend.
2. Define role and permission rules in `users-permissions`.
3. Implement API contracts for groups, forum topics, resources, profile data, and messages.
4. Add development seed data after the content model is stable.
5. Document the frontend environment variables that point to this backend.

## Related documentation

If you are in the published standalone repository, read these files directly at the repository root.
If you are in the monorepo layout, the backend-specific files below are under `local-dev/connecttroca-api`, while `LOCAL_STRAPI_SETUP.md` remains at the monorepo root.

- `README.md`
- `LOCAL_STRAPI_SETUP.md`
- `docs/COMMAND_REFERENCE.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/API_DEVELOPMENT_WORKFLOW.md`
- `docs/FUTURE_DEVELOPMENT_AREAS.md`
- `docs/TROUBLESHOOTING.md`