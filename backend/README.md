# Backend Service - ConWise

This directory contains the Express/Prisma REST API powering the
ConWise frontend dashboard. It's structured for clarity and
modularity, allowing each business domain to live in its own module.

## Overview

- **Runtime:** Node.js 18+ (LTS recommended)
- **Framework:** Express
- **ORM:** Prisma (TypeScript despite JS sources)
- **Database:** any SQL database supported by Prisma (SQLite for
development, Postgres/MySQL in production)
- **Authentication:** JWT tokens

## Key folders

```
backend/
├─ package.json            # npm scripts and dependencies
├─ prisma.config.ts        # Prisma config (generator + client)
├─ prisma/                 # schema and migrations
│   └─ schema.prisma
├─ src/
│   ├─ server.js           # application entry point
│   ├─ config/             # configuration modules
│   │   ├─ constants.js    # hardcoded constants
│   │   ├─ env.js          # environment variable parsing
│   │   └─ prisma.js       # singleton Prisma client
│   ├─ middlewares/        # reusable Express middleware
│   ├─ modules/            # feature modules grouped by domain
│   ├─ routes/             # aggregates all module routes
│   └─ utils/              # shared helper functions
```

### server.js

Sets up the Express `app`, mounts JSON/body parsers, applies
authentication and other middleware, and starts the HTTP server.
Example:

```js
const express = require('express');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 5000);
```

### config/

- `env.js` uses `dotenv` to load `.env` and exports validated
  variables.
- `constants.js` exports values reused across modules (e.g.,
  `PASSWORD_SALT_ROUNDS`).
- `prisma.js` creates and exports a Prisma client instance used by
  services.

### middlewares/

Centralized pieces of logic that can be attached per-route. Common
files include:

* `auth.middleware.js` – verify JWT and attach `req.user`.
* `role.middleware.js` – ensure user has required role(s).
* `validate.middleware.js` – run schema validation using `Joi`.
* `error.middleware.js` – final error handler converting exceptions to
  HTTP responses.

### modules/

Each domain (auth, project, task, etc.) lives under its own folder.
Inside you typically find:

* `*.routes.js` – Express router for the module.
* `*.controller.js` – request handlers (thin, call services).
* `*.service.js` – business logic and DB access via Prisma client.
* `*.validation.js` – request body schemas (Joi).

### routes/

`index.js` imports all module routers and mounts them to the
application. Example:

```js
const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');

const router = express.Router();
router.use('/auth', authRoutes);
// other modules...

module.exports = router;
```

### utils/

General helpers used across the codebase, e.g.:

* `catchAsync.js` – wrapper to handle async errors in controllers.
* `generateToken.js` – JWT generation logic.
* `hash.js` – password hash and compare functions.
* `pagination.js` – parse/query helpers for paginated endpoints.

## Running the backend

1. Copy `.env.example` to `.env` and fill in values (DATABASE_URL,
   JWT_SECRET, etc.).
2. Install dependencies: `npm install`.
3. Run database migrations: `npx prisma migrate dev`.
4. Start development server: `npm run dev`.

> **Tip:** use `npx prisma studio` to open a UI for inspecting the
database.

## Testing

(If tests are added, describe the command here.)

## Deployment

The backend can be deployed to any Node.js host. Ensure environment
variables are provided and the database is reachable. Configure CORS
for the frontend origin if the UI is served from a different domain.

---

This README supplements the project root README with service‑specific
details. Refer back there for cross-service architecture and workflows.