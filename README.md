# cdn-console

EdgeFlow CDN admin console — web UI for managing the CDN.

## Features

- Login with JWT authentication
- Domain management (create, list, delete, detail view)
- Origin server management (CRUD per domain)
- Cache rule management (path patterns, TTL, query handling)
- Edge node monitoring with inline status control
- Certificate management with expiry tracking
- Cache purge interface (URL, directory, full site)
- Responsive sidebar layout

## Tech Stack

- React 18 + TypeScript
- Ant Design (UI components)
- React Router (navigation)
- Axios (API client with JWT interceptor)

## Quick Start

```bash
# Install dependencies
npm install

# Development
npm start

# Production build
npm run build

# Docker
docker build -t cdn-console .
```

## Configuration

Set the API URL via environment variable:

```bash
REACT_APP_API_URL=http://localhost:8090 npm start
```
