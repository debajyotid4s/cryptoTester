# CryptoTester Agent Instructions

Use this file as the first stop for repo conventions. Keep deeper setup and deployment details in [README.md](README.md) and [PROJECT_DOCUMENTATION.txt](PROJECT_DOCUMENTATION.txt).

## Working Boundaries

- Treat [api/index.js](api/index.js) and [server/src/app.js](server/src/app.js) as backend entrypoints.
- Treat [client/src/main.jsx](client/src/main.jsx) and [client/src/App.jsx](client/src/App.jsx) as frontend entrypoints.
- Keep backend route logic in [server/src/routes/](server/src/routes/) and shared helpers in [server/src/utils/](server/src/utils/).
- Keep frontend network access behind [client/src/services/](client/src/services/) and page composition in [client/src/pages/](client/src/pages/) plus [client/src/components/](client/src/components/).

## Commands

- Use `cd client && npm run dev` for the Vite UI.
- Use `cd server && npm run dev` for the API.
- Use `cd server && npm run test` before changing cipher logic or shared validation.
- Use `cd client && npm run build` before checking deploy output or routing changes.

## Repo Conventions

- Preserve the `/cryptoTester` base path in [client/vite.config.js](client/vite.config.js) and [client/src/main.jsx](client/src/main.jsx).
- Keep API route registration ahead of the SPA fallback in [server/src/app.js](server/src/app.js).
- Update both client and server env handling when changing host, auth, or payload behavior: `VITE_API_URL`, `VITE_API_AUTH_KEY`, `API_AUTH_KEY`, and the CORS allowlist in [server/src/app.js](server/src/app.js).
- Assume the backend may run without a built client; do not rely on `client/dist` being present unless you have just built it.
- Avoid editing generated build artifacts such as `client/dist`.

## Practical Checks

- If you touch server routes or validators, run the server tests.
- If you touch routing, layout, or deployment settings, run the client build.
- When updating the Ra chatbot UI, preserve its established golden Eye-of-Ra theme and copy.

## Helpful References

- [server/src/app.js](server/src/app.js) for middleware, auth, CORS, and static serving.
- [client/src/services/http.js](client/src/services/http.js) for client-side API header and URL behavior.
- [client/vite.config.js](client/vite.config.js) for the Vite proxy and base path.
- [PROJECT_DOCUMENTATION.txt](PROJECT_DOCUMENTATION.txt) for deployment and environment notes.
