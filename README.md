# PROMPT GitHub Challenge

Standalone repository for the PROMPT GitHub Challenge client.

## Structure

- `client/` GitHub Challenge micro-frontend
- `docker-compose.yml` Placeholder local compose file
- `docker-compose.prod.yml` Production deployment for the GitHub Challenge client only

## Local Development

1. Copy `.env.template` to `.env` and adapt values if needed.
2. Link the shared library from the main PROMPT repository with `ln -sfn ../prompt2/clients/shared_library shared_library`.
3. Install client dependencies and run the client with `cd client && yarn install && yarn dev`.

Use a Node LTS release (recommended: Node 22) for local client tooling.

The core app in the main PROMPT repository can load this client via Module Federation at `http://localhost:3006`.

## Production Deployment

CI/CD workflows are in `.github/workflows/`:

- `build-and-push.yml` builds and pushes the client image
- `dev.yml` runs linting, builds, and deploys to dev VM
- `prod.yml` runs release builds and deploys to prod VM
- `deploy.yml` deploys only the GitHub Challenge client container using `docker-compose.prod.yml`
