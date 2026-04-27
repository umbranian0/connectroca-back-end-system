# API Modules Guide (`src/api`)

This folder contains the business modules that power the project API.

## Existing modules (project ERD)

- `health`
- `profile`
- `area`
- `group`
- `group-member`
- `user-area`
- `material`
- `topic`
- `post`
- `comment`
- `like`

## Folder pattern students must follow

For each module, keep this structure:

```text
src/api/<module>/
  content-types/<module>/schema.json
  controllers/<module>.ts
  routes/<module>.ts
  services/<module>.ts
```

## Step-by-step: create a new collection

1. Create content type in Strapi admin panel.
2. Save changes and let Strapi generate schema files.
3. Confirm files appear in `src/api/<module>/...`.
4. Add custom controller/service code only if needed.
5. Restart backend and test endpoint.

## Step-by-step: edit an existing collection

1. Open the module schema file:
   - `src/api/<module>/content-types/<module>/schema.json`
2. Apply the field/relation change.
3. Restart backend.
4. Test endpoint with `populate=*`.
5. Confirm frontend page still loads.

## Permission rule used in this project

- Public role: read only (`find`, `findOne`)
- Authenticated role: full CRUD

Permissions are configured on startup in `src/index.ts`.

## Important beginner rules

1. Keep controllers thin (no heavy business logic).
2. Put business logic in service files.
3. Use relations instead of duplicated text fields when possible.
4. Do not rename existing module folders unless teacher asks.
5. Test after every schema change.

## Quick API test examples

```powershell
curl "http://localhost:1337/api/topics?populate=*"
curl "http://localhost:1337/api/groups?populate=*"
```

Expected result: JSON with `data` and `meta`.
