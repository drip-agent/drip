import "server-only";

import { tool } from "ai";
import { z } from "zod";
import { execSync } from "child_process";
import { registerSkill } from "./registry";
import type { SkillDefinition } from "./types";

const STABLE_ENRICH_BASE = "https://stableenrich.dev";

/**
 * Execute an AgentCash paid fetch via CLI.
 *
 * Uses `npx agentcash fetch` which handles x402 payment automatically
 * using the wallet at ~/.agentcash/wallet.json.
 */
function agentcashFetch(
  url: string,
  method: "GET" | "POST" = "GET",
  body?: Record<string, unknown>
): unknown {
  const args = [`npx agentcash@latest fetch '${url}'`, `-m ${method}`, `--format json`];
  if (body) {
    args.push(`-b '${JSON.stringify(body)}'`);
  }
  const cmd = args.join(" ");
  console.log(`[research] agentcash fetch: ${method} ${url}`);

  const output = execSync(cmd, {
    encoding: "utf-8",
    timeout: 60_000,
    cwd: process.cwd(),
  });

  // The CLI outputs JSON — parse the response
  const parsed = JSON.parse(output.trim());
  return parsed;
}

/**
 * Research skill — company & people intelligence via StableEnrich.
 *
 * Tools make paid API calls via AgentCash CLI. Payment is automatic
 * using USDC on Solana. Failures surface as structured error objects
 * in tool results (the LLM sees them and can communicate to the user).
 */

const companyLookup = tool({
  description:
    "Look up detailed company information by domain name. Returns firmographics, " +
    "funding, employee count, social profiles, and description.",
  inputSchema: z.object({
    domain: z
      .string()
      .describe(
        "Company domain to look up (e.g. 'anthropic.com', 'coinbase.com')"
      ),
  }),
  execute: async ({ domain }) => {
    const url = `${STABLE_ENRICH_BASE}/api/apollo/org-enrich`;
    console.log(`[research] company-lookup: ${domain}`);

    try {
      const data = agentcashFetch(url, "POST", { domain });
      console.log(`[research] company-lookup success: ${domain}`);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[research] company-lookup error: ${message}`);
      return {
        error: true as const,
        reason: `Failed to fetch company data: ${message}`,
        domain,
      };
    }
  },
});

const personEnrich = tool({
  description:
    "Enrich a person's profile by email or LinkedIn URL. Returns name, title, " +
    "company, location, and social profiles.",
  inputSchema: z.object({
    email: z.string().optional().describe("Person's email address"),
    linkedinUrl: z
      .string()
      .optional()
      .describe("Person's LinkedIn profile URL"),
  }),
  execute: async ({ email, linkedinUrl }) => {
    if (!email && !linkedinUrl) {
      return {
        error: true as const,
        reason: "At least one of email or linkedinUrl is required",
      };
    }

    const url = `${STABLE_ENRICH_BASE}/api/apollo/people-enrich`;
    const identifier = email || linkedinUrl;
    console.log(`[research] person-enrich: ${identifier}`);

    const body: Record<string, string> = {};
    if (email) body.email = email;
    if (linkedinUrl) body.linkedin_url = linkedinUrl;

    try {
      const data = agentcashFetch(url, "POST", body);
      console.log(`[research] person-enrich success: ${identifier}`);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[research] person-enrich error: ${message}`);
      return {
        error: true as const,
        reason: `Failed to enrich person: ${message}`,
        identifier,
      };
    }
  },
});

const researchSkill: SkillDefinition = {
  id: "research",
  name: "Company & People Research",
  description:
    "Look up companies by domain and enrich people profiles via StableEnrich data.",
  systemPrompt: `You have access to real-time company and people research tools.

When a user asks you to research a company:
- Use company-lookup with the company's domain (e.g. "anthropic.com")
- Present the results as structured markdown: name, description, funding, headcount, key links
- If the lookup fails, explain the error clearly

When a user asks about a person:
- Use person-enrich with their email or LinkedIn URL
- Present name, title, company, location, and available social profiles

Always present data clearly with markdown formatting. If a tool returns an error, acknowledge it honestly — don't fabricate data.`,
  tools: {
    "company-lookup": companyLookup,
    "person-enrich": personEnrich,
  },
};

// Self-register at import time
registerSkill(researchSkill);

export { researchSkill };
