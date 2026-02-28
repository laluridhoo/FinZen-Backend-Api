import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

interface JwtPayload {
  sub?: string | number;
  id?: number;
  email?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}

/**
 * Middleware authenticate
 * - Membaca header Authorization Bearer
 * - Memverifikasi token
 * - Menetapkan `req.user` dengan payload minimal yang diperlukan
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || typeof authHeader !== "string") {
    return res.status(401).json({ success: false, message: "Authorization header missing" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ success: false, message: "Malformed Authorization header" });
  }

  const token = parts[1];

  try {
    const payload = verifyToken<JwtPayload>(token);

    // Attach minimal, non-sensitive user info to req.user
    req.user = {
      id: payload.sub ? Number(payload.sub) : payload.id,
      email: payload.email,
      roles: payload.roles || [],
    };

    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export default authenticate;
