# ConnectTroca Back-End System

Standalone Strapi backend for local API development and frontend integration.

## Stack

- Strapi 5.42.1
- PostgreSQL 16
- Docker Compose for local development

## Quick start

1. Copy `.env.example` to `.env`
2. Run `docker compose up --build`
3. Open `http://localhost:1337/admin`
4. Create the first administrator user
5. Test `http://localhost:1337/api/health`

## Main commands

```powershell
docker compose up --build
docker compose down
docker compose down -v
```

## Local API base URL

```text
http://localhost:1337
```

## Included files

- `docker-compose.yml`: local PostgreSQL + Strapi stack
- `LOCAL_STRAPI_SETUP.md`: step-by-step setup guide
- `src/api/health`: simple public health endpoint

## Frontend integration

The backend CORS configuration allows the common local frontend origins used by the ConnectTroca frontend workspace, including `http://localhost:5173`.