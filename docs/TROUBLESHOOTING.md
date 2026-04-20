# Troubleshooting

## Purpose of this document

This document helps junior engineers diagnose the most common local setup problems without guessing.

## Problem: `docker compose up --build` fails immediately

Common causes:

- Docker Desktop is not running
- the current folder is wrong
- the compose file cannot be parsed

Checks:

1. confirm Docker Desktop is open
2. confirm you are in `local-dev/connecttroca-api`
3. run `docker compose config`

## Problem: the admin panel does not open

Expected URL:

```text
http://localhost:1337/admin
```

Common causes:

- Strapi is still booting
- port `1337` is occupied
- Strapi failed during startup

Checks:

1. inspect container logs
2. confirm no other process is using port `1337`
3. confirm the `strapi` container is running

## Problem: the health endpoint does not respond

Expected URL:

```text
http://localhost:1337/api/health
```

Common causes:

- Strapi did not finish booting
- route or controller files were modified incorrectly
- the container is restarting because of an error

Checks:

1. inspect Strapi logs
2. confirm `src/api/health/routes/health.ts` exists
3. confirm `src/api/health/controllers/health.ts` exists

## Problem: PostgreSQL connection errors appear in the logs

Common causes:

- PostgreSQL is not healthy yet
- `.env` values are incorrect
- a stale volume is causing inconsistent local state

Checks:

1. confirm `DATABASE_HOST=postgres`
2. confirm `DATABASE_PORT=5432`
3. confirm `DATABASE_NAME`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD` match the compose values
4. if necessary, reset with `docker compose down -v`

## Problem: CORS errors appear in the browser

Common causes:

- the frontend origin is not in `CORS_ORIGIN`
- the backend was not restarted after an environment change

Checks:

1. inspect `.env`
2. confirm the frontend URL is listed in `CORS_ORIGIN`
3. restart the backend after changing `.env`

## Problem: changes do not seem to apply

Common causes:

- the wrong folder is being edited
- Docker containers are using stale state
- the engineer changed files in the Strapi monorepo instead of the standalone app

Checks:

1. confirm the working folder is `local-dev/connecttroca-api`
2. confirm the edited files are inside that folder
3. restart the backend
4. if needed, rebuild with `docker compose up --build`

## Problem: the environment is too broken to trust

Reset sequence:

```powershell
docker compose down -v
docker compose up --build
```

Use this when:

- the database state is disposable
- the local environment has become inconsistent
- startup errors persist after basic checks

## Practical debugging rule

Change one variable at a time.
If you change Docker, environment variables, and application code at the same time, the source of the problem becomes harder to isolate.