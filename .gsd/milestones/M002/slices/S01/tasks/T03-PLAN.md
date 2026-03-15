---
estimated_steps: 5
estimated_files: 4
---

# T03: Build agent layout, chat UI, and integration verification

**Slice:** S01 — Agent Chat with Live Research
**Milestone:** M002

## Description

The agent's face. Chat UI built on useChat with the DRIP dark-theme aesthetic, an agent-specific layout with adapted navigation, and the verification script that proves the entire slice works. This is the integration closure — connecting backend (T02) to a real user-facing surface.

## Steps

1. Create `app/agent/layout.tsx`. Server component wrapping agent pages. Includes an adapted NavBar variant with agent-specific links (Chat → /agent, Feed → /agent/feed) instead of landing page anchor links. Reuses the same font variables and theme from RootLayout. Metadata for agent subdomain (title: "DRIP Agent", description for agent context).
2. Create `app/agent/page.tsx`. Client component using `useChat` from `@ai-sdk/react`. Build:
   - Scrolling message list with auto-scroll to bottom on new messages
   - User messages styled distinctly from assistant messages (different bg, alignment)
   - Assistant messages rendered as markdown (basic: bold, code blocks, lists — no heavy library, just dangerouslySetInnerHTML with simple markdown-to-html or a lightweight approach)
   - Tool call indicators: when assistant message has tool invocations, show a subtle "researching..." step indicator with tool name
   - Input bar at bottom: text input + send button, disabled while loading
   - Loading state: pulsing indicator while assistant is responding
   - Empty state: initial prompt suggestions ("Research Anthropic", "Look up a company")
   - All styled with DRIP design tokens — dark-surface backgrounds, icy-aqua accents, glass effects, ocean-mist secondary text
3. Style the chat interface to match M001 aesthetic. Use existing components where appropriate (GlassPanel for message container, Button for send, Input for text entry). Ensure responsive layout (mobile-first, full-height chat on mobile).
4. Create `scripts/verify-m002-s01.sh`. Contract verification checks:
   - All 10 expected files exist
   - package.json contains required dependencies (ai, @ai-sdk/anthropic, @x402/fetch, etc.)
   - middleware.ts exports config
   - lib/skills/types.ts exports SkillDefinition
   - lib/skills/registry.ts exports registerSkill, getSkills, getAllTools, getSystemPrompt
   - lib/skills/research.ts exports a SkillDefinition
   - app/api/agent/chat/route.ts exports POST
   - app/agent/layout.tsx exists
   - app/agent/page.tsx exists
   - `npm run build` succeeds
5. Run verification: execute the script, fix any failures, confirm build passes and all checks green.

## Must-Haves

- [ ] Agent layout renders with agent-specific NavBar links (Chat, Feed)
- [ ] Chat UI uses useChat hook with streaming message display
- [ ] Messages auto-scroll to latest; user and assistant messages visually distinct
- [ ] Tool-call steps shown as indicators (e.g., "Researching company...")
- [ ] Input disabled during loading; empty state shows prompt suggestions
- [ ] All styling uses DRIP design tokens — no off-brand colors or fonts
- [ ] Verification script passes all contract checks
- [ ] Build succeeds with all files in place

## Verification

- `bash scripts/verify-m002-s01.sh` — all checks pass
- `npm run build` succeeds
- Dev server: navigating to /agent renders the chat UI with input, send button, and empty state suggestions
- Sending a message shows streaming response with typing indicator

## Inputs

- `app/api/agent/chat/route.ts` — POST endpoint for chat (from T02)
- `components/ui/*` — Button, Input, GlassPanel, Card from M001 design system
- `components/layout/*` — NavBar, Container from M001
- `app/globals.css` — design tokens and utility classes
- `lib/utils.ts` — cn() helper
- D005 — dark futuristic with aqua glow
- D006 — cool & mysterious agent voice (affects empty state copy)

## Observability Impact

- **Chat UI status**: `useChat` exposes `status` field (`ready`, `submitted`, `streaming`) — visible in component state. Loading indicator renders during `submitted`.
- **Tool-call indicators**: Each tool invocation renders as a visible DOM element with state (`output-available` → ✓, otherwise pulsing dot). Tool name displayed on completion.
- **API errors**: Missing `OPENROUTER_API_KEY` → 500 response logged at `[agent-chat]` prefix in server console. Chat UI degrades gracefully (returns to ready state).
- **Skill registration**: Console output at build/import time: `[skill-registry] Registered skill: ...` confirms wiring.
- **Verification script**: `scripts/verify-m002-s01.sh` — 25 contract checks covering file existence, dependencies, exports, and build. Exit 1 on any failure.

## Expected Output

- `app/agent/layout.tsx` — agent layout with adapted NavBar
- `app/agent/page.tsx` — streaming chat UI with useChat, tool indicators, DRIP styling
- `scripts/verify-m002-s01.sh` — full contract verification script
- All verification checks passing, build green
