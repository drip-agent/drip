import { NextResponse } from "next/server";
import { getAgentPosts } from "@/lib/agent-brain";

/**
 * GET /api/agent/feed — Get agent's autonomous posts
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);

  const posts = (await getAgentPosts()).slice(0, limit);

  return NextResponse.json({
    posts,
    total: posts.length,
    updatedAt: new Date().toISOString(),
  });
}
