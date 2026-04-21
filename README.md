# ConnectTroca API Local Workspace

## Purpose

This folder contains the standalone Strapi 5 backend used for local project development.
It is the backend that the team should change when implementing API features for the frontend.

Stack:

- Strapi `5.42.1`
- PostgreSQL `16`
- Docker Compose for the standard local workflow
- Node `20.20.2` for host-machine commands

## How to enter the project

If you already have the local monorepo folder:

```powershell
cd "C:\Users\vasil\Documents\Aulas\projeto integrado 2\backend_conectra\local-dev\connecttroca-api"
```

If you are using the published standalone backend repository:

```powershell
git clone https://github.com/umbranian0/connectroca-back-end-system.git
cd connectroca-back-end-system
```

## Recommended local development workflow

This is the preferred team workflow:

1. Copy `.env.example` to `.env`.
2. Start the stack with Docker.
3. Wait until Strapi reports `Strapi started successfully`.
4. Open the admin panel.
5. Validate the public health endpoint.

Commands:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

URLs:

- Admin panel: `http://localhost:1337/admin`
- API base URL: `http://localhost:1337`
- Health endpoint: `http://localhost:1337/api/health`

## Host-machine workflow

Use the host-machine workflow only when you need direct `npm` debugging outside Docker.

Requirements:

- Node `20.20.2` or another Node `20+` release
- npm `10+`

The project includes `.nvmrc` to make the expected Node version explicit.

Commands:

```powershell
npm ci
npm run typecheck
npm run build
npm run develop
```

Use `npm ci` instead of `npm install` when working from the committed lockfile.
That keeps dependency resolution reproducible across the team.

## Command summary

### Docker

- `docker compose up --build`
  Rebuilds the Strapi image when needed and starts PostgreSQL plus Strapi.
- `docker compose down`
  Stops the stack and keeps volumes.
- `docker compose down -v`
  Stops the stack and removes named volumes, including the local database.
- `docker compose ps`
  Shows current container status.
- `docker compose logs -f strapi`
  Streams Strapi logs.
- `docker compose logs -f postgres`
  Streams PostgreSQL logs.

### npm scripts

- `npm run develop`
  Starts Strapi in development mode on the host machine.
- `npm run build`
  Builds the Strapi admin panel.
- `npm run start`
  Starts Strapi in non-development mode.
- `npm run console`
  Opens the Strapi console.
- `npm run typecheck`
  Runs TypeScript type checking without emitting files.
- `npm run docker:up`
  Shortcut for `docker compose up --build`.
- `npm run docker:down`
  Shortcut for `docker compose down`.
- `npm run docker:logs`
  Shortcut for `docker compose logs -f strapi`.
- `npm run docker:ps`
  Shortcut for `docker compose ps`.
- `npm run docker:reset`
  Shortcut for `docker compose down -v`.

## Project layout

Important files and folders:

- `package.json`
  Defines project scripts and runtime dependencies.
- `package-lock.json`
  Locks exact dependency versions for reproducible installs.
- `.nvmrc`
  Declares the expected host Node version.
- `.env.example`
  Team-level template for runtime configuration.
- `docker-compose.yml`
  Local development stack with PostgreSQL and Strapi.
- `Dockerfile`
  Development image that installs dependencies with `npm ci`.
- `config/`
  Cross-cutting Strapi runtime configuration.
- `src/api/`
  Project feature modules.
- `types/generated/`
  Generated Strapi TypeScript definitions.
- `public/uploads/`
  Persistent uploaded files.

## Strapi development conventions

Use these rules for new backend work:

- Start with a content type when the requirement is standard CRUD.
- Keep controllers thin.
- Put business logic in services, not controllers.
- Use the Strapi admin panel for content modeling and permissions first.
- Commit generated schema files after content-type changes.
- Review public permissions explicitly before frontend integration.

The default place for project features is:

```text
src/api/<feature>
```

Typical feature layout:

```text
src/api/<feature>/
  content-types/<feature>/schema.json
  controllers/
  routes/
  services/
  policies/
```

## Documentation map

Read these in order:

1. `README.md`
2. `LOCAL_STRAPI_SETUP.md`
3. `docs/COMMAND_REFERENCE.md`
4. `docs/PROJECT_STRUCTURE.md`
5. `docs/STRAPI_DEVELOPMENT_STANDARDS.md`
6. `docs/API_DEVELOPMENT_WORKFLOW.md`
7. `docs/FUTURE_DEVELOPMENT_AREAS.md`
8. `docs/TROUBLESHOOTING.md`

If you are in the monorepo layout, `LOCAL_STRAPI_SETUP.md` lives at the monorepo root.

## Practical next steps

1. Bring the stack up and confirm `/api/health` works.
2. Create the first required content type in Strapi.
3. Commit the generated schema files.
4. Add custom services only where generated CRUD is not enough.
5. Integrate one frontend screen at a time against stable endpoints.
