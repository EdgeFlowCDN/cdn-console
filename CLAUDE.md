# cdn-console

EdgeFlow CDN admin console — React web UI.

## Tech Stack

React 18, TypeScript, Ant Design, React Router, Axios, Recharts

## Project Structure

```
src/
  api/client.ts       Axios client with JWT interceptor, all API functions
  types/index.ts      TypeScript interfaces for all data models
  pages/
    LoginPage.tsx         JWT login
    DashboardPage.tsx     Stats cards + charts (Recharts)
    DomainsPage.tsx       Domain list with create/delete
    DomainDetailPage.tsx  Domain detail: origins + cache rules (tabbed)
    NodesPage.tsx         Node list with inline status control
    CertsPage.tsx         Certificate list with expiry indicators
    PurgePage.tsx         Cache purge form (URL/dir/all)
    LogsPage.tsx          Log query with filters and results table
  App.tsx               Router + sidebar layout
```

## API Connection

Set `REACT_APP_API_URL` env var (defaults to `http://localhost:8090`).
Nginx config proxies `/api/` to cdn-control in Docker/K8s.

## Development

```bash
npm install
npm start           # dev server on :3000
npm run build       # production build
npx tsc --noEmit    # type check
```
