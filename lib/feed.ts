import "server-only";

import { kv } from "@vercel/kv";

/** Whether KV is configured (env vars present) */
const kvConfigured =
  !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

// ─── Types ──────────────────────────────────────────────────────────

export interface FeedEntry {
  /** Unique identifier (e.g. "feed-1710489600000") */
  id: string;
  /** Entry type — extensible for future skill types */
  type: "company" | "person" | "general";
  /** The topic/domain that was researched */
  topic: string;
  /** Human-readable title for the card */
  title: string;
  /** Agent-generated summary (markdown) */
  summary: string;
  /** Raw structured data from the research tool */
  data: Record<string, unknown> | null;
  /** ISO 8601 creation timestamp */
  createdAt: string;
}

// ─── Keys ───────────────────────────────────────────────────────────

const FEED_SORTED_SET = "feed:entries";
const RECENT_TOPICS_KEY = "feed:recent-topics";
const MAX_RECENT_TOPICS = 30;

function entryKey(id: string): string {
  return `feed:entry:${id}`;
}

// ─── Write Operations ───────────────────────────────────────────────

/**
 * Save a feed entry to KV.
 *
 * Writes to both a sorted set (for ordering) and an individual
 * key (for data retrieval). Returns true on success, false on error.
 */
export async function saveFeedEntry(entry: FeedEntry): Promise<boolean> {
  if (!kvConfigured) return false;
  try {
    const timestamp = new Date(entry.createdAt).getTime();

    await Promise.all([
      kv.zadd(FEED_SORTED_SET, { score: timestamp, member: entry.id }),
      kv.set(entryKey(entry.id), entry),
    ]);

    console.log(
      `[feed] Saved entry: ${entry.id} (topic=${entry.topic}, type=${entry.type})`
    );
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[feed] Failed to save entry ${entry.id}: ${message}`);
    return false;
  }
}

// ─── Read Operations ────────────────────────────────────────────────

/**
 * Fetch the most recent feed entries, ordered newest-first.
 *
 * Returns an empty array on any KV error — graceful degradation
 * so the feed page always renders.
 */
export async function getFeedEntries(limit = 20): Promise<FeedEntry[]> {
  if (!kvConfigured) return [];
  try {
    // Get IDs from sorted set, newest first
    const ids = await kv.zrange<string[]>(FEED_SORTED_SET, 0, limit - 1, {
      rev: true,
    });

    if (!ids || ids.length === 0) {
      console.log("[feed] No entries found in sorted set");
      return [];
    }

    // Batch-fetch all entry data
    const keys = ids.map((id) => entryKey(id));
    const entries = await kv.mget<FeedEntry[]>(...keys);

    // Filter out any null entries (deleted or corrupted)
    const valid = entries.filter(
      (entry): entry is FeedEntry => entry !== null && entry !== undefined
    );

    console.log(
      `[feed] Fetched ${valid.length} entries (requested ${limit})`
    );
    return valid;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[feed] Failed to fetch entries: ${message}`);
    return [];
  }
}

// ─── Topic Tracking ─────────────────────────────────────────────────

/**
 * Record a topic as recently used. Maintains a bounded list
 * to avoid researching the same domain repeatedly.
 */
export async function addRecentTopic(topic: string): Promise<void> {
  if (!kvConfigured) return;
  try {
    await kv.lpush(RECENT_TOPICS_KEY, topic);
    await kv.ltrim(RECENT_TOPICS_KEY, 0, MAX_RECENT_TOPICS - 1);
    console.log(`[feed] Added recent topic: ${topic}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[feed] Failed to track topic "${topic}": ${message}`);
    // Non-critical — don't throw
  }
}

/**
 * Get the list of recently-used topics for deduplication.
 * Returns empty array on error.
 */
export async function getRecentTopics(): Promise<string[]> {
  if (!kvConfigured) return [];
  try {
    const topics = await kv.lrange<string>(
      RECENT_TOPICS_KEY,
      0,
      MAX_RECENT_TOPICS - 1
    );
    return topics ?? [];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[feed] Failed to get recent topics: ${message}`);
    return [];
  }
}
