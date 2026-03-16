import { NextResponse } from "next/server";

/**
 * GET /api/agent/feed — Agent posts feed
 *
 * Strategy:
 *   1. Try local .agent/posts.json (has all data including moltbook IDs)
 *   2. If empty, fetch known post IDs from Moltbook individually
 *
 * The cron heartbeat stores posts locally AND cross-posts to Moltbook.
 * On Vercel (ephemeral FS), we fetch from Moltbook using stored post IDs.
 */

const MOLTBOOK_API = "https://www.moltbook.com/api/v1";

// Known Moltbook post IDs — updated by cron heartbeat
// This acts as a registry when KV isn't available
const KNOWN_POST_IDS = [
  "2e9bb482-369d-448c-8f37-195047458b33",
  "fb8897b7-3dbe-4da3-b442-8b5d917b1bb9",
];

interface MoltbookPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  score?: number;
  comment_count?: number;
  author?: { name: string };
}

async function fetchMoltbookPosts(
  apiKey: string,
  postIds: string[]
): Promise<MoltbookPost[]> {
  const results: MoltbookPost[] = [];

  for (const id of postIds) {
    try {
      const res = await fetch(`${MOLTBOOK_API}/posts/${id}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 120 },
      });
      if (res.ok) {
        const data = await res.json();
        const post = data.post || data;
        if (post.title) results.push(post);
      }
    } catch {
      /* skip failed fetches */
    }
  }

  return results.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);

  // 1. Try local file first (dev + post-heartbeat on Vercel)
  try {
    const { getAgentPosts } = await import("@/lib/agent-brain");
    const localPosts = await getAgentPosts();
    if (localPosts.length > 0) {
      return NextResponse.json({
        posts: localPosts.slice(0, limit),
        total: localPosts.length,
        source: "local",
        updatedAt: new Date().toISOString(),
      });
    }
  } catch {
    /* no local posts */
  }

  // 2. Fallback: fetch from Moltbook
  const moltbookKey = process.env.MOLTBOOK_API_KEY;
  if (moltbookKey && KNOWN_POST_IDS.length > 0) {
    const moltPosts = await fetchMoltbookPosts(moltbookKey, KNOWN_POST_IDS);
    if (moltPosts.length > 0) {
      const posts = moltPosts.slice(0, limit).map((p) => ({
        id: p.id,
        title: p.title,
        content: p.content || "",
        category: "insight" as const,
        createdAt: p.created_at,
        moltbookPostId: p.id,
        score: p.score || 0,
        comments: p.comment_count || 0,
      }));

      return NextResponse.json({
        posts,
        total: posts.length,
        source: "moltbook",
        updatedAt: new Date().toISOString(),
      });
    }
  }

  // 3. Empty
  return NextResponse.json({
    posts: [],
    total: 0,
    source: "none",
    updatedAt: new Date().toISOString(),
  });
}
