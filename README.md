# tRPC Notes (API + React frontend)

Type-safe notes app with tRPC, Prisma, Zod, Express, and React. Database uses SQLite (no install needed).

## Features
- tRPC end-to-end types (v11)
- Prisma ORM + SQLite
- Zod validation
- CRUD Notes with tags, pagination, search
- React frontend with @tanstack/react-query

## Requirements
- Node.js 18+
- npm

## Quick start

1) Install deps
```bash
npm install
cd frontend && npm install && cd ..
```

2) Environment
```bash
# Root .env (already created by setup)
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=development
```

3) DB setup
```bash
npm run db:push   # create dev.db and apply schema
npm run db:seed   # optional sample data
```

4) Run
```bash
# Backend (http://localhost:3001)
npm run dev

# Frontend (http://localhost:3000)
cd frontend && npm start
```

Backend tRPC endpoint: http://localhost:3001/trpc

## Scripts (root)
```bash
npm run dev         # start API in watch mode
npm run build       # tsc build
npm run start       # run built server (dist)
npm run db:push     # push Prisma schema
npm run db:seed     # seed sample data
npm run test:client # exercise API via tRPC client
```

## API
Base URL: `http://localhost:3001/trpc`

Notes router
- notes.create (mutation): { title: string, content: string, tags: string[] }
- notes.getById (query): { id: string }
- notes.getAll (query): { search?: string, tags?: string[], page: number, limit: number }
- notes.update (mutation): { id: string, data: { title?: string, content?: string, tags?: string[] } }
- notes.delete (mutation): { id: string }
- notes.getTags (query): void

Example (curl)
```bash
# health
curl http://localhost:3001/health

# get all
curl "http://localhost:3001/trpc/notes.getAll?batch=1&input=%7B%220%22%3A%7B%22page%22%3A1%2C%22limit%22%3A20%7D%7D"
``` 

## Implementation notes
- We use SQLite. The `Note.tags` field is stored as a JSON string internally and parsed before returning from the API for compatibility with SQLite (no native string[]).
- Filtering for search/tags is done in memory after fetching (SQLite friendly).

## Frontend
- Location: `frontend/`
- Dev: `cd frontend && npm start` (http://localhost:3000)
- Build: `cd frontend && npm run build`
- tRPC client URL is set to `http://localhost:3001/trpc` in `frontend/src/trpc.ts`.

## Troubleshooting
- Unexpected token '<', "<!DOCTYPE" ... is not valid JSON
  - Cause: calling wrong URL (served HTML) or backend not running/wrong port
  - Fix: ensure backend running on 3001, frontend points to `http://localhost:3001/trpc`, visit `/health` to verify
- Cannot POST /notes.create
  - Cause: hitting REST-like path instead of tRPC batch endpoint
  - Fix: use tRPC client; endpoint base must be `/trpc`, not `/notes.create`
- Prisma error: list/array not supported in SQLite
  - Use JSON string for `tags` (already handled in code)

## Project structure
```
.
├─ src/
│  ├─ index.ts          # Express + tRPC server
│  ├─ trpc.ts           # tRPC init/context
│  ├─ routers/
│  │  ├─ index.ts       # appRouter
│  │  └─ notes.ts       # notes endpoints
│  ├─ schemas/
│  │  └─ note.ts        # Zod schemas
│  └─ test-client.ts    # tRPC client exerciser
├─ prisma/
│  └─ schema.prisma     # SQLite schema
└─ frontend/            # React app
```

## License
MIT
