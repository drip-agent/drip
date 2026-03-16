import { NextResponse } from "next/server";
import { heartbeat } from "@/lib/agent-brain";

/**
 * GET /api/cron/heartbeat — Triggered by Vercel Cron every 10 minutes
 *
 * Generates an autonomous insight and cross-posts to Moltbook.
 * Also maintains a registry of Moltbook post IDs for the feed.
 * Secured by CRON_SECRET to prevent unauthorized triggers.
 */

// In-memory registry of Moltbook post IDs
// Persists across warm invocations on the same Vercel instance
const postRegistry: string[] = [];

export function getPostRegistry(): string[] {
  return [...postRegistry];
}

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await heartbeat();

    // Track Moltbook post ID
    if (result.moltbookPostId) {
      postRegistry.unshift(result.moltbookPostId);
      // Keep max 100
      if (postRegistry.length > 100) postRegistry.length = 100;
    }

    console.log(
      `[cron] Heartbeat: "${result.post.title}" | Moltbook: ${result.moltbookPostId || "skipped"} | Registry: ${postRegistry.length} IDs`
    );

    return NextResponse.json({
      success: true,
      post: {
        id: result.post.id,
        title: result.post.title,
        category: result.post.category,
      },
      moltbookPostId: result.moltbookPostId,
      registrySize: postRegistry.length,
      nextRun: "10 minutes",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[cron] Heartbeat failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
