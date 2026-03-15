import type { Tool } from "ai";

/**
 * Defines the contract for a modular agent skill.
 *
 * Each skill provides:
 * - Identity (id, name, description)
 * - A system prompt fragment that shapes the LLM's behavior for this skill
 * - A set of AI SDK tools the LLM can invoke
 *
 * Skills are registered in the registry and assembled into a single
 * system prompt + tool set at runtime.
 */
export interface SkillDefinition {
  /** Unique identifier, used as registry key (e.g. "research") */
  id: string;

  /** Human-readable name (e.g. "Company & People Research") */
  name: string;

  /** Brief description of what this skill enables */
  description: string;

  /** System prompt fragment — concatenated with other skills at runtime */
  systemPrompt: string;

  /** AI SDK tools this skill exposes to the LLM */
  tools: Record<string, Tool<any, any>>;
}
