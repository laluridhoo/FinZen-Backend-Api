import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/env";

const DEFAULT_EXPIRES_IN = "1h";

export function signToken(payload: object, expiresIn = DEFAULT_EXPIRES_IN): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, getJwtSecret()) as T;
}

export default { signToken, verifyToken };
