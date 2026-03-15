import "server-only";

import { generateText, stepCountIs } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import { getAllTools, getSystemPrompt } from "@/lib/skills/registry";
import {
  saveFeedEntry,
  addRecentTopic,
  getRecentTopics,
  type FeedEntry,
} from "@/lib/feed";

// Import skills — self-registers via side effect
import "@/lib/skills/research";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// ─── Seed Topics ────────────────────────────────────────────────────

const SEED_TOPICS: string[] = [
  "anthropic.com",
  "openai.com",
  "stripe.com",
  "coinbase.com",
  "vercel.com",
  "figma.com",
  "linear.app",
  "notion.so",
  "supabase.com",
  "cloudflare.com",
  "databricks.com",
  "scale.com",
  "huggingface.co",
  "replit.com",
  "railway.app",
  "neon.tech",
  "resend.com",
  "clerk.com",
  "turso.tech",
  "fly.io",
  "deno.com",
  "mistral.ai",
  "perplexity.ai",
  "anyscale.com",
  "modal.com",
];

// ─── Agent System Prompt ────────────────────────────────────────────

const CRON_SYSTEM_PROMPT = `You are DRIP — an autonomous research agent generating intelligence briefs.

Your task: Research the given company domain using the company-lookup tool. Produce a concise intelligence brief with:
- Company name and one-line description
- Key metrics (funding, headcount, industry)
- Notable recent signals or strategic position
- Why this company matters in the current landscape

Be factual and precise. Use the tool to fetch real data — do not fabricate. If the tool fails, state what happened plainly.

Format your output as clean markdown with headers.
`;

// ─── Route Handler ──────────────────────────────────────────────────

export async function GET(req: Request) {
  // Auth check
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    console.warn("[cron-feed] Unauthorized request — missing or invalid CRON_SECRET");
    return Response.json(
      { error: "Unauthorized", message: "Valid CRON_SECRET required" },
      { status: 401 }
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("[cron-feed] OPENROUTER_API_KEY is not set");
    return Response.json(
      { error: "Configuration error", message: "LLM provider not configured" },
      { status: 500 }
    );
  }

  let selectedTopic: string | undefined;

  try {
    // Pick a topic, filtering out recently-used ones
    const recentTopics = await getRecentTopics();
    const available = SEED_TOPICS.filter((t) => !recentTopics.includes(t));

    // If all topics used recently, reset and pick from full list
    const pool = available.length > 0 ? available : SEED_TOPICS;
    selectedTopic = pool[Math.floor(Math.random() * pool.length)];

    console.log(
      `[cron-feed] Selected topic: ${selectedTopic} ` +
        `(${available.length}/${SEED_TOPICS.length} available, ` +
        `${recentTopics.length} recently used)`
    );

    // Run autonomous agent
    const openrouter = createOpenRouter({ apiKey });
    const tools = getAllTools();
    const skillPrompts = getSystemPrompt();

    console.log(
      `[cron-feed] Starting generateText — topic=${selectedTopic}, ` +
        `${Object.keys(tools).length} tool(s)`
    );

    const { text, steps } = await generateText({
      model: openrouter("anthropic/claude-sonnet-4-20250514"),
      system: CRON_SYSTEM_PROMPT + "\n\n" + skillPrompts,
      prompt: `Research the company at domain: ${selectedTopic}`,
      tools,
      stopWhen: stepCountIs(3),
    });

    const totalToolCalls = steps.reduce(
      (sum, step) => sum + (step.toolCalls?.length ?? 0),
      0
    );
    console.log(
      `[cron-feed] generateText complete — ` +
        `${steps.length} step(s), ${totalToolCalls} tool call(s)`
    );

    // Build feed entry
    const entryId = `feed-${Date.now()}`;
    const entry: FeedEntry = {
      id: entryId,
      type: "company",
      topic: selectedTopic,
      title: `Intelligence Brief: ${selectedTopic}`,
      summary: text,
      data: null,
      createdAt: new Date().toISOString(),
    };

    // Save to KV
    const saved = await saveFeedEntry(entry);
    if (saved) {
      await addRecentTopic(selectedTopic);
    }

    console.log(
      `[cron-feed] Entry ${saved ? "saved" : "failed to save"}: ${entryId}`
    );

    return Response.json({
      success: true,
      entryId,
      topic: selectedTopic,
      saved,
      steps: steps.length,
      toolCalls: totalToolCalls,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[cron-feed] Failed — topic=${selectedTopic ?? "none"}, error=${message}`
    );
    return Response.json(
      {
        error: "Cron execution failed",
        topic: selectedTopic ?? null,
        message,
        phase: selectedTopic ? "agent-run" : "topic-selection",
      },
      { status: 500 }
    );
  }
}
