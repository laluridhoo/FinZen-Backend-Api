declare namespace Express {
  interface Request {
    /**
     * Minimal user object populated by authentication middleware.
     * Keep fields non-sensitive (no secrets, no password hashes).
     */
    user?: {
      id?: number;
      email?: string;
      roles?: string[];
    };
  }
}
