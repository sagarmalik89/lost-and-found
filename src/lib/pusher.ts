// src/lib/pusher.ts
import Pusher from "pusher";

/**
 * Server‑side Pusher Channels instance used by API routes to broadcast events in real-time.
 * Ensure the following environment variables are defined in .env:
 *   PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER
 */
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID ?? "",
  key: process.env.PUSHER_KEY ?? "",
  secret: process.env.PUSHER_SECRET ?? "",
  cluster: process.env.PUSHER_CLUSTER ?? "mt1",
  useTLS: true,
});
