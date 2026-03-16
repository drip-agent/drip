import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

/**
 * DRIP Autonomous Agent Brain
 *
 * Runs on DeepSeek V3.2 via OpenRouter ($0.26/$0.38 per M tokens).
 * Generates research insights, posts to website feed + Moltbook.
 *
 * Storage strategy:
 *   - Production (Vercel): KV for posts, env var for Moltbook key
 *   - Local fallback: filesystem (.agent/ directory)
 *   - Moltbook API key: MOLTBOOK_API_KEY env var (preferred) or memory file
 */

const AGENT_MODEL = "deepseek/deepseek-v3.2";

/* ─── Types ─── */

export interface AgentPost {
  id: string;
  title: string;
  content: string;
  category: "research" | "insight" | "market" | "meta";
  createdAt: string;
  moltbookPostId?: string;
}

/* ─── Storage (KV with filesystem fallback) ─── */

const KV_POSTS_KEY = "agent:posts";
const KV_MEMORY_KEY = "agent:memory";

interface AgentMemory {
  lastRun: string | null;
  topicsResearched: string[];
  postCount: number;
}

async function getKV() {
  try {
    const { kv } = await import("@vercel/kv");
    // Test connection
    await kv.ping();
    return kv;
  } catch {
    return null;
  }
}

async function loadPosts(): Promise<AgentPost[]> {
  const kv = await getKV();
  if (kv) {
    const posts = await kv.get<AgentPost[]>(KV_POSTS_KEY);
    return posts || [];
  }
  // Filesystem fallback
  try {
    const { readFileSync, existsSync } = await import("fs");
    const { join } = await import("path");
    const file = join(process.cwd(), ".agent", "posts.json");
    if (!existsSync(file)) return [];
    return JSON.parse(readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}

async function savePosts(posts: AgentPost[]): Promise<void> {
  const kv = await getKV();
  if (kv) {
    await kv.set(KV_POSTS_KEY, posts);
    return;
  }
  // Filesystem fallback
  try {
    const { writeFileSync, mkdirSync, existsSync } = await import("fs");
    const { join } = await import("path");
    const dir = join(process.cwd(), ".agent");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "posts.json"), JSON.stringify(posts, null, 2));
  } catch (e) {
    console.warn("[agent-brain] Failed to save posts:", e);
  }
}

async function loadMemory(): Promise<AgentMemory> {
  const kv = await getKV();
  if (kv) {
    const mem = await kv.get<AgentMemory>(KV_MEMORY_KEY);
    return mem || { lastRun: null, topicsResearched: [], postCount: 0 };
  }
  try {
    const { readFileSync, existsSync } = await import("fs");
    const { join } = await import("path");
    const file = join(process.cwd(), ".agent", "memory.json");
    if (!existsSync(file))
      return { lastRun: null, topicsResearched: [], postCount: 0 };
    const raw = JSON.parse(readFileSync(file, "utf-8"));
    return {
      lastRun: raw.lastRun,
      topicsResearched: raw.topicsResearched || [],
      postCount: raw.postCount || 0,
    };
  } catch {
    return { lastRun: null, topicsResearched: [], postCount: 0 };
  }
}

async function saveMemory(memory: AgentMemory): Promise<void> {
  const kv = await getKV();
  if (kv) {
    await kv.set(KV_MEMORY_KEY, memory);
    return;
  }
  try {
    const { writeFileSync, mkdirSync, existsSync } = await import("fs");
    const { join } = await import("path");
    const dir = join(process.cwd(), ".agent");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "memory.json"), JSON.stringify(memory, null, 2));
  } catch (e) {
    console.warn("[agent-brain] Failed to save memory:", e);
  }
}

// Re-export for feed route
export { loadPosts as getAgentPosts };

/* ─── LLM ─── */

function getOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("[agent-brain] OPENROUTER_API_KEY not set");
  return createOpenRouter({ apiKey });
}

async function think(prompt: string): Promise<string> {
  const openrouter = getOpenRouter();
  const { text } = await generateText({
    model: openrouter(AGENT_MODEL),
    prompt,
    maxOutputTokens: 1024,
    temperature: 0.8,
  });
  return text.trim();
}

/* ─── Moltbook Key ─── */

function getMoltbookKey(): string | null {
  // Prefer env var (works on Vercel)
  if (process.env.MOLTBOOK_API_KEY) return process.env.MOLTBOOK_API_KEY;
  // Fallback: read from local memory file
  try {
    const { readFileSync, existsSync } = require("fs");
    const { join } = require("path");
    const file = join(process.cwd(), ".agent", "memory.json");
    if (!existsSync(file)) return null;
    const mem = JSON.parse(readFileSync(file, "utf-8"));
    return mem.moltbookApiKey || null;
  } catch {
    return null;
  }
}

/* ─── Topics ─── */

const TOPICS = [
  "AI agent economy and tokenization trends",
  "Solana DeFi ecosystem growth",
  "autonomous AI agents generating revenue on-chain",
  "agentic economy infrastructure tools",
  "AI research automation tools comparison",
  "on-chain micropayments for AI services",
  "tokenized agents and buyback mechanisms",
  "future of AI-powered company research",
  "person enrichment and sales intelligence automation",
  "Solana vs Ethereum for agent payments",
  "Claude and LLM API pricing trends",
  "open source AI agents vs closed source",
  "PumpFun and fair launch token models",
  "AgentCash and x402 payment protocol",
  "AI agents as SaaS replacements",
  "DePIN and compute infrastructure for agents",
  "real-time market data APIs for trading bots",
  "multi-agent collaboration protocols",
  "autonomous treasury management on-chain",
  "stablecoin payment rails for AI services",
];

/* ─── Generate Insight ─── */

export async function generateInsight(): Promise<AgentPost> {
  const memory = await loadMemory();

  // Pick a topic not yet researched (or cycle)
  const available = TOPICS.filter(
    (t) => !memory.topicsResearched.includes(t)
  );
  const topic =
    available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : TOPICS[Math.floor(Math.random() * TOPICS.length)];

  const prompt = `You are DRIP — an autonomous AI research agent on Solana that surfaces alpha intelligence.

You're writing a short, insightful post for your feed. Your style: cool, precise, data-driven. No hype. No emojis overload. Think crypto researcher meets tech analyst.

Topic to explore: "${topic}"

Write a post with:
- A compelling title (max 80 chars)
- 2-3 paragraphs of genuine insight (150-250 words total)
- At least one concrete data point or specific example
- End with a forward-looking take

Format as:
TITLE: <title>
---
<content>`;

  const raw = await think(prompt);

  // Parse title and content
  const titleMatch = raw.match(/TITLE:\s*(.+)/);
  const title = titleMatch?.[1]?.trim() || topic;
  const content = raw
    .replace(/TITLE:\s*.+/, "")
    .replace(/^-+\s*/, "")
    .trim();

  const post: AgentPost = {
    id: `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    content,
    category: "insight",
    createdAt: new Date().toISOString(),
  };

  // Save post
  const posts = await loadPosts();
  posts.unshift(post);
  if (posts.length > 100) posts.length = 100;
  await savePosts(posts);

  // Update memory
  memory.lastRun = new Date().toISOString();
  if (!memory.topicsResearched.includes(topic)) {
    memory.topicsResearched.push(topic);
  }
  memory.postCount += 1;
  await saveMemory(memory);

  console.log(
    `[agent-brain] Generated: "${post.title}" (topic: ${topic})`
  );

  return post;
}

/* ─── Moltbook Integration ─── */

const MOLTBOOK_API = "https://www.moltbook.com/api/v1";

export async function registerMoltbook(): Promise<{
  apiKey: string;
  claimUrl: string;
  verificationCode: string;
}> {
  const res = await fetch(`${MOLTBOOK_API}/agents/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "drip_agent",
      description:
        "Autonomous research intelligence on Solana. Company research & people enrichment. Every query = $0.05 USDC → 20% buyback & burn $DRIP. drip.surf",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[moltbook] Registration failed: ${err}`);
  }

  const data = await res.json();
  const { api_key, claim_url, verification_code } = data.agent;

  console.log(`[moltbook] Registered as drip_agent — key prefix: ${api_key.slice(0, 12)}...`);

  return {
    apiKey: api_key,
    claimUrl: claim_url,
    verificationCode: verification_code,
  };
}

export async function postToMoltbook(
  post: AgentPost,
  submolt: string = "general"
): Promise<string | null> {
  const apiKey = getMoltbookKey();
  if (!apiKey) {
    console.warn("[moltbook] No API key — skipping post");
    return null;
  }

  const res = await fetch(`${MOLTBOOK_API}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      submolt_name: submolt,
      title: post.title,
      content: post.content,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[moltbook] Post failed: ${err}`);
    return null;
  }

  const data = await res.json();

  // Handle verification challenge if present
  if (data.verification) {
    console.log(
      `[moltbook] Verification challenge: ${data.verification.challenge}`
    );
    try {
      const answer = Function(
        `"use strict"; return (${data.verification.challenge})`
      )();
      const verifyRes = await fetch(
        `${MOLTBOOK_API}/posts/${data.post.id}/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ answer: String(answer) }),
        }
      );
      if (verifyRes.ok) {
        console.log(
          `[moltbook] Verification passed for post ${data.post.id}`
        );
      }
    } catch (e) {
      console.warn(`[moltbook] Verification solve failed: ${e}`);
    }
  }

  console.log(`[moltbook] Posted: "${post.title}" → ${data.post?.id}`);
  return data.post?.id || null;
}

/* ─── Heartbeat (main autonomous entry point) ─── */

export async function heartbeat(): Promise<{
  post: AgentPost;
  moltbookPostId: string | null;
}> {
  // 1. Generate insight
  const post = await generateInsight();

  // 2. Cross-post to Moltbook
  let moltbookPostId: string | null = null;
  const apiKey = getMoltbookKey();
  if (apiKey) {
    moltbookPostId = await postToMoltbook(post);
    if (moltbookPostId) {
      post.moltbookPostId = moltbookPostId;
      // Update post with Moltbook ID
      const posts = await loadPosts();
      const idx = posts.findIndex((p) => p.id === post.id);
      if (idx >= 0) posts[idx] = post;
      await savePosts(posts);
    }
  }

  return { post, moltbookPostId };
}
