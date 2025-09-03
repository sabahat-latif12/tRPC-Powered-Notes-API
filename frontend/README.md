# Frontend (React + tRPC)

Dev server: http://localhost:3000
API base (tRPC): http://localhost:3001/trpc

## Scripts
```bash
npm start   # start dev server
npm run build
```

## Configuration
- tRPC client URL is defined in `src/trpc.ts`:
```ts
httpBatchLink({ url: 'http://localhost:3001/trpc' })
```
- If your backend URL changes, update it here or set `REACT_APP_API_URL`.

## Common issues
- "Unexpected token '<', \"<!DOCTYPE\" ... is not valid JSON"
  - Backend not running or URL incorrect; ensure `http://localhost:3001/trpc` is reachable.
- CORS errors
  - Backend must allow `http://localhost:3000` origin.
