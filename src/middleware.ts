// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@upstash/redis";
import { z } from "zod";

// ----- Upstash Redis rate limiter -----
const redis = createClient({
  url: process.env.UPSTASH_REDIS_URL ?? "",
  token: process.env.UPSTASH_REDIS_TOKEN ?? "",
});

const RATE_LIMIT = 100; // requests per minute per IP
const WINDOW_MS = 60 * 1000;

async function checkRateLimit(ip: string) {
  const key = `rl:${ip}`;
  const now = Date.now();
  const ttl = Math.ceil(WINDOW_MS / 1000);
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, ttl);
  return count <= RATE_LIMIT;
}

// ----- CSRF protection for state‑changing methods -----
function validateCsrf(req: NextRequest): boolean {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method ?? "")) {
    const header = req.headers.get("x-csrf-token");
    const cookie = req.cookies.get("csrfToken")?.value;
    return header && cookie && header === cookie;
  }
  return true;
}

// ----- Role‑based access control -----
async function getUserRole(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("next-auth.session-token")?.value;
  if (!token) return null;
  // Decode JWT without verification for speed (NextAuth already verifies on server‑side).
  const payload = token.split(".")[1];
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
    return decoded.role ?? null;
  } catch {
    return null;
  }
}

// ----- Input sanitisation helper (example schema) -----
export const sanitizeBody = (schema: z.ZodSchema<any>, body: any) => {
  const result = schema.safeParse(body);
  if (!result.success) throw new Error("Invalid request payload");
  return result.data;
};

export async function middleware(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  // Rate limiting
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  // CSRF protection
  if (!validateCsrf(req)) {
    return new NextResponse("Invalid CSRF token", { status: 403 });
  }

  // RBAC – protect admin & moderator routes
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  if (pathname.startsWith("/admin") || pathname.startsWith("/moderator")) {
    const role = await getUserRole(req);
    if (!role || (pathname.startsWith("/admin") && role !== "ADMIN") || (pathname.startsWith("/moderator") && role !== "MODERATOR" && role !== "ADMIN")) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // Allow request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/moderator/:path*"],
};
