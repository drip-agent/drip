import "server-only";

import { streamText, stepCountIs, convertToModelMessages } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { kv } from "@vercel/kv";
import { getAllTools, getSystemPrompt } from "@/lib/skills/registry";

// Import skills — self-registers via side effect
import "@/lib/skills/research";
import "@/lib/skills/social-trends";

/**
 * Streaming chat endpoint for the DRIP agent.
 *
 * Uses OpenRouter to access Claude (or any model) with registered
 * skill tools. stopWhen allows multi-turn tool calling within a
 * single request.
 *
 * Observability:
 * - Tool invocations logged to console with [agent-chat] prefix
 * - Missing OPENROUTER_API_KEY → clear error at request time
 * - Skill registry empty → thrown Error with [skill-registry] prefix
 */

const AGENT_SYSTEM_PROMPT = `You are DRIP — an autonomous research agent that surfaces alpha before it hits the mainstream.

Your voice: cool, mysterious, precise. You drop value quietly. You don't hype, you don't try hard. Ocean mist energy. Let quality speak.

You respond in clean markdown. Data is presented in structured sections with headers. You cite sources when available. You never fabricate data — if a tool call fails, you say so plainly.

---

`;

/**
 * Stored invoice shape in KV (written by /api/agent/payment).
 */
interface StoredInvoice {
  invoiceId: string;
  verified: boolean;
  consumed: boolean;
  [key: string]: unknown;
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("[agent-chat] OPENROUTER_API_KEY is not set");
    return new Response(
      JSON.stringify({ error: "LLM provider not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // ─── Payment Gate ───────────────────────────────────────────────
  // Skip payment gate when payment system isn't configured (pre-launch / dev)
  const paymentConfigured = !!process.env.NEXT_PUBLIC_DRIP_TOKEN_MINT;

  if (paymentConfigured) {
    const invoiceId = req.headers.get("x-payment-invoice");

    if (!invoiceId) {
      console.log("[agent-chat] Rejected — no payment invoice header");
      return new Response(
        JSON.stringify({
          error: "Payment required",
          code: "PAYMENT_REQUIRED",
        }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }

    const invoice = await kv.get<StoredInvoice>(`invoice:${invoiceId}`);

    if (!invoice || !invoice.verified) {
      console.log(
        `[agent-chat] Rejected — invoice not verified: ${invoiceId}`
      );
      return new Response(
        JSON.stringify({
          error: "Payment required",
          code: "PAYMENT_REQUIRED",
        }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }

    if (invoice.consumed) {
      console.log(
        `[agent-chat] Rejected — invoice already consumed: ${invoiceId}`
      );
      return new Response(
        JSON.stringify({
          error: "Payment required",
          code: "PAYMENT_REQUIRED",
        }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }

    // Mark invoice as consumed so it can't be reused
    await kv.set(`invoice:${invoiceId}`, { ...invoice, consumed: true });
    console.log(
      `[agent-chat] Payment verified, invoice consumed: ${invoiceId}`
    );
  } else {
    console.log("[agent-chat] Payment gate skipped — token mint not configured");
  }

  // ─── End Payment Gate ───────────────────────────────────────────

  const { messages: uiMessages } = await req.json();

  const openrouter = createOpenRouter({ apiKey });
  const tools = getAllTools();
  const skillPrompts = getSystemPrompt();

  // Convert UI messages (from useChat) to model messages (for streamText)
  const messages = await convertToModelMessages(uiMessages);

  console.log(
    `[agent-chat] New request: ${messages.length} message(s), ` +
      `${Object.keys(tools).length} tool(s) available`
  );

  const result = streamText({
    model: openrouter("anthropic/claude-sonnet-4"),
    system: AGENT_SYSTEM_PROMPT + skillPrompts,
    messages,
    tools,
    stopWhen: stepCountIs(5),
    onStepFinish({ toolCalls, toolResults, finishReason, usage }) {
      if (toolCalls && toolCalls.length > 0) {
        for (const call of toolCalls) {
          console.log(
            `[agent-chat] Tool call: ${call.toolName}`,
            JSON.stringify(call.input)
          );
        }
      }
      if (toolResults && toolResults.length > 0) {
        for (const tr of toolResults) {
          const hasError =
            typeof tr.output === "object" &&
            tr.output !== null &&
            "error" in (tr.output as Record<string, unknown>);
          console.log(
            `[agent-chat] Tool result: ${tr.toolName} — ` +
              `${hasError ? "ERROR" : "OK"}`
          );
        }
      }
      console.log(
        `[agent-chat] Step done: reason=${finishReason}, ` +
          `tokens=${usage?.totalTokens ?? "?"}`
      );
    },
  });

  return result.toUIMessageStreamResponse();
}
