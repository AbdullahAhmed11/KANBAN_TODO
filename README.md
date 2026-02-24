# Kanban ToDo Dashboard

Package manager npm

```bash
npm install


Optional: copy `.env.example` to `.env` and set `VITE_API_URL` if the API runs on a different host/port (default is `http://localhost:4000`).

## Run json-server (mock API)

Start the mock API on port 4000:

```bash
npm run server
```

This runs `json-server --watch db.json --port 4000`. The app expects the tasks API at:

- **Base URL:** `http://localhost:4000`
- **Tasks endpoint:** `GET/POST /tasks`, `GET/PATCH/DELETE /tasks/:id`

Ensure `db.json` exists at the project root with a `tasks` array. The server rewrites `db.json` on create/update/delete.

## Run the app

**Option A — One command (recommended):** Start both the API and the app:

```bash
npm run dev:all
```

This runs json-server on port 4000 and the Vite dev server (e.g. `http://localhost:5173`) in one terminal.

**Option B — Two terminals:** Start the API first, then the app:

```bash
npm run server

npm run dev
```

Then open the URL shown. If you see "Cannot connect to the API", the server is not running — use Option A or start `npm run server`.

## Tech stack

| Area | Technology |
|------|------------|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 7 |
| **Data fetching & caching** | TanStack React Query (query keys, background refetch, optimistic updates) |
| **State management** | Redux Toolkit (e.g. global search term) |
| **UI** | Material UI (MUI) |
| **Drag and drop** | @dnd-kit (core, sortable, utilities) |
| **Mock API** | json-server |

## Features

- **Board:** Four columns — Backlog, In Progress, Review, Done
- **Tasks:** Create, edit, delete; drag and drop between columns 
- **Search:** Global search by title or description, debounced
- **Pagination:** Per-column pagination (page size 10)
- **Loading / error / empty states:** Handled in the UI
- **Optimistic updates:** Used for update and delete (with rollback on error)


```

## Scripts

- `npm run dev` — start Vite dev server only (API must be running separately)
- `npm run dev:all` — start json-server and Vite together (recommended)

# KANBAN_TODO
