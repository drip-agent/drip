import { NextResponse } from "next/server";

/**
 * GET /api/agent/feed — Agent posts feed
 *
 * 1. Local .agent/posts.json (dev / warm Vercel instance)
 * 2. Moltbook fallback: fetch known posts by ID
 * 3. Triggers background heartbeat if stale (visitor-driven autonomy)
 */

const MOLTBOOK_API = "https://www.moltbook.com/api/v1";

// Seed post IDs — new IDs added by cron heartbeat at runtime
const SEED_POST_IDS = [
  "2a4dc07e-933c-4f98-bf3e-35c129b23e61",
  "2e9bb482-369d-448c-8f37-195047458b33",
  "fb8897b7-3dbe-4da3-b442-8b5d917b1bb9",
];

// Runtime registry: accumulates new post IDs from heartbeats
const runtimePostIds: string[] = [];

export function registerPostId(id: string) {
  if (!runtimePostIds.includes(id) && !SEED_POST_IDS.includes(id)) {
    runtimePostIds.unshift(id);
  }
}

function getAllPostIds(): string[] {
  return [...new Set([...runtimePostIds, ...SEED_POST_IDS])];
}

interface FeedPost {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  moltbookPostId: string;
  score?: number;
  comments?: number;
}

async function fetchMoltbookPosts(apiKey: string): Promise<FeedPost[]> {
  const ids = getAllPostIds();
  const results: FeedPost[] = [];

  // Fetch in parallel
  const fetches = ids.map(async (id) => {
    try {
      const res = await fetch(`${MOLTBOOK_API}/posts/${id}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 120 },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const p = data.post || data;
      if (!p.title) return null;
      return {
        id: p.id,
        title: p.title,
        content: (p.content || "").replace(/^-+\s*/, ""),
        category: "insight",
        createdAt: p.created_at,
        moltbookPostId: p.id,
        score: p.score || 0,
        comments: p.comment_count || 0,
      } as FeedPost;
    } catch {
      return null;
    }
  });

  const settled = await Promise.all(fetches);
  for (const p of settled) {
    if (p) results.push(p);
  }

  return results.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);

  // 1. Try local posts
  try {
    const { getAgentPosts } = await import("@/lib/agent-brain");
    const localPosts = await getAgentPosts();
    if (localPosts.length > 0) {
      // Trigger background heartbeat for freshness (fire-and-forget)
      triggerHeartbeat(req);

      return NextResponse.json({
        posts: localPosts.slice(0, limit),
        total: localPosts.length,
        source: "local",
        updatedAt: new Date().toISOString(),
      });
    }
  } catch {
    /* no local */
  }

  // 2. Moltbook fallback
  const apiKey = process.env.MOLTBOOK_API_KEY;
  if (apiKey) {
    const posts = await fetchMoltbookPosts(apiKey);
    if (posts.length > 0) {
      // Trigger heartbeat to populate local store
      triggerHeartbeat(req);

      return NextResponse.json({
        posts: posts.slice(0, limit),
        total: posts.length,
        source: "moltbook",
        updatedAt: new Date().toISOString(),
      });
    }
  }

  // 3. Empty — definitely trigger heartbeat
  triggerHeartbeat(req);

  return NextResponse.json({
    posts: [],
    total: 0,
    source: "none",
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Fire-and-forget heartbeat trigger via visitor traffic.
 * Rate-limited by the heartbeat endpoint's cooldown.
 */
function triggerHeartbeat(req: Request) {
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : new URL(req.url).origin;

  fetch(`${baseUrl}/api/cron/heartbeat?trigger=visitor`).catch(() => {});
}
