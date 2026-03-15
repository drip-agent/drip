import type { Tool } from "ai";
import type { SkillDefinition } from "./types";

/**
 * Module-level skill registry.
 *
 * Pure in-memory store — no database, no async init. Skills register
 * themselves at import time via registerSkill(). The chat route
 * assembles the full tool set and system prompt from all registered skills.
 */

const registry = new Map<string, SkillDefinition>();

/**
 * Register a skill in the global registry.
 * Warns on duplicate IDs (keeps existing registration).
 */
export function registerSkill(skill: SkillDefinition): void {
  if (registry.has(skill.id)) {
    console.warn(
      `[skill-registry] Duplicate skill ID "${skill.id}" — ` +
        `keeping existing registration for "${registry.get(skill.id)!.name}". ` +
        `New registration "${skill.name}" ignored.`
    );
    return;
  }

  registry.set(skill.id, skill);
  console.log(
    `[skill-registry] Registered skill: ${skill.name} (${skill.id}) — ` +
      `${Object.keys(skill.tools).length} tool(s)`
  );
}

/**
 * Returns all registered skills as an array.
 * Throws if registry is empty — fail fast rather than silently
 * passing an empty tool set to the LLM.
 */
export function getSkills(): SkillDefinition[] {
  if (registry.size === 0) {
    throw new Error(
      "[skill-registry] No skills registered. " +
        "Import at least one skill module before calling getSkills()."
    );
  }
  return Array.from(registry.values());
}

/**
 * Merges all registered skill tools into a single Record.
 * This is the tool set passed to streamText().
 */
export function getAllTools(): Record<string, Tool<any, any>> {
  const skills = getSkills(); // throws if empty
  const merged: Record<string, Tool<any, any>> = {};

  for (const skill of skills) {
    for (const [name, tool] of Object.entries(skill.tools)) {
      if (merged[name]) {
        console.warn(
          `[skill-registry] Tool name collision: "${name}" exists in ` +
            `multiple skills. Last registration wins.`
        );
      }
      merged[name] = tool;
    }
  }

  return merged;
}

/**
 * Concatenates all skill system prompts with headers.
 * Format:
 *   ## [Skill Name]
 *   <system prompt>
 *
 * This becomes part of the LLM's full system prompt.
 */
export function getSystemPrompt(): string {
  const skills = getSkills(); // throws if empty

  return skills
    .map((s) => `## ${s.name}\n\n${s.systemPrompt}`)
    .join("\n\n---\n\n");
}
