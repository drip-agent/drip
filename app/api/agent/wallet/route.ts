import { getWalletBalance } from "@/lib/wallet";

/**
 * GET /api/agent/wallet — returns the agent wallet's USDC balance.
 *
 * Success: { address, balance, formatted }
 * Missing key: { error, configured: false } with 200 (not 500)
 * Unexpected error: { error } with 500
 *
 * Never exposes the private key — only public address and balance.
 */
export async function GET() {
  try {
    const result = await getWalletBalance();

    console.log(
      `[wallet] GET /api/agent/wallet — ${result.formatted} USDC`
    );

    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    // Missing private key → "not configured" state (200, not 500)
    if (message.includes("X402_PRIVATE_KEY")) {
      console.log("[wallet] GET /api/agent/wallet — not configured");
      return Response.json({
        error: "Wallet not configured",
        configured: false,
      });
    }

    // Unexpected error → 500
    console.error(`[wallet] GET /api/agent/wallet — error: ${message}`);
    return Response.json({ error: "Failed to read wallet balance" }, { status: 500 });
  }
}
