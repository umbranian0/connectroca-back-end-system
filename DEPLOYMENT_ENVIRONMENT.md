# Deployment Environment Variables (Heroku)

This file is the single source of truth for backend environment configuration.

## Heroku required configuration

Set these config vars in the Heroku app (`connectra-backend-system`):

| Variable | Required | Example | Notes |
|---|---|---|---|
| `NODE_ENV` | Yes | `production` | Must be production for Heroku runtime. |
| `HOST` | Yes | `0.0.0.0` | Bind host. |
| `IS_PROXIED` | Yes | `true` | Trust reverse proxy. |
| `HEROKU_APP_NAME` | Yes | `connectra-backend-system` | Used for URL fallback logic. |
| `PUBLIC_URL` | Yes | `https://connectra-backend-system-f4a977a741b9.herokuapp.com` | Public backend URL. |
| `ADMIN_URL` | Yes | `/admin` | Strapi admin route. |
| `APP_KEYS` | Yes | `<k1>,<k2>,<k3>,<k4>` | Comma-separated app keys. |
| `API_TOKEN_SALT` | Yes | `<api-token-salt>` | Strapi secret. |
| `ADMIN_JWT_SECRET` | Yes | `<admin-jwt-secret>` | Strapi secret. |
| `TRANSFER_TOKEN_SALT` | Yes | `<transfer-token-salt>` | Strapi secret. |
| `JWT_SECRET` | Yes | `<jwt-secret>` | Users-permissions secret. |
| `ENCRYPTION_KEY` | Yes | `<encryption-key>` | Strapi secret. |
| `DATABASE_CLIENT` | Yes | `postgres` | DB client. |
| `DATABASE_SSL` | Yes | `true` | Heroku Postgres requires SSL. |
| `DATABASE_SSL_REJECT_UNAUTHORIZED` | Yes | `false` | Common Heroku SSL setup. |
| `CORS_ORIGIN` | Yes | `https://connectroca-front-end-system.vercel.app,http://localhost:5173,http://127.0.0.1:5173` | Supports develop and cross local runs. |
| `FRONTEND_DEVELOP_URL` | Yes | `https://connectroca-front-end-system.vercel.app` | Added as default allowed frontend origin. |
| `CORS_ALLOW_VERCEL_PREVIEWS` | Yes | `true` | Allows preview deployments. |
| `STRAPI_TELEMETRY_DISABLED` | Yes | `true` | Disable telemetry. |

## Heroku provided automatically

| Variable | Source | Notes |
|---|---|---|
| `PORT` | Heroku runtime | Do not hardcode in Heroku. |
| `DATABASE_URL` | Heroku Postgres add-on | Primary DB connection string. |

## Optional tuning variables

| Variable | Default |
|---|---|
| `DATABASE_POOL_MIN` | `2` |
| `DATABASE_POOL_MAX` | `10` |
| `DATABASE_CONNECTION_TIMEOUT` | `60000` |
| `DATABASE_SCHEMA` | `public` |
| `API_DEFAULT_LIMIT` | `25` |
| `API_MAX_LIMIT` | `100` |
| `API_WITH_COUNT` | `true` |

## One-shot command template

```bash
heroku config:set \
  NODE_ENV=production \
  HOST=0.0.0.0 \
  IS_PROXIED=true \
  HEROKU_APP_NAME=<your-backend-app-name> \
  PUBLIC_URL=https://<your-backend-app-name>.herokuapp.com \
  ADMIN_URL=/admin \
  DATABASE_CLIENT=postgres \
  DATABASE_SSL=true \
  DATABASE_SSL_REJECT_UNAUTHORIZED=false \
  CORS_ORIGIN=https://connectroca-front-end-system.vercel.app,http://localhost:5173,http://127.0.0.1:5173 \
  FRONTEND_DEVELOP_URL=https://connectroca-front-end-system.vercel.app \
  CORS_ALLOW_VERCEL_PREVIEWS=true \
  STRAPI_TELEMETRY_DISABLED=true \
  APP_KEYS="<k1>,<k2>,<k3>,<k4>" \
  API_TOKEN_SALT="<api-token-salt>" \
  ADMIN_JWT_SECRET="<admin-jwt-secret>" \
  TRANSFER_TOKEN_SALT="<transfer-token-salt>" \
  JWT_SECRET="<jwt-secret>" \
  ENCRYPTION_KEY="<encryption-key>" \
  -a <your-backend-app-name>
```

## GitHub Actions prerequisites (backend repo)

Configure these repository secrets:

- `HEROKU_API_KEY`
- `HEROKU_EMAIL`
- `HEROKU_APP_KEYS`
- `HEROKU_API_TOKEN_SALT`
- `HEROKU_ADMIN_JWT_SECRET`
- `HEROKU_TRANSFER_TOKEN_SALT`
- `HEROKU_JWT_SECRET`
- `HEROKU_ENCRYPTION_KEY`

Configure these repository variables:

- `HEROKU_APP_NAME`
- `HEROKU_PUBLIC_URL`
- `HEROKU_CORS_ORIGIN`
- `HEROKU_FRONTEND_DEVELOP_URL`

Pipeline file: `.github/workflows/backend-heroku-pipeline.yml`
Template source: `cloud/heroku.env.template`
