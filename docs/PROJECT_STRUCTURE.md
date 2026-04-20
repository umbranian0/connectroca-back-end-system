# Project Structure

## Why this document exists

Junior engineers often lose time because they do not know which files are configuration, which files are runtime code, and which files are safe to change.
This document explains the purpose of the main folders in the local Strapi workspace.

## Root-level files

### `package.json`

This file defines:

- project name and version
- npm scripts
- runtime dependencies
- development dependencies

Important scripts:

- `npm run develop`
- `npm run docker:up`
- `npm run docker:down`
- `npm run docker:reset`

### `.env.example`

This is the template for the local environment file.
You copy it to `.env` before running the project.

Do not edit `.env.example` for machine-specific values unless the whole team needs those changes.
Use `.env` for local-only changes.

### `.env`

This is your local runtime configuration file.
It is not meant to be committed.

### `docker-compose.yml`

This file defines the local runtime stack.
It starts PostgreSQL and Strapi together and binds the correct ports and volumes.

### `Dockerfile`

This file defines the Strapi container image.
It is used by the `strapi` service in Docker Compose.

## Configuration folder

### `config/admin.ts`

Controls admin-related behavior such as:

- admin URL
- admin JWT secret
- API token salt
- transfer token salt

### `config/api.ts`

Controls REST API defaults such as pagination limits.

### `config/database.ts`

Controls how Strapi connects to PostgreSQL.
This file is one of the first places to inspect if the backend cannot connect to the database.

### `config/middlewares.ts`

Controls middleware used by the application.
It currently includes:

- security middleware
- CORS configuration
- request parsing middleware
- session middleware
- static file serving middleware

This file is especially important when the frontend cannot access the backend because of cross-origin restrictions.

### `config/server.ts`

Controls host, port, public URL, and app keys.

## Source code folder

### `src/index.ts`

Entry point for custom application logic.
Right now it only logs a startup message, but it can be extended later for application-level bootstrap code.

### `src/api`

Main location for project APIs.
This is where feature-specific backend code should be created.

A typical feature may eventually contain files for:

- routes
- controllers
- services
- content type schemas
- policies
- middlewares

### `src/api/health`

A minimal feature used to confirm that the backend is reachable.
It exposes:

- `GET /api/health`

This feature is intentionally simple and should be used as a reference for how a route maps to a controller.

## Public folder

### `public/uploads`

This folder stores uploaded files.
In Docker, uploads are persisted through a named volume.
The `.gitkeep` file exists only to keep the folder in version control.

## Which files are usually safe to edit

A junior engineer will most often edit:

- `.env` for local-only runtime changes
- files inside `src/api`
- selected files in `config`
- documentation files in `docs`

## Which files should be changed carefully

Be careful with:

- `docker-compose.yml`
- `Dockerfile`
- `config/database.ts`
- `config/middlewares.ts`
- `config/server.ts`

These files affect the whole team because they define how the app starts and communicates.

## Practical rule of thumb

If you are building a business feature, work in `src/api`.
If you are fixing startup, database, host, or browser integration issues, inspect `config`, `.env`, `Dockerfile`, and `docker-compose.yml`.