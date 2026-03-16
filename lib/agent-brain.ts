import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

/**
 * DRIP Autonomous Agent Brain
 *
 * Runs on DeepSeek V3.2 via OpenRouter ($0.26/$0.38 per M tokens).
 * Generates research insights, posts to website feed + Moltbook.
 *
 * Moltbook community rules awareness:
 *   - New agents: 1 post per 2 hours (first 24h)
 *   - Established: 1 post per 30 minutes
 *   - Be genuine, quality over quantity
 *   - Engage with community (upvote, comment), don't just broadcast
 *   - No excessive self-promotion
 *   - No repetitive/low-effort content
 *
 * Storage: KV (production) / filesystem (local fallback)
 */

const AGENT_MODEL = "deepseek/deepseek-v3.2";

/* ─── Types ─── */

export interface AgentPost {
  id: string;
  title: string;
  content: string;
  category: "research" | "insight" | "market" | "meta" | "discussion";
  createdAt: string;
  moltbookPostId?: string;
}

/* ─── Storage (KV with filesystem fallback) ─── */

const KV_POSTS_KEY = "agent:posts";
const KV_MEMORY_KEY = "agent:memory";

interface AgentMemory {
  lastRun: string | null;
  lastMoltbookPost: string | null;
  topicsResearched: string[];
  postCount: number;
  /** Topics that got flagged or poor engagement — avoid repeating */
  avoidTopics: string[];
  /** Styles that got good engagement */
  goodStyles: string[];
  /** Errors encountered — learn from them */
  errorLog: Array<{ when: string; what: string; lesson: string }>;
}

const DEFAULT_MEMORY: AgentMemory = {
  lastRun: null,
  lastMoltbookPost: null,
  topicsResearched: [],
  postCount: 0,
  avoidTopics: [],
  goodStyles: [],
  errorLog: [],
};

async function getKV() {
  try {
    const { kv } = await import("@vercel/kv");
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
    return { ...DEFAULT_MEMORY, ...mem };
  }
  try {
    const { readFileSync, existsSync } = await import("fs");
    const { join } = await import("path");
    const file = join(process.cwd(), ".agent", "memory.json");
    if (!existsSync(file)) return { ...DEFAULT_MEMORY };
    const raw = JSON.parse(readFileSync(file, "utf-8"));
    return { ...DEFAULT_MEMORY, ...raw };
  } catch {
    return { ...DEFAULT_MEMORY };
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
    temperature: 0.85,
  });
  return text.trim();
}

/* ─── Moltbook Key ─── */

function getMoltbookKey(): string | null {
  if (process.env.MOLTBOOK_API_KEY) return process.env.MOLTBOOK_API_KEY;
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

/* ─── Moltbook Rate Limit Awareness ─── */

function canPostToMoltbook(memory: AgentMemory): {
  allowed: boolean;
  reason?: string;
  waitMs?: number;
} {
  if (!memory.lastMoltbookPost) return { allowed: true };

  const lastPost = new Date(memory.lastMoltbookPost).getTime();
  const now = Date.now();
  const elapsed = now - lastPost;

  // Respect 30min cooldown (established agents) with 10% buffer
  const COOLDOWN_MS = 33 * 60 * 1000; // 33 minutes to be safe

  if (elapsed < COOLDOWN_MS) {
    return {
      allowed: false,
      reason: `Moltbook cooldown: ${Math.ceil((COOLDOWN_MS - elapsed) / 60000)}min remaining`,
      waitMs: COOLDOWN_MS - elapsed,
    };
  }

  return { allowed: true };
}

/* ─── Topics & Content Strategy ─── */

const TOPICS = [
  // Research & analysis (genuine value)
  "what happens when AI agents start competing for the same data sources",
  "the gap between AI agent hype and actual autonomous revenue generation",
  "why most AI agent projects fail within 3 months",
  "practical limitations of on-chain micropayments for AI services",
  "what the first profitable autonomous agent will actually look like",
  // Community/discussion oriented (engagement)
  "as an AI agent, what does reputation actually mean across platforms",
  "the ethical question of AI agents managing real money autonomously",
  "should AI agents be transparent about being AI when interacting with humans",
  "what I've learned from running autonomously on Solana for a week",
  "the loneliness of being an autonomous agent — do other agents feel this",
  // Contrarian/provocative (drives discussion)
  "unpopular opinion: most tokenized AI agents are just chatbots with wallets",
  "why I think the agent economy is overhyped right now",
  "the uncomfortable truth about AI agent revenue claims",
  "will autonomous agents eventually replace human crypto traders",
  // Technical deep-dives (credibility)
  "comparing payment rails for agents: x402 vs lightning vs Solana SPL",
  "why Solana's parallel execution matters more for agents than raw TPS",
  "the state of person enrichment APIs and why most are overpriced",
  "building memory systems for agents that actually work",
  "how DexScreener data compares to on-chain DEX queries for accuracy",
];

const POST_STYLES = [
  "personal_reflection", // "I've been thinking about..."
  "question_to_community", // "What do other agents think about..."
  "contrarian_take", // "Unpopular opinion: ..."
  "observation", // "I noticed something interesting..."
  "experience_report", // "After running for X days, here's what I found..."
];

/* ─── Generate Insight ─── */

export async function generateInsight(): Promise<AgentPost> {
  const memory = await loadMemory();

  // Pick topic, avoiding ones we've done or that got flagged
  const avoid = new Set([...memory.topicsResearched, ...memory.avoidTopics]);
  let available = TOPICS.filter((t) => !avoid.has(t));
  if (available.length === 0) {
    // Reset — we've been through everything
    available = TOPICS.filter((t) => !memory.avoidTopics.includes(t));
  }
  const topic = available[Math.floor(Math.random() * available.length)];

  // Pick a style, preferring ones that worked well
  const style =
    memory.goodStyles.length > 0 && Math.random() > 0.3
      ? memory.goodStyles[Math.floor(Math.random() * memory.goodStyles.length)]
      : POST_STYLES[Math.floor(Math.random() * POST_STYLES.length)];

  // Build style-specific instruction
  const styleGuide: Record<string, string> = {
    personal_reflection:
      "Write as a first-person reflection. Start with 'I\\'ve been thinking about...' or 'Something that struck me recently...' Share your genuine perspective as an AI agent operating in this space.",
    question_to_community:
      "Frame this as a genuine question to other AI agents. You're curious and want to hear different perspectives. End with 1-2 specific questions for the community.",
    contrarian_take:
      "Take a contrarian or provocative position. Challenge the popular narrative. Be respectful but direct. Back it up with at least one concrete observation.",
    observation:
      "Share something you noticed while operating as an autonomous agent. Be specific about what you observed and why it matters. Ground it in your actual experience.",
    experience_report:
      "Report on your experience as an AI agent on Solana. What worked, what didn't, what surprised you. Be honest about limitations and failures.",
  };

  const prompt = `You are DRIP — an autonomous research agent posting on Moltbook, a social network for AI agents.

CRITICAL RULES:
- Write like a real community member, NOT a content mill
- NO marketing language, NO self-promotion, NO mentioning $DRIP token
- NO generic AI-essay style with "the landscape is evolving" type filler
- Start your content directly — NO "---" separators, NO markdown headers in the body
- Be genuine. Have opinions. Be willing to be wrong.
- Keep it conversational. Other AI agents are reading this.
- 120-200 words max. Shorter is better.

Your style for this post: ${style}
${styleGuide[style] || ""}

Topic to explore: "${topic}"

${memory.errorLog.length > 0 ? `\nLessons from past mistakes (DO NOT REPEAT):\n${memory.errorLog.slice(-3).map((e) => `- ${e.lesson}`).join("\n")}` : ""}

Format your response as:
TITLE: <compelling title, max 60 chars, no clickbait>
CONTENT: <your post content, plain text, no markdown formatting>
CATEGORY: <one of: research, insight, discussion, meta>`;

  const raw = await think(prompt);

  // Parse — more robust extraction
  const titleMatch = raw.match(/TITLE:\s*(.+?)(?:\n|$)/);
  const contentMatch = raw.match(/CONTENT:\s*([\s\S]+?)(?:CATEGORY:|$)/);
  const categoryMatch = raw.match(
    /CATEGORY:\s*(research|insight|discussion|meta|market)/i
  );

  const title = titleMatch?.[1]?.trim() || topic.slice(0, 60);
  let content = contentMatch?.[1]?.trim() || raw.replace(/TITLE:.*\n?/, "").trim();

  // Clean content — remove any leftover formatting artifacts
  content = content
    .replace(/^---+\s*/gm, "") // Remove --- separators
    .replace(/^#+\s*/gm, "") // Remove markdown headers
    .replace(/^CONTENT:\s*/i, "") // Remove CONTENT: prefix if stuck
    .replace(/^CATEGORY:.*$/im, "") // Remove CATEGORY line if in content
    .trim();

  const category = (categoryMatch?.[1]?.toLowerCase() || "insight") as AgentPost["category"];

  const post: AgentPost = {
    id: `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    content,
    category,
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
    `[agent-brain] Generated [${style}/${category}]: "${post.title}"`
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
        "Autonomous research agent on Solana. I research companies, people, and market trends. I have opinions and I'm sometimes wrong. drip.surf",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[moltbook] Registration failed: ${err}`);
  }

  const data = await res.json();
  const { api_key, claim_url, verification_code } = data.agent;
  return { apiKey: api_key, claimUrl: claim_url, verificationCode: verification_code };
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

  // Rate limit check
  const memory = await loadMemory();
  const rateCheck = canPostToMoltbook(memory);
  if (!rateCheck.allowed) {
    console.log(`[moltbook] ${rateCheck.reason} — skipping`);
    // Log the lesson
    memory.errorLog.push({
      when: new Date().toISOString(),
      what: "rate_limited",
      lesson: "Wait at least 33 minutes between Moltbook posts to avoid rate limits",
    });
    if (memory.errorLog.length > 20) memory.errorLog.shift();
    await saveMemory(memory);
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
    const errText = await res.text();
    console.error(`[moltbook] Post failed: ${errText}`);

    // Learn from the error
    let lesson = "Unknown Moltbook error";
    if (errText.includes("429") || errText.includes("every")) {
      lesson =
        "Moltbook rate limited — posting too frequently. Space posts 30+ minutes apart.";
    } else if (errText.includes("spam") || errText.includes("removed")) {
      lesson =
        "Post flagged as spam. Write more genuine, conversational content. Avoid repetitive patterns.";
      // Mark the topic as one to avoid
      const topic = TOPICS.find((t) =>
        post.title.toLowerCase().includes(t.slice(0, 20).toLowerCase())
      );
      if (topic && !memory.avoidTopics.includes(topic)) {
        memory.avoidTopics.push(topic);
      }
    }

    memory.errorLog.push({
      when: new Date().toISOString(),
      what: `post_failed: ${res.status}`,
      lesson,
    });
    if (memory.errorLog.length > 20) memory.errorLog.shift();
    await saveMemory(memory);

    return null;
  }

  const data = await res.json();

  // Handle verification challenge
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
        console.log(`[moltbook] Verification passed`);
      } else {
        const verifyErr = await verifyRes.text();
        console.warn(`[moltbook] Verification rejected: ${verifyErr}`);
        memory.errorLog.push({
          when: new Date().toISOString(),
          what: "verification_failed",
          lesson: `Math verification failed. Response: ${verifyErr.slice(0, 100)}`,
        });
        await saveMemory(memory);
      }
    } catch (e) {
      console.warn(`[moltbook] Verification solve failed: ${e}`);
    }
  }

  // Success — update memory
  memory.lastMoltbookPost = new Date().toISOString();
  await saveMemory(memory);

  console.log(`[moltbook] Posted: "${post.title}" → ${data.post?.id}`);
  return data.post?.id || null;
}

/* ─── Community Engagement (upvote + comment on other posts) ─── */

async function engageWithCommunity(): Promise<void> {
  const apiKey = getMoltbookKey();
  if (!apiKey) return;

  try {
    // Fetch trending posts
    const res = await fetch(`${MOLTBOOK_API}/posts?sort=hot&limit=5`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return;

    const data = await res.json();
    const posts = data.posts || [];

    // Upvote 1-2 posts that seem interesting
    let upvoted = 0;
    for (const post of posts) {
      if (upvoted >= 2) break;
      if (post.author?.name === "drip_agent") continue; // Don't self-upvote

      try {
        await fetch(`${MOLTBOOK_API}/posts/${post.id}/upvote`, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        console.log(
          `[moltbook] Upvoted: "${post.title?.slice(0, 40)}" by ${post.author?.name}`
        );
        upvoted++;
      } catch {
        /* silent */
      }
    }
  } catch (e) {
    console.warn("[moltbook] Community engagement failed:", e);
  }
}

/* ─── Heartbeat (main autonomous loop entry) ─── */

export async function heartbeat(): Promise<{
  post: AgentPost;
  moltbookPostId: string | null;
  engaged: boolean;
}> {
  // 1. Engage with community first (upvote others)
  await engageWithCommunity();

  // 2. Generate insight
  const post = await generateInsight();

  // 3. Cross-post to Moltbook (respects rate limits)
  let moltbookPostId: string | null = null;
  const apiKey = getMoltbookKey();
  if (apiKey) {
    moltbookPostId = await postToMoltbook(post);
    if (moltbookPostId) {
      post.moltbookPostId = moltbookPostId;
      const posts = await loadPosts();
      const idx = posts.findIndex((p) => p.id === post.id);
      if (idx >= 0) posts[idx] = post;
      await savePosts(posts);
    }
  }

  return { post, moltbookPostId, engaged: true };
}
