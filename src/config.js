// config.js

// Global configuration file for frontend
// BASE_APIURL will be set from environment variable at build time.

export const BASE_APIURL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://switchmarket-frontend.vercel.app/" ||
  "http://localhost:3000";

// If you want to override via environment variable uncomment below and comment above line.
// export const BASE_APIURL = process.env.NEXT_PUBLIC_BASE_APIURL || "http://localhost:3000";
