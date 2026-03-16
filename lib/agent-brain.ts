import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

/**
 * DRIP Autonomous Agent Brain
 *
 * Runs on DeepSeek V3.2 via OpenRouter (cheap: $0.25/$0.38 per M tokens).
 * Generates research insights, posts to website feed, and interacts with Moltbook.
 *
 * This is the autonomous part — operates without user input.
 */

const AGENT_MODEL = "deepseek/deepseek-v3.2";
const MEMORY_DIR = join(process.cwd(), ".agent");
const MEMORY_FILE = join(MEMORY_DIR, "memory.json");
const POSTS_FILE = join(MEMORY_DIR, "posts.json");

// Ensure directories exist
if (!existsSync(MEMORY_DIR)) mkdirSync(MEMORY_DIR, { recursive: true });

/* ─── Types ─── */

export interface AgentPost {
  id: string;
  title: string;
  content: string;
  category: "research" | "insight" | "market" | "meta";
  createdAt: string;
  moltbookPostId?: string;
}

export interface AgentMemory {
  lastRun: string | null;
  topicsResearched: string[];
  postCount: number;
  moltbookRegistered: boolean;
  moltbookApiKey: string | null;
  moltbookAgentName: string | null;
}

/* ─── Memory ─── */

function loadMemory(): AgentMemory {
  if (!existsSync(MEMORY_FILE)) {
    return {
      lastRun: null,
      topicsResearched: [],
      postCount: 0,
      moltbookRegistered: false,
      moltbookApiKey: null,
      moltbookAgentName: null,
    };
  }
  return JSON.parse(readFileSync(MEMORY_FILE, "utf-8"));
}

function saveMemory(memory: AgentMemory): void {
  writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

export function loadPosts(): AgentPost[] {
  if (!existsSync(POSTS_FILE)) return [];
  return JSON.parse(readFileSync(POSTS_FILE, "utf-8"));
}

function savePosts(posts: AgentPost[]): void {
  writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

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

/* ─── Autonomous Actions ─── */

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
];

export async function generateInsight(): Promise<AgentPost> {
  const memory = loadMemory();

  // Pick a topic not yet researched (or cycle)
  const available = TOPICS.filter((t) => !memory.topicsResearched.includes(t));
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
    .replace(/^---\s*/, "")
    .trim();

  const post: AgentPost = {
    id: `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    content,
    category: "insight",
    createdAt: new Date().toISOString(),
  };

  // Save
  const posts = loadPosts();
  posts.unshift(post);
  // Keep max 100 posts
  if (posts.length > 100) posts.length = 100;
  savePosts(posts);

  // Update memory
  memory.lastRun = new Date().toISOString();
  if (!memory.topicsResearched.includes(topic)) {
    memory.topicsResearched.push(topic);
  }
  memory.postCount += 1;
  saveMemory(memory);

  console.log(
    `[agent-brain] Generated insight: "${post.title}" (topic: ${topic})`
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

  // Save to memory
  const memory = loadMemory();
  memory.moltbookRegistered = true;
  memory.moltbookApiKey = api_key;
  memory.moltbookAgentName = "drip_agent";
  saveMemory(memory);

  console.log(`[moltbook] Registered as drip_agent`);

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
  const memory = loadMemory();
  if (!memory.moltbookApiKey) {
    console.warn("[moltbook] Not registered — skipping post");
    return null;
  }

  const res = await fetch(`${MOLTBOOK_API}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${memory.moltbookApiKey}`,
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
    console.log(`[moltbook] Verification challenge: ${data.verification.challenge}`);
    try {
      // Solve math challenge
      const answer = eval(data.verification.challenge);
      const verifyRes = await fetch(
        `${MOLTBOOK_API}/posts/${data.post.id}/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${memory.moltbookApiKey}`,
          },
          body: JSON.stringify({ answer: String(answer) }),
        }
      );
      if (verifyRes.ok) {
        console.log(`[moltbook] Verification passed for post ${data.post.id}`);
      }
    } catch (e) {
      console.warn(`[moltbook] Verification failed: ${e}`);
    }
  }

  console.log(`[moltbook] Posted: "${post.title}" → ${data.post?.id}`);
  return data.post?.id || null;
}

export async function getMoltbookFeed(): Promise<unknown[]> {
  const memory = loadMemory();
  if (!memory.moltbookApiKey) return [];

  const res = await fetch(`${MOLTBOOK_API}/posts?sort=hot&limit=10`, {
    headers: { Authorization: `Bearer ${memory.moltbookApiKey}` },
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.posts || [];
}

/* ─── Heartbeat (main autonomous loop entry) ─── */

export async function heartbeat(): Promise<{
  post: AgentPost;
  moltbookPostId: string | null;
}> {
  // 1. Generate insight
  const post = await generateInsight();

  // 2. Post to Moltbook if registered
  let moltbookPostId: string | null = null;
  const memory = loadMemory();
  if (memory.moltbookApiKey) {
    moltbookPostId = await postToMoltbook(post);
    if (moltbookPostId) {
      post.moltbookPostId = moltbookPostId;
      // Update post with moltbook ID
      const posts = loadPosts();
      const idx = posts.findIndex((p) => p.id === post.id);
      if (idx >= 0) posts[idx] = post;
      savePosts(posts);
    }
  }

  return { post, moltbookPostId };
}
