# ConnectTroca API Local Workspace

## What this folder is for

This folder is the standalone backend application used for local API development.
It is the part of the backend that the team should actively modify when building the project API.

The backend stack is:

- Strapi 5.42.1
- PostgreSQL 16
- Docker Compose

## How to get to the project

There are two valid ways a junior engineer may arrive at this backend workspace.

### Case 1. You are working inside the local `backend_conectra` monorepo folder

Open PowerShell and run:

```powershell
cd "C:\Users\vasil\Documents\Aulas\projeto integrado 2\backend_conectra\local-dev\connecttroca-api"
```

Use this path if you already have the local monorepo folder on your machine.

### Case 2. You are working from the published project repository

Clone the repository and enter it:

```powershell
git clone https://github.com/umbranian0/connectroca-back-end-system.git
cd connectroca-back-end-system
```

Use this path if you want the clean standalone backend project without the Strapi monorepo around it.

## Start here if you are new

Use this exact sequence on first run:

1. Open a terminal in the project folder.
2. Copy `.env.example` to `.env`.
3. Run `docker compose up --build`.
4. Open `http://localhost:1337/admin`.
5. Create the first admin user.
6. Open `http://localhost:1337/api/health` and confirm the backend is responding.

## Quick commands

```powershell
Copy-Item .env.example .env
docker compose up --build
docker compose down
docker compose down -v
```

## Command summary

### Docker commands

- `docker compose up --build`
  Builds the Strapi image if needed and starts PostgreSQL plus Strapi.
- `docker compose down`
  Stops the containers but keeps the database volume.
- `docker compose down -v`
  Stops the containers and removes named volumes, including the database.
- `docker compose ps`
  Shows which containers are running.
- `docker compose logs -f strapi`
  Streams Strapi logs in real time.
- `docker compose logs -f postgres`
  Streams PostgreSQL logs in real time.

### npm scripts from `package.json`

- `npm run docker:up`
  Shortcut for `docker compose up --build`.
- `npm run docker:down`
  Shortcut for `docker compose down`.
- `npm run docker:reset`
  Shortcut for `docker compose down -v`.
- `npm run develop`
  Starts Strapi in development mode on the host machine.
- `npm run dev`
  Same as `npm run develop`.
- `npm run build`
  Builds the Strapi admin panel.
- `npm run start`
  Starts Strapi in production-style mode after a build.
- `npm run strapi`
  Runs the Strapi CLI directly.

### Example Strapi CLI usage

```powershell
npm run strapi -- version
npm run strapi -- help
```

## What each important file does

- `.env.example`: example runtime configuration
- `.env`: your local runtime values
- `docker-compose.yml`: local Strapi and PostgreSQL containers
- `Dockerfile`: Strapi container definition
- `config/`: Strapi runtime configuration
- `src/api/`: project API endpoints
- `src/api/health`: simple sample endpoint used to confirm the backend is reachable
- `docs/`: onboarding, workflow, command, and troubleshooting documentation

## Local URLs

- Admin panel: `http://localhost:1337/admin`
- API base URL: `http://localhost:1337`
- Health endpoint: `http://localhost:1337/api/health`

## Documentation map

If you are inside the published standalone repository, use these paths directly.
If you are inside the `backend_conectra` monorepo, these same files live under `local-dev/connecttroca-api`, except `LOCAL_STRAPI_SETUP.md`, which lives at the monorepo root.

Read the documentation in this order:

1. `README.md`
   Use this for the quick overview and the minimum startup path.
2. `LOCAL_STRAPI_SETUP.md`
   Use this for the full onboarding and environment explanation.
3. `docs/COMMAND_REFERENCE.md`
   Use this when you need to understand what each command does.
4. `docs/PROJECT_STRUCTURE.md`
   Use this when you need to understand where code should be added.
5. `docs/API_DEVELOPMENT_WORKFLOW.md`
   Use this when you are starting to implement real project endpoints.
6. `docs/FUTURE_DEVELOPMENT_AREAS.md`
   Use this to understand what backend areas still need to be built.
7. `docs/TROUBLESHOOTING.md`
   Use this when the backend does not start or the frontend cannot connect.

## Where future development should happen

Most future backend development should happen in these places:

- `src/api`
  Use this for feature APIs such as `profiles`, `groups`, `forum-topics`, `resources`, and `messages`.
- `config`
  Use this only when you need cross-cutting backend changes such as CORS, server settings, or database configuration.
- Strapi admin panel
  Use this for content types, permissions, and content management tasks.
- `docs`
  Update the documentation when you add new commands, environment variables, or backend modules.

## Frontend integration

The frontend should call this local backend:

```text
http://localhost:1337
```

CORS is already configured for the common development origins used by the frontend workspace.

## Recommended next steps for a junior engineer

1. Run the stack and confirm the health endpoint works.
2. Read `docs/COMMAND_REFERENCE.md`.
3. Read `docs/PROJECT_STRUCTURE.md`.
4. Read `docs/API_DEVELOPMENT_WORKFLOW.md`.
5. Start the first real content type required by the frontend.
6. Test that endpoint before integrating it into the frontend.