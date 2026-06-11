# Portfolio API (Express + MongoDB)

This folder provides a production-ready API for the portfolio app, built with Express and MongoDB and suitable for Vercel serverless deployment.

Environment variables

- `MONGODB_URI` - required in production (connection string)
- `MONGODB_DB` - optional database name
- `ADMIN_TOKEN` - required for admin-protected endpoints (simple bearer token)
- `PORT` - optional local port (default 4000)

Main endpoints (mounted under `/api/v1` when server is served from root `/api`):

- `GET /api/v1/public-aggregate` - returns experiences, skills, projects, socials and settings
- `GET /api/v1/experiences/public` - public list of experiences
- Admin-protected CRUD (require `Authorization: Bearer <ADMIN_TOKEN>` or `x-admin-token` header):
  - `GET /api/v1/experiences` (list)
  - `POST /api/v1/experiences` (create)
  - `PUT /api/v1/experiences/:id` (update)
  - `DELETE /api/v1/experiences/:id` (delete)

Settings are key/value pairs and include entries like `github_username`, `technical_arsenal`, etc. Admin can `POST /api/v1/settings` with `{ key, value }` to upsert.

Deploy to Vercel

1. Set `MONGODB_URI` and `ADMIN_TOKEN` in Vercel Environment Variables.
2. Push repo; Vercel will use `api/index.ts` as the serverless entry.
