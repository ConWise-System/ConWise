# ConWise Frontend

This repository holds the **frontend** of the ConWise construction-management system. It is a Next.js 14 application built with the `app` router and TypeScript where appropriate, designed to interact with a separate backend API.

---

## Architecture Overview

The frontend is structured as a modular, role-based dashboard application. It leverages:

* **Next.js 14** for server/client components, routing, and API routes.
* **React** with functional components and hooks.
* **Axios** for HTTP communication with the `backend` service.
* **Context / custom hooks** for authentication, theming and global state.
* **Tailwind CSS** (via `globals.css`) for styling.

The application is divided into distinct feature-based folders under `src/app` and `src/components`, reflecting the domain modules used by the backend.

---

## Folder structure

```
frontend/
├─ jsconfig.json              # path aliases for editor
├─ next.config.mjs            # Next.js configuration
├─ package.json               # frontend dependencies & scripts
├─ postcss.config.mjs         # Tailwind/ PostCSS config
├─ public/                    # static assets (images, fonts, etc.)
└─ src/
   ├─ loading.jsx             # global loading indicator
   ├─ api/
   │   └─ axios.js            # pre‑configured Axios instance
   ├─ app/                    # application routes and layouts
   │   ├─ globals.css         # global styles
   │   ├─ layout.js           # root layout
   │   ├─ page.js             # landing page (login)
   │   ├─ dashboard/          # role-specific dashboards
   │   │   ├─ admin/
   │   │   ├─ project-manager/
   │   │   ├─ site-engineer/
   │   │   └─ supervisor/
   │   ├─ layout/             # reusable layouts
   │   │   ├─ dashboard-layout.jsx
   │   │   └─ sidebar.jsx
   │   ├─ login/              # login route
   │   │   └─ page.tsx
   │   └─ services/           # client-side service helpers
   ├─ components/             # shared UI components
   │   ├─ dashboard-card.tsx
   │   ├─ sidebar.jsx
   │   ├─ theme-provider.jsx
   │   └─ layout/             # layout-specific components
   │       └─ dashboard-layout.jsx
   │   └─ ui/                 # generic UI building blocks
   ├─ features/               # feature-specific modules (e.g. project)
   │   └─ project/ …
   ├─ hooks/
   │   └─ useAuth.js         # authentication hook
   ├─ lib/
   │   └─ utils.js           # miscellaneous helpers
   └─ middleware/
       └─ middleware.js      # Next.js middleware (auth, redirects)
```

> 🔍 **Note:** The frontend communicates with the Express/Prisma backend which lives in the `backend/` folder at the workspace root.

---

## Development

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   # or yarn / pnpm
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:3000](http://localhost:3000).

3. **Environment variables**
   Create a `.env.local` with the API base URL and any other secrets, for example:
   ```dotenv
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Linting & formatting**
   ```bash
   npm run lint       # ESLint/Prettier checks
   ```

---

## Build & Deployment

```bash
npm run build
npm run start    # serve the production build
```

You can deploy the project to Vercel, Netlify or any static host that supports Next.js. The backend API must be reachable from the deployed frontend.

---

## Contributing

* Follow the established folder conventions when adding new features.
* Use TypeScript for new files where appropriate.
* Write unit tests for critical components and hooks.
* Respect the API contracts defined by the backend.

---

## Resources

* [Next.js Documentation](https://nextjs.org/docs)
* [Tailwind CSS](https://tailwindcss.com/docs)
* [Axios GitHub](https://github.com/axios/axios)

---

> ✨ *This README provides a professional overview of the frontend application structure and should guide contributors and maintainers through the codebase.*
