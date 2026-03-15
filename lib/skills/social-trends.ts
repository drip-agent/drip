import "server-only";

import { tool } from "ai";
import { z } from "zod";
import { registerSkill } from "./registry";
import type { SkillDefinition } from "./types";

/**
 * Social Trends skill — preview/stub proving modular skill registration.
 *
 * Returns canned data. The purpose is to demonstrate that a new skill
 * can be added with zero changes to registry.ts, types.ts, or chat
 * route logic — just an import side-effect.
 */

const trendingTopics = tool({
  description:
    "Get trending topics and social sentiment for a given category. " +
    "Currently returns preview data — full analysis coming soon.",
  inputSchema: z.object({
    category: z.string().describe("Topic category (e.g. 'crypto', 'defi', 'nft')"),
  }),
  execute: async ({ category }) => {
    console.log(`[social-trends] trending-topics: ${category}`);

    return {
      status: "preview" as const,
      message: "Social trend analysis coming soon.",
      topics: ["crypto sentiment", "defi trends", "nft market"],
    };
  },
});

const socialTrendsSkill: SkillDefinition = {
  id: "social-trends",
  name: "Social Trends",
  description:
    "Analyze trending topics and social sentiment across crypto and web3.",
  systemPrompt: `You have access to a Social Trends tool (currently in preview mode).

When a user asks about trending topics, social sentiment, or market trends:
- Use trending-topics with a relevant category
- The tool currently returns sample/preview data — be transparent about this
- Present the data clearly and note that full real-time analysis is coming soon

This is a preview capability — it demonstrates the tool is available but returns sample data only.`,
  tools: {
    "trending-topics": trendingTopics,
  },
};

// Self-register at import time
registerSkill(socialTrendsSkill);

export { socialTrendsSkill };
