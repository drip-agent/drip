import { NextResponse } from "next/server";
import { heartbeat } from "@/lib/agent-brain";
import { registerPostId } from "@/app/api/agent/feed/route";

/**
 * GET /api/cron/heartbeat — Autonomous agent heartbeat
 *
 * Generates insight + cross-posts to Moltbook.
 * Rate-limited to once per 10 minutes.
 *
 * Triggers:
 *   1. Vercel Cron (every 4h — Hobby plan)
 *   2. Visitor-triggered from feed page (?trigger=visitor) — 10min cooldown
 *   3. Manual via CRON_SECRET auth
 */

export const maxDuration = 30;

let lastHeartbeat = 0;
const COOLDOWN_MS = 10 * 60 * 1000;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const isAuthorized = !cronSecret || authHeader === `Bearer ${cronSecret}`;
  const isTrigger =
    new URL(req.url).searchParams.get("trigger") === "visitor";

  // Visitor trigger: respect cooldown
  if (isTrigger) {
    const now = Date.now();
    if (now - lastHeartbeat < COOLDOWN_MS) {
      return NextResponse.json({
        skipped: true,
        reason: "cooldown",
        nextIn: Math.ceil((lastHeartbeat + COOLDOWN_MS - now) / 1000) + "s",
      });
    }
  } else if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await heartbeat();
    lastHeartbeat = Date.now();

    // Register Moltbook post ID for feed fallback
    if (result.moltbookPostId) {
      registerPostId(result.moltbookPostId);
    }

    console.log(
      `[cron] Heartbeat: "${result.post.title}" → Moltbook: ${result.moltbookPostId || "skipped"}`
    );

    return NextResponse.json({
      success: true,
      post: {
        id: result.post.id,
        title: result.post.title,
        category: result.post.category,
      },
      moltbookPostId: result.moltbookPostId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[cron] Heartbeat failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
