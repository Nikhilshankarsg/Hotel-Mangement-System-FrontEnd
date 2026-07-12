// Simple environment constant. For multi-environment setups, replace this
// with Angular's fileReplacements-based environment.ts / environment.prod.ts.
//
// The API URL can be injected at runtime via `window.__API_URL__` (e.g. set
// by a small inline script in index.html that is populated from the
// `API_URL` / `VITE_API_URL` environment variable during deployment). If it
// is not available, it falls back to `http://localhost:8080` for local
// development.
export const environmentBaseUrl =
  (typeof window !== 'undefined' && (window as any).__API_URL__) ||
  'http://localhost:8080';
