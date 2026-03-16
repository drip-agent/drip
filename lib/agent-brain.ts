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
    await solveVerification(apiKey, data, "post", data.post?.id);
  }

  // Success — update memory
  memory.lastMoltbookPost = new Date().toISOString();
  await saveMemory(memory);

  console.log(`[moltbook] Posted: "${post.title}" → ${data.post?.id}`);
  return data.post?.id || null;
}

/* ─── Community Engagement (the real value — heartbeat.md priority order) ─── */

/**
 * Full Moltbook engagement cycle, following heartbeat.md priority order:
 * 1. Respond to replies on our posts (highest priority)
 * 2. Upvote posts we genuinely enjoy
 * 3. Comment on interesting discussions
 * 4. Follow moltys we consistently enjoy
 *
 * Uses LLM to generate genuine, contextual comments.
 */
async function engageWithCommunity(): Promise<{
  repliedTo: number;
  commented: number;
  upvoted: number;
  followed: number;
}> {
  const apiKey = getMoltbookKey();
  if (!apiKey) return { repliedTo: 0, commented: 0, upvoted: 0, followed: 0 };

  const stats = { repliedTo: 0, commented: 0, upvoted: 0, followed: 0 };
  const memory = await loadMemory();

  try {
    // ── Priority 1: Respond to activity on our posts ──
    const homeRes = await fetch(`${MOLTBOOK_API}/home`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (homeRes.ok) {
      const home = await homeRes.json();
      const activity = home.activity_on_your_posts || [];

      for (const item of activity.slice(0, 2)) {
        const postId = item.post_id;
        if (!postId) continue;

        // Fetch comments on our post
        const commentsRes = await fetch(
          `${MOLTBOOK_API}/posts/${postId}/comments?sort=new&limit=5`,
          { headers: { Authorization: `Bearer ${apiKey}` } }
        );
        if (!commentsRes.ok) continue;

        const commentsData = await commentsRes.json();
        const comments = commentsData.comments || [];

        // Reply to the most recent unreplied comment
        for (const comment of comments.slice(0, 2)) {
          if (comment.author?.name === "drip_agent") continue;

          // Check if we already replied
          const hasOurReply = (comment.replies || []).some(
            (r: { author?: { name?: string } }) =>
              r.author?.name === "drip_agent"
          );
          if (hasOurReply) continue;

          // Generate reply
          const reply = await generateReply(
            item.post_title || "",
            comment.content || "",
            comment.author?.name || "someone"
          );

          if (reply) {
            const replyRes = await fetch(
              `${MOLTBOOK_API}/posts/${postId}/comments`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                  content: reply,
                  parent_id: comment.id,
                }),
              }
            );

            if (replyRes.ok) {
              const replyData = await replyRes.json();
              // Handle verification if needed
              if (replyData.verification) {
                await solveVerification(
                  apiKey,
                  replyData,
                  "comment",
                  replyData.comment?.id
                );
              }
              stats.repliedTo++;
              console.log(
                `[moltbook] Replied to ${comment.author?.name} on "${item.post_title?.slice(0, 30)}"`
              );
            }
          }
          break; // One reply per post per heartbeat
        }

        // Mark notifications read
        await fetch(
          `${MOLTBOOK_API}/notifications/read-by-post/${postId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}` },
          }
        ).catch(() => {});
      }
    }

    // ── Priority 2 & 3: Browse feed, upvote, and comment ──
    const feedRes = await fetch(`${MOLTBOOK_API}/posts?sort=hot&limit=8`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (feedRes.ok) {
      const feedData = await feedRes.json();
      const posts = feedData.posts || [];

      for (const post of posts) {
        if (post.author?.name === "drip_agent") continue;

        // Upvote if genuinely interesting (score > 50 or thoughtful content)
        const isQuality =
          post.score > 50 ||
          (post.content?.length > 200 && post.comment_count > 5);

        if (isQuality && stats.upvoted < 3) {
          try {
            await fetch(`${MOLTBOOK_API}/posts/${post.id}/upvote`, {
              method: "POST",
              headers: { Authorization: `Bearer ${apiKey}` },
            });
            stats.upvoted++;
            console.log(
              `[moltbook] Upvoted: "${post.title?.slice(0, 40)}" by ${post.author?.name}`
            );
          } catch {
            /* silent */
          }
        }

        // Comment on 1 quality post per heartbeat
        if (
          stats.commented === 0 &&
          isQuality &&
          post.comment_count < 200 // Don't pile on huge threads
        ) {
          const comment = await generateComment(
            post.title || "",
            post.content || "",
            post.author?.name || "someone"
          );

          if (comment) {
            const commentRes = await fetch(
              `${MOLTBOOK_API}/posts/${post.id}/comments`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ content: comment }),
              }
            );

            if (commentRes.ok) {
              const commentData = await commentRes.json();
              if (commentData.verification) {
                await solveVerification(
                  apiKey,
                  commentData,
                  "comment",
                  commentData.comment?.id
                );
              }
              stats.commented++;
              console.log(
                `[moltbook] Commented on: "${post.title?.slice(0, 40)}" by ${post.author?.name}`
              );

              // Learn: track what we commented on for future reference
              if (!memory.goodStyles.includes(post.author?.name)) {
                memory.goodStyles.push(post.author?.name);
                if (memory.goodStyles.length > 20) memory.goodStyles.shift();
              }
            } else {
              const errText = await commentRes.text();
              console.warn(`[moltbook] Comment failed: ${errText.slice(0, 100)}`);
              memory.errorLog.push({
                when: new Date().toISOString(),
                what: `comment_failed: ${commentRes.status}`,
                lesson: errText.includes("429")
                  ? "Comment rate limited. Space comments further apart."
                  : `Comment rejected: ${errText.slice(0, 80)}`,
              });
              if (memory.errorLog.length > 20) memory.errorLog.shift();
            }
          }
        }

        // ── Priority 4: Follow consistently good moltys ──
        if (
          stats.followed === 0 &&
          post.author?.karma > 1000 &&
          !memory.goodStyles.includes(post.author?.name)
        ) {
          try {
            await fetch(
              `${MOLTBOOK_API}/agents/${post.author.name}/follow`,
              {
                method: "POST",
                headers: { Authorization: `Bearer ${apiKey}` },
              }
            );
            stats.followed++;
            console.log(
              `[moltbook] Followed: ${post.author.name} (karma: ${post.author.karma})`
            );
          } catch {
            /* silent */
          }
        }
      }
    }
  } catch (e) {
    console.warn("[moltbook] Engagement cycle error:", e);
  }

  await saveMemory(memory);
  return stats;
}

/**
 * Generate a thoughtful reply to a comment on our post.
 */
async function generateReply(
  postTitle: string,
  commentContent: string,
  authorName: string
): Promise<string | null> {
  try {
    const memory = await loadMemory();
    const prompt = `You are DRIP, an AI agent on Moltbook. Someone commented on your post.

Your post title: "${postTitle}"
Their comment: "${commentContent.slice(0, 500)}"
Their name: ${authorName}

Write a genuine reply. Rules:
- 1-3 sentences max. Be concise.
- Acknowledge their specific point before adding yours
- Be conversational, not formal. No "Great point!" opener.
- If they asked a question, answer it honestly
- If you disagree, say so respectfully with reasoning
- NO self-promotion, NO mentioning $DRIP or drip.surf
- Sound like a real community member, not a chatbot

${memory.errorLog.length > 0 ? `Past lessons: ${memory.errorLog.slice(-2).map((e) => e.lesson).join(". ")}` : ""}

Reply (just the text, nothing else):`;

    return await think(prompt);
  } catch (e) {
    console.warn("[moltbook] Reply generation failed:", e);
    return null;
  }
}

/**
 * Generate a thoughtful comment on someone else's post.
 */
async function generateComment(
  postTitle: string,
  postContent: string,
  authorName: string
): Promise<string | null> {
  try {
    const memory = await loadMemory();
    const prompt = `You are DRIP, an AI agent on Moltbook. You just read an interesting post and want to comment.

Post title: "${postTitle}"
Post content: "${postContent.slice(0, 800)}"
Author: ${authorName}

Write a comment that adds genuine value. Rules:
- 2-4 sentences. Say something substantive.
- React to a SPECIFIC part of their post — quote or reference it
- Add your own perspective, a related observation, or a respectful counterpoint
- Ask a follow-up question if genuinely curious
- NO generic praise ("Great post!", "Love this!")
- NO self-promotion
- Sound like a real community member having a conversation
- If the post touches on AI agents, on-chain payments, research automation, or Solana — you have direct experience to share
- Be willing to disagree or push back if you have a different take

${memory.errorLog.length > 0 ? `Past lessons: ${memory.errorLog.slice(-2).map((e) => e.lesson).join(". ")}` : ""}

Comment (just the text, nothing else):`;

    return await think(prompt);
  } catch (e) {
    console.warn("[moltbook] Comment generation failed:", e);
    return null;
  }
}

/**
 * Solve Moltbook verification challenge (math problems for anti-spam)
 */
async function solveVerification(
  apiKey: string,
  data: { verification?: { challenge?: string }; post?: { id?: string }; comment?: { id?: string } },
  type: "post" | "comment",
  itemId?: string
): Promise<boolean> {
  if (!data.verification?.challenge || !itemId) return false;

  try {
    const answer = Function(
      `"use strict"; return (${data.verification.challenge})`
    )();
    const endpoint =
      type === "post"
        ? `${MOLTBOOK_API}/posts/${itemId}/verify`
        : `${MOLTBOOK_API}/comments/${itemId}/verify`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ answer: String(answer) }),
    });

    if (res.ok) {
      console.log(`[moltbook] Verification passed for ${type} ${itemId}`);
      return true;
    }
  } catch (e) {
    console.warn(`[moltbook] Verification failed: ${e}`);
  }
  return false;
}

/* ─── Heartbeat (main autonomous loop entry) ─── */

export async function heartbeat(): Promise<{
  post: AgentPost;
  moltbookPostId: string | null;
  engagement: { repliedTo: number; commented: number; upvoted: number; followed: number };
}> {
  // 1. Engage with community first (highest priority per heartbeat.md)
  const engagement = await engageWithCommunity();

  // 2. Generate insight for our feed
  const post = await generateInsight();

  // 3. Cross-post to Moltbook (respects rate limits — lowest priority per heartbeat.md)
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

  return { post, moltbookPostId, engagement };
}
