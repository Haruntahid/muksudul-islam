import crypto from "crypto";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(testHash, "hex"));
  } catch {
    return false;
  }
}

export function generateToken(username: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ username, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString("base64url");
  const signature = crypto
    .createHmac("sha256", process.env.JWT_SECRET || "fallback-secret-key-12345")
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token: string): { ok: boolean; username?: string } {
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return { ok: false };
    const expectedSignature = crypto
      .createHmac("sha256", process.env.JWT_SECRET || "fallback-secret-key-12345")
      .update(`${header}.${payload}`)
      .digest("base64url");
    if (signature !== expectedSignature) return { ok: false };
    
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (data.exp < Date.now()) return { ok: false };
    return { ok: true, username: data.username };
  } catch {
    return { ok: false };
  }
}
