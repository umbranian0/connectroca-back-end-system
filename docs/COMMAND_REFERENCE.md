# Command Reference

## Purpose of this document

This document explains the main commands used in the ConnectTroca backend project and when each one should be used.
It is written for junior engineers who need both the command and the practical reason behind it.

## Before running commands

Make sure you are inside the backend project folder.

### If you are using the local monorepo layout

```powershell
cd "C:\Users\vasil\Documents\Aulas\projeto integrado 2\backend_conectra\local-dev\connecttroca-api"
```

### If you are using the published standalone repository

```powershell
cd connectroca-back-end-system
```

## Environment setup command

### `Copy-Item .env.example .env`

Purpose:

- creates the local runtime environment file from the committed template

Use this when:

- you are setting up the project for the first time
- `.env` was deleted
- the team updated `.env.example` and you need to refresh local values

## Docker commands

### `docker compose up --build`

Purpose:

- builds the Strapi image if needed
- starts the backend stack

Use this when:

- starting the project
- applying Dockerfile changes
- applying dependency changes

### `docker compose down`

Purpose:

- stops the running containers without deleting volumes

Use this when:

- finishing work for the day
- freeing ports temporarily

### `docker compose down -v`

Purpose:

- stops the containers and removes named volumes

Use this when:

- you need a full reset
- the database state should be discarded
- the local environment became inconsistent

### `docker compose ps`

Purpose:

- shows whether `postgres` and `strapi` are running

Use this when:

- you are unsure whether the backend is up

### `docker compose logs -f strapi`

Purpose:

- streams Strapi logs continuously

Use this when:

- startup fails
- a route throws errors
- you need runtime feedback

### `docker compose logs -f postgres`

Purpose:

- streams PostgreSQL logs continuously

Use this when:

- the database does not start
- Strapi cannot connect to PostgreSQL

## npm scripts

### `npm run docker:up`

Equivalent to:

```powershell
docker compose up --build
```

### `npm run docker:down`

Equivalent to:

```powershell
docker compose down
```

### `npm run docker:reset`

Equivalent to:

```powershell
docker compose down -v
```

### `npm run develop`

Purpose:

- starts Strapi in development mode on the host machine

Use this when:

- you want a non-Docker debugging flow
- PostgreSQL is already available

### `npm run dev`

Same behavior as `npm run develop`.

### `npm run build`

Purpose:

- builds the Strapi admin panel

Use this when:

- checking production-oriented build health
- preparing for `npm run start`

### `npm run start`

Purpose:

- starts the built Strapi application in non-development mode

Use this when:

- simulating a more production-like start sequence

### `npm run strapi`

Purpose:

- exposes the Strapi CLI directly

Examples:

```powershell
npm run strapi -- version
npm run strapi -- help
```

## Practical command sequence for a new engineer

Use this order on first setup:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

Then open:

```text
http://localhost:1337/admin
http://localhost:1337/api/health
```

## Practical command sequence for daily work

Start work:

```powershell
docker compose up --build
```

Inspect problems if needed:

```powershell
docker compose ps
docker compose logs -f strapi
```

Stop work:

```powershell
docker compose down
```

Reset only if necessary:

```powershell
docker compose down -v
```