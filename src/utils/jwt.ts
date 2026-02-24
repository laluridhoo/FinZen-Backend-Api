import jwt from "jsonwebtoken";

const DEFAULT_EXPIRES_IN = "1h";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set in environment");
  return secret;
}

export function signToken(payload: object, expiresIn = DEFAULT_EXPIRES_IN): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, getJwtSecret()) as T;
}

export default { signToken, verifyToken };
