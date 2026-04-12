# PROMPT GitHub Challenge - AI Assistant Guide

This document provides essential context for AI assistants working on the standalone PROMPT GitHub Challenge repository.

## Project Overview

**PROMPT GitHub Challenge** is the extracted GitHub Challenge client of the PROMPT platform. It contains:

- **Client**: GitHub Challenge micro-frontend (Webpack Module Federation remote)
- **Deployment**: dedicated Docker Compose and GitHub Actions workflows for the GitHub Challenge client

For full platform context (core app, other course phases, shared architecture), see the main PROMPT repository:

- <https://github.com/prompt-edu/prompt>

## Repository Structure

```text
client/                       # GitHub Challenge micro-frontend (port 3006)
  routes/                     # Remote route registration for PROMPT core shell
  sidebar/                    # Sidebar registration for PROMPT core shell
  src/github_challenge/       # GitHub Challenge feature pages, hooks, state, network calls

.github/workflows/            # CI/CD for intro-course repo
```

## Quick Start Commands

### Environment

```bash
cp .env.template .env
```

### Client

```bash
cd client
yarn dev
yarn lint
yarn build
```

The PROMPT core app (from the main repository) can load this remote at:

- `http://localhost:3006/remoteEntry.js`

## Environment Variables

Relevant variables from `.env.template`:

- Runtime/URLs: `CORE_HOST`, `CLIENT_IMAGE_TAG`

## Technology Stack

### Frontend (`client/`)

- React + TypeScript
- Webpack 5 + Module Federation
- TanStack React Query
- Zustand
- Tailwind CSS
- Shared PROMPT packages: `@tumaet/prompt-ui-components`, `@tumaet/prompt-shared-state`

## Code Conventions

### Client-Side

**Naming:**

- PascalCase for React components and component folders
- camelCase for utilities, functions, variables
- SCREAMING_SNAKE_CASE for constants

**Types:**

- Prefer `interface` for object structures
- Avoid `any`
- Keep domain interfaces close to feature modules (`src/introCourse/**/interfaces`)

**State and data:**

- Use React Query for server state and request lifecycle
- Use Zustand (`useIntroCourseStore`) for local intro-course state
- Keep API access in `src/introCourse/network/`

**Route + sidebar contract:**

- Maintain exports used by host shell:
  - `client/routes/index.tsx`
  - `client/sidebar/index.tsx`
  - `client/src/provide/index.ts`
- Keep required permissions aligned with backend role checks.

## GitHub Challenge Specific Functional Areas

Primary client pages include:

- Student challenge flow
- Lecturer/admin results overview
- Lecturer/admin mailing page

The standalone repo keeps the shared library external, matching the intro-course extraction pattern.

## Module Federation Pattern (Client)

In `client/webpack.config.ts`:

- Remote name: `intro_course_developer_component`
- Dev port: `3005`
- Exposes:
  - `./routes`
  - `./sidebar`
  - `./provide`

When changing exposed modules or remote name, update host integration in main PROMPT repo accordingly.

## CI/CD

Relevant workflows in `.github/workflows/`:

- `lint-server.yml`: server linting
- `dev.yml`: PR/push pipeline (lint, test, build, deploy to dev on push)
- `build-and-push.yml`: builds/pushes server and client images
- `deploy.yml`: deploys intro-course services via `docker-compose.prod.yml`
- `prod.yml`: production release/deploy flow

Container images built by CI:

- `ghcr.io/prompt-edu/prompt-intro-course/prompt-server-intro-course`
- `ghcr.io/prompt-edu/prompt-intro-course/prompt-clients-intro-course-developer`

## Testing

### Server

```bash
cd server
go test ./...
```

Notes:

- Tests use `testcontainers-go` for DB-backed integration tests.
- Test helpers live in `server/testutils/`.
- `database_dumps/intro_course.sql` is used for seeded scenarios.

### Client

- Lint before merging client changes:

```bash
cd client
yarn lint
```

## Reusable Libraries (Prefer Over Custom Implementations)

Use shared PROMPT libraries whenever possible before introducing new primitives.

### `@tumaet/prompt-ui-components`

- Shared UI component set used throughout intro-course pages.
- Already included via imports and Tailwind config.

### `@tumaet/prompt-shared-state`

- Shared domain types and role constants.
- Used for permission checks and course-phase participation models.

### `prompt-sdk` (`github.com/prompt-edu/prompt-sdk`)

- Authentication middleware
- Shared endpoint registration (`promptTypes.RegisterCopyEndpoint`, `promptTypes.RegisterConfigEndpoint`)
- Utility helpers used across services

## Important Notes

- Keep client route permissions and server role checks consistent.
- Keep generated sqlc code in sync with query files and migrations.
- Do not change API base paths unless host-shell and deployment routing are updated together.
- Do not commit secrets; `.env.template` only contains placeholders.
- For broader architectural decisions, refer to the main PROMPT repository:
  - <https://github.com/prompt-edu/prompt>
