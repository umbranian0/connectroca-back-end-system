# API Development Workflow

## Goal of this document

This document explains a safe and repeatable workflow for implementing new backend features in Strapi.
It is written for junior engineers who need a practical path from requirement to working endpoint.

## Before you start coding

Make sure the backend is already running and healthy.
Confirm these two checks first:

- `http://localhost:1337/admin` loads
- `http://localhost:1337/api/health` returns a successful response

If either check fails, stop and resolve the environment issue before building new features.

## Recommended implementation sequence

### Step 1. Start from the frontend requirement

Before creating backend code, identify exactly what the frontend needs.

Examples:

- a list of forum topics
- a list of groups
- a profile record for the logged-in user
- a message feed for a group chat

Write down:

- endpoint purpose
- expected fields
- whether the endpoint is public or authenticated
- whether the frontend needs list, detail, create, update, or delete operations

### Step 2. Decide whether Strapi content types are enough

Strapi can generate many CRUD endpoints automatically from content types.
That means you should not write custom controllers unless you actually need custom behavior.

Use generated content types when:

- the feature is mostly standard CRUD
- filtering and population rules are simple
- business logic is minimal

Use custom controllers or services when:

- the response shape is not standard
- you need complex validation or orchestration
- you need to combine data from multiple sources

### Step 3. Create the data model

For each feature, define the minimum required model first.
Avoid building a large schema before the frontend contract is clear.

Examples of likely first entities for this project:

- profile
- group
- forum-topic
- resource
- message

When defining a model, think about:

- field names
- field types
- required versus optional fields
- relations between entities
- whether timestamps are needed

### Step 4. Add or generate the API feature

Project API code belongs under `src/api`.
Each feature should have its own folder.

Examples:

```text
src/api/profile
src/api/group
src/api/forum-topic
src/api/resource
src/api/message
```

Keep feature code grouped by responsibility.
Do not scatter routes and controllers across unrelated folders.

### Step 5. Implement the smallest useful endpoint first

Do not try to build the full backend domain in one change.
Start with one endpoint that the frontend can immediately use.

Good first examples:

- `GET /api/groups`
- `GET /api/resources`
- `GET /api/forum-topics`

This reduces debugging scope and helps validate the integration early.

### Step 6. Test the endpoint directly

Before connecting the frontend, test the endpoint on its own.

Possible methods:

- open the route in the browser for simple GET requests
- use Postman or Insomnia
- use the Strapi admin panel to inspect stored content

Check:

- response status code
- response body shape
- field names
- whether relations are present when needed

### Step 7. Connect the frontend only after the endpoint is stable

A common junior mistake is to debug frontend and backend problems at the same time.
Do not do that.

First confirm:

- backend endpoint works independently
- CORS is correct
- response shape matches the frontend contract

Then connect the frontend.

## Suggested first features for this project

Given the frontend that already exists, the backend will likely need these domains first:

1. `profiles`
2. `groups`
3. `forum-topics`
4. `resources`
5. `messages`

A practical order is:

1. profiles
2. groups
3. resources
4. forum topics
5. messages

This order helps because profile and group data often support multiple screens.

## Authentication and permissions

The project already depends on `@strapi/plugin-users-permissions`.
That plugin should be used for:

- authentication
- roles
- protected routes
- user-related permissions

Do not mark everything public by default.
For each endpoint, decide whether it should be:

- public
- authenticated
- limited to a role

## How to keep the API junior-friendly and maintainable

Use these rules:

- choose clear entity names
- keep endpoint behavior predictable
- avoid unnecessary custom logic
- start with minimal fields
- document the API contract in pull requests or feature notes
- test one feature at a time

## When to create custom logic

Custom logic is justified when standard CRUD is not enough.
Examples:

- returning a dashboard-specific payload
- computing derived values
- enforcing custom business rules
- combining data from multiple models

If standard Strapi CRUD already solves the problem, prefer that first.

## Definition of done for a new feature

A backend feature should usually be considered ready when:

- the model is defined
- the endpoint starts correctly
- the endpoint returns the expected shape
- permissions are correct
- the frontend can consume it without ad hoc backend fixes
- the change is documented clearly enough for the next engineer