import { NextResponse } from "next/server";
import {
  heartbeat,
  generateInsight,
  registerMoltbook,
  getAgentPosts,
} from "@/lib/agent-brain";

/**
 * POST /api/agent/autonomous — Trigger autonomous agent actions
 *
 * Actions:
 *   heartbeat — Generate insight + post to Moltbook
 *   generate  — Generate insight only (no Moltbook)
 *   register-moltbook — Register agent on Moltbook
 *   status — Get agent state
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action as string;

    switch (action) {
      case "heartbeat": {
        const result = await heartbeat();
        return NextResponse.json({
          success: true,
          post: result.post,
          moltbookPostId: result.moltbookPostId,
        });
      }

      case "generate": {
        const post = await generateInsight();
        return NextResponse.json({ success: true, post });
      }

      case "register-moltbook": {
        const result = await registerMoltbook();
        return NextResponse.json({
          success: true,
          claimUrl: result.claimUrl,
          verificationCode: result.verificationCode,
          message:
            "Open the claim URL and verify with your X account",
        });
      }

      case "status": {
        const posts = await getAgentPosts();
        return NextResponse.json({
          postCount: posts.length,
          latestPost: posts[0] || null,
          moltbookConfigured: !!process.env.MOLTBOOK_API_KEY,
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[autonomous] Error: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
