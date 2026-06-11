import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/auth";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers["authorization"]?.toString();
  const token =
    header?.replace(/Bearer\s+/i, "") ||
    req.headers["x-admin-token"]?.toString();

  if (!token) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  // Allow static token fallback for development/seeding if configured
  if (process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN) {
    return next();
  }

  // Otherwise, verify JWT
  const verified = verifyToken(token);
  if (!verified.ok) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  // Attach user info to request
  (req as any).adminUser = verified.username;
  return next();
}

export default adminAuth;

