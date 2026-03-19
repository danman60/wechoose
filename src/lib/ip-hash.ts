import { createHash } from "crypto";

export function hashIP(ip: string): string {
  const salt = process.env.IP_HASH_SALT || "wechoose-default-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "unknown";
}
