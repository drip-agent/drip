import "server-only";

import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

/**
 * GET /api/agent/revenue — Revenue statistics
 *
 * Returns current revenue metrics from KV. Always fresh (no-store).
 * Used by the frontend revenue badge and for agent self-inspection.
 *
 * KV keys read:
 *   revenue:total_earned — cumulative USDC earned (string)
 *   revenue:query_count — total paid queries (number)
 *
 * Returns: { totalEarned: string, queryCount: number, tokenMint: string | null }
 */

export async function GET() {
  const kvConfigured =
    !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

  try {
    const totalEarned = kvConfigured
      ? await kv.get<string>("revenue:total_earned")
      : null;
    const queryCount = kvConfigured
      ? await kv.get<number>("revenue:query_count")
      : null;

    const tokenMint = process.env.NEXT_PUBLIC_DRIP_TOKEN_MINT || null;

    console.log(
      `[revenue] Stats requested — earned=${totalEarned || "0"} USDC, ` +
        `queries=${queryCount || 0}`
    );

    return NextResponse.json(
      {
        totalEarned: totalEarned || "0",
        queryCount: queryCount || 0,
        tokenMint,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[revenue] Failed to fetch stats: ${message}`);
    return NextResponse.json(
      {
        totalEarned: "0",
        queryCount: 0,
        tokenMint: null,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
