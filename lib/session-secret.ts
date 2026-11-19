export const SESSION_JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "post-hub-secure-admin-secret-key-must-be-at-least-32-chars-long"
);
