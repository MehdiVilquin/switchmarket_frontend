// config.js

// BASE_APIURL will be set from environment variable at build time.
// Utilise la variable d'environnement pour cibler le backend adapté à l'environnement
// En local : NEXT_PUBLIC_API_URL=http://localhost:3000
// En prod :  NEXT_PUBLIC_API_URL=https://switchmarket-backend.vercel.app

export const BASE_APIURL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
).replace(/\/$/, ""); // regex

// Toutes les requêtes API doivent utiliser BASE_APIURL
