import { NextResponse } from "next/server";
import { heartbeat } from "@/lib/agent-brain";

/**
 * GET /api/cron/heartbeat — Triggered by Vercel Cron every 10 minutes
 *
 * Generates an autonomous insight and cross-posts to Moltbook.
 * Secured by CRON_SECRET to prevent unauthorized triggers.
 */
export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await heartbeat();

    console.log(
      `[cron] Heartbeat complete: "${result.post.title}" | Moltbook: ${result.moltbookPostId || "skipped"}`
    );

    return NextResponse.json({
      success: true,
      post: {
        id: result.post.id,
        title: result.post.title,
        category: result.post.category,
      },
      moltbookPostId: result.moltbookPostId,
      nextRun: "10 minutes",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[cron] Heartbeat failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
