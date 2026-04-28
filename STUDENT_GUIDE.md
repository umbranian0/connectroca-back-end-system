# ConnectTroca Backend (Strapi) - Student Guide

## Objective
This guide is for students who need to run and validate the backend locally.

## 1) Start backend

```powershell
cd "C:\Users\vasil\Documents\Aulas\projeto integrado 2\backend_conectra\connectroca-back-end-system"
Copy-Item .env.example .env   # first run only
docker compose up --build -d
```

## 2) Validate backend

```powershell
curl http://localhost:1337/api/health
```

Expected: HTTP `200`.

Open admin:

- `http://localhost:1337/admin`

## 3) Seeded demo account

- Email: `integration.user@example.com`
- Password: `Integration123!`

## 4) API scope used by frontend

- `/api/profiles`
- `/api/areas`
- `/api/groups`
- `/api/group-members`
- `/api/user-areas`
- `/api/materials`
- `/api/topics`
- `/api/posts`
- `/api/comments`
- `/api/likes`
- `/api/users`
- `/api/auth/local`
- `/api/auth/forgot-password`

## 5) Daily commands

```powershell
docker compose up -d
docker compose down
```

## 6) Reset database (destructive)

```powershell
docker compose down -v
docker compose up --build -d
```

## 7) Notes for project work

- Keep changes in this backend repo only.
- Preserve environment variables in `.env.example` alignment.
- Confirm CORS contains frontend origin before integration tests.
