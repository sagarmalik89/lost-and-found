// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // In production, create a single global instance to avoid exhausting connections
  prisma = new PrismaClient();
} else {
  // In development, attach the client to the global object to reuse across HMR
  if (!(globalThis as any).prisma) {
    (globalThis as any).prisma = new PrismaClient();
  }
  prisma = (globalThis as any).prisma;
}

export default prisma;
