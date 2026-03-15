import "server-only";

import { createPublicClient, http, formatUnits } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { erc20Abi } from "viem";

/**
 * Wallet balance reader for the agent's USDC holdings on Base Sepolia.
 *
 * Creates its own publicClient (not shared with x402-client) to keep
 * payment signing and balance reading as independent concerns.
 *
 * 60s TTL in-memory cache avoids excessive RPC calls.
 *
 * Observability: all console output prefixed with [wallet].
 */

const USDC_CONTRACT = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

interface WalletBalance {
  address: string;
  balance: string;
  formatted: string;
}

// --- TTL Cache ---
let cachedResult: WalletBalance | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60_000;

export async function getWalletBalance(): Promise<WalletBalance> {
  const now = Date.now();
  if (cachedResult && now - cachedAt < CACHE_TTL_MS) {
    console.log("[wallet] Returning cached balance");
    return cachedResult;
  }

  const privateKey = process.env.X402_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "[wallet] X402_PRIVATE_KEY env var is required. " +
        "Cannot read wallet balance without a configured private key."
    );
  }

  const account = privateKeyToAccount(privateKey as `0x${string}`);

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  console.log(`[wallet] Reading USDC balance for ${account.address}`);

  const balance = await publicClient.readContract({
    address: USDC_CONTRACT,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account.address],
  });

  const formatted = formatUnits(balance, 6);

  const result: WalletBalance = {
    address: account.address,
    balance: balance.toString(),
    formatted,
  };

  // Update cache
  cachedResult = result;
  cachedAt = now;

  console.log(`[wallet] Balance: ${formatted} USDC`);
  return result;
}
